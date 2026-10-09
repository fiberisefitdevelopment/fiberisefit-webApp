import HeroCarouselClient from '@/components/sections/HeroCarousel.client'
import type { StorefrontProduct } from '@/lib/shopify/fetch-products'

type HeroSectionProps = {
  products: StorefrontProduct[]
}

export default function HeroSection({ products }: HeroSectionProps) {
  return <HeroCarouselClient products={products} />
}
