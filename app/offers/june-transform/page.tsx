import ProductPage from '@/components/pages/ProductPage'
import type { Metadata } from 'next'
import { shopifyFetch, formatProduct } from '@/lib/shopify/client'
import { PRODUCT_BY_HANDLE_QUERY } from '@/lib/shopify/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Fyber Transformation Pack (30 Sachets) - Special Offer | Fiberise',
  description: 'Control cravings & manage weight naturally with the 30-sachet Transformation Pack. Special campaign offer.',
  keywords: 'ozempic for weight loss, weight management supplements, fat burner for women, best fiber supplement',
  alternates: {
    canonical: '/offers/june-transform',
  },
}

async function getProductData(slug: string) {
  try {
    const data = await shopifyFetch<{ product: any }>({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: slug },
    })
    if (!data.product) return null
    return formatProduct(data.product)
  } catch (err) {
    console.error('SSR Product Fetch Error:', err)
    return null
  }
}

export default async function JuneTransformOfferPage() {
  const initialProduct = await getProductData('transformation-pack')
  return <ProductPage slug="transformation-pack" initialProduct={initialProduct} isJuneTransformPage={true} />
}
