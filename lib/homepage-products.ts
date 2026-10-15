import type { StorefrontProduct } from '@/lib/shopify/fetch-products'

export const HERO_FALLBACK_PRODUCTS: Record<
  string,
  { id: string; title: string; price: number; image: string; slug: string }
> = {
  'transformation pack': {
    id: 'gid://shopify/ProductVariant/53389411549459',
    title: 'Transformation Pack',
    price: 2249,
    image:
      'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/Transformation_Pack.png?v=1779360501',
    slug: 'transformation-pack',
  },
  'ultimate pack': {
    id: 'gid://shopify/ProductVariant/67585010434323',
    title: 'Ultimate Pack',
    price: 5999,
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/A_90Days_-01.jpg?v=1791206641',
    slug: 'ultimate-pack',
  },
}

export function pickFeaturedHomeProducts(products: StorefrontProduct[]): StorefrontProduct[] {
  return [...products]
    .filter((p) => {
      const t = p.title.toLowerCase()
      return (
        (t.includes('transformation pack') ||
          t.includes('ultimate pack') ||
          t.includes('elite pack')) &&
        p.slug !== 'starter-pack'
      )
    })
    .sort((a, b) => {
      const rank = (title: string) => {
        const t = title.toLowerCase()
        // Desktop row is Ultimate | Transformation | Elite, so the popular pack sits in the center.
        if (t.includes('ultimate')) return 0
        if (t.includes('transformation')) return 1
        if (t.includes('elite')) return 2
        return 3
      }
      return rank(a.title) - rank(b.title)
    })
}
