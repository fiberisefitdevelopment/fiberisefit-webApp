/**
 * POST /api/support/get-order
 *
 * Zoho SalesIQ Zobot webhook endpoint.
 * Looks up an order by orderNumber (required) from Shopify,
 * then fetches Shiprocket tracking info.
 *
 * Auth: x-salesiq-signature header must match SALESIQ_SUPPORT_SHARED_SECRET
 */

import { NextRequest, NextResponse } from 'next/server'
import { shopifyAdminFetch } from '@/lib/shopify/admin-client'
import { getShiprocketToken } from '@/lib/shiprocket/client'
import { validateSupportRequest, extractOrderNumber } from '@/lib/support/auth'
import { logSupportEvent } from '@/lib/support/logger'

export const dynamic = 'force-dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RequestBody {
  orderNumber: string
  email?: string
  phone?: string
}

interface ShopifyTrackingInfo {
  company: string | null
  number: string | null
  url: string | null
}

interface ShopifyFulfillment {
  displayStatus: string | null
  trackingInfo: ShopifyTrackingInfo[]
}

interface ShopifyOrderNode {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
  displayFulfillmentStatus: string | null
  displayFinancialStatus: string | null
  totalPriceSet: {
    shopMoney: { amount: string; currencyCode: string }
  }
  customer: {
    email: string | null
    phone: string | null
  } | null
  lineItems: {
    edges: Array<{
      node: {
        title: string
        quantity: number
      }
    }>
  }
  fulfillments: ShopifyFulfillment[]
}

interface ShopifyOrdersResponse {
  orders: {
    edges: Array<{ node: ShopifyOrderNode }>
  }
}

interface ShiprocketTrackResponse {
  tracking_data?: {
    shipment_track?: Array<{
      current_status?: string
      edd?: string
      awb_code?: string
    }>
    track_url?: string
  }
  tracking?: {
    current_status?: string
    etd?: string
    awb?: string
    track_url?: string
  }
}

interface ShipmentResult {
  status: string
  trackingNumber: string
  trackingUrl: string
  estimatedDelivery: string
}

interface OrderResult {
  orderNumber: string
  orderDate: string
  paymentStatus: string
  fulfillmentStatus: string
  totalAmount: string
  items: Array<{ name: string; quantity: number }>
}

// ─── GraphQL Query ─────────────────────────────────────────────────────────────

const ORDER_BY_NAME_QUERY = `
  query OrderByName($query: String!) {
    orders(first: 1, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          email
          phone
          createdAt
          displayFulfillmentStatus
          displayFinancialStatus
          totalPriceSet {
            shopMoney { amount currencyCode }
          }
          customer {
            email
            phone
          }
          lineItems(first: 50) {
            edges {
              node {
                title
                quantity
              }
            }
          }
          fulfillments {
            displayStatus
            trackingInfo(first: 5) {
              company
              number
              url
            }
          }
        }
      }
    }
  }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Normalize a raw order number input: strips spaces, ensures # prefix. */
function normalizeOrderNumber(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, '')
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
}

/** Normalize phone to digits only. */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

/** Returns the last N digits of a string. */
function lastN(str: string, n: number): string {
  return str.slice(-n)
}

/** Extract the first available tracking info from Shopify fulfillments. */
function extractShopifyTracking(fulfillments: ShopifyFulfillment[]): ShipmentResult | null {
  for (const f of fulfillments) {
    for (const t of f.trackingInfo ?? []) {
      if (t.number) {
        return {
          status: f.displayStatus ?? 'In Transit',
          trackingNumber: t.number,
          trackingUrl: t.url ?? '',
          estimatedDelivery: '',
        }
      }
    }
  }
  if (fulfillments[0]?.displayStatus) {
    return {
      status: fulfillments[0].displayStatus,
      trackingNumber: '',
      trackingUrl: '',
      estimatedDelivery: '',
    }
  }
  return null
}

/**
 * Fetch Shiprocket tracking by channel order ID (Shopify order name without #).
 * Times out after 5 seconds. Falls back to null on any error so the response
 * still returns Shopify data.
 */
async function fetchShiprocketTracking(channelOrderId: string): Promise<ShipmentResult | null> {
  try {
    const token = await getShiprocketToken()

    const trackUrl = new URL('https://apiv2.shiprocket.in/v1/external/courier/track')
    trackUrl.searchParams.set('order_id', channelOrderId)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(trackUrl.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      console.warn(`[get-order] Shiprocket track request failed: ${res.status}`)
      return null
    }

    const data = (await res.json()) as ShiprocketTrackResponse

    const track = data.tracking_data?.shipment_track?.[0]
    if (track) {
      return {
        status: track.current_status ?? 'In Transit',
        trackingNumber: track.awb_code ?? '',
        trackingUrl: data.tracking_data?.track_url ?? '',
        estimatedDelivery: track.edd ?? '',
      }
    }

    if (data.tracking) {
      return {
        status: data.tracking.current_status ?? 'In Transit',
        trackingNumber: data.tracking.awb ?? '',
        trackingUrl: data.tracking.track_url ?? '',
        estimatedDelivery: data.tracking.etd ?? '',
      }
    }

    return null
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.toLowerCase().includes('abort')) {
      console.warn('[get-order] Shiprocket tracking request timed out')
    } else {
      console.error('[get-order] Shiprocket tracking error:', msg)
    }
    return null
  }
}

/** Format an ISO date string into a human-readable format. */
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {

  // 1. Auth + rate limit
  const auth = validateSupportRequest(req)
  if (!auth.ok) return auth.errorResponse!

  // 2. Parse request body
  let body: RequestBody
  try {
    body = (await req.json()) as RequestBody
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  // 3. Validate + sanitize orderNumber (handles all formats: 1021, #1021, "order 1021")
  const rawOrderNumber = typeof body?.orderNumber === 'string' ? body.orderNumber : ''
  if (!rawOrderNumber.trim()) {
    return NextResponse.json(
      { success: false, message: 'orderNumber is required' },
      { status: 400 }
    )
  }

  const orderNumber = extractOrderNumber(rawOrderNumber)
  if (!orderNumber) {
    return NextResponse.json(
      { success: false, message: 'Could not extract a valid order number. Please provide just the number, e.g. 1021.' },
      { status: 400 }
    )
  }

  // Optional identity fields for verification
  const rawEmail = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const rawPhone = typeof body?.phone === 'string' ? normalizePhone(body.phone) : ''

  // 5. Guard: Shopify Admin token must be configured
  if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.error('[get-order] SHOPIFY_ADMIN_ACCESS_TOKEN is not configured')
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }

  // 6. Fetch order from Shopify by order name (e.g. "#1021")
  let shopifyOrder: ShopifyOrderNode | null = null
  try {
    const result = await shopifyAdminFetch<ShopifyOrdersResponse>({
      query: ORDER_BY_NAME_QUERY,
      variables: { query: `name:${orderNumber}` },
    })
    shopifyOrder = result.orders.edges[0]?.node ?? null
  } catch (err: unknown) {
    console.error('[get-order] Shopify fetch error:', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }

  if (!shopifyOrder) {
    logSupportEvent({ action: 'order_lookup', orderNumber, result: 'not_found', ip: auth.ip })
    return NextResponse.json(
      { success: false, message: 'Order not found' },
      { status: 200 }
    )
  }

  // 7. Optional identity verification (if caller provides email or phone)
  if (rawEmail || rawPhone) {
    const orderEmail = (shopifyOrder.email ?? shopifyOrder.customer?.email ?? '').toLowerCase()
    const orderPhone = normalizePhone(shopifyOrder.phone ?? shopifyOrder.customer?.phone ?? '')

    const emailMatch = rawEmail
      ? orderEmail === rawEmail || orderEmail.includes(rawEmail)
      : true
    const phoneMatch = rawPhone
      ? lastN(rawPhone, 10) === lastN(orderPhone, 10)
      : true

    if (!emailMatch && !phoneMatch) {
      // Deliberately vague to prevent order enumeration
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 200 }
      )
    }
  }

  // 8. Fetch Shiprocket tracking; falls back to Shopify tracking info
  const channelOrderId = shopifyOrder.name.replace(/^#/, '').trim()
  const shiprocketTracking = await fetchShiprocketTracking(channelOrderId)
  const shopifyTracking = extractShopifyTracking(shopifyOrder.fulfillments ?? [])

  const shipment: ShipmentResult = shiprocketTracking ?? shopifyTracking ?? {
    status: shopifyOrder.displayFulfillmentStatus ?? 'Processing',
    trackingNumber: '',
    trackingUrl: '',
    estimatedDelivery: '',
  }

  // 9. Build final response
  const order: OrderResult = {
    orderNumber: shopifyOrder.name,
    orderDate: formatDate(shopifyOrder.createdAt),
    paymentStatus: shopifyOrder.displayFinancialStatus ?? 'pending',
    fulfillmentStatus: shopifyOrder.displayFulfillmentStatus ?? 'unfulfilled',
    totalAmount: `₹${parseFloat(shopifyOrder.totalPriceSet.shopMoney.amount).toFixed(2)}`,
    items: shopifyOrder.lineItems.edges.map((edge) => ({
      name: edge.node.title,
      quantity: edge.node.quantity,
    })),
  }

  logSupportEvent({
    action: 'order_lookup',
    orderNumber,
    result: 'found',
    ip: auth.ip,
    meta: { fulfillmentStatus: order.fulfillmentStatus, paymentStatus: order.paymentStatus },
  })

  return NextResponse.json({ success: true, order, shipment }, { status: 200 })
}
