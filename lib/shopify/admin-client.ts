import { SHOPIFY_CONFIG } from './config'

const SHOPIFY_ADMIN_API_URL = `https://${SHOPIFY_CONFIG.shopDomain}/admin/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`

interface ShopifyAdminResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
  }>
}

export async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, any>
}): Promise<T> {
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

  if (!adminAccessToken) {
    throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN is not configured')
  }

  try {
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ShopifyAdminResponse<T> = await response.json()

    if (result.errors) {
      console.error('GraphQL errors:', result.errors)
      throw new Error(result.errors.map((e) => e.message).join(', '))
    }

    if (!result.data) {
      throw new Error('No data returned from Shopify')
    }

    return result.data
  } catch (error) {
    console.error('Shopify Admin fetch error:', error)
    throw error
  }
}
