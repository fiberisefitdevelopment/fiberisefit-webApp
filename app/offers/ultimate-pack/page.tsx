import ProductPage from '@/components/pages/ProductPage'
import type { Metadata } from 'next'
import { shopifyFetch, formatProduct } from '@/lib/shopify/client'
import { PRODUCT_BY_HANDLE_QUERY } from '@/lib/shopify/queries'

export const dynamic = 'force-dynamic'

const PRODUCT_HANDLE = 'ultimate-pack'

export const metadata: Metadata = {
  title: 'Fyber Ultimate Pack (90 Sachets + Lyte Band) - Exclusive Offer | Fiberise',
  description:
    'Fyber Ultimate Pack with 90 sachets and Lyte Band. Control cravings, boost metabolism & support gut health. Free shipping.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: '/offers/ultimate-pack',
  },
}

async function getProductData() {
  try {
    const data = await shopifyFetch<{ product: any }>({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: PRODUCT_HANDLE },
    })
    if (!data.product) return null
    return formatProduct(data.product)
  } catch (err) {
    console.error('SSR Product Fetch Error:', err)
    return null
  }
}

export default async function UltimatePackIsolatedOfferPage() {
  const initialProduct = await getProductData()
  return (
    <ProductPage
      slug={PRODUCT_HANDLE}
      initialProduct={initialProduct}
      isIsolatedPurchasePage
    />
  )
}
