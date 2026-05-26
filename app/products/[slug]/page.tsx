import ProductPage from '@/components/pages/ProductPage'
import type { Metadata } from 'next'
import { shopifyFetch, formatProduct } from '@/lib/shopify/client'
import { PRODUCT_BY_HANDLE_QUERY } from '@/lib/shopify/queries'

const PRODUCT_META_BY_SLUG: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  'starter-pack': {
    title: 'Fyber Starter Pack (7 Sachets) - Natural Fiber Weight Management | Fiberise',
    description:
      'Fyber is a natural fiber weight management solution in easy sachet form. Control cravings, support fat metabolism & improve gut health. 7 Sachets included. Free shipping pan India.',
    keywords: 'natural fiber, weight management',
  },
  'transformation-pack': {
    title: 'Fyber Transformation Pack (30 Sachets) - Weight Management & Fat Burner',
    description:
      'Control cravings & manage weight naturally with the 30-sachet Transformation Pack. Supports fat burning & gut health - smart alternative for weight loss.',
    keywords: 'ozempic for weight loss, weight management supplements, fat burner for women, best fiber supplement',
  },
  'ultimate-pack': {
    title: 'Fyber Ultimate Pack (90 Sachets + Lyte Band) - Best Weight Loss Set',
    description:
      'Fyber Ultimate Pack with 90 sachets and Lyte Band. The best weight loss tracking to control cravings, boost metabolism & support gut health. Free shipping.',
    keywords: 'fat loss medicine, best weight loss, ozempic medicine',
  },
}

const PRODUCT_SCHEMA_BY_SLUG: Record<string, Record<string, unknown>> = {
  'starter-pack': {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: 'Starter Pack',
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/FIBERISE_A_-01.png?v=1773251134',
    description:
      'The 7-sachet FYBER Starter Pack is designed for first-time users looking to experience natural craving suppression, better fat metabolism, and sustained daily energy.',
    brand: {
      '@type': 'Brand',
      name: 'Fiberise Fit',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://fiberisefit.com/products/starter-pack',
      priceCurrency: 'INR',
      price: '2249',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  },
  'transformation-pack': {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: 'Transformation Pack',
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/kh.jpg?v=1773315591',
    description:
      'The Transformation Pack is a 30-sachet clinically tested weight-management solution formulated for deep daily craving control and regulated metabolism.',
    brand: {
      '@type': 'Brand',
      name: 'Fiberise Fit',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://fiberisefit.com/products/transformation-pack',
      priceCurrency: 'INR',
      price: '5999',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '7',
    },
  },
  'ultimate-pack': {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: 'Ultimate Pack',
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/hf_20260312_061942_1ae37390-504a-4f8d-9c88-2036cfc3a423.jpg?v=1773309225',
    description:
      'The Ultimate Pack is a 90-sachet + Lyte Band clinically tested weight-management solution formulated for deep daily craving control, sustained energy, and healthy weight management.',
    brand: {
      '@type': 'Brand',
      name: 'Fiberise Fit',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://fiberisefit.com/products/ultimate-pack',
      priceCurrency: 'INR',
      price: '6499',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '7',
    },
  },
}

type ProductProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
  const { slug } = await params
  const key = (slug || '').toLowerCase()
  const meta = PRODUCT_META_BY_SLUG[key] ?? PRODUCT_META_BY_SLUG[key.replace(/^\//, '')]

  const title = meta?.title ?? 'Fiberise Fit'
  const description = meta?.description ?? 'Smart health ecosystem powered by AI & innovation.'
  const url = `/products/${slug}`

  return {
    title,
    description,
    keywords: meta?.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
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

function getBreadcrumbSchema(slug: string) {
  const nameMap: Record<string, string> = {
    'starter-pack': 'Starter Pack',
    'transformation-pack': 'Transformation Pack',
    'ultimate-pack': 'Ultimate Pack',
  }
  const name = nameMap[slug] || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://fiberisefit.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Products',
        'item': 'https://fiberisefit.com/products'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': name,
        'item': `https://fiberisefit.com/products/${slug}`
      }
    ]
  }
}

export default async function Product({ params }: ProductProps) {
  const { slug } = await params
  const initialProduct = await getProductData(slug)
  const productSchema = PRODUCT_SCHEMA_BY_SLUG[slug]
  const breadcrumbSchema = getBreadcrumbSchema(slug)

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductPage slug={slug} initialProduct={initialProduct} />
    </>
  )
}
