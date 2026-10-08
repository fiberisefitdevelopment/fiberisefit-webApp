import SpecialOfferPage from '@/components/pages/SpecialOfferPage'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Special Offer — 7, 30 & 90 Days Packs | Fiberise Fit',
  description:
    'Exclusive special offer on FYBER Starter Pack, Transformation Pack, and Ultimate Pack with Lite Fitband in Assorted Flavours.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: '/special-offer',
  },
}

export default function Page() {
  return <SpecialOfferPage />
}
