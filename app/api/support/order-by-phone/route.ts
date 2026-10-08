import { NextRequest, NextResponse } from 'next/server'
import { shopifyAdminFetch } from '@/lib/shopify/admin-client'
import { ORDERS_BY_EMAIL_QUERY } from '@/lib/shopify/queries'

type FulfillmentTrackingInfo = {
  company: string | null
  number: string | null
  url: string | null
}

type FulfillmentNode = {
  displayStatus: string | null
  trackingInfo?: { first?: number } | Array<FulfillmentTrackingInfo>
}

type OrderNode = {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
  displayFulfillmentStatus: string | null
  displayFinancialStatus: string | null
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } }
  fulfillments?: FulfillmentNode[] | { edges?: Array<{ node: FulfillmentNode }> }
  customer: {
    id: string
    email: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    defaultPhoneNumber?: { phoneNumber: string } | null
  } | null
  shippingAddress: {
    name: string | null
    address1: string | null
    address2: string | null
    city: string | null
    province: string | null
    zip: string | null
    country: string | null
    phone: string | null
  } | null
  billingAddress: {
    name: string | null
    address1: string | null
    address2: string | null
    city: string | null
    province: string | null
    zip: string | null
    country: string | null
    phone: string | null
  } | null
  lineItems: {
    edges: Array<{
      node: {
        title: string
        quantity: number
        originalUnitPriceSet: { shopMoney: { amount: string; currencyCode: string } }
        image: { url: string; altText: string | null } | null
      }
    }>
  }
}

interface OrdersQueryResponse {
  orders: {
    edges: Array<{ node: OrderNode }>
    pageInfo?: { hasNextPage: boolean; endCursor: string | null }
  }
}

function normalizePhone(phone?: string | null): string {
  return phone ? phone.replace(/\D/g, '') : ''
}

/** Returns true if two digit-only strings represent the same phone (exact or last-10 match for country code). */
function phonesMatch(userDigits: string, orderDigits: string): boolean {
  if (!orderDigits) return false
  if (userDigits === orderDigits) return true
  if (userDigits.length >= 10 && orderDigits.length >= 10) {
    const userLast10 = userDigits.slice(-10)
    const orderLast10 = orderDigits.slice(-10)
    if (userLast10 === orderLast10) return true
  }
  if (userDigits.length >= orderDigits.length && userDigits.endsWith(orderDigits)) return true
  if (orderDigits.length >= userDigits.length && orderDigits.endsWith(userDigits)) return true
  return false
}

function getFulfillmentsList(order: OrderNode): FulfillmentNode[] {
  const raw = order.fulfillments
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  return (raw.edges ?? []).map((e) => e.node)
}

function getTrackingFromFulfillments(fulfillments: FulfillmentNode[]): FulfillmentTrackingInfo[] {
  const out: FulfillmentTrackingInfo[] = []
  for (const f of fulfillments) {
    const ti = f.trackingInfo
    if (!ti) continue
    const list = Array.isArray(ti)
      ? ti
      : ((ti as { edges?: Array<{ node: FulfillmentTrackingInfo }> }).edges ?? []).map(
          (e) => e.node
        )
    for (const t of list) {
      if (t && (t.number || t.company)) {
        out.push({
          company: t.company ?? null,
          number: t.number ?? null,
          url: t.url ?? null,
        })
      }
    }
  }
  return out
}

function getDeliveryStatus(order: OrderNode): string {
  const fulfillments = getFulfillmentsList(order)
  const tracking = getTrackingFromFulfillments(fulfillments)
  const firstStatus = fulfillments[0]?.displayStatus
  if (firstStatus) return firstStatus
  if (tracking.length > 0) return 'Tracking added'
  return ''
}

function orderToSupportResult(order: OrderNode) {
  const fulfillments = getFulfillmentsList(order)
  const tracking = getTrackingFromFulfillments(fulfillments)
  const deliveryStatus = getDeliveryStatus(order)

  return {
    id: order.id,
    orderNumber: order.name,
    createdAt: order.createdAt,
    financialStatus: order.displayFinancialStatus || 'pending',
    fulfillmentStatus: order.displayFulfillmentStatus || 'pending',
    deliveryStatus: deliveryStatus || null,
    totalAmount: parseFloat(order.totalPriceSet.shopMoney.amount),
    currencyCode: order.totalPriceSet.shopMoney.currencyCode,
    email: order.email || order.customer?.email || null,
    contactPhone:
      order.phone ||
      order.shippingAddress?.phone ||
      order.customer?.phone ||
      order.customer?.defaultPhoneNumber?.phoneNumber ||
      null,
    shippingAddress: order.shippingAddress
      ? {
          name: order.shippingAddress.name,
          address1: order.shippingAddress.address1,
          address2: order.shippingAddress.address2,
          city: order.shippingAddress.city,
          province: order.shippingAddress.province,
          zip: order.shippingAddress.zip,
          country: order.shippingAddress.country,
          phone: order.shippingAddress.phone,
        }
      : null,
    billingAddress: order.billingAddress
      ? {
          name: order.billingAddress.name,
          address1: order.billingAddress.address1,
          address2: order.billingAddress.address2,
          city: order.billingAddress.city,
          province: order.billingAddress.province,
          zip: order.billingAddress.zip,
          country: order.billingAddress.country,
          phone: order.billingAddress.phone,
        }
      : null,
    items: order.lineItems.edges.map((edge) => ({
      title: edge.node.title,
      quantity: edge.node.quantity,
      price: parseFloat(edge.node.originalUnitPriceSet.shopMoney.amount),
      image: edge.node.image?.url || null,
    })),
    tracking: tracking.length > 0 ? tracking : [],
  }
}

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const sharedSecret = process.env.SALESIQ_SUPPORT_SHARED_SECRET
  if (!sharedSecret) {
    console.error(
      'SALESIQ_SUPPORT_SHARED_SECRET is not configured. Refusing to serve support endpoint.'
    )
    return NextResponse.json(
      { error: 'Support endpoint not configured', code: 'CONFIG_ERROR' },
      { status: 500 }
    )
  }

  const authHeader = req.headers.get('x-salesiq-signature') || req.headers.get('authorization')
  const providedToken = authHeader?.replace(/^Bearer\s+/i, '').trim()

  if (!providedToken || providedToken !== sharedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }

  const phone =
    typeof (body as any)?.phone === 'string'
      ? ((body as any).phone as string)
      : typeof (body as any)?.phoneNumber === 'string'
        ? ((body as any).phoneNumber as string)
        : null

  // Optional: how many recent orders to return (default 1, max 20)
  const rawLimit = (body as any)?.limit ?? (body as any)?.count
  const limit = Math.min(
    Math.max(1, typeof rawLimit === 'number' ? rawLimit : parseInt(String(rawLimit), 10) || 1),
    20
  )

  if (!phone) {
    return NextResponse.json(
      {
        error: 'Missing phone number. Provide "phone" or "phoneNumber".',
        code: 'MISSING_PHONE',
      },
      { status: 400 }
    )
  }

  const normalizedUserPhone = normalizePhone(phone)
  if (!normalizedUserPhone || normalizedUserPhone.length < 10) {
    return NextResponse.json(
      {
        error: 'Invalid phone number format',
        code: 'INVALID_PHONE',
      },
      { status: 400 }
    )
  }

  if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.warn(
      'SHOPIFY_ADMIN_ACCESS_TOKEN not configured. Cannot fetch orders from Shopify in support endpoint.'
    )
    return NextResponse.json(
      {
        error: 'Shopify Admin API not configured',
        code: 'SHOPIFY_NOT_CONFIGURED',
      },
      { status: 500 }
    )
  }

  try {
    const PAGE_SIZE = 100
    const MAX_PAGES = 10
    let cursor: string | null = null
    let pageCount = 0
    const matches: OrderNode[] = []

    const filterByPhone = (nodes: OrderNode[]) =>
      nodes.filter((order) => {
        const orderPhones = [
          order.phone,
          order.shippingAddress?.phone ?? null,
          order.customer?.phone ?? null,
          order.customer?.defaultPhoneNumber?.phoneNumber ?? null,
        ]
        return (
          normalizedUserPhone &&
          orderPhones.some((p) => {
            const normalized = normalizePhone(p)
            return phonesMatch(normalizedUserPhone, normalized)
          })
        )
      })

    while (pageCount < MAX_PAGES) {
      const recentData: OrdersQueryResponse = await shopifyAdminFetch<OrdersQueryResponse>({
        query: ORDERS_BY_EMAIL_QUERY,
        variables: {
          query: 'status:any',
          first: PAGE_SIZE,
          after: cursor,
        },
      })

      const nodes = recentData.orders.edges.map((edge) => edge.node)
      const pageMatches = filterByPhone(nodes)
      matches.push(...pageMatches)
      pageCount += 1

      const pageInfo = recentData.orders.pageInfo
      const hasNextPage = pageInfo?.hasNextPage === true && pageInfo.endCursor
      if (!hasNextPage || nodes.length === 0) break
      cursor = pageInfo!.endCursor
    }

    if (matches.length === 0) {
      return NextResponse.json(
        {
          found: false,
          order: null,
          orders: [],
          message: 'No order found for this phone number.',
        },
        { status: 200 }
      )
    }

    const sorted = matches.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    const toReturn = sorted.slice(0, limit).map(orderToSupportResult)
    const first = toReturn[0]

    return NextResponse.json(
      {
        found: true,
        order: first,
        orders: toReturn,
        count: toReturn.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error in /api/support/order-by-phone:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }
}

