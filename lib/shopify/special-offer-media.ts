import { withStarterPackHero } from '@/lib/starter-pack-hero'
import { shopifyFetch } from '@/lib/shopify/client'

const HANDLES = ['starter-pack', 'transformation-pack', 'ultimate-pack'] as const

const SPECIAL_OFFER_PACKS_QUERY = `
  query SpecialOfferPacks {
    starter: product(handle: "starter-pack") {
      descriptionHtml
      images(first: 10) { edges { node { url } } }
    }
    transformation: product(handle: "transformation-pack") {
      descriptionHtml
      images(first: 10) { edges { node { url } } }
    }
    ultimate: product(handle: "ultimate-pack") {
      descriptionHtml
      images(first: 10) { edges { node { url } } }
    }
  }
`

type PackNode = {
  descriptionHtml?: string | null
  images?: { edges?: Array<{ node?: { url?: string | null } | null } | null> | null } | null
} | null

export type SpecialOfferMedia = {
  images: Record<string, string[]>
  descriptions: Record<string, string>
}

function urlsFrom(pack: PackNode): string[] {
  return (pack?.images?.edges || [])
    .map((edge) => edge?.node?.url || '')
    .filter((url) => url.length > 0)
}

export async function getSpecialOfferMedia(): Promise<SpecialOfferMedia> {
  const data = await shopifyFetch<{
    starter: PackNode
    transformation: PackNode
    ultimate: PackNode
  }>({ query: SPECIAL_OFFER_PACKS_QUERY })

  const packs: Array<[string, PackNode]> = [
    [HANDLES[0], data.starter],
    [HANDLES[1], data.transformation],
    [HANDLES[2], data.ultimate],
  ]

  const images: Record<string, string[]> = {}
  const descriptions: Record<string, string> = {}
  for (const [handle, pack] of packs) {
    const gallery = withStarterPackHero(handle, urlsFrom(pack), { includeHero: false })
    if (gallery.length > 0) images[handle] = gallery
    if (pack?.descriptionHtml) descriptions[handle] = pack.descriptionHtml
  }
  return { images, descriptions }
}
