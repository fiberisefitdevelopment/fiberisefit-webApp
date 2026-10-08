import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch, formatProduct } from '@/lib/shopify/client'
import { filterVisibleProducts } from '@/lib/hidden-products'
import { COLLECTION_QUERY } from '@/lib/shopify/queries'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params
    const searchParams = request.nextUrl.searchParams
    const first = parseInt(searchParams.get('first') || '50')
    const after = searchParams.get('after') || undefined

    if (!handle) {
      return NextResponse.json(
        { error: 'Collection handle is required' },
        { status: 400 }
      )
    }

    const data = await shopifyFetch<{
      collection: {
        id: string
        title: string
        description: string
        products: {
          edges: Array<{
            node: any
            cursor: string
          }>
          pageInfo: {
            hasNextPage: boolean
            hasPreviousPage: boolean
            startCursor: string
            endCursor: string
          }
        }
      }
    }>({
      query: COLLECTION_QUERY,
      variables: { handle, first, after },
    })

    if (!data.collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    const products = filterVisibleProducts(
      data.collection.products.edges.map((edge) => formatProduct(edge.node))
    )

    return NextResponse.json(
      {
        collection: {
          id: data.collection.id,
          title: data.collection.title,
          description: data.collection.description,
        },
        products,
        pageInfo: data.collection.products.pageInfo,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}
