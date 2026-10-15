'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Truck,
  Award,
} from 'lucide-react'
import PaymentIcons from '@/components/PaymentIcons'
import ProductPageLowerSections from '@/components/sections/ProductPageLowerSections'
import FeaturedOnMarquee from '@/components/sections/FeaturedOnMarquee'
import PackageDurationSelector, {
  PackageOption,
} from '@/components/PackageDurationSelector'
import {
  STARTER_PACK_HERO_IMAGE,
  withStarterPackHero,
} from '@/lib/starter-pack-hero'
import { formatInr } from '@/lib/utils'
import { trackAddToCart, trackViewContent } from '@/lib/meta-pixel'
import SlidingImageGallery from '@/components/SlidingImageGallery'

export const SPECIAL_OFFER_PACKAGES: PackageOption[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    duration: '7 Days',
    servings: '7 Sachets',
    flavour: 'Assorted Flavours',
    price: 699,
    comparePrice: 999,
    handle: 'starter-pack',
    variantId: '67627887427859',
    shopifyId: 'gid://shopify/ProductVariant/67627887427859',
    image: STARTER_PACK_HERO_IMAGE,
    images: [
      STARTER_PACK_HERO_IMAGE,
      '/specialOfferCarousel/WhatsApp_Image_2026-05-06_at_07.10.16.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-05-06_at_07.10.18_1.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-05-06_at_07.10.16_1.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-05-06_at_07.10.18_2.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-05-06_at_07.10.18.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-05-06_at_07.10.17.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-05-06_at_07.10.17_1.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-05-06_at_07.10.19.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-04-16_at_17.17.45.webp',
      '/specialOfferCarousel/WhatsApp_Image_2026-04-16_at_17.17.46.webp',
    ],
    description:
      'The 7-sachet FYBER Starter Pack is designed for first-time users looking to experience natural craving suppression, better fat metabolism, and sustained daily energy.',
  },
  {
    id: 'transformation',
    name: 'Transformation Pack',
    duration: '30 Days',
    badge: 'MOST POPULAR',
    badgeBg: 'linear-gradient(90deg, #f0cf82, #d9a84e)',
    badgeTextColor: '#3b2a0e',
    servings: '30 Sachets',
    flavour: 'Assorted Flavours',
    price: 2249,
    comparePrice: 2999,
    handle: 'transformation-pack',
    variantId: '54312470806803',
    shopifyId: 'gid://shopify/ProductVariant/54312470806803',
    image: '/specialOfferCarousel/A_30Days_-02.webp',
    images: [
      '/specialOfferCarousel/notice-your-weight-changing.webp',
      '/specialOfferCarousel/A_30Days_-02.webp',
      '/specialOfferCarousel/A_30Days_-03.webp',
      '/specialOfferCarousel/A_30Days_-04.webp',
      '/specialOfferCarousel/A_30Days_-05.webp',
      '/specialOfferCarousel/A_30Days_-06.webp',
      '/specialOfferCarousel/A_30Days_-07.webp',
      '/specialOfferCarousel/A_30Days_-08.webp',
      '/specialOfferCarousel/A_30Days_-09.webp',
      '/specialOfferCarousel/A_30Days_-10.webp',
      '/specialOfferCarousel/A_30Days_-11.webp',
    ],
    description:
      'Start your wellness journey with the FYBER Transformation Pack, featuring 30 convenient sachets in assorted flavours. Formulated with natural prebiotic fiber and probiotics, it supports appetite control and gut health.',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    duration: '90 Days + Lite Fitband',
    badge: 'FREE FITBAND',
    badgeBg: 'linear-gradient(90deg, #2b5844, #1f4031)',
    badgeTextColor: '#ffffff',
    servings: '90 Sachets + Free LYTE Band',
    includes: 'Free LYTE Smart Band Included',
    flavour: 'Assorted Flavours',
    price: 5999,
    comparePrice: 7999,
    handle: 'ultimate-pack',
    variantId: '54312506917139',
    shopifyId: 'gid://shopify/ProductVariant/54312506917139',
    image: '/specialOfferCarousel/A_90Days_-01_cd556116-aa6c-4c67-9b94-25bb7f34c3d2.webp',
    images: [
      '/specialOfferCarousel/A_90Days_-01_cd556116-aa6c-4c67-9b94-25bb7f34c3d2.webp',
      '/specialOfferCarousel/A_90Days_-02_8772be8e-1f78-4e3d-9483-99ff2df8d3c2.webp',
      '/specialOfferCarousel/A_90Days_-03_3bafc180-2f82-4e5d-8dd0-cf6cbf1bc5cd.webp',
      '/specialOfferCarousel/A_90Days_-04_7cbd92c7-5a41-4cd5-9d24-45648f5ba91d.webp',
      '/specialOfferCarousel/A_90Days_-05_5d360ce6-cd92-4c40-a8ff-ad17b82ae7f0.webp',
      '/specialOfferCarousel/A_90Days_-06_1e40cc52-fc1f-434d-a98d-2ff1977cb502.webp',
      '/specialOfferCarousel/A_90Days_-07_9411fd52-b413-4900-945e-b91c6daa46bf.webp',
      '/specialOfferCarousel/A_90Days_-08_93a07e82-2b8a-41af-b881-93f7b69fe003.webp',
      '/specialOfferCarousel/A_90Days_-09_51f62b25-9d14-4b9e-920b-cadc6722dada.webp',
      '/specialOfferCarousel/A_90Days_-10_991d7916-7de7-498a-a73d-15b40f651345.webp',
    ],
    description:
      'The comprehensive 90-day metabolic transformation pack with 90 sachets in assorted flavours. Includes a complimentary LYTE Smart Fitness Band for continuous habit and progress tracking.',
  },
]

const STARTER_SLIDES_BEFORE_NEXT_PACK = 2

function packGallery(pkg: PackageOption): string[] {
  return withStarterPackHero(pkg.handle, pkg.images)
}

const CAROUSEL_BY_PACK = {
  starter: packGallery(SPECIAL_OFFER_PACKAGES[0]).slice(0, STARTER_SLIDES_BEFORE_NEXT_PACK),
  transformation: packGallery(SPECIAL_OFFER_PACKAGES[1]),
  ultimate: packGallery(SPECIAL_OFFER_PACKAGES[2]),
}

const CAROUSEL_IMAGES = [
  ...CAROUSEL_BY_PACK.starter,
  ...CAROUSEL_BY_PACK.transformation,
  ...CAROUSEL_BY_PACK.ultimate,
]

const CAROUSEL_PACK_START: Record<string, number> = {
  starter: 0,
  transformation: CAROUSEL_BY_PACK.starter.length,
  ultimate: CAROUSEL_BY_PACK.starter.length + CAROUSEL_BY_PACK.transformation.length,
}

export default function SpecialOfferPage() {
  // Option 1 — Starter Pack (7 Days) selected by default
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>(
    SPECIAL_OFFER_PACKAGES[0]
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  const [quantity, setQuantity] = useState(1)
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('box')
  const [showStickyAddToCart, setShowStickyAddToCart] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [galleryAutoPlay, setGalleryAutoPlay] = useState(true)
  const [shopifyDescriptionHtml, setShopifyDescriptionHtml] = useState<Record<string, string>>({})
  const heroRef = useRef<HTMLDivElement>(null)
  const mainButtonRef = useRef<HTMLButtonElement>(null)
  const galleryTouchStartX = useRef<number | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  // Product copy still comes from Shopify. Carousel files stay in /public/specialOfferCarousel.
  useEffect(() => {
    const handles = SPECIAL_OFFER_PACKAGES.map((p) => p.handle)
    Promise.all(
      handles.map((handle) =>
        fetch(`/api/shopify/product/${handle}`, { cache: 'no-store' })
          .then((r) => r.ok ? r.json() : null)
          .then((data) => {
            const descriptionHtml = (data?.product?.descriptionHtml as string) || ''
            return descriptionHtml ? { handle, descriptionHtml } : null
          })
          .catch(() => null)
      )
    ).then((results) => {
      const descriptionMap: Record<string, string> = {}
      results.forEach((r) => {
        if (r?.descriptionHtml) descriptionMap[r.handle] = r.descriptionHtml
      })
      if (Object.keys(descriptionMap).length > 0) setShopifyDescriptionHtml(descriptionMap)
    })
  }, [])

  // Reset selected image when changing package
  const handleSelectPackage = (pkg: PackageOption) => {
    const nextIndex = CAROUSEL_PACK_START[pkg.id] ?? 0
    setSelectedPackage(pkg)
    setSelectedImageIndex(nextIndex)
    setImageError({})
    setGalleryAutoPlay(true)
  }

  // Sticky add-to-cart listener
  useEffect(() => {
    const handleScroll = () => {
      if (mainButtonRef.current) {
        const buttonRect = mainButtonRef.current.getBoundingClientRect()
        setShowStickyAddToCart(buttonRect.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const images = CAROUSEL_IMAGES

  const GALLERY_AUTO_MS = 2000

  useEffect(() => {
    setSelectedImageIndex((prev) =>
      images.length ? Math.min(prev, images.length - 1) : 0
    )
  }, [images.length])

  // Auto-advance 1→2→…→n→1. Each step slides in from the right.
  useEffect(() => {
    if (!galleryAutoPlay || images.length <= 1) return
    const intervalId = window.setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % images.length)
    }, GALLERY_AUTO_MS)
    return () => window.clearInterval(intervalId)
  }, [galleryAutoPlay, selectedPackage.id, images.length])

  useEffect(() => {
    trackViewContent({
      contentName: `FYBER ${selectedPackage.name}`,
      contentIds: [selectedPackage.shopifyId, selectedPackage.variantId],
      value: selectedPackage.price,
      quantity: 1,
    })
  }, [selectedPackage.id, selectedPackage.name, selectedPackage.price, selectedPackage.shopifyId, selectedPackage.variantId])

  const handleAddToCart = () => {
    setIsAdding(true)
    try {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: `${selectedPackage.shopifyId}::assorted-flavours`,
          variantId: selectedPackage.variantId,
          title: `FYBER ${selectedPackage.name}`,
          price: selectedPackage.price,
          image: selectedPackage.image,
          handle: selectedPackage.handle,
          variant: 'Assorted Flavours',
        })
      }
      trackAddToCart({
        contentName: `FYBER ${selectedPackage.name}`,
        contentIds: [selectedPackage.shopifyId, selectedPackage.variantId],
        value: selectedPackage.price * quantity,
        quantity,
      })
    } catch (err) {
      console.error('Error adding special offer to cart:', err)
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
  }

  const toggleAccordion = (id: string) => {
    setExpandedAccordion(expandedAccordion === id ? null : id)
  }

  const goToGalleryImage = (direction: 'next' | 'prev') => {
    if (images.length <= 1) return
    setSelectedImageIndex((prev) =>
      direction === 'next'
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length
    )
  }

  const gallerySources = images.map((src, imageIndex) =>
    imageError[`${selectedPackage.id}-${imageIndex}`] ? selectedPackage.image : src
  )

  const renderGallery = (padded: boolean) => (
    <SlidingImageGallery
      images={gallerySources}
      index={selectedImageIndex}
      alt={`FYBER ${selectedPackage.name} - Assorted Flavours`}
      padClassName={padded ? 'p-8' : ''}
      unoptimized
      sizes={padded ? '50vw' : '100vw'}
      onImageError={(imageIndex) =>
        setImageError((prev) => ({
          ...prev,
          [`${selectedPackage.id}-${imageIndex}`]: true,
        }))
      }
    />
  )

  const handleGalleryPressStart = (clientX: number) => {
    galleryTouchStartX.current = clientX
    setGalleryAutoPlay(false)
  }

  const handleGalleryPressEnd = (clientX: number) => {
    const startX = galleryTouchStartX.current
    galleryTouchStartX.current = null
    if (images.length > 1) {
      const deltaX = startX !== null ? clientX - startX : 0
      if (Math.abs(deltaX) >= 40) {
        goToGalleryImage(deltaX < 0 ? 'next' : 'prev')
      } else {
        goToGalleryImage('next')
      }
    }
    setGalleryAutoPlay(true)
  }

  const galleryPressHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      handleGalleryPressStart(e.touches[0].clientX)
    },
    onTouchEnd: (e: React.TouchEvent) => {
      handleGalleryPressEnd(e.changedTouches[0].clientX)
    },
    onTouchCancel: () => {
      galleryTouchStartX.current = null
      setGalleryAutoPlay(true)
    },
    onMouseDown: (e: React.MouseEvent) => {
      if (e.button !== 0) return
      handleGalleryPressStart(e.clientX)
    },
    onMouseUp: (e: React.MouseEvent) => {
      if (e.button !== 0) return
      handleGalleryPressEnd(e.clientX)
    },
    onMouseLeave: (e: React.MouseEvent) => {
      if (galleryTouchStartX.current === null) return
      handleGalleryPressEnd(e.clientX)
    },
  }

  const displayServings =
    selectedPackage.id === 'starter' ? 7 : selectedPackage.id === 'ultimate' ? 90 : 30

  const descriptionHtml =
    shopifyDescriptionHtml[selectedPackage.handle] || selectedPackage.description

  return (
    <div className={`min-h-screen bg-[#faf8f5] overflow-x-hidden pt-[5.5rem] ${showStickyAddToCart ? 'pb-24' : ''}`}>
      {/* Top Banner Notice */}
      <div className="hidden md:block bg-[#187254] text-white py-2.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wider uppercase">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 mr-2 animate-pulse" />
        Exclusive Offer • 7, 30 & 90 Days Supply • Assorted Flavours
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="bg-white">
        <div className="max-w-[1600px] mx-auto lg:px-8 pb-8 md:pb-12">
          <div className="flex flex-col lg:flex-row gap-0 lg:items-start">
            <div className="order-1 w-full lg:w-1/2 flex gap-4 lg:pr-6 lg:sticky lg:top-[5.5rem]">
              <div className="flex-1 relative bg-transparent rounded-none sm:rounded-lg overflow-hidden max-md:w-full">
                {/* Mobile: fixed square frame so slides cannot push the page */}
                <div
                  className="md:hidden relative w-full aspect-square overflow-hidden touch-pan-y cursor-pointer select-none"
                  {...galleryPressHandlers}
                >
                  {renderGallery(false)}
                </div>

                {/* Desktop: one mounted image at a time so Chrome actually swaps (no stacked opacity-0 LCP). */}
                <div
                  className="hidden md:block relative w-full aspect-square overflow-hidden cursor-pointer select-none"
                  {...galleryPressHandlers}
                >
                  {renderGallery(true)}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation()
                          setGalleryAutoPlay(false)
                          goToGalleryImage('prev')
                          window.setTimeout(() => setGalleryAutoPlay(true), GALLERY_AUTO_MS)
                        }}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex p-2 rounded-full bg-white/90 hover:bg-white text-black shadow-md transition-all active:scale-95"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation()
                          setGalleryAutoPlay(false)
                          goToGalleryImage('next')
                          window.setTimeout(() => setGalleryAutoPlay(true), GALLERY_AUTO_MS)
                        }}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex p-2 rounded-full bg-white/90 hover:bg-white text-black shadow-md transition-all active:scale-95"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Details & Duration Selector */}
            <div className="order-2 w-full lg:w-1/2 min-w-0 px-4 sm:px-6 lg:px-0 lg:pl-6 pt-4 md:pt-8 lg:pt-0 space-y-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto overflow-x-hidden max-md:overflow-x-clip lg:pr-2 scrollbar-hide">
              
              {/* Product Type & Title */}
              <div>
                <FeaturedOnMarquee variant="compact" />
                <h1 className="mb-2">
                  <span className="block text-4xl md:text-2xl uppercase tracking-wider text-[#187254] font-semibold">
                    Fyber
                  </span>
                  <span className="block text-xl sm:text-2xl md:text-3xl font-light text-gray-900 tracking-tight mt-0.5">
                    Weight management Solution
                  </span>
                  <span className="sr-only">{selectedPackage.name}</span>
                </h1>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                        aria-hidden
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">4.8</span>
                </div>
              </div>

              {/* 3 Duration Options Selector */}
              <PackageDurationSelector
                packages={SPECIAL_OFFER_PACKAGES}
                selectedPackageId={selectedPackage.id}
                onSelect={handleSelectPackage}
              />

              {/* Pack subtitle + Shopify description (desktop only — avoids duplicate pack title on mobile) */}
              <div className="hidden md:block space-y-2 pt-1">
                <h3 className="text-base font-medium text-black tracking-tight">
                  Pack: {displayServings} Sachets | Assorted Flavours
                </h3>
                {descriptionHtml && (
                  <div className="text-xs text-gray-700 leading-relaxed product-description">
                    {shopifyDescriptionHtml[selectedPackage.handle] ? (
                      <div
                        className="prose prose-sm max-w-none prose-gray prose-p:text-xs prose-li:text-xs prose-headings:text-sm space-y-1"
                        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                      />
                    ) : (
                      <p>{descriptionHtml}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity Selector + CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white px-2 py-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-black transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-sm font-extrabold text-black min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-black transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    ref={mainButtonRef}
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 py-4 px-6 rounded-xl font-extrabold text-sm uppercase tracking-widest bg-black text-white hover:bg-gray-900 transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm uppercase tracking-widest bg-gradient-to-r from-[#2b5844] to-[#1f4031] text-white hover:opacity-95 transition-all shadow-sm active:scale-[0.99]"
                >
                  Buy Now • Instant Checkout
                </button>
              </div>

              <div className="mt-4 flex flex-col -mx-4 sm:-mx-6 lg:mx-0">
                <Image
                  src="/MONEYBACK DESKTOP.png"
                  alt="100% money-back guarantee. No questions asked."
                  width={1200}
                  height={400}
                  className="w-full h-auto object-contain hidden md:block"
                />
                <Image
                  src="/MONEYBACK MOBILE 2.png"
                  alt="100% money-back guarantee. No questions asked."
                  width={800}
                  height={700}
                  className="w-full h-auto object-contain block md:hidden"
                />
                <Image
                  src="/timeline mobile.png"
                  alt="Product Timeline - Measurable Results"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain block md:hidden"
                />
                <Image
                  src="/timeline-desktoppng.png"
                  alt="Product Timeline - Measurable Results"
                  width={800}
                  height={200}
                  className="w-full h-auto object-contain hidden md:block"
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-200/80 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-gray-700 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">Free Shipping</span>
                  <span className="text-[10px] text-gray-500">Pan India Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-gray-700 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">Natural Ingredients</span>
                  <span className="text-[10px] text-gray-500">Non-Habit Forming</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="w-5 h-5 text-gray-700 mb-1" />
                  <span className="text-[11px] font-bold text-gray-800">Clinically Studied</span>
                  <span className="text-[10px] text-gray-500">GLP-1 Pathway Satiety</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-1">
                <PaymentIcons />
              </div>

              {/* Accordions */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                {/* Accordion: What's in the Box */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('box')}
                    className="w-full py-3.5 px-5 flex items-center justify-between text-left font-bold text-sm text-gray-900"
                  >
                    <span>What&apos;s Inside Your Pack</span>
                    <Plus
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedAccordion === 'box' ? 'rotate-45 text-black' : 'text-gray-500'
                      }`}
                    />
                  </button>
                  {expandedAccordion === 'box' && (
                    <div className="px-5 pb-4 text-xs text-gray-600 space-y-2 leading-relaxed border-t border-gray-100 pt-3">
                      <p>
                        <strong>Duration:</strong> {selectedPackage.duration}
                      </p>
                      <p>
                        <strong>Total Servings:</strong> {selectedPackage.servings}
                      </p>
                      <p>
                        <strong>Flavour:</strong> Assorted Flavours (Unflavored, Lemon & Watermelon)
                      </p>
                      {selectedPackage.id === 'ultimate' && (
                        <p className="text-emerald-700 font-semibold">
                          🎁 Includes 1x Free LYTE Smart Fitness Band with Bluetooth sync & habit tracking!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Accordion: How it works */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('how')}
                    className="w-full py-3.5 px-5 flex items-center justify-between text-left font-bold text-sm text-gray-900"
                  >
                    <span>How FYBER Works in 60 Minutes</span>
                    <Plus
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedAccordion === 'how' ? 'rotate-45 text-black' : 'text-gray-500'
                      }`}
                    />
                  </button>
                  {expandedAccordion === 'how' && (
                    <div className="px-5 pb-4 text-xs text-gray-600 space-y-2 leading-relaxed border-t border-gray-100 pt-3">
                      <p>
                        FYBER is a patented natural fiber derived from Corn.
                      </p>
                      <p>
                        When dissolved in water and consumed 60 minutes before your meal, it expands gently into a soothing viscous gel in your stomach, triggering natural GLP-1 satiety signals to the brain and delaying gastric emptying. Cravings quieten down naturally and portion control becomes effortless.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion: How to Use */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('usage')}
                    className="w-full py-3.5 px-5 flex items-center justify-between text-left font-bold text-sm text-gray-900"
                  >
                    <span>Recommended Daily Ritual</span>
                    <Plus
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedAccordion === 'usage' ? 'rotate-45 text-black' : 'text-gray-500'
                      }`}
                    />
                  </button>
                  {expandedAccordion === 'usage' && (
                    <div className="px-5 pb-4 text-xs text-gray-600 space-y-2 leading-relaxed border-t border-gray-100 pt-3">
                      <ol className="list-decimal list-inside space-y-1.5">
                        <li>Mix 1 sachet in a glass of room temperature water (250–300ml).</li>
                        <li>Stir and drink 30-60 minutes before meals.</li>
                      </ol>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Add to Cart Bar */}
      {showStickyAddToCart && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-2xl transition-all">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={selectedPackage.image}
                  alt={selectedPackage.name}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {selectedPackage.duration}
                </p>
                <p className="text-[11px] text-gray-500">
                  ₹{formatInr(selectedPackage.price)} • Assorted Flavours
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="py-2.5 px-5 sm:px-8 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider bg-black text-white hover:bg-gray-900 transition-all shadow-md whitespace-nowrap active:scale-95"
              >
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ProductPageLowerSections
        productSlug={selectedPackage.handle}
        productTitle={selectedPackage.name}
      />
    </div>
  )
}
