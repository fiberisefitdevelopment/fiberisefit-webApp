export const TRANSFORMATION_PACK_ASSORTED_FLAVOUR = 'Assorted Flavours'

interface ProductVariantLike {
  id: string
  gid: string
  name: string
  price: number
  compareAtPrice?: number | null
  available: boolean
}

interface ProductLike {
  variants: ProductVariantLike[]
}

const isAssortedFlavour = (name: string) => /assorted/i.test(name)

export function withTransformationPackAssortedVariant<T extends ProductLike>(
  product: T,
  slug: string
): T {
  if (slug !== 'transformation-pack' || !product.variants?.length) {
    return product
  }

  if (product.variants.some((variant) => isAssortedFlavour(variant.name))) {
    return product
  }

  const template =
    product.variants.find((variant) => /unflav/i.test(variant.name)) ??
    product.variants[0]

  return {
    ...product,
    variants: [
      ...product.variants,
      {
        ...template,
        id: `${template.gid}::assorted-flavours`,
        name: TRANSFORMATION_PACK_ASSORTED_FLAVOUR,
      },
    ],
  }
}

export function getShopifyVariantId(variantId: string): string {
  return variantId.split('::')[0]
}

export function isSyntheticAssortedVariant(variantId: string): boolean {
  return variantId.includes('::assorted-flavours')
}
