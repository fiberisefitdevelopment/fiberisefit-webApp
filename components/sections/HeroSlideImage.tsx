import type { HeroSlide } from '@/lib/homepage-hero'

type HeroSlideImageProps = {
  slide: HeroSlide
  isPriority: boolean
}

/** Hero banners are served directly (no _next/image). */
export default function HeroSlideImage({ slide, isPriority }: HeroSlideImageProps) {
  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
      <img
        src={slide.desktopImage}
        alt={slide.alt}
        width={1200}
        height={1500}
        className="h-full w-full object-cover"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        loading="eager"
        fetchPriority={isPriority ? 'high' : 'low'}
        decoding="async"
        draggable={false}
      />
    </picture>
  )
}
