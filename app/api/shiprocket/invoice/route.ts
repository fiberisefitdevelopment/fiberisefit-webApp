import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, isAdminInitialized } from '@/lib/firebase/admin'
import { findOrderByChannelOrderNumber, getShiprocketInvoicePdfUrl } from '@/lib/shiprocket/client'
import { isShiprocketConfigured } from '@/lib/shiprocket/config'

export const dynamic = 'force-dynamic'

/**
 * GET /api/shiprocket/invoice?orderIds=123,456
 * Returns JSON { url } for the invoice PDF, or redirects to the PDF if redirect=1.
 *
 * Optional: ?orderNumber=1021 to resolve Shiprocket order by custom order_id (e.g. Shopify order number).
 * Requires Authorization: Bearer <Firebase ID token> so only the logged-in user can request.
 */
export async function GET(request: NextRequest) {
  if (!isShiprocketConfigured()) {
    return NextResponse.json(
      { error: 'Shiprocket is not configured. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env.local' },
      { status: 503 }
    )
  }

  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 })
  }

  if (!isAdminInitialized() || !adminAuth) {
    return NextResponse.json({ error: 'Server auth not configured' }, { status: 500 })
  }

  try {
    await adminAuth.verifyIdToken(authHeader.slice(7))
  } catch {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const orderIdsParam = searchParams.get('orderIds')
  const orderNumber = searchParams.get('orderNumber')
  const redirect = searchParams.get('redirect') === '1'

  let orderIds: number[] = []

  if (orderIdsParam) {
    orderIds = orderIdsParam
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n))
  } else if (orderNumber) {
    const match = await findOrderByChannelOrderNumber(orderNumber)
    if (!match?.id) {
      return NextResponse.json(
        { error: `No Shiprocket order found for order number ${orderNumber}` },
        { status: 404 }
      )
    }
    orderIds = [match.id]
  }

  if (orderIds.length === 0) {
    return NextResponse.json(
      { error: 'Provide orderIds (comma-separated Shiprocket order IDs) or orderNumber' },
      { status: 400 }
    )
  }

  try {
    const url = await getShiprocketInvoicePdfUrl(orderIds)
    if (redirect) {
      return NextResponse.redirect(url)
    }
    return NextResponse.json({ url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get invoice URL'
    console.error('Shiprocket invoice error:', err)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
