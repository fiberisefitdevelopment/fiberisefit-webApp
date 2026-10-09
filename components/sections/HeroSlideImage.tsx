import type { HeroSlide } from '@/lib/homepage-hero'

type HeroSlideImageProps = {
  slide: HeroSlide
  isPriority: boolean
}

/** Pre-compressed WebP in /public/banners/optimized — served directly (no _next/image). */
export default function HeroSlideImage({ slide, isPriority }: HeroSlideImageProps) {
  return (
    <img
      src={slide.mobileImage}
      srcSet={`${slide.mobileImage} 767w, ${slide.desktopImage} 1280w`}
      sizes="100vw"
      alt={slide.alt}
      width={1200}
      height={1500}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      loading="eager"
      fetchPriority={isPriority ? 'high' : 'low'}
      decoding="async"
      draggable={false}
    />
  )
}
