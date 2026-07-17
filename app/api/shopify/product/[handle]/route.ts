import { NextRequest, NextResponse } from 'next/server'
import { shopifyFetch, formatProduct } from '@/lib/shopify/client'
import { PRODUCT_BY_HANDLE_QUERY } from '@/lib/shopify/queries'
import { withTransformationPackAssortedVariant } from '@/lib/transformation-pack-variants'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params
    
    console.log('Fetching product with handle:', handle)

    if (!handle) {
      return NextResponse.json(
        { error: 'Product handle is required' },
        { status: 400 }
      )
    }

    const data = await shopifyFetch<{
      product: any
    }>({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    })

    console.log('Shopify response received:', data ? 'Success' : 'No data')

    if (!data.product) {
      console.log('Product not found for handle:', handle)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = formatProduct(data.product)
    console.log('Product formatted successfully:', product.title)

    return NextResponse.json(
      { product: withTransformationPackAssortedVariant(product, handle) },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
