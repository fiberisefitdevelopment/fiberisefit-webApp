import { shopifyFetch } from './client'
import {
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
  CUSTOMER_ORDERS_QUERY,
} from './queries'
import type { Order } from '@/lib/orders/types'

export interface CustomerAuthResult {
  accessToken: string
  expiresAt: string
}

export interface ShopifyCustomer {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

export async function customerRegister(input: {
  email: string
  password: string
  firstName?: string
  lastName?: string
}): Promise<{ customer: ShopifyCustomer | null; errors: string[] }> {
  const data = await shopifyFetch<{
    customerCreate: {
      customer: ShopifyCustomer | null
      customerUserErrors: { field: string[] | null; message: string }[]
    }
  }>({
    query: CUSTOMER_CREATE_MUTATION,
    variables: { input },
  })

  const result = data.customerCreate
  const errors = result.customerUserErrors?.map((e) => e.message) || []
  return { customer: result.customer, errors }
}

export async function customerLogin(input: {
  email: string
  password: string
}): Promise<{ token: CustomerAuthResult | null; errors: string[] }> {
  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null
      customerUserErrors: { field: string[] | null; message: string }[]
    }
  }>({
    query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    variables: { input },
  })

  const result = data.customerAccessTokenCreate
  const errors = result.customerUserErrors?.map((e) => e.message) || []
  if (!result.customerAccessToken) {
    return { token: null, errors }
  }

  return {
    token: {
      accessToken: result.customerAccessToken.accessToken,
      expiresAt: result.customerAccessToken.expiresAt,
    },
    errors,
  }
}

export async function customerLogout(token: string): Promise<string[] | null> {
  const data = await shopifyFetch<{
    customerAccessTokenDelete: {
      deletedAccessToken: string | null
      deletedCustomerAccessTokenId: string | null
      userErrors: { field: string[] | null; message: string }[]
    }
  }>({
    query: CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
    variables: { customerAccessToken: token },
  })

  const errs = data.customerAccessTokenDelete.userErrors
  return errs?.length ? errs.map((e) => e.message) : null
}

export interface CustomerOrdersResult {
  customer: ShopifyCustomer | null
  orders: Order[]
  hasNextPage: boolean
  endCursor: string | null
}

export async function fetchCustomerOrders(
  accessToken: string,
  cursor?: string | null
): Promise<CustomerOrdersResult> {
  const data = await shopifyFetch<{
    customer: {
      id: string
      email: string
      firstName: string | null
      lastName: string | null
      orders: {
        edges: {
          cursor: string
          node: {
            id: string
            name: string
            orderNumber: number
            processedAt: string
            financialStatus: string | null
            fulfillmentStatus: string | null
            totalPriceSet: { shopMoney: { amount: string; currencyCode: string } }
            lineItems: {
              edges: {
                node: {
                  title: string
                  quantity: number
                  discountedTotalSet: {
                    shopMoney: { amount: string; currencyCode: string }
                  }
                }
              }[]
            }
          }
        }[]
        pageInfo: { hasNextPage: boolean; endCursor: string | null }
      }
    } | null
  }>({
    query: CUSTOMER_ORDERS_QUERY,
    variables: { customerAccessToken: accessToken, cursor: cursor || null },
  })

  const customer = data.customer
  if (!customer) {
    return { customer: null, orders: [], hasNextPage: false, endCursor: null }
  }

  const orders: Order[] =
    customer.orders.edges.map(({ node }) => {
      const total = parseFloat(node.totalPriceSet.shopMoney.amount || '0')
      const currency = node.totalPriceSet.shopMoney.currencyCode

      const items =
        node.lineItems.edges.map(({ node: item }) => {
          const price = parseFloat(item.discountedTotalSet.shopMoney.amount || '0')
          return {
            title: item.title,
            quantity: item.quantity,
            price,
          }
        }) || []

      return {
        id: node.id,
        name: node.name || `#${node.orderNumber}`,
        date: node.processedAt,
        total,
        currency,
        paymentStatus: node.financialStatus || 'UNKNOWN',
        fulfillmentStatus: node.fulfillmentStatus || 'UNFULFILLED',
        items,
      }
    }) || []

  return {
    customer: {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    },
    orders,
    hasNextPage: customer.orders.pageInfo.hasNextPage,
    endCursor: customer.orders.pageInfo.endCursor,
  }
}

