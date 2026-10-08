'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { HERO_SLIDES, type HeroSlide } from '@/lib/homepage-hero'
import { HERO_FALLBACK_PRODUCTS } from '@/lib/homepage-products'
import type { StorefrontProduct } from '@/lib/shopify/fetch-products'
import HeroSlideImage from '@/components/sections/HeroSlideImage'

type HeroCarouselClientProps = {
  products: StorefrontProduct[]
  /** Server-rendered LCP image for slide 1 (streamed as child). */
  firstSlideImage: ReactNode
}

export default function HeroCarouselClient({ products, firstSlideImage }: HeroCarouselClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const [hasLoadedOtherSlides, setHasLoadedOtherSlides] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: typeof requestIdleCallback }).requestIdleCallback(
        () => setHasLoadedOtherSlides(true),
        { timeout: 2500 }
      )
      return () =>
        (window as Window & { cancelIdleCallback: typeof cancelIdleCallback }).cancelIdleCallback(id)
    }
    const timer = setTimeout(() => setHasLoadedOtherSlides(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleOrderNow = async (productSearch: string) => {
    try {
      setIsAdding(productSearch)
      const foundProduct = products.find((p) => p.title.toLowerCase().includes(productSearch))
      const productDetails = foundProduct || HERO_FALLBACK_PRODUCTS[productSearch]

      if (productDetails) {
        addItem({
          id: productDetails.id,
          title: productDetails.title,
          price: productDetails.price,
          image: productDetails.image,
          handle: productDetails.slug,
        })
      }
    } finally {
      setIsAdding(null)
    }
  }

  const renderSlideImage = (slide: HeroSlide, index: number) => {
    if (index === 0 && currentIndex === 0) {
      return firstSlideImage
    }
    return <HeroSlideImage slide={slide} isPriority={index === 0} />
  }

  return (
    <section className="relative w-full overflow-hidden bg-white pt-20 md:pt-20 group">
      <div className="relative w-full h-0 hero-carousel-wrapper">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex
          const shouldRenderSlide = index === 0 || hasLoadedOtherSlides || currentIndex === index

          return (
            <div
              key={slide.key}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {shouldRenderSlide ? (
                <Link
                  href={`/products/${slide.slug}`}
                  className="block relative w-full h-full cursor-pointer"
                  title={`View ${slide.alt}`}
                >
                  {renderSlideImage(slide, index)}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleOrderNow(slide.productSearch)
                    }}
                    disabled={isAdding !== null}
                    className={`absolute bottom-[10%] md:bottom-[15%] left-1/2 md:left-[16%] -translate-x-1/2 md:translate-x-0 z-20 px-8 py-3.5 md:px-12 md:py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.2)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${slide.btnClass}`}
                  >
                    {isAdding === slide.productSearch ? 'Adding...' : slide.btnText}
                  </button>
                </Link>
              ) : (
                <div className="w-full h-full bg-[#f6f2ec]" />
              )}
            </div>
          )
        })}

        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5 px-3 py-1.5 rounded-full bg-black/15 backdrop-blur-sm">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setHasLoadedOtherSlides(true)
                setCurrentIndex(index)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
