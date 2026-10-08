import { SHOPIFY_STOREFRONT_API_URL, SHOPIFY_CONFIG } from './config'

interface ShopifyResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: Array<string | number>
  }>
}

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string
  variables?: Record<string, any>
}): Promise<T> {
  try {
    
    const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify API error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const result: ShopifyResponse<T> = await response.json()

    if (result.errors) {
      console.error('GraphQL errors:', result.errors)
      throw new Error(result.errors.map((e) => e.message).join(', '))
    }

    if (!result.data) {
      console.error('No data in Shopify response')
      throw new Error('No data returned from Shopify')
    }

    return result.data
  } catch (error) {
    console.error('Shopify fetch error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}

// Helper function to format product data
export function formatProduct(product: any) {
  const image = product.images?.edges?.[0]?.node
  const variant = product.variants?.edges?.[0]?.node
  const price = parseFloat(product.priceRange?.minVariantPrice?.amount || variant?.price?.amount || '0')
  const maxPrice = parseFloat(product.priceRange?.maxVariantPrice?.amount || '0')

  // Get the first available variant GID (for cart/checkout)
  const variantGID = variant?.id || product.variants?.edges?.[0]?.node?.id || ''

  // Check availability - only mark as available if explicitly true
  // Check if at least one variant is available
  const hasAvailableVariant = product.variants?.edges?.some((edge: any) => edge.node.availableForSale === true)
  const isAvailable = variant?.availableForSale === true || hasAvailableVariant === true
  
  // Extract metafields - filter out null values first
  const metafields = (product.metafields || []).filter((m: any) => m !== null && m !== undefined)
  const servings = metafields.find((m: any) => m && m.key === 'servings')?.value || ''
  const ingredients = metafields.find((m: any) => m && m.key === 'ingredients')?.value || ''
  const shippingInfo = metafields.find((m: any) => m && m.key === 'shipping_info')?.value || ''
  const returnsInfo = metafields.find((m: any) => m && m.key === 'returns_info')?.value || ''

  const variantsFormatted = (product.variants?.edges?.map((edge: any) => {
    const vPrice = parseFloat(edge.node.price?.amount || '0')
    const vCompareAt = edge.node.compareAtPrice?.amount ? parseFloat(edge.node.compareAtPrice.amount) : null
    return {
      id: edge.node.id || '',
      gid: edge.node.id || '',
      name: edge.node.title || '',
      price: vPrice,
      compareAtPrice: vCompareAt != null && vCompareAt > vPrice ? vCompareAt : null,
      available: edge.node.availableForSale === true,
      selectedOptions: edge.node.selectedOptions || [],
    }
  }) || []) as Array<{ id: string; gid: string; name: string; price: number; compareAtPrice: number | null; available: boolean; selectedOptions: any[] }>

  // Product-level compare price: use first variant's compare-at when it's a discount
  const firstVariantCompare = variantsFormatted[0]?.compareAtPrice
  const comparePrice = firstVariantCompare != null && firstVariantCompare > price ? firstVariantCompare : null

  return {
    id: variantGID, // Use variant GID for cart (full GID format: gid://shopify/ProductVariant/123)
    productId: product.id || '', // Keep product ID for reference
    title: product.title || '',
    handle: product.handle || '',
    description: product.description || '',
    descriptionHtml: product.descriptionHtml || '',
    price,
    maxPrice: maxPrice > price ? maxPrice : null,
    comparePrice,
    image: image?.url || '',
    images: product.images?.edges?.map((edge: any) => edge.node.url) || [],
    available: isAvailable, // Only true if explicitly available
    variants: variantsFormatted,
    slug: product.handle || '',
    // Metafields from Shopify
    servings,
    ingredients,
    shippingInfo,
    returnsInfo,
  }
}

// Helper function to format collection data
export function formatCollection(collection: any) {
  return {
    id: collection.id?.split('/').pop() || '',
    title: collection.title || '',
    handle: collection.handle || '',
    description: collection.description || '',
    image: collection.image?.url || '',
  }
}

