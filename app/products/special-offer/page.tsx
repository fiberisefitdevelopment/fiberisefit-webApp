import SpecialOfferPage from '@/components/pages/SpecialOfferPage'
import { getSpecialOfferMedia } from '@/lib/shopify/special-offer-media'
import { shopifyDisplayUrl } from '@/lib/shopify-image'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Fyber Transformation Pack (30 Sachets) - Weight Management & Fat Burner',
  description:
    'Control cravings & manage weight naturally with the 30-sachet Transformation Pack. Supports fat burning & gut health - smart alternative for weight loss.',
  keywords:
    'ozempic for weight loss, weight management supplements, fat burner for women, best fiber supplement',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Fyber Transformation Pack (30 Sachets) - Weight Management & Fat Burner',
    description:
      'Control cravings & manage weight naturally with the 30-sachet Transformation Pack. Supports fat burning & gut health - smart alternative for weight loss.',
    url: 'https://fiberisefit.com/products/special-offer',
    type: 'website',
  },
  alternates: {
    canonical: '/products/special-offer',
  },
}

export default async function Page() {
  const media = await getSpecialOfferMedia().catch(() => ({
    images: {} as Record<string, string[]>,
    descriptions: {} as Record<string, string>,
  }))
  const firstImage = media.images['transformation-pack']?.[0]
  const firstImageSrc = firstImage ? shopifyDisplayUrl(firstImage) : null
  return (
    <>
      {firstImageSrc ? (
        <link rel="preload" as="image" href={firstImageSrc} fetchPriority="high" />
      ) : null}
      <SpecialOfferPage
        initialImages={media.images}
        initialDescriptions={media.descriptions}
        lockedPackageId="transformation"
      />
    </>
  )
}
