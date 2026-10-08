import { isLinkDiscountProduct, normalizeProductHandle } from '@/lib/hidden-products'

/** Secret / campaign URLs: same product page, no site navigation. */
export const ISOLATED_PURCHASE_PATHS = ['/offers/ultimate-pack'] as const

export type IsolatedPurchasePath = (typeof ISOLATED_PURCHASE_PATHS)[number]

export function normalizePathname(pathname: string | null | undefined): string {
  if (!pathname) return ''
  const trimmed = pathname.split('?')[0].split('#')[0]
  if (trimmed.length > 1 && trimmed.endsWith('/')) {
    return trimmed.slice(0, -1)
  }
  return trimmed
}

export function isIsolatedPurchasePath(pathname: string | null | undefined): boolean {
  const normalized = normalizePathname(pathname)
  if ((ISOLATED_PURCHASE_PATHS as readonly string[]).includes(normalized)) {
    return true
  }
  const productMatch = normalized.match(/^\/products\/([^/]+)$/)
  if (productMatch && isLinkDiscountProduct(normalizeProductHandle(productMatch[1]))) {
    return true
  }
  return false
}
