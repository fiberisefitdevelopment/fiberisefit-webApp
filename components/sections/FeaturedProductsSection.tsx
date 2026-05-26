'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
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
  servings?: string
}

interface CardConfig {
  hasBadge: boolean
  badgeText: string
  badgeBg: string
  badgeTextColor: string
  isTopBanner: boolean
  title: string
  subtitle: string
  bottomTextBig: string
  bottomTextMid: string
  bottomTextSmall: string
  comparePrice: number
  save: number
  perSachet: number
  buttonText: string
  buttonClass: string
  rating: string
  ratingScore: number
  reviews: string
  wrapperClass: string
  isPopular: boolean
  priceColorClass?: string
}

function getCardConfig(title: string, price: number): CardConfig {
  const t = title.toLowerCase()

  if (t.includes('test')) {
    return {
      hasBadge: false,
      badgeText: '',
      badgeBg: '',
      badgeTextColor: '',
      isTopBanner: false,
      title: 'Test Pack',
      subtitle: 'Try before you commit',
      bottomTextBig: '',
      bottomTextMid: '',
      bottomTextSmall: '3 Sachets',
      comparePrice: 599,
      save: 200,
      perSachet: 133,
      buttonText: 'Add to cart',
      buttonClass: 'bg-[#e8ddd0] text-[#3d352b] hover:bg-[#d9cfc2]',
      rating: '4.7',
      ratingScore: 4.7,
      reviews: 'from 150 reviews',
      wrapperClass: 'border border-[#e2dcd5] bg-[#faf8f5]',
      isPopular: false,
      priceColorClass: 'text-gray-900 font-normal',
    }
  } else if (t.includes('ultimate')) {
    return {
      hasBadge: false,
      badgeText: '',
      badgeBg: '',
      badgeTextColor: '',
      isTopBanner: false,
      title: 'Ultimate Pack',
      subtitle: '90 Sachets + Free Lyte Band',
      bottomTextBig: '',
      bottomTextMid: '',
      bottomTextSmall: '90 Sachets',
      comparePrice: 7999,
      save: 2000,
      perSachet: 67,
      buttonText: 'Add to cart',
      buttonClass: 'bg-[#e8ddd0] text-[#3d352b] hover:bg-[#d9cfc2]',
      rating: '4.8',
      ratingScore: 4.8,
      reviews: 'from 981 reviews',
      wrapperClass: 'border border-[#e2dcd5] bg-[#faf8f5]',
      isPopular: false,
      priceColorClass: 'text-gray-900 font-normal',
    }
  } else if (t.includes('transformation')) {
    return {
      hasBadge: false,
      badgeText: '',
      badgeBg: '',
      badgeTextColor: '',
      isTopBanner: false,
      title: 'Transformation Pack',
      subtitle: 'Best for daily cravings control',
      bottomTextBig: '',
      bottomTextMid: '',
      bottomTextSmall: '30 Sachets',
      comparePrice: 2999,
      save: 750,
      perSachet: 75,
      buttonText: 'Add to cart',
      buttonClass: 'bg-[#e8ddd0] text-[#3d352b] hover:bg-[#d9cfc2]',
      rating: '4.9',
      ratingScore: 4.9,
      reviews: 'from 2,184 customers',
      wrapperClass: 'border border-[#e2dcd5] bg-[#faf8f5]',
      isPopular: false,
      priceColorClass: 'text-gray-900 font-normal',
    }
  } else {
    // Starter Pack (Center & Most Popular)
    return {
      hasBadge: true,
      badgeText: 'MONEY BACK GUARANTEE',
      badgeBg: 'linear-gradient(90deg, #f0cf82, #d9a84e)',
      badgeTextColor: '#3b2a0e',
      isTopBanner: true,
      title: 'Starter Pack',
      subtitle: 'Best for first-time users',
      bottomTextBig: '',
      bottomTextMid: '',
      bottomTextSmall: '7 Sachets',
      comparePrice: 1200,
      save: 601,
      perSachet: 86,
      buttonText: 'Add to Cart',
      buttonClass: 'bg-gradient-to-r from-[#f0cf82] to-[#d9a84e] text-[#3b2a0e] hover:brightness-95',
      rating: '4.6',
      ratingScore: 4.6,
      reviews: '378 reviews',
      wrapperClass: 'border-2 border-[#d9a84e] bg-[#faf8f5] shadow-[0_0_20px_rgba(217,168,78,0.15)]',
      isPopular: true,
      priceColorClass: 'text-[#a67517] font-normal drop-shadow-sm',
    }
  }
}

function StarRow({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(score)
        const half = !filled && i - 0.5 <= score
        return (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${filled
              ? 'fill-amber-400 text-amber-400'
              : half
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-300'
              }`}
            aria-hidden
          />
        )
      })}
    </div>
  )
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/shopify/products?all=true', { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const data = await res.json()
        if (data.products) setProducts(data.products)
      } catch (err) {
        console.error('FeaturedProductsSection fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const orderedProducts = [...products]
    .filter((p) => {
      const t = p.title.toLowerCase()
      return t.includes('starter pack') || t.includes('transformation pack') || t.includes('ultimate pack') || t.includes('test pack')
    })
    .sort((a, b) => {
      const rank = (title: string) => {
        const t = title.toLowerCase()
        if (t.includes('test pack')) return 0
        if (t.includes('transformation pack')) return 1
        if (t.includes('starter pack')) return 2
        if (t.includes('ultimate pack')) return 3
        return 4
      }
      return rank(a.title) - rank(b.title)
    })

  return (
    <section id="products" className="py-10 md:py-20 bg-[#f5f0eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-[#a67517] mb-3">
            Science-Backed Natural Weight Management Supplement
          </h1>
          <p className="text-2xl md:text-3xl text-gray-900 font-normal leading-snug mb-2">
            Control Appetite. Refine Weight
          </p>
          <p className="text-base md:text-lg text-gray-500 font-normal">
            A science-driven approach to feeling full, lighter, and in control.
          </p>
        </div>

        {loading ? (
          <div className="flex gap-6 justify-center flex-wrap">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-[320px] h-[640px] rounded-2xl bg-[#ede8e2] animate-pulse" />
            ))}
          </div>
        ) : orderedProducts.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
            {orderedProducts.map((product) => {
              const cfg = getCardConfig(product.title, product.price)
              const displayPrice = product.price
              const isAvailable = product.available

              const titleLower = product.title.toLowerCase()
              let orderClass = 'order-4 md:order-4'
              if (titleLower.includes('test pack')) {
                orderClass = 'order-1 md:order-1'
              } else if (titleLower.includes('starter pack')) {
                orderClass = 'order-2 md:order-3'
              } else if (titleLower.includes('transformation pack')) {
                orderClass = 'order-3 md:order-2'
              }

              return (
                <div
                  key={product.id}
                  className={`relative flex flex-col rounded-2xl overflow-hidden w-[88%] max-w-[320px] mx-auto md:mx-0 md:w-[330px] lg:w-[355px] ${cfg.wrapperClass} ${orderClass}`}
                >
                  {/* Badge */}
                  {cfg.hasBadge ? (
                    cfg.isTopBanner ? (
                      <div
                        className="text-center py-2.5 text-[13px] font-black tracking-widest uppercase shadow-sm"
                        style={{ background: cfg.badgeBg, color: cfg.badgeTextColor }}
                      >
                        {cfg.badgeText}
                      </div>
                    ) : (
                      <div className="flex justify-center pt-5 pb-1">
                        <span
                          className="px-4 py-1 rounded-md text-[10px] font-bold tracking-[0.15em] uppercase"
                          style={{ background: cfg.badgeBg, color: cfg.badgeTextColor }}
                        >
                          {cfg.badgeText}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="pt-10" />
                  )}

                  {/* Title block */}
                  <div className={`text-center px-6 ${cfg.isTopBanner ? 'pt-5' : 'pt-2'}`}>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-[24px] md:text-[26px] font-normal text-gray-900 leading-snug tracking-wide hover:opacity-75 transition-opacity">
                        {cfg.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{cfg.subtitle}</p>
                  </div>

                  {/* Image */}
                  <Link href={`/products/${product.slug}`} className="block px-6 mt-5 mb-1">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden group">
                      <Image
                        src={product.image || '/placeholder-product.png'}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  {/* Bottom info */}
                  <div className="px-6 pb-6 mt-3 flex flex-col flex-grow text-center">
                    {cfg.bottomTextBig && (
                      <p className="text-[24px] font-medium text-gray-900 leading-snug">
                        {cfg.bottomTextBig}
                      </p>
                    )}
                    {cfg.bottomTextMid && (
                      <p className="text-[13px] text-gray-500 mt-1 mb-1">
                        {cfg.bottomTextMid}
                      </p>
                    )}
                    {cfg.bottomTextSmall && (
                      <p className="text-sm text-gray-500 mt-1">
                        {cfg.bottomTextSmall}
                      </p>
                    )}

                    {/* Pricing row */}
                    <div className="mt-4 flex items-end justify-center gap-2 flex-wrap">
                      <span className="text-lg text-gray-400 line-through font-light">
                        ₹{cfg.comparePrice}
                      </span>
                      <span className={`text-4xl leading-none ${cfg.priceColorClass || 'font-normal text-gray-900'}`}>
                        ₹{displayPrice}
                      </span>
                    </div>

                    {/* Save row */}
                    <p className="mt-2 text-sm text-gray-500 flex justify-center items-center">
                      {cfg.comparePrice > displayPrice && (
                        <span>
                          Save <span className="text-red-500 font-bold ml-0.5">{Math.round(((cfg.comparePrice - displayPrice) / cfg.comparePrice) * 100)}%</span>
                        </span>
                      )}
                    </p>

                    {/* CTA button */}
                    <div className="mt-6">
                      <button
                        onClick={() =>
                          isAvailable &&
                          addItem({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            image: product.image,
                          })
                        }
                        disabled={!isAvailable}
                        className={`w-full py-3.5 rounded-lg text-base font-semibold transition-all ${isAvailable
                          ? cfg.buttonClass
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {isAvailable ? cfg.buttonText : 'OUT OF STOCK'}
                      </button>
                    </div>

                    {/* Rating row */}
                    <div className="mt-4 flex items-center justify-center gap-1.5">
                      <StarRow score={cfg.ratingScore} />
                      <span className="text-[13px] font-semibold text-gray-800">
                        {cfg.rating}/5
                      </span>
                    </div>

                    {/* Trust badges */}
                    <p className="mt-4 text-[11px] text-gray-400 tracking-wide">
                      Free shipping · Secure checkout · No added sugar
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">No products found.</div>
        )}
      </div>
    </section>
  )
}
