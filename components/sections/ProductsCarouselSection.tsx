'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface Product {
  id: string
  title: string
  price: number
  maxPrice?: number | null
  comparePrice?: number | null
  image: string
  slug: string
  available: boolean
}

const getStaticCardData = (product: Product) => {
  const t = product.title.toLowerCase()
  const isMiddle = t.includes('transformation')
  
  if (t.includes('ultimate')) {
    return {
      badgeText: 'BEST VALUE',
      badgeBg: 'bg-[#5b7361] text-white',
      title: 'Ultimate Pack',
      subtitle: 'Lowest cost per sachet',
      subtitle2: '90 Sachets + Free LYTE Band',
      comparePrice: 7999,
      price: product.price || 5999,
      shippingStrikethrough: 5999,
      save: 2000,
      perSachet: 67,
      buttonText: 'Get Best Value',
      buttonClass: 'bg-[#29292b] text-white hover:bg-black',
      rating: '4.8',
      reviews: 'from 981 reviews',
      footer: 'Free shipping · Secure checkout · No added sugar',
      borderClass: 'border border-gray-100 shadow-sm bg-[#faf9f6]',
      isMiddle: false,
    }
  } else if (isMiddle) {
    return {
      badgeText: 'MOST POPULAR',
      badgeBg: 'bg-[#eec67c] text-gray-900',
      title: 'Transformation Pack',
      subtitle: 'Best for daily cravings control',
      subtitle2: 'Best for daily cravings control',
      comparePrice: 2999,
      price: product.price || 2249,
      shippingStrikethrough: 249,
      save: 750,
      perSachet: 75,
      buttonText: 'Start Now',
      buttonClass: 'bg-gradient-to-r from-[#ecc67d] to-[#d6a958] text-[#3d2f11] font-medium hover:opacity-90 shadow-md',
      rating: '4.9',
      reviews: 'from 2,184 customers',
      footer: 'Free shipping · Secure checkout · No added sugar',
      borderClass: 'border-[2px] border-[#dcb160] shadow-[0_0_15px_rgba(220,177,96,0.1)] bg-[#faf9f6]',
      isMiddle: true,
    }
  } else {
    // Starter Pack
    return {
      badgeText: 'STARTER PACK',
      badgeBg: 'bg-[#676767] text-white',
      title: 'Starter Pack',
      subtitle: 'Best for first-time users',
      subtitle2: 'Best for first-time users',
      comparePrice: 1200,
      price: product.price || 599,
      shippingStrikethrough: 99,
      save: 601,
      perSachet: 86,
      buttonText: 'Add to Cart',
      buttonClass: 'bg-[#e9ded0] text-[#3d372f] font-medium hover:bg-[#d5cbb8]',
      rating: '4.6',
      reviews: '378 reviews',
      footer: 'Free shipping · Secure checkout · No added sugar',
      borderClass: 'border border-gray-100 shadow-sm bg-[#faf9f6]',
      isMiddle: false,
    }
  }
}

export default function ProductsCarouselSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/shopify/products?all=true', { cache: 'no-store' })
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`)
        const data = await response.json()
        if (data.products) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mediaQuery.matches)
    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -400 : 400,
        behavior: 'smooth',
      })
    }
  }

  const orderedProducts = [...products]
    .filter(p => !p.title.toLowerCase().includes('lyte')) // Removing standalone lyte bands to match design
    .sort((a, b) => {
      const rank = (title: string) => {
        const t = title.toLowerCase()
        if (t.includes('starter pack')) return 1
        if (t.includes('transformation pack')) return 2
        if (t.includes('ultimate pack')) return 3
        return 4
      }
      return rank(a.title) - rank(b.title)
    })

  return (
    <section className="py-16 md:py-24 bg-white font-sans text-gray-900">
      <div className="max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex gap-6 overflow-hidden items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[300px] md:w-[350px] h-[550px] animate-pulse bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors hidden xl:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>

            {/* Products Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-8 pt-4 items-stretch justify-start lg:justify-center px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {orderedProducts.map((product) => {
                const data = getStaticCardData(product)
                const isAvailable = product.available

                return (
                  <div
                    key={product.id}
                    className={`flex-shrink-0 w-[280px] sm:w-[300px] md:w-[350px] flex flex-col rounded-xl relative ${data.borderClass}`}
                  >
                    {/* Top Badge */}
                    {data.isMiddle ? (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#eeca85] to-[#dbb061] text-[#3d2f11] font-bold text-[11px] md:text-[13px] px-6 md:px-8 py-1.5 rounded-b-md shadow-sm z-10 text-center uppercase tracking-widest whitespace-nowrap">
                        {data.badgeText}
                      </div>
                    ) : (
                      <div className="flex justify-center pt-5">
                        <span className={`px-4 py-1 text-[10px] md:text-xs font-bold tracking-widest rounded-md uppercase ${data.badgeBg}`}>
                          {data.badgeText}
                        </span>
                      </div>
                    )}
                    
                    {/* Top Heading */}
                    <Link href={`/products/${product.slug}`} className="block">
                      <div className={`text-center ${data.isMiddle ? 'mt-10' : 'mt-3'}`}>
                        <h3 className="text-[28px] md:text-3xl font-serif text-gray-900 leading-tight tracking-wide">
                          {data.title}
                        </h3>
                        <p className="text-[13px] md:text-sm text-gray-500 mt-1.5">{data.subtitle}</p>
                      </div>
                    </Link>

                    {/* Image */}
                    <Link href={`/products/${product.slug}`} className="block mt-6 mb-2 flex-shrink-0">
                      <div className="relative w-full aspect-[4/3] group mx-auto px-4 mix-blend-multiply">
                        <Image
                          src={product.image || '/placeholder-product.png'}
                          alt={product.title}
                          fill
                          className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      </div>
                    </Link>

                    {/* Bottom Info */}
                    <div className="px-6 pb-6 text-center flex flex-col flex-grow">
                      <Link href={`/products/${product.slug}`} className="block">
                        <h4 className="text-[22px] md:text-[26px] font-serif text-gray-900 hover:text-gray-600 transition-colors tracking-wide">
                          {data.title}
                        </h4>
                      </Link>
                      <p className="text-[13px] md:text-sm text-gray-500 mt-1">{data.subtitle2}</p>

                      <div className="mt-5 flex items-end justify-center gap-2">
                        <span className="line-through decoration-1 text-gray-400 text-xl font-light mb-0.5">₹{data.comparePrice}</span>
                        <span className="text-[34px] md:text-[38px] font-medium text-gray-900 leading-none">₹{data.price}</span>
                        {data.shippingStrikethrough && (
                          <span className="line-through decoration-1 text-gray-400 text-lg mb-0.5 relative">
                            ₹{data.shippingStrikethrough}
                            <span className="absolute w-[120%] h-px bg-gray-400 left-[-10%] top-[60%] -rotate-12"></span>
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[13px] md:text-sm text-gray-500 mt-2 flex items-center justify-center gap-1.5">
                        <span>Save ₹{data.save}</span>
                        <span className="text-gray-300 mx-1">&middot;</span>
                        <span>₹{data.perSachet}/sachet</span>
                      </p>

                      <div className="mt-auto pt-7">
                        <button
                          onClick={() => isAvailable && addItem({ id: product.id, title: product.title, price: product.price, image: product.image })}
                          disabled={!isAvailable}
                          className={`w-full py-3.5 px-6 rounded-md font-semibold text-[15px] md:text-lg transition-all ${data.buttonClass}`}
                        >
                          {isAvailable ? data.buttonText : 'OUT OF STOCK'}
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-1">
                        <div className="flex text-[#e8c67c]">
                          {[1,2,3,4,5].map(i => <Star key={i} className="w-[15px] h-[15px] fill-current" />)}
                        </div>
                        <span className="text-[13px] font-bold text-gray-800 ml-1.5">{data.rating}/5</span>
                        <span className="text-[12px] text-gray-500 ml-1">&middot; {data.reviews}</span>
                      </div>

                      <p className="text-[10px] md:text-[11px] text-gray-400 mt-4 tracking-wide font-medium font-sans">
                        {data.footer}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:bg-gray-50 transition-colors hidden xl:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No products found.
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
