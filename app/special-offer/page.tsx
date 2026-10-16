import SpecialOfferPage from '@/components/pages/SpecialOfferPage'
import { getSpecialOfferMedia } from '@/lib/shopify/special-offer-media'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Special Offer — 7, 30 & 90 Days Packs | Fiberise Fit',
  description:
    'Exclusive special offer on FYBER Starter Pack, Transformation Pack, and Ultimate Pack with Lite Fitband in Assorted Flavours.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Special Offer — 7, 30 & 90 Days Packs | Fiberise Fit',
    description:
      'Exclusive special offer on FYBER Starter Pack, Transformation Pack, and Ultimate Pack with Lite Fitband in Assorted Flavours.',
    url: 'https://fiberisefit.com/special-offer',
    type: 'website',
  },
  alternates: {
    canonical: '/special-offer',
  },
}

export default async function Page() {
  const media = await getSpecialOfferMedia().catch(() => ({
    images: {} as Record<string, string[]>,
    descriptions: {} as Record<string, string>,
  }))
  const firstImage = media.images['starter-pack']?.[0]
  return (
    <>
      {firstImage ? (
        <link rel="preload" as="image" href={firstImage} fetchPriority="high" />
      ) : null}
      <SpecialOfferPage
        initialImages={media.images}
        initialDescriptions={media.descriptions}
      />
    </>
  )
}
