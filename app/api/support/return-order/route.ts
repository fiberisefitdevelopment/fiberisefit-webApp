/**
 * POST /api/support/return-order
 *
 * Zoho SalesIQ Zobot — Return / Refund Request endpoint.
 * Rules:
 *   - FULFILLED orders → eligible for return → logs request
 *   - UNFULFILLED orders → suggest cancellation instead
 *   - CANCELLED → show refund timeline
 *
 * Auth: x-salesiq-signature header
 */

import { NextRequest, NextResponse } from 'next/server'
import { shopifyAdminFetch } from '@/lib/shopify/admin-client'
import { validateSupportRequest, extractOrderNumber } from '@/lib/support/auth'
import { logSupportEvent } from '@/lib/support/logger'
import { adminDb, isAdminInitialized } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RequestBody {
  orderNumber: string
  phone?: string
  reason?: string
}

interface ShopifyOrderNode {
  id: string
  name: string
  displayFulfillmentStatus: string | null
  displayFinancialStatus: string | null
  createdAt: string
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } }
  customer: { email: string | null; phone: string | null } | null
  lineItems: {
    edges: Array<{ node: { title: string; quantity: number } }>
  }
}

interface ShopifyOrdersResponse {
  orders: { edges: Array<{ node: ShopifyOrderNode }> }
}

// ─── Query ─────────────────────────────────────────────────────────────────

const ORDER_STATUS_QUERY = `
  query OrderByName($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          id
          name
          createdAt
          displayFulfillmentStatus
          displayFinancialStatus
          totalPriceSet { shopMoney { amount currencyCode } }
          customer { email phone }
          lineItems(first: 10) {
            edges { node { title quantity } }
          }
        }
      }
    }
  }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns number of days since ISO date string. */
function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {

  // 1. Auth + rate limit
  const auth = validateSupportRequest(req)
  if (!auth.ok) return auth.errorResponse!

  // 2. Parse body
  let body: RequestBody
  try {
    body = (await req.json()) as RequestBody
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 })
  }

  // 3. Extract + sanitize order number
  const rawOrderNumber = typeof body?.orderNumber === 'string' ? body.orderNumber : ''
  const orderNumber = extractOrderNumber(rawOrderNumber)
  if (!orderNumber) {
    return NextResponse.json(
      { success: false, message: 'Please provide a valid order number (e.g. 1021).' },
      { status: 400 }
    )
  }

  const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
  const reason = typeof body?.reason === 'string' ? body.reason.trim() : 'Requested by customer'

  // 4. Guard: Shopify Admin must be configured
  if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.error('[return-order] SHOPIFY_ADMIN_ACCESS_TOKEN not configured')
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 })
  }

  // 5. Fetch order from Shopify
  let shopifyOrder: ShopifyOrderNode | null = null
  try {
    const result = await shopifyAdminFetch<ShopifyOrdersResponse>({
      query: ORDER_STATUS_QUERY,
      variables: { query: `name:${orderNumber}` },
    })
    shopifyOrder = result.orders.edges[0]?.node ?? null
  } catch (err: unknown) {
    console.error('[return-order] Shopify fetch error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  if (!shopifyOrder) {
    logSupportEvent({ action: 'return_request', orderNumber, result: 'not_found', ip: auth.ip })
    return NextResponse.json(
      { success: false, message: 'Order not found. Please check the order number and try again.' },
      { status: 200 }
    )
  }

  const fulfillmentStatus = (shopifyOrder.displayFulfillmentStatus ?? '').toUpperCase()
  const financialStatus = (shopifyOrder.displayFinancialStatus ?? '').toUpperCase()
  const daysOld = daysSince(shopifyOrder.createdAt)

  // 6. Not yet shipped → suggest cancel instead
  if (fulfillmentStatus === 'UNFULFILLED') {
    return NextResponse.json({
      success: false,
      suggestCancel: true,
      message: `Order ${orderNumber} hasn't shipped yet. You can cancel it instead — would you like to request a cancellation?`,
    }, { status: 200 })
  }

  // 7. Already cancelled/refunded
  if (financialStatus === 'REFUNDED' || financialStatus === 'VOIDED') {
    return NextResponse.json({
      success: false,
      alreadyRefunded: true,
      message: `A refund was already processed for order ${orderNumber}. If you have not received it within 7 business days, please contact support.`,
    }, { status: 200 })
  }

  // 8. Return window check (7 days policy)
  const RETURN_WINDOW_DAYS = 7
  if (daysOld > RETURN_WINDOW_DAYS) {
    logSupportEvent({ action: 'return_request', orderNumber, result: 'outside_return_window', ip: auth.ip, meta: { daysOld } })
    return NextResponse.json({
      success: false,
      outsideReturnWindow: true,
      message: `Unfortunately, order ${orderNumber} is ${daysOld} days old. Our return window is ${RETURN_WINDOW_DAYS} days from delivery. Please contact support if you believe this is an exception.`,
    }, { status: 200 })
  }

  // 9. Eligible → log return request
  if (isAdminInitialized() && adminDb) {
    const returnRequest = {
      orderNumber,
      shopifyOrderId: shopifyOrder.id,
      phone: phone || shopifyOrder.customer?.phone || null,
      reason,
      fulfillmentStatus,
      daysOld,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    }
    await adminDb.collection('returnRequests').add(returnRequest).catch((err: unknown) => {
      console.error('[return-order] Failed to log return request:', err)
    })
  }

  logSupportEvent({
    action: 'return_request',
    orderNumber,
    result: 'submitted',
    ip: auth.ip,
    meta: { fulfillmentStatus, reason, daysOld },
  })

  return NextResponse.json({
    success: true,
    message: `Your return request for order ${orderNumber} has been submitted. Our team will reach out within 24-48 hours with return instructions. Refunds are processed within 5-7 business days after we receive the product.`,
    orderNumber,
    refundTimeline: '5-7 business days after return receipt',
  }, { status: 200 })
}
