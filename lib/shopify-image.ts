/** Width used for on-page Shopify product photos (LCP / gallery). */
export const SHOPIFY_DISPLAY_WIDTH = 800

/** Ask Shopify CDN for a resized file instead of the multi-megabyte original. */
export function shopifyDisplayUrl(
  src: string,
  width: number = SHOPIFY_DISPLAY_WIDTH
): string {
  if (!src || !src.includes('cdn.shopify.com')) return src
  try {
    const url = new URL(src)
    url.searchParams.set('width', String(width))
    return url.toString()
  } catch {
    return src
  }
}
