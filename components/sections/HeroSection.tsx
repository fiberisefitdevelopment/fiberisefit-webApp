import HeroCarouselClient from '@/components/sections/HeroCarousel.client'
import HeroSlideImage from '@/components/sections/HeroSlideImage'
import { HERO_SLIDES } from '@/lib/homepage-hero'
import type { StorefrontProduct } from '@/lib/shopify/fetch-products'

type HeroSectionProps = {
  products: StorefrontProduct[]
}

export default function HeroSection({ products }: HeroSectionProps) {
  return (
    <HeroCarouselClient
      products={products}
      firstSlideImage={<HeroSlideImage slide={HERO_SLIDES[0]} isPriority />}
    />
  )
}
