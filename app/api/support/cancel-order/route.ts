/**
 * POST /api/support/cancel-order
 *
 * Zoho SalesIQ Zobot — Cancel Order endpoint.
 * Rules:
 *   - UNFULFILLED orders → eligible for cancellation → logs request to Firestore
 *   - FULFILLED / SHIPPED orders → not eligible → suggest return flow
 *   - NOT FOUND → friendly message
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
    console.error('[cancel-order] SHOPIFY_ADMIN_ACCESS_TOKEN not configured')
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
    console.error('[cancel-order] Shopify fetch error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  if (!shopifyOrder) {
    logSupportEvent({ action: 'cancel_request', orderNumber, result: 'not_found', ip: auth.ip })
    return NextResponse.json(
      { success: false, message: 'Order not found. Please check the order number and try again.' },
      { status: 200 }
    )
  }

  const fulfillmentStatus = (shopifyOrder.displayFulfillmentStatus ?? '').toUpperCase()
  const financialStatus = (shopifyOrder.displayFinancialStatus ?? '').toUpperCase()

  // 6. Already cancelled
  if (fulfillmentStatus === 'CANCELLED' || financialStatus === 'VOIDED' || financialStatus === 'REFUNDED') {
    logSupportEvent({ action: 'cancel_request', orderNumber, result: 'already_cancelled', ip: auth.ip })
    return NextResponse.json({
      success: false,
      alreadyCancelled: true,
      message: 'This order has already been cancelled. If you have not received a refund within 5-7 business days, please contact support.',
    }, { status: 200 })
  }

  // 7. Already shipped / fulfilled → not eligible for cancellation
  if (fulfillmentStatus === 'FULFILLED' || fulfillmentStatus === 'PARTIAL') {
    logSupportEvent({ action: 'cancel_request', orderNumber, result: 'not_eligible_fulfilled', ip: auth.ip })
    return NextResponse.json({
      success: false,
      alreadyShipped: true,
      message: 'Your order has already been shipped and cannot be cancelled. You may be eligible for a return instead.',
    }, { status: 200 })
  }

  // 8. Eligible for cancellation (UNFULFILLED)
  // Log the cancellation request to Firestore for the team to action
  if (isAdminInitialized() && adminDb) {
    const cancelRequest = {
      orderNumber,
      shopifyOrderId: shopifyOrder.id,
      phone: phone || shopifyOrder.customer?.phone || null,
      reason,
      status: 'pending',  // team will action this
      requestedAt: new Date().toISOString(),
    }
    await adminDb.collection('cancelRequests').add(cancelRequest).catch((err: unknown) => {
      console.error('[cancel-order] Failed to log cancel request:', err)
    })
  }

  logSupportEvent({
    action: 'cancel_request',
    orderNumber,
    result: 'submitted',
    ip: auth.ip,
    meta: { fulfillmentStatus, reason },
  })

  return NextResponse.json({
    success: true,
    message: `Your cancellation request for order ${orderNumber} has been submitted. Our team will process it within 24 hours and you will receive a confirmation. Refunds take 5-7 business days.`,
    orderNumber,
    refundTimeline: '5-7 business days',
  }, { status: 200 })
}
