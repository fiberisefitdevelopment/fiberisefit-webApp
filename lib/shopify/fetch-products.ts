import { shopifyFetch, formatProduct } from '@/lib/shopify/client'
import { filterVisibleProducts } from '@/lib/hidden-products'
import { PRODUCTS_QUERY } from '@/lib/shopify/queries'

export type StorefrontProduct = ReturnType<typeof formatProduct>

const PAGE_SIZE = 50
const MAX_PAGES = 100

type ProductsResponse = {
  products: {
    edges: Array<{ node: unknown; cursor: string }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string
    }
  }
}

/** Server-side catalog fetch (same shape as GET /api/shopify/products?all=true). */
export async function fetchAllStorefrontProducts(): Promise<StorefrontProduct[]> {
  const allProducts: unknown[] = []
  let after: string | undefined
  let pageCount = 0

  do {
    const data = await shopifyFetch<ProductsResponse>({
      query: PRODUCTS_QUERY,
      variables: { first: PAGE_SIZE, after },
    })

    const edges = data.products.edges
    allProducts.push(...edges.map((e) => e.node))
    pageCount += 1

    const hasNext = data.products.pageInfo?.hasNextPage && data.products.pageInfo?.endCursor
    if (!hasNext || edges.length === 0 || pageCount >= MAX_PAGES) break
    after = data.products.pageInfo.endCursor
  } while (true)

  return filterVisibleProducts(allProducts.map((node) => formatProduct(node)))
}
