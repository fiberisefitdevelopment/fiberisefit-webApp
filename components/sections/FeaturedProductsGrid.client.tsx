'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Loader2, ShoppingCart, Star, Zap } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useCampaignStore } from '@/store/campaignStore'
import { trackInitiateCheckout } from '@/lib/meta-pixel'
import { useCheckoutOtp } from '@/hooks/useCheckoutOtp'
import type { StorefrontProduct } from '@/lib/shopify/fetch-products'

interface CardConfig {
  hasBadge: boolean
  badgeText: string
  badgeBg: string
  badgeTextColor: string
  isTopBanner: boolean
  title: string
  subtitle: string
  bottomTextSmall: string
  comparePrice: number
  rating: string
  ratingScore: number
  wrapperClass: string
  priceColorClass?: string
}

function cardOrderClass(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('transformation')) return 'order-1 md:order-2'
  if (t.includes('ultimate')) return 'order-2 md:order-1'
  if (t.includes('elite')) return 'order-3'
  return ''
}

function getCardConfig(title: string): CardConfig {
  const t = title.toLowerCase()

  if (t.includes('elite')) {
    return {
      hasBadge: true,
      badgeText: '120 DAYS',
      badgeBg: 'linear-gradient(90deg, #2b5844, #1f4031)',
      badgeTextColor: '#ffffff',
      isTopBanner: true,
      title: 'Elite Pack',
      subtitle: 'Best for long-term results',
      bottomTextSmall: '120 Sachets',
      comparePrice: 8999,
      rating: '4.8',
      ratingScore: 4.8,
      wrapperClass:
        'border border-[#2b5844]/30 bg-[#faf8f5] hover:border-[#2b5844] hover:shadow-[0_10px_28px_rgba(43,88,68,0.2)]',
      priceColorClass: 'text-gray-900 font-normal',
    }
  }

  if (t.includes('ultimate')) {
    return {
      hasBadge: true,
      badgeText: '90 DAYS',
      badgeBg: 'linear-gradient(90deg, #e7eaee, #b7bcc4)',
      badgeTextColor: '#2a2e34',
      isTopBanner: true,
      title: 'Ultimate Pack',
      subtitle: '90 Sachets + Free Lyte Band',
      bottomTextSmall: '90 Sachets',
      comparePrice: 7999,
      rating: '4.8',
      ratingScore: 4.8,
      wrapperClass:
        'border border-[#e2dcd5] bg-[#faf8f5] hover:border-[#b7aea3] hover:shadow-[0_10px_28px_rgba(120,110,100,0.16)]',
      priceColorClass: 'text-gray-900 font-normal',
    }
  }

  return {
    hasBadge: true,
    badgeText: 'MOST POPULAR',
    badgeBg: 'linear-gradient(90deg, #f0cf82, #d9a84e)',
    badgeTextColor: '#3b2a0e',
    isTopBanner: true,
    title: 'Transformation Pack',
    subtitle: 'Best for daily cravings control',
    bottomTextSmall: '30 Sachets',
    comparePrice: 2999,
    rating: '4.9',
    ratingScore: 4.9,
    wrapperClass:
      'border-2 border-[#d9a84e] bg-[#faf8f5] shadow-[0_0_20px_rgba(217,168,78,0.15)] hover:border-[#c4922a] hover:shadow-[0_10px_32px_rgba(217,168,78,0.34)]',
    priceColorClass: 'text-[#a67517] font-normal drop-shadow-sm',
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
            className={`w-3.5 h-3.5 ${
              filled
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

type FeaturedProductsGridProps = {
  products: StorefrontProduct[]
}

export default function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  const cartItems = useCartStore((state) => state.items)
  const activeCampaign = useCampaignStore((state) => state.activeCampaign)
  const { requireVerifiedPhone, checkoutOtpModal } = useCheckoutOtp()
  const [buyingId, setBuyingId] = useState<string | null>(null)

  useEffect(() => {
    const resetBuyingState = () => setBuyingId(null)
    window.addEventListener('pageshow', resetBuyingState)
    return () => window.removeEventListener('pageshow', resetBuyingState)
  }, [])

  const buyNow = (product: StorefrontProduct) => {
    if (!product.available || buyingId) return
    const campaignApplies =
      !!activeCampaign &&
      Date.now() < new Date(activeCampaign.expiresAt).getTime() &&
      activeCampaign.applicableProducts.includes(product.slug)

    void requireVerifiedPhone({
      orderLabel: product.title,
      orderTotal: product.price,
      onVerified: async (token, phoneDigits) => {
        setBuyingId(product.id)
        try {
          const response = await fetch('/api/checkout/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              items: [{ id: product.id, quantity: 1 }],
              ...(campaignApplies ? { campaignSlug: activeCampaign.slug } : {}),
              ...(!token && phoneDigits ? { phone: phoneDigits } : {}),
            }),
          })
          const data = await response.json().catch(() => ({}))
          if (!response.ok || !data.checkoutUrl) {
            throw new Error(data.error || 'Failed to start checkout')
          }

          trackInitiateCheckout(
            [
              {
                contentName: product.title,
                contentIds: [product.id],
                value: product.price,
                quantity: 1,
              },
            ],
            product.price
          )
          window.location.href = data.checkoutUrl
        } catch (error) {
          setBuyingId(null)
          throw error
        }
      },
    })
  }

  if (products.length === 0) {
    return <div className="text-center py-16 text-gray-400">No products found.</div>
  }

  return (
    <>
    {checkoutOtpModal}
    <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-12 justify-center items-stretch flex-wrap">
      {products.map((product) => {
        const cfg = getCardConfig(product.title)
        const displayPrice = product.price
        const comparePrice =
          product.comparePrice && product.comparePrice > displayPrice
            ? product.comparePrice
            : cfg.comparePrice
        const isAvailable = product.available
        const inCart = cartItems.some((item) => item.id === product.id)

        return (
          <div
            key={product.id}
            className={`relative flex flex-col rounded-2xl overflow-hidden w-[88%] max-w-[340px] mx-auto md:mx-0 md:w-[320px] lg:w-[340px] transition-[border-color,box-shadow] duration-300 ease-out ${cardOrderClass(product.title)} ${cfg.wrapperClass}`}
          >
            {cfg.hasBadge && cfg.isTopBanner ? (
              <div
                className="text-center py-2.5 text-[13px] font-black tracking-widest uppercase shadow-sm"
                style={{ background: cfg.badgeBg, color: cfg.badgeTextColor }}
              >
                {cfg.badgeText}
              </div>
            ) : (
              <div className="pt-10" />
            )}

            <div className={`text-center px-6 ${cfg.isTopBanner ? 'pt-5' : 'pt-2'}`}>
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-[24px] md:text-[26px] font-normal text-gray-900 leading-snug tracking-wide hover:opacity-75 transition-opacity">
                  {cfg.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{cfg.subtitle}</p>
            </div>

            <Link href={`/products/${product.slug}`} className="block px-6 mt-5 mb-1">
              <div className="relative w-full aspect-square overflow-hidden rounded-[11%] group">
                <Image
                  src={product.image || '/placeholder-product.png'}
                  alt={product.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 340px, (max-width: 1200px) 320px, 340px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>

            <div className="px-6 pb-6 mt-3 flex flex-col flex-grow text-center">
              <p className="text-sm text-gray-500 mt-1">{cfg.bottomTextSmall}</p>

              <div className="mt-4 flex items-end justify-center gap-2 flex-wrap">
                <span className="text-lg text-gray-500 line-through font-light">₹{comparePrice}</span>
                <span
                  className={`text-4xl leading-none ${cfg.priceColorClass || 'font-normal text-gray-900'}`}
                >
                  ₹{displayPrice}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500 flex justify-center items-center">
                {comparePrice > displayPrice && (
                  <span>
                    Save{' '}
                    <span className="text-red-500 font-bold ml-0.5">
                      {Math.round(((comparePrice - displayPrice) / comparePrice) * 100)}%
                    </span>
                  </span>
                )}
              </p>

              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={
                    !isAvailable ? 'Out of stock' : inCart ? 'Already added to cart' : 'Add to cart'
                  }
                  aria-pressed={inCart}
                  title={inCart ? 'Already added' : 'Add to cart'}
                  onClick={() => {
                    if (!isAvailable) return
                    if (inCart) {
                      openCart()
                      return
                    }
                    addItem({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.image,
                      handle: product.slug,
                    })
                  }}
                  disabled={!isAvailable}
                  className={`flex h-11 w-12 shrink-0 items-center justify-center rounded-[10px] transition-colors active:scale-95 ${
                    !isAvailable
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : inCart
                        ? 'bg-[#1b2744] text-white hover:bg-[#243256]'
                        : 'bg-[#f0c44a] text-[#1a1a1a] hover:bg-[#e4b63a]'
                  }`}
                >
                  {inCart ? (
                    <Check className="h-[18px] w-[18px]" strokeWidth={2.75} />
                  ) : (
                    <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={2.25} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => buyNow(product)}
                  disabled={!isAvailable || buyingId === product.id}
                  className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[15px] font-semibold tracking-wide transition-colors active:scale-[0.99] ${
                    isAvailable
                      ? 'bg-[#1b2744] text-white hover:bg-[#243256]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {buyingId === product.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Buy Now
                    </>
                  ) : isAvailable ? (
                    <>
                      <Zap className="h-4 w-4 fill-current" strokeWidth={2} />
                      Buy Now
                    </>
                  ) : (
                    'Out of stock'
                  )}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5">
                <StarRow score={cfg.ratingScore} />
                <span className="text-[13px] font-semibold text-gray-800">{cfg.rating}/5</span>
              </div>

              <p className="mt-4 text-[11px] text-gray-400 tracking-wide">
                Free shipping · Secure checkout · No added sugar
              </p>
            </div>
          </div>
        )
      })}
    </div>
    </>
  )
}
