import type { Metadata } from 'next'
import PackGuideLocked from '@/components/pages/PackGuideLocked'
import PackGuidePage from '@/components/pages/PackGuidePage'
import { isPackGuideToken } from '@/lib/pack-guide'

export const metadata: Metadata = {
  title: 'How to Use FYBER | Pack Guide',
  description: 'How to take FYBER, benefits, recommended packs, and what to expect over 30 to 120 days.',
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

export default async function FyberPackGuidePage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams)
  if (!isPackGuideToken(params?.k)) {
    return <PackGuideLocked />
  }
  return <PackGuidePage />
}
