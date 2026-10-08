import { NextRequest, NextResponse } from 'next/server'
import { shopifyAdminFetch } from '@/lib/shopify/admin-client'
import { ORDERS_BY_EMAIL_QUERY } from '@/lib/shopify/queries'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 100
const MAX_PAGES = 50 // cap at 5000 orders

type OrderNode = {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
  displayFulfillmentStatus: string | null
  displayFinancialStatus: string | null
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } }
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

function orderToResult(order: OrderNode) {
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
  }
}

/**
 * GET /api/shopify/orders
 * Fetches ALL orders from Shopify (Admin API) with cursor pagination.
 * No auth required – ensure this route is protected or only used server-side if needed.
 * Query: ?maxPages=10 (optional, default 50, max 50)
 */
export async function GET(request: NextRequest) {
  if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'SHOPIFY_ADMIN_ACCESS_TOKEN is not configured', orders: [] },
      { status: 503 }
    )
  }

  try {
    const maxPagesParam = request.nextUrl.searchParams.get('maxPages')
    const maxPages = Math.min(
      Math.max(1, parseInt(maxPagesParam || String(MAX_PAGES), 10) || MAX_PAGES),
      50
    )

    const allOrders: OrderNode[] = []
    let cursor: string | null = null
    let pageCount = 0

    while (pageCount < maxPages) {
      const data: OrdersQueryResponse = await shopifyAdminFetch<OrdersQueryResponse>({
        query: ORDERS_BY_EMAIL_QUERY,
        variables: {
          query: 'status:any',
          first: PAGE_SIZE,
          after: cursor,
        },
      })

      const nodes = data.orders.edges.map((e) => e.node)
      allOrders.push(...nodes)
      pageCount += 1

      const pageInfo = data.orders.pageInfo
      const hasNext = pageInfo?.hasNextPage && pageInfo?.endCursor
      if (!hasNext || nodes.length === 0) break
      cursor = pageInfo!.endCursor
    }

    const result = allOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(orderToResult)

    return NextResponse.json({
      orders: result,
      total: result.length,
      pageInfo: { pagesFetched: pageCount },
    })
  } catch (error: any) {
    console.error('Error fetching all orders from Shopify:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch orders', orders: [] },
      { status: 500 }
    )
  }
}
