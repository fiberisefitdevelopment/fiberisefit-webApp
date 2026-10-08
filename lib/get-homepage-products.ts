import { fetchAllStorefrontProducts } from '@/lib/shopify/fetch-products'
import { pickFeaturedHomeProducts } from '@/lib/homepage-products'
import { unstable_cache } from 'next/cache'

const getCachedCatalog = unstable_cache(
  async () => fetchAllStorefrontProducts(),
  ['homepage-shopify-catalog'],
  { revalidate: 300 }
)

export async function getHomepageProducts() {
  try {
    const catalog = await getCachedCatalog()
    const featured = pickFeaturedHomeProducts(catalog)
    return { catalog, featured }
  } catch (error) {
    console.error('[getHomepageProducts] Shopify fetch failed:', error)
    return { catalog: [], featured: [] }
  }
}
