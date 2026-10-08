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

/** Shopify link-only discount products (hidden from site; direct URL + isolated checkout UI). */
export const LINK_DISCOUNT_PRODUCTS: Record<string, PdProductConfig> = {
  'transformation-pack-discount': {
    handle: 'transformation-pack-discount',
    regularPrice: 2999,
    salePrice: 1999,
    discountCode: '',
    discountPercent: Math.round((1 - 1999 / 2999) * 100),
  },
  'ultimate-pack-copy': {
    handle: 'ultimate-pack-copy',
    regularPrice: 7999,
    salePrice: 5499,
    discountCode: '',
    discountPercent: Math.round((1 - 5499 / 7999) * 100),
  },
  'elite-pack-discount': {
    handle: 'elite-pack-discount',
    regularPrice: 8999,
    salePrice: 5499,
    discountCode: '',
    discountPercent: Math.round((1 - 5499 / 8999) * 100),
  },
}

export const LINK_DISCOUNT_FALLBACK_HANDLE: Record<string, string> = {
  'transformation-pack-discount': 'transformation-pack',
  'ultimate-pack-copy': 'ultimate-pack',
  'elite-pack-discount': 'elite-pack',
}

/** Link-only handles without PD pricing overrides (Shopify price used as-is). */
export const LINK_ONLY_PRODUCT_HANDLES = ['starter-pack', 'transformation-pack-1', 'special-offer'] as const

export const HIDDEN_PRODUCT_HANDLES = [
  ...Object.keys(PD_PRODUCTS),
  ...Object.keys(LINK_DISCOUNT_PRODUCTS),
  ...LINK_ONLY_PRODUCT_HANDLES,
] as const

export type HiddenProductHandle = (typeof HIDDEN_PRODUCT_HANDLES)[number]

export function normalizeProductHandle(handle: string | null | undefined): string {
  return (handle || '').toLowerCase().trim()
}

export function getPdProductConfig(handle: string | null | undefined): PdProductConfig | null {
  const normalized = normalizeProductHandle(handle)
  return PD_PRODUCTS[normalized] ?? null
}

export function getLinkDiscountProductConfig(handle: string | null | undefined): PdProductConfig | null {
  const normalized = normalizeProductHandle(handle)
  return LINK_DISCOUNT_PRODUCTS[normalized] ?? null
}

export function isLinkDiscountProduct(handle: string | null | undefined): boolean {
  return getLinkDiscountProductConfig(handle) !== null
}

/** PD prepaid pages or link-only discount products — custom MRP / sale display & cart price. */
export function getProductPricingOverride(handle: string | null | undefined): PdProductConfig | null {
  return getPdProductConfig(handle) ?? getLinkDiscountProductConfig(handle)
}

export function isPdProduct(handle: string | null | undefined): boolean {
  return getPdProductConfig(handle) !== null
}

export function isLinkOnlyProduct(handle: string | null | undefined): boolean {
  const normalized = normalizeProductHandle(handle)
  return (LINK_ONLY_PRODUCT_HANDLES as readonly string[]).includes(normalized)
}

export function isHiddenProductHandle(handle: string | null | undefined): boolean {
  return isPdProduct(handle) || isLinkDiscountProduct(handle) || isLinkOnlyProduct(handle)
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

  const [handle] = Array.from(pdHandles)
  return getPdProductConfig(handle)?.discountCode
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
