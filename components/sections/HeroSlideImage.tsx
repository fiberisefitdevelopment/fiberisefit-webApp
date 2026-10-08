'use client'

import type { HeroSlide } from '@/lib/homepage-hero'

type HeroSlideImageProps = {
  slide: HeroSlide
  isPriority: boolean
}

/** Pre-compressed WebP in /public/banners/optimized — served directly (no _next/image). */
export default function HeroSlideImage({ slide, isPriority }: HeroSlideImageProps) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={slide.desktopImage} type="image/webp" />
      <source media="(max-width: 767px)" srcSet={slide.mobileImage} type="image/webp" />
      <img
        src={slide.mobileImage}
        alt={slide.alt}
        width={1200}
        height={1500}
        className="absolute inset-0 w-full h-full object-cover"
        loading={isPriority ? 'eager' : 'lazy'}
        fetchPriority={isPriority ? 'high' : 'auto'}
        decoding={isPriority ? 'sync' : 'async'}
        sizes="100vw"
      />
    </picture>
  )
}
