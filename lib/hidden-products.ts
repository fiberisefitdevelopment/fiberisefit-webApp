/** Products reachable only via direct link — excluded from listings, search, and sitemap. */
export const HIDDEN_PRODUCT_HANDLES = ['starter-pack-pd'] as const

export type HiddenProductHandle = (typeof HIDDEN_PRODUCT_HANDLES)[number]

export const STARTER_PACK_PD_HANDLE = 'starter-pack-pd'
export const STARTER_PACK_PD_REGULAR_PRICE = 1200
export const STARTER_PACK_PD_PREPAID_PRICE = 599
export const STARTER_PACK_PD_PREPAID_DISCOUNT_PERCENT = 50
export const STARTER_PACK_PD_PREPAID_CODE = 'STARTERPD50'

export function isHiddenProductHandle(handle: string | null | undefined): boolean {
  if (!handle) return false
  const normalized = handle.toLowerCase().trim()
  return HIDDEN_PRODUCT_HANDLES.some((hiddenHandle) => hiddenHandle === normalized)
}

export function isStarterPackPd(handle: string | null | undefined): boolean {
  return (handle || '').toLowerCase().trim() === STARTER_PACK_PD_HANDLE
}

export function getStarterPackPdPrice(paymentMethod: 'prepaid' | 'cod'): number {
  return paymentMethod === 'prepaid'
    ? STARTER_PACK_PD_PREPAID_PRICE
    : STARTER_PACK_PD_REGULAR_PRICE
}

export function filterVisibleProducts<T extends { slug?: string; handle?: string }>(
  products: T[]
): T[] {
  return products.filter((product) => {
    const handle = product.slug || product.handle || ''
    return !isHiddenProductHandle(handle)
  })
}
