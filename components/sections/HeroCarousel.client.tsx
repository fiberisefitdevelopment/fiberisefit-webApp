'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { HERO_SLIDES } from '@/lib/homepage-hero'
import { HERO_FALLBACK_PRODUCTS } from '@/lib/homepage-products'
import type { StorefrontProduct } from '@/lib/shopify/fetch-products'
import HeroSlideImage from '@/components/sections/HeroSlideImage'

type HeroCarouselClientProps = {
  products: StorefrontProduct[]
}

export default function HeroCarouselClient({ products }: HeroCarouselClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)
  const slide = HERO_SLIDES[currentIndex]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => window.clearInterval(timer)
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

  return (
    <section className="relative w-full overflow-hidden bg-white pt-20 md:pt-20 group">
      <div className="relative w-full aspect-[4/5] md:aspect-[4000/2233]">
        <div key={slide.key} className="absolute inset-0 hero-slide-in">
          <Link
            href={`/products/${slide.slug}`}
            className="absolute inset-0 cursor-pointer"
            title={`View ${slide.alt}`}
          >
            <HeroSlideImage slide={slide} isPriority={currentIndex === 0} />
          </Link>
          <button
            type="button"
            onClick={() => handleOrderNow(slide.productSearch)}
            disabled={isAdding !== null}
            className={`absolute bottom-[10%] md:bottom-[15%] left-1/2 md:left-[16%] -translate-x-1/2 md:translate-x-0 z-20 px-8 py-3.5 md:px-12 md:py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.2)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${slide.btnClass}`}
          >
            {isAdding === slide.productSearch ? 'Adding...' : slide.btnText}
          </button>
        </div>

        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5 px-3 py-1.5 rounded-full bg-black/15 backdrop-blur-sm">
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.key}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
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
