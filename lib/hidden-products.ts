/** Direct-link-only products — excluded from listings, search, and sitemap. */
export type PdProductConfig = {
  handle: string
  regularPrice: number
  salePrice: number
  discountCode: string
  discountPercent: number
}

export const PD_PRODUCTS: Record<string, PdProductConfig> = {
  'starter-pack-pd': {
    handle: 'starter-pack-pd',
    regularPrice: 1200,
    salePrice: 599,
    discountCode: 'STARTERPD50',
    discountPercent: 50,
  },
  'transformation-pack-pd': {
    handle: 'transformation-pack-pd',
    regularPrice: 2999,
    salePrice: 2249,
    discountCode: 'TRANSFORMPD',
    discountPercent: 25,
  },
  'ultimate-pack-pd': {
    handle: 'ultimate-pack-pd',
    regularPrice: 7999,
    salePrice: 5999,
    discountCode: 'ULTIMATEPD',
    discountPercent: 25,
  },
}

export const HIDDEN_PRODUCT_HANDLES = Object.keys(PD_PRODUCTS) as Array<keyof typeof PD_PRODUCTS>

export type HiddenProductHandle = (typeof HIDDEN_PRODUCT_HANDLES)[number]

export function normalizeProductHandle(handle: string | null | undefined): string {
  return (handle || '').toLowerCase().trim()
}

export function getPdProductConfig(handle: string | null | undefined): PdProductConfig | null {
  const normalized = normalizeProductHandle(handle)
  return PD_PRODUCTS[normalized] ?? null
}

export function isPdProduct(handle: string | null | undefined): boolean {
  return getPdProductConfig(handle) !== null
}

export function isHiddenProductHandle(handle: string | null | undefined): boolean {
  return isPdProduct(handle)
}

export function getPdCheckoutDiscountCode(
  items: Array<{ handle?: string }>
): string | undefined {
  const pdHandles = new Set(
    items
      .map((item) => normalizeProductHandle(item.handle))
      .filter((handle) => isPdProduct(handle))
  )

  if (pdHandles.size !== 1) return undefined

  return getPdProductConfig([...pdHandles][0])?.discountCode
}

export function filterVisibleProducts<T extends { slug?: string; handle?: string }>(
  products: T[]
): T[] {
  return products.filter((product) => {
    const handle = product.slug || product.handle || ''
    return !isHiddenProductHandle(handle)
  })
}

// Backwards-compatible exports
export const STARTER_PACK_PD_HANDLE = PD_PRODUCTS['starter-pack-pd'].handle
export const STARTER_PACK_PD_REGULAR_PRICE = PD_PRODUCTS['starter-pack-pd'].regularPrice
export const STARTER_PACK_PD_PREPAID_PRICE = PD_PRODUCTS['starter-pack-pd'].salePrice
export const STARTER_PACK_PD_PREPAID_DISCOUNT_PERCENT = PD_PRODUCTS['starter-pack-pd'].discountPercent
export const STARTER_PACK_PD_PREPAID_CODE = PD_PRODUCTS['starter-pack-pd'].discountCode

export function isStarterPackPd(handle: string | null | undefined): boolean {
  return normalizeProductHandle(handle) === STARTER_PACK_PD_HANDLE
}
