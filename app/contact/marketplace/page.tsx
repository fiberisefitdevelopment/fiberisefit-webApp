import type { Metadata } from 'next'
import AmazonContactLocked from '@/components/pages/AmazonContactLocked'
import AmazonContactPage from '@/components/pages/AmazonContactPage'
import { isAmazonContactToken } from '@/lib/amazon-contact'

export const metadata: Metadata = {
  title: 'Marketplace Support | Fiberise Fit',
  description:
    'Contact Fiberise Fit if you bought FYBER on Amazon, Flipkart, Blinkit, Zepto or InstaMart.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
}

type PageProps = {
  searchParams?: Promise<{ k?: string | string[] }> | { k?: string | string[] }
}

export default async function MarketplaceContactRoute({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams)
  if (!isAmazonContactToken(params?.k)) {
    return <AmazonContactLocked />
  }
  return <AmazonContactPage />
}
