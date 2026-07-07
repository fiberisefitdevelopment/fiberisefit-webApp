import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch, formatProduct } from '@/lib/shopify/client'
import { filterVisibleProducts } from '@/lib/hidden-products'
import { PRODUCTS_QUERY } from '@/lib/shopify/queries'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 50
const MAX_PAGES = 100 // cap at 5000 products

type ProductsResponse = {
  products: {
    edges: Array<{ node: any; cursor: string }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fetchAll = searchParams.get('all') === 'true' || searchParams.get('all') === '1'
    const first = fetchAll ? PAGE_SIZE : Math.min(250, parseInt(searchParams.get('first') || '10', 10) || 10)
    let after = searchParams.get('after') || undefined

    const allProducts: any[] = []
    let pageCount = 0
    let lastPageInfo: ProductsResponse['products']['pageInfo'] | null = null

    do {
      const data = await shopifyFetch<ProductsResponse>({
        query: PRODUCTS_QUERY,
        variables: { first, after },
      })

      const edges = data.products.edges
      lastPageInfo = data.products.pageInfo
      allProducts.push(...edges.map((e) => e.node))
      pageCount += 1

      if (!fetchAll) break

      const hasNext = data.products.pageInfo?.hasNextPage && data.products.pageInfo?.endCursor
      if (!hasNext || edges.length === 0 || pageCount >= MAX_PAGES) break
      after = data.products.pageInfo!.endCursor
    } while (true)

    if (process.env.NODE_ENV === 'development' && allProducts.length > 0) {
      console.log(`Products API: returned ${allProducts.length} product(s). Handles: ${allProducts.map((p: any) => p?.handle || p?.title).join(', ')}`)
    }

    const products = filterVisibleProducts(allProducts.map((node) => formatProduct(node)))

    return NextResponse.json(
      {
        products,
        total: products.length,
        ...(lastPageInfo && !fetchAll ? { pageInfo: lastPageInfo } : {}),
        ...(fetchAll ? { pageInfo: { pagesFetched: pageCount } } : {}),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
