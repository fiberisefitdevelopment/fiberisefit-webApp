import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, isAdminInitialized, getInitError } from '@/lib/firebase/admin'
import { shopifyAdminFetch } from '@/lib/shopify/admin-client'
import { ORDERS_BY_EMAIL_QUERY } from '@/lib/shopify/queries'
import { normalizePhone } from '@/lib/user-identifier'

export const dynamic = 'force-dynamic'

/** Returns true if two digit-only strings represent the same phone (exact or last-10 match for country code). */
function phonesMatch(userDigits: string, orderDigits: string): boolean {
  if (!orderDigits) return false
  if (userDigits === orderDigits) return true
  // Indian (and others): user +919548891893 (12) vs order 9548891893 (10)
  if (userDigits.length >= 10 && orderDigits.length >= 10) {
    const userLast10 = userDigits.slice(-10)
    const orderLast10 = orderDigits.slice(-10)
    if (userLast10 === orderLast10) return true
  }
  // One contains the other (e.g. 919548891893 ends with 9548891893)
  if (userDigits.length >= orderDigits.length && userDigits.endsWith(orderDigits)) return true
  if (orderDigits.length >= userDigits.length && orderDigits.endsWith(userDigits)) return true
  return false
}

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
    const list = Array.isArray(ti) ? ti : (ti as { edges?: Array<{ node: FulfillmentTrackingInfo }> }).edges?.map((e) => e.node) ?? []
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

function orderToResult(order: OrderNode) {
  const fulfillments = getFulfillmentsList(order)
  const tracking = getTrackingFromFulfillments(fulfillments)
  const deliveryStatus = getDeliveryStatus(order)

  return {
    id: order.id,
    orderNumber: order.name,
    email: order.email || order.customer?.email || null,
    createdAt: order.createdAt,
    status: order.displayFulfillmentStatus || 'pending',
    financialStatus: order.displayFinancialStatus || 'pending',
    totalAmount: parseFloat(order.totalPriceSet.shopMoney.amount),
    currencyCode: order.totalPriceSet.shopMoney.currencyCode,
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
    items: order.lineItems.edges.map((itemEdge) => ({
      title: itemEdge.node.title,
      quantity: itemEdge.node.quantity,
      price: parseFloat(itemEdge.node.originalUnitPriceSet.shopMoney.amount),
      image: itemEdge.node.image?.url || '',
    })),
    deliveryStatus: deliveryStatus || null,
    tracking: tracking.length > 0 ? tracking : [],
  }
}

export async function GET(request: NextRequest) {
  // Check if Firebase Admin is initialized
  if (!isAdminInitialized() || !adminAuth) {
    const error = getInitError()
    console.error('Firebase Admin not initialized:', error)
    return NextResponse.json(
      {
        error: 'Firebase Admin not configured. Please check FIREBASE_SERVICE_ACCOUNT_KEY in .env.local',
        details: error?.message || 'Unknown error',
        orders: [],
      },
      { status: 500 }
    )
  }

  try {
    // Get Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided', orders: [] },
        { status: 401 }
      )
    }

    const idToken = authHeader.split('Bearer ')[1]

    // Verify Firebase token
    let decodedToken
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken)
    } catch (error: any) {
      console.error('Token verification error:', error)
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token', orders: [] },
        { status: 401 }
      )
    }

    const phone = decodedToken.phone_number as string | undefined
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required. Please sign in with phone.', orders: [] },
        { status: 400 }
      )
    }

    const normalizedUserPhone = normalizePhone(phone)

    // Check if we have Shopify Admin API token
    if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      console.warn('SHOPIFY_ADMIN_ACCESS_TOKEN not configured. Cannot fetch orders from Shopify.')
      return NextResponse.json(
        {
          error: 'Shopify Admin API not configured. Please set SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local',
          orders: [],
        },
        { status: 200 }
      )
    }

    try {
      console.log(`🔍 Fetching orders for phone: ${phone}`)

      // Fetch recent orders with pagination and filter by phone
      const PAGE_SIZE = 100
      const MAX_PAGES = 10 // cap at 1000 orders to avoid long runs
      let byPhone: OrderNode[] = []
      let cursor: string | null = null
      let pageCount = 0
      let lastRecentPage: OrdersQueryResponse['orders'] | null = null

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
        lastRecentPage = recentData.orders
        const nodes = recentData.orders.edges.map((edge: { node: OrderNode }) => edge.node)
        const matches = filterByPhone(nodes)
        byPhone = byPhone.concat(matches)
        pageCount += 1
        const pageInfo: { hasNextPage: boolean; endCursor: string | null } | undefined =
          recentData.orders.pageInfo
        const hasNextPage = pageInfo?.hasNextPage === true && pageInfo?.endCursor
        if (!hasNextPage || nodes.length === 0) break
        cursor = pageInfo!.endCursor
      }

      if (byPhone.length > 0) {
        console.log(`📱 Found ${byPhone.length} order(s) by phone (scanned ${pageCount} page(s))`)
      }

      // Dedupe by order id, sort by createdAt desc
      const seen = new Set<string>()
      const merged = byPhone
        .filter((order) => {
          if (seen.has(order.id)) return false
          seen.add(order.id)
          return true
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      const filteredOrders = merged.map(orderToResult)

      if (filteredOrders.length === 0 && (lastRecentPage?.edges.length ?? 0) > 0) {
        lastRecentPage!.edges.slice(0, 5).forEach((edge: { node: OrderNode }) => {
          const o = edge.node
          const phones = [
            o.phone,
            o.shippingAddress?.phone ?? null,
            o.customer?.phone ?? null,
            o.customer?.defaultPhoneNumber?.phoneNumber ?? null,
          ].filter(Boolean)
          console.log(`  [debug] ${o.name}: email=${o.email ?? o.customer?.email ?? 'null'}, phones=${JSON.stringify(phones)}`)
        })
      }

      console.log(`✅ Returning ${filteredOrders.length} orders (phone: ${byPhone.length})`)
      return NextResponse.json({ orders: filteredOrders })
    } catch (shopifyError: any) {
      console.error('❌ Error fetching orders from Shopify:', shopifyError)
      console.error('Error details:', shopifyError.message)

      // Return empty orders array instead of failing
      return NextResponse.json(
        {
          error: 'Failed to fetch orders from Shopify',
          details: shopifyError.message || 'Unknown error',
          orders: [],
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error('Error in /api/orders:', error)
    return NextResponse.json(
      { error: 'Internal server error', orders: [] },
      { status: 500 }
    )
  }
}
