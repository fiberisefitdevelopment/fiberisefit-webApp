'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useCampaignStore } from '@/store/campaignStore'
import { Plus, Minus, Star, Zap, Moon, Heart, Activity, Shield, Battery } from 'lucide-react'
import PaymentIcons from '@/components/PaymentIcons'
import ProductReviewsSection from '@/components/sections/ProductReviewsSection'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductVariant {
  id: string
  gid: string
  name: string
  price: number
  compareAtPrice?: number | null
  available: boolean
}

interface Product {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml?: string
  price: number
  comparePrice?: number | null
  image: string
  images: string[]
  available: boolean
  variants: ProductVariant[]
  slug: string
}

interface LyteProductPageProps {
  slug: string
}

// ─── Features ─────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Activity, label: '24/7 Monitoring', desc: 'Continuous health tracking around the clock' },
  { icon: Moon, label: 'Sleep Tracking', desc: 'Understand your recovery and sleep quality' },
  { icon: Heart, label: 'SpO2 & Heart Rate', desc: 'Blood oxygen and heart rate monitoring' },
  { icon: Zap, label: 'Calorie Tracking', desc: 'Real-time energy expenditure insights' },
  { icon: Battery, label: '30-Day Battery', desc: 'Long-lasting charge for uninterrupted use' },
  { icon: Shield, label: 'Waterproof', desc: 'Wear it through any condition' },
]

// Banners with headings (order matches lyte_banners)
const LYTE_BANNERS = [
  {
    heading: 'DESIGNED FOR CALM, BUILT FOR LIFE.',
    src: '/lyte_banners/banner-01.jpg-2.jpeg',
  },
  {
    heading: 'KNOW YOUR BODY, BEAT BY BEAT.',
    src: '/lyte_banners/banner-02.jpg.jpeg',
  },
  {
    heading: 'ONE APP. COMPLETE WELLNESS INSIGHTS.',
    src: '/lyte_banners/banner-03.jpg.jpeg',
  },
  {
    heading: 'EVERYDAY WELLNESS, PERFECTLY DESIGNED.',
    src: '/lyte_banners/banner-04.jpg.jpeg',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function LyteProductPage({ slug }: LyteProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)
  const [visibleBanners, setVisibleBanners] = useState<Set<number>>(new Set())
  const heroRef = useRef<HTMLDivElement>(null)
  const bannerRefs = useRef<(HTMLDivElement | null)[]>([])
  const addItem = useCartStore((state) => state.addItem)
  const { activeCampaign } = useCampaignStore()
  const isCampaignActive = activeCampaign &&
    activeCampaign.applicableProducts.includes(slug) &&
    (new Date().getTime() < new Date(activeCampaign.expiresAt).getTime())

  // Treat all LYTE band product slugs as sold out (do not allow add to cart)
  const isLyteBandSoldOut = ['lyte'].includes(slug)

  const toggleAccordion = (id: string) => {
    setExpandedAccordion((prev) => (prev === id ? null : id))
  }

  const DEFAULT_RATING = 4.8
  const displayReviewCount: number = 0
  const displayRating = DEFAULT_RATING

  // Sticky bar on scroll
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Banner blocks: subtle appear when scrolling into view
  useEffect(() => {
    const refs = bannerRefs.current.filter(Boolean)
    if (refs.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = refs.indexOf(entry.target as HTMLDivElement)
          if (index === -1) return
          setVisibleBanners((prev) => new Set(prev).add(index))
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    refs.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [product])

  // Fetch product from Shopify
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const res = await fetch(`/api/shopify/product/${slug}`, { cache: 'no-store' })
        const data = await res.json()
        if (data.product) {
          setProduct(data.product)
          if (data.product.variants?.length > 0) {
            setSelectedVariant(data.product.variants[0])
          }
        } else {
          setError(data.error || 'Product not found')
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchProduct()
  }, [slug])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleAddToCart() {
    if (!product || isLyteBandSoldOut) return
    const id = selectedVariant?.id ?? product.id
    const price = selectedVariant?.price ?? product.price

    // Match cart behavior on other product pages: add one item per quantity
    for (let i = 0; i < quantity; i++) {
      addItem({ id, title: product.title, price, image: product.image, handle: slug })
    }
  }

  // ─── Derived ───────────────────────────────────────────────────────────────

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0
  const displayCompareAt = selectedVariant?.compareAtPrice ?? product?.comparePrice ?? null
  const discountPercent = displayCompareAt != null && displayCompareAt > displayPrice && displayPrice > 0
    ? Math.round((1 - displayPrice / displayCompareAt) * 100)
    : null
  const baseAvailable = selectedVariant?.available ?? product?.available ?? false
  const isAvailable = baseAvailable && !isLyteBandSoldOut
  const displayImages = product?.images?.length ? product.images : product?.image ? [product.image] : []
  const productType = 'SMART HEALTH BAND'
  const displayServings = '1 Device'
  const ingredientTags = ['30-Day Battery', 'SpO2', 'Heart Rate', 'Waterproof']

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/" className="underline text-gray-500 hover:text-black">Back to Home</Link>
        </div>
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${showStickyBar ? 'pb-20' : ''}`}>

      {/* ── Sticky Add To Cart ──────────────────────────────────────────────── */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{product.title}</p>
            <p className="text-sm text-gray-500">₹{displayPrice.toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="px-6 py-3 bg-black text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      )}

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="bg-white">

        {/* Breadcrumb */}
        <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>

        {/* Product hero grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

            {/* Left: Images */}
            <div className="w-full lg:w-1/2 flex gap-4 relative">
              {/* Thumbnails */}
              {displayImages.length > 1 && (
                <div className="hidden lg:flex flex-col gap-3 flex-shrink-0">
                  {displayImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === i
                          ? 'border-black scale-105'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image src={img} alt={`${product.title} ${i + 1}`} fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image — no container, image only */}
              <div className="flex-1 relative aspect-square">
                {displayImages[selectedImageIndex] && (
                  <Image
                    src={displayImages[selectedImageIndex]}
                    alt={product.title}
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                )}
                {/* Dot nav */}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {displayImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        className={`rounded-full transition-all ${
                          i === selectedImageIndex ? 'w-3 h-3 bg-black' : 'w-2 h-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details — same structure as other product pages */}
            <div className="w-full lg:w-1/2 min-w-0 lg:pl-6 pt-8 lg:pt-0 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto overflow-x-hidden lg:pr-2 scrollbar-hide">
              <div className="space-y-6 pb-8 min-w-0">
                {/* Product Type/Category */}
                <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                  {productType}
                </div>

                {/* Product Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black uppercase leading-[1.1] mb-1 break-words">
                  {product.title}
                </h1>
                {isLyteBandSoldOut && (
                  <span className="inline-flex items-center px-3 py-1 mt-2 text-xs font-semibold uppercase tracking-wide rounded-full bg-red-50 text-red-700 border border-red-200">
                    Sold Out
                  </span>
                )}
                {/* Removed "Servings : 1 Device" for LYTE */}

                {/* Ingredient / Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {ingredientTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-800 bg-transparent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Product Description */}
                {(product.descriptionHtml || product.description) && (
                  <div className="text-sm text-gray-700 leading-relaxed product-description">
                    {product.descriptionHtml ? (
                      <div
                        className="prose prose-sm max-w-none prose-gray prose-p:text-sm prose-li:text-sm prose-headings:text-base"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{product.description}</p>
                    )}
                  </div>
                )}

                {/* Variant Selection */}
                {product.variants && product.variants.length > 1 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-800">
                      Choose option:
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={!variant.available}
                          className={`w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedVariant?.id === variant.id
                              ? 'border-[#FFB6C1] bg-[#FFE4E9] scale-110 shadow-md'
                              : variant.available
                              ? 'border-gray-300 bg-transparent hover:border-gray-400'
                              : 'border-gray-400 bg-transparent cursor-not-allowed opacity-50'
                          }`}
                          title={variant.name}
                        >
                          <span className={`text-sm font-semibold ${
                            selectedVariant?.id === variant.id ? 'text-black' : 'text-gray-800'
                          }`}>
                            {variant.name.charAt(0).toUpperCase()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="space-y-1 mt-6">
                  {isCampaignActive ? (
                    (() => {
                      const mrp = displayCompareAt ?? (displayPrice + 750)
                      const specialOfferPrice = displayPrice - activeCampaign.discountValue
                      const youSave = mrp - specialOfferPrice
                      return (
                        <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-2xl p-4 space-y-2 mb-4 animate-fade-in max-w-md">
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-[#187254] uppercase tracking-wider mb-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#187254] animate-pulse" />
                            Special Campaign Offer Applied
                          </div>
                          <div className="grid grid-cols-2 gap-y-1.5 text-xs sm:text-sm text-gray-700">
                            <div>MRP:</div>
                            <div className="text-right line-through text-gray-400">₹{mrp.toFixed(0)}</div>
                            
                            <div>Regular Price:</div>
                            <div className="text-right text-gray-900 font-semibold">₹{displayPrice.toFixed(0)}</div>
                            
                            <div className="text-[#187254] font-bold">Special Offer Price:</div>
                            <div className="text-right text-xl sm:text-2xl font-black text-[#187254]">₹{specialOfferPrice.toFixed(0)}</div>
                            
                            <div className="text-red-600 font-bold">You Save:</div>
                            <div className="text-right text-red-600 font-bold">₹{youSave.toFixed(0)}</div>
                          </div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest pt-1 border-t border-[#A5D6A7]/30">INCL. OF ALL TAXES</p>
                        </div>
                      )
                    })()
                  ) : (
                    <>
                      <div className="flex flex-wrap items-baseline gap-2">
                        {displayCompareAt != null && displayCompareAt > displayPrice ? (
                          <>
                            <span className="text-xl md:text-2xl text-gray-400 line-through">₹{displayCompareAt.toFixed(2)}</span>
                            <span className="text-4xl md:text-5xl font-bold text-black">₹{displayPrice.toFixed(2)}</span>
                            {discountPercent != null && discountPercent > 0 && (
                              <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-4xl md:text-5xl font-bold text-black">₹{displayPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 font-normal">MRP (incl. of all taxes)</p>
                      <p className="text-sm text-gray-500">Tax included.</p>
                    </>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= displayRating
                              ? 'fill-amber-400 text-amber-400'
                              : i - 1 < displayRating && displayRating < i
                              ? 'fill-amber-400/60 text-amber-400'
                              : 'text-gray-300'
                          }`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{displayRating.toFixed(1)}</span>
                    {displayReviewCount > 0 && (
                      <span className="text-xs text-gray-500">({displayReviewCount} {displayReviewCount === 1 ? 'review' : 'reviews'})</span>
                    )}
                  </div>
                </div>

                {/* Quantity Selector and Add to Cart */}
                <div className="flex gap-3 mt-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors text-gray-800"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 font-medium text-gray-900 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors text-gray-800"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                    className={`flex-1 py-4 px-6 rounded-lg font-semibold text-sm uppercase tracking-wider transition-colors ${
                      isAvailable
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
                  </button>
                </div>

                {/* Trust strip */}
                <div className="text-sm text-gray-600 mt-4 space-y-1">
                  <p>Free shipping Pan India</p>
                  <p className="text-xs text-gray-500">Free delivery · Easy returns</p>
                </div>

                {/* Payment Icons */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xs text-gray-600 font-medium">We accept:</span>
                  <PaymentIcons iconClassName="w-9 h-6 object-contain flex-shrink-0" />
                </div>

                {/* Accordion Sections — Benefits, Hardware Specifications, LYTE Mobile Application */}
                <div className="mt-6 space-y-2">
                  {/* Benefits */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion('benefits')}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                        Benefits
                      </span>
                      <Plus
                        className={`w-5 h-5 text-gray-700 transition-transform ${
                          expandedAccordion === 'benefits' ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                    {expandedAccordion === 'benefits' && (
                      <div className="pb-4 text-sm text-gray-700 leading-relaxed">
                        <ul className="list-disc list-inside space-y-2">
                          <li>Monitor lifestyle habits</li>
                          <li>Improve sleep quality</li>
                          <li>Track cardiovascular health</li>
                          <li>Maintain physical activity goals</li>
                          <li>Track daily calorie burned</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Hardware Specifications */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion('hardware')}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                        Hardware Specifications
                      </span>
                      <Plus
                        className={`w-5 h-5 text-gray-700 transition-transform ${
                          expandedAccordion === 'hardware' ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                    {expandedAccordion === 'hardware' && (
                      <div className="pb-4 text-sm text-gray-700 leading-relaxed space-y-2">
                        <p>Approximately 22–30 grams, designed for comfortable all-day wear.</p>
                        <p>The band is protected against sweat, rain, and brief water immersion, making it suitable for workouts and everyday activities.</p>
                        <p>Approximately 1.5–2 hours for a full charge.</p>
                        <p>The band battery lasts approximately up to 25 days depending on usage.</p>
                        <p>Medical-grade Nylon Strap</p>
                      </div>
                    )}
                  </div>

                  {/* LYTE Mobile Application */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion('lyte-app')}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                        LYTE Mobile Application
                      </span>
                      <Plus
                        className={`w-5 h-5 text-gray-700 transition-transform ${
                          expandedAccordion === 'lyte-app' ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                    {expandedAccordion === 'lyte-app' && (
                      <div className="pb-4 text-sm text-gray-700 leading-relaxed space-y-2">
                        <p>The LYTE App receives data from your band, analyzes it, and gives you a clear picture of your health.</p>
                        <p>Available via <strong>LYTE</strong> on Android and <strong>LYTE HEALTH</strong> on iOS.</p>
                        <p>The app provides 24-Hour Vital Monitoring, Calorie Tracking and Management, Daily Calorie &amp; Weight Ledger, Detailed Sleep Insights, and Progress Tracking.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LYTE Banners (below hero) ───────────────────────────────────────── */}
      <div className="w-full">
        {LYTE_BANNERS.map((banner, index) => (
          <div
            key={index}
            ref={(el) => { bannerRefs.current[index] = el }}
            className={`lyte-banner-block ${visibleBanners.has(index) ? 'is-visible' : ''}`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
                  {banner.heading}
                </h2>
              </div>
            </section>
            <div className="w-full">
              <Image
                src={banner.src}
                alt=""
                width={1920}
                height={1080}
                className="w-full h-auto object-cover"
                sizes="100vw"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '24/7', label: 'Continuous Monitoring' },
              { value: '30', label: 'Days Battery Life' },
              { value: '99%', label: 'Accuracy Rate' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-4xl md:text-5xl font-light text-gray-900 mb-2">{value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feature Showcase ────────────────────────────────────────────────── */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Everything your body needs to know
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Real-time health data, elegantly delivered. LYTE tracks what matters so you can focus on living.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="p-3 bg-gray-200 rounded-xl w-fit mb-4">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings & Reviews — user can add a review (shared across products) */}
      <ProductReviewsSection productSlug={product.slug || product.handle} productTitle={product.title} />

      {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-t border-gray-100 py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h2>
          <p className="text-gray-500 mb-6 text-sm">Free shipping · 1 Year Warranty · Easy Returns</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            {displayCompareAt && displayCompareAt > displayPrice && (
              <span className="text-lg text-gray-400 line-through">₹{displayCompareAt.toFixed(2)}</span>
            )}
            <span className="text-3xl font-semibold text-gray-900">₹{displayPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className="w-full max-w-xs mx-auto block py-4 px-8 bg-black text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

    </div>
  )
}
