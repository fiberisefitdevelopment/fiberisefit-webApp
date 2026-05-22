'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface Product {
  id: string
  title: string
  price: number
  image: string
  slug: string
  available: boolean
}

const SLIDES = [
  {
    key: 'starter',
    productSearch: 'starter pack',
    slug: 'starter-pack',
    desktopImage: '/banners/Starter Pack_Desktop Banner.jpg',
    mobileImage: '/banners/Starter Pack_Mobile Banner (2).jpg',
    alt: 'Starter Pack - India’s First Craving Control Supplement',
    btnClass: 'bg-gradient-to-r from-[#f0cf82] to-[#d9a84e] text-[#3b2a0e] hover:brightness-95 focus:ring-[#d9a84e]',
    btnText: 'Order Now',
  },
  {
    key: 'transformation',
    productSearch: 'transformation pack',
    slug: 'transformation-pack',
    desktopImage: '/banners/Transformation Pack_Desktop Banner.jpg',
    mobileImage: '/banners/Transformation Pack_Mobile Banner.jpg',
    alt: 'Transformation Pack - Weight Loss & Cravings Control',
    btnClass: 'bg-[#3b3836] text-white hover:bg-black focus:ring-black',
    btnText: 'Order Now',
  },
  {
    key: 'ultimate',
    productSearch: 'ultimate pack',
    slug: 'ultimate-pack',
    desktopImage: '/banners/Ultimate Desktop Banner.jpg',
    mobileImage: '/banners/Ultimate Pack_Mobile Banner.jpg',
    alt: 'Ultimate Pack - Complete Weight Management Ecosystem',
    btnClass: 'bg-[#2b5844] text-white hover:bg-[#1f4031] focus:ring-[#2b5844]',
    btnText: 'Order Now',
  }
]

// Static fallback in case Shopify API is slow or fails
const FALLBACK_PRODUCTS: Record<string, { id: string; title: string; price: number; image: string }> = {
  'starter pack': {
    id: 'gid://shopify/ProductVariant/53932294930707',
    title: 'Starter pack',
    price: 599,
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/Starter_Pack_1.png?v=1779360427'
  },
  'transformation pack': {
    id: 'gid://shopify/ProductVariant/53389411549459',
    title: 'Transformation Pack',
    price: 2249,
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/Transformation_Pack.png?v=1779360501'
  },
  'ultimate pack': {
    id: 'gid://shopify/ProductVariant/53812865171731',
    title: 'Ultimate Pack',
    price: 5999,
    image: 'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/Ultimate-pack.png?v=1779360564'
  }
}

export default function HeroSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/shopify/products?all=true')
        if (res.ok) {
          const data = await res.json()
          if (data.products) {
            setProducts(data.products)
          }
        }
      } catch (err) {
        console.error('HeroSection product fetch error:', err)
      }
    }
    fetchProducts()
  }, [])

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length)
  }

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + SLIDES.length) % SLIDES.length)
  }

  const handleOrderNow = async (productSearch: string) => {
    try {
      setIsAdding(productSearch)
      // Find product dynamic detail or fallback
      const foundProduct = products.find((p) =>
        p.title.toLowerCase().includes(productSearch)
      )

      const productDetails = foundProduct || FALLBACK_PRODUCTS[productSearch]

      if (productDetails) {
        addItem({
          id: productDetails.id,
          title: productDetails.title,
          price: productDetails.price,
          image: productDetails.image,
        })
      } else {
        console.error('Product match failed for: ', productSearch)
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
    } finally {
      setIsAdding(null)
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-white pt-24 md:pt-0 group">
      {/* Carousel Wrapper */}
      <div className="relative w-full h-0 hero-carousel-wrapper">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex
          return (
            <div
              key={slide.key}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Slide Link */}
              <Link
                href={`/products/${slide.slug}`}
                className="block relative w-full h-full cursor-pointer"
                title={`View ${slide.alt}`}
              >
                {/* Desktop Image */}
                <img
                  src={encodeURI(slide.desktopImage)}
                  alt={slide.alt}
                  className="hidden md:block absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                {/* Mobile Image */}
                <img
                  src={encodeURI(slide.mobileImage)}
                  alt={slide.alt}
                  className="md:hidden absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />

                {/* Add to Cart CTA Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleOrderNow(slide.productSearch)
                  }}
                  disabled={isAdding !== null}
                  className={`absolute bottom-[10%] md:bottom-[15%] left-1/2 md:left-[16%] -translate-x-1/2 md:translate-x-0 z-20 px-8 py-3.5 md:px-12 md:py-4 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.2)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    slide.btnClass
                  }`}
                >
                  {isAdding === slide.productSearch ? 'Adding...' : slide.btnText}
                </button>
              </Link>
            </div>
          )
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/40 hover:bg-white text-black backdrop-blur-md shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/40 hover:bg-white text-black backdrop-blur-md shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Indicator Dots container */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5 px-3 py-1.5 rounded-full bg-black/15 backdrop-blur-sm">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
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
