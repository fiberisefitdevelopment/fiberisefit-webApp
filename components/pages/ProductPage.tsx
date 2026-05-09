'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { ChevronRight, ChevronLeft, Plus, Minus, Star } from 'lucide-react'
import VideoSection from '@/components/sections/VideoSection'
import MetabolismSection from '@/components/sections/science/MetabolismSection'
import BenefitsGrid from '@/components/sections/science/BenefitsGrid'
import ProductReviewsSection from '@/components/sections/ProductReviewsSection'
import PaymentIcons from '@/components/PaymentIcons'
import { getProductRatingBySlug } from '@/lib/product-ratings'

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
  price: number
  comparePrice?: number | null
  image: string
  images: string[]
  available: boolean
  variants: ProductVariant[]
  slug: string
}

interface ProductPageProps {
  slug: string
  initialProduct?: Product | null
}

export default function ProductPage({ slug, initialProduct }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct || null)
  const [loading, setLoading] = useState(!initialProduct)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null)
  const [joinEmail, setJoinEmail] = useState('')
  const [joinSubmitted, setJoinSubmitted] = useState(false)
  const [showStickyAddToCart, setShowStickyAddToCart] = useState(false)
  const [reviewRating, setReviewRating] = useState<{ averageRating: number; totalCount: number } | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((state) => state.addItem)

  const DEFAULT_RATING = getProductRatingBySlug(slug)
  const displayRating = reviewRating && reviewRating.totalCount > 0
    ? reviewRating.averageRating
    : DEFAULT_RATING
  const displayReviewCount = reviewRating?.totalCount ?? 0

  const mainButtonRef = useRef<HTMLButtonElement>(null)
  const ingredientsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!mainButtonRef.current) {
            ticking = false;
            return;
          }

          const buttonRect = mainButtonRef.current.getBoundingClientRect()
          let isIngredientsInView = false

          if (ingredientsRef.current) {
            const ingredientsRect = ingredientsRef.current.getBoundingClientRect()
            isIngredientsInView = ingredientsRect.top < window.innerHeight && ingredientsRect.bottom > 0
          }

          const isPastButton = buttonRect.bottom < 0

          setShowStickyAddToCart(isPastButton && !isIngredientsInView)
          ticking = false;
        });
        ticking = true;
      }
    }

    // Call initially and add listener
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching product with slug:', slug)

        const response = await fetch(`/api/shopify/product/${slug}`, { cache: 'no-store' })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('API response error:', response.status, errorData)
          setError(errorData.error || `Failed to load product (${response.status})`)
          return
        }

        const data = await response.json()
        console.log('Product data received:', data)

        if (data.error) {
          console.error('Product fetch error:', data.error)
          setError(data.error)
          return
        }

        if (data.product) {
          console.log('Product loaded successfully:', data.product.title)
          setProduct(data.product)
          // Set the first available variant as selected
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0])
          }
        } else {
          console.error('No product data in response')
          setError('Product data not found')
        }
      } catch (err: any) {
        console.error('Error fetching product:', err)
        setError(`Failed to load product: ${err.message || 'Network error'}`)
      } finally {
        setLoading(false)
      }
    }

    if (slug && !initialProduct) {
      fetchProduct()
    } else if (initialProduct) {
      if (initialProduct.variants && initialProduct.variants.length > 0) {
        setSelectedVariant(initialProduct.variants[0])
      }
    }
  }, [slug, initialProduct])

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    async function fetchReviewSummary() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}/reviews`, { cache: 'no-store' })
        const data = await res.json()
        if (cancelled) return
        if (typeof data.averageRating === 'number' && typeof data.totalCount === 'number') {
          setReviewRating({ averageRating: data.averageRating, totalCount: data.totalCount })
        }
      } catch {
        if (!cancelled) setReviewRating(null)
      }
    }
    fetchReviewSummary()
    return () => { cancelled = true }
  }, [slug])

  // Auto-advance main product image every 5s (desktop & mobile)
  useEffect(() => {
    if (!product) return
    const images =
      product.images && product.images.length > 0
        ? product.images
        : product.image
          ? [product.image]
          : []
    if (images.length <= 1) return

    const intervalId = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [product?.id, product?.images?.length])

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return

    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: selectedVariant.id || product.id,
        title: product.title,
        price: selectedVariant.price || product.price,
        image: product.image,
      })
    }
  }

  const toggleAccordion = (id: string) => {
    setExpandedAccordion(expandedAccordion === id ? null : id)
  }

  const nextImage = () => {
    if (!product) return
    const displayImages = product.images && product.images.length > 0 ? product.images : [product.image]
    setSelectedImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    if (!product) return
    const displayImages = product.images && product.images.length > 0 ? product.images : [product.image]
    setSelectedImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  // Extract ingredient tags from description or product title
  const extractIngredients = (title: string, description: string): string[] => {
    const commonIngredients = ['Iron', 'Zinc', 'Folate', 'Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D', 'Vitamin E', 'Calcium', 'Magnesium']
    const found: string[] = []

    // Check title and description for ingredient mentions
    const text = `${title} ${description}`.toUpperCase()
    commonIngredients.forEach(ingredient => {
      if (text.includes(ingredient.toUpperCase())) {
        found.push(ingredient)
      }
    })

    // Return first 4 found ingredients, or default ones if none found
    return found.slice(0, 4).length > 0 ? found.slice(0, 4) : ['Iron', 'Zinc', 'Folate', 'Vitamin A']
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-8rem)]">
            <div className="w-full lg:w-1/2 animate-pulse">
              <div className="bg-gray-200 rounded-lg h-full" />
            </div>
            <div className="w-full lg:w-1/2 space-y-4 p-8">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const displayPrice = selectedVariant?.price ?? product.price
  const displayCompareAt = selectedVariant?.compareAtPrice ?? product.comparePrice ?? null
  const discountPercent = displayCompareAt != null && displayCompareAt > displayPrice && displayPrice > 0
    ? Math.round((1 - displayPrice / displayCompareAt) * 100)
    : null
  const isAvailable = selectedVariant?.available ?? product.available
  const displayImages = product.images && product.images.length > 0 ? product.images : [product.image]
  //const ingredients = ['Unflavoured', 'Watermelon', 'Lemon', 'Assorted']

  // Extract product type/category from title or use default
  const productType = product.title.toUpperCase().includes('PLANT-BASED')
    ? 'PLANT-BASED'
    : product.title.toUpperCase().includes('VEGAN')
      ? 'VEGAN'
      : 'FYBER'

  // Servings: Starter Pack = 7, Transformation Pack = 30, Ultimate Pack = 90
  const getServings = (label: string) => {
    const l = label.toLowerCase()
    if (l.includes('starter')) return 7
    if (l.includes('transformation')) return 30
    if (l.includes('ultimate')) return 90
    return 30
  }
  // Base servings on product title, not variant name
  const displayServings = getServings(product.title)

  return (
    <div className={`min-h-screen ${showStickyAddToCart ? 'pb-20' : ''}`}>
      {/* Hero Section - White Background */}
      <div ref={heroRef} className="bg-white">
        {/* Breadcrumb Navigation */}
        <div className="pt-28 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-gray-600">
              <Link href="/" className="hover:underline text-gray-700">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Variant carousel + ATC (screenshot format) — when multiple variants */}
        {product.variants && product.variants.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <p className="text-center text-base md:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              A science-driven approach to feeling full, lighter, and in control.
            </p>
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory justify-center px-2">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => variant.available && setSelectedVariant(variant)}
                      disabled={!variant.available}
                      className={`flex-shrink-0 w-[180px] sm:w-[200px] snap-center rounded-xl border-2 bg-white overflow-hidden transition-all ${isSelected
                        ? 'border-black shadow-lg ring-2 ring-black ring-offset-2'
                        : variant.available
                          ? 'border-gray-200 hover:border-gray-400'
                          : 'border-gray-200 opacity-60 cursor-not-allowed'
                        }`}
                    >
                      <div className="relative aspect-[3/4] bg-gray-50">
                        <Image
                          src={product.image || '/placeholder-product.png'}
                          alt={`${product.title} - ${variant.name}`}
                          fill
                          className="object-contain p-4"
                          sizes="200px"
                          unoptimized
                        />
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-sm font-semibold text-gray-900">{variant.name}</p>
                        <p className="text-base text-gray-500 mt-0.5">Servings : {getServings(variant.name)}</p>
                        <div className="mt-1">
                          {variant.compareAtPrice != null && variant.compareAtPrice > variant.price ? (
                            <>
                              <span className="text-sm text-gray-400 line-through mr-1">₹{variant.compareAtPrice.toFixed(2)}</span>
                              <span className="text-lg font-bold text-black">₹{variant.price.toFixed(2)}</span>
                              <span className="ml-1 text-xs font-semibold text-red-600">
                                {Math.round((1 - variant.price / variant.compareAtPrice) * 100)}% OFF
                              </span>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-black">₹{variant.price.toFixed(2)}</p>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">MRP (incl. of all taxes)</p>
                        <div className="flex items-center justify-center gap-1 mt-1.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i <= displayRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : i - 1 < displayRating && displayRating < i
                                    ? 'fill-amber-400/60 text-amber-400'
                                    : 'text-gray-300'
                                  }`}
                                aria-hidden
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-gray-700">{displayRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
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
                  className={`w-full sm:w-auto min-w-[200px] py-4 px-8 rounded-lg font-semibold text-sm uppercase tracking-wider border-2 transition-colors ${isAvailable
                    ? 'border-black text-black bg-white hover:bg-black hover:text-white'
                    : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              </div>
              {/* Trust strip below ATC */}
              <p className="text-center text-xs text-gray-500 mt-4">
                Free delivery · COD available · Easy returns
              </p>
            </div>
          </div>
        )}

        {/* Main Product Content - 50/50 Split */}
        <div className="max-w-[1600px] mx-auto lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-0 lg:items-start">
            {/* Left Section - Product Images (50%) */}
            <div className="w-full lg:w-1/2 flex gap-4 lg:pr-6">
              {/* Thumbnail Column (Vertical) - shows 5 at a time with scroll */}
              {displayImages.length > 1 && (
                <div
                  className="hidden lg:flex flex-col gap-3 flex-shrink-0 overflow-y-auto pr-1"
                  style={{ maxHeight: 'calc(5 * 80px + 4 * 12px)' }}
                >
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                        ? 'border-black scale-105'
                        : 'border-transparent hover:border-gray-400'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Display */}
              <div className="flex-1 relative bg-transparent rounded-none sm:rounded-lg overflow-hidden group">
                <div className="relative w-full aspect-square">
                  <Image
                    src={displayImages[selectedImageIndex] || product.image || '/placeholder-product.png'}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain sm:p-8"
                    priority
                    fetchPriority="high"
                  />
                </div>

                {/* Image Navigation Bar - Below image */}
                {displayImages.length > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-full border border-gray-200/80 shadow-md">
                      {displayImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`rounded-full transition-all duration-200 ${index === selectedImageIndex
                            ? 'w-2.5 h-2.5 bg-black ring-2 ring-black/20'
                            : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Thumbnails */}
                {displayImages.length > 1 && (
                  <div className="lg:hidden flex gap-2 mt-4 overflow-x-auto pb-2 px-4 sm:px-6">
                    {displayImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                          ? 'border-black'
                          : 'border-transparent hover:border-gray-300'
                          }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.title} - Image ${index + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Product Details (50%) */}
            <div className="w-full lg:w-1/2 min-w-0 px-4 sm:px-6 lg:px-0 lg:pl-6 pt-8 lg:pt-0 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto overflow-x-hidden lg:pr-2 scrollbar-hide">
              <div className="space-y-4 pb-4 min-w-0">
                {/* Header Section */}
                <div>
                  {/* Product Type/Category */}
                  <div className="text-4xl md:text-2xl uppercase tracking-wider text-[#187254] font-semibold mb-1">
                    {productType}
                  </div>

                  {/* Product Title */}
                  <h1 className="text-l md:text-2xl font-light text-black leading-tight mb-1">
                    {product.title}
                  </h1>

                  {/* Rating immediately below Title */}
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden />
                    <span className="text-sm font-semibold text-black">{displayRating.toFixed(1)}</span>
                    {displayReviewCount > 0 && (
                      <span className="text-sm font-semibold text-black">({displayReviewCount})</span>
                    )}
                  </div>
                </div>

                {/* Variant Selection (Box style) */}
                {product.variants && product.variants.length > 1 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={!variant.available}
                          className={`flex items-center px-3 py-1.5 text-xs md:text-sm transition-colors ${isSelected
                            ? 'bg-black text-white font-medium'
                            : variant.available
                              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                            }`}
                        >
                          {isSelected && <span className="mr-1.5">✓</span>}
                          {variant.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Price Block AND Quantity Selector Side-by-Side */}
                <div className="flex justify-between items-end pt-2">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-normal text-black tracking-tight flex items-baseline">
                        <span className="text-xl mr-0.5">₹</span>
                        {displayPrice.toFixed(0)}
                      </span>
                      {displayCompareAt != null && displayCompareAt > displayPrice && (
                        <>
                          <span className="text-base text-gray-400 line-through">₹{displayCompareAt.toFixed(0)}</span>
                          {discountPercent != null && discountPercent > 0 && (
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">INCL. OF ALL TAXES</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-200 bg-gray-50/50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-black"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 pointer-events-none" strokeWidth={1.5} />
                    </button>
                    <span className="px-3 py-1.5 font-medium text-black border-x border-gray-200 min-w-[2.5rem] text-center text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors text-black"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 pointer-events-none" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Description Area (Short descriptions/Subtitles) */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-base font-medium text-black tracking-tight">
                    Pack: {displayServings} Sachets | Assorted Flavours
                  </h3>

                  <div className="text-sm text-gray-800">
                    {/* {ingredients.join(' | ')} */}
                  </div>

                  {(product as any).descriptionHtml && (
                    <div className="text-xs text-gray-700 leading-relaxed product-description">
                      <div
                        className="prose prose-sm max-w-none prose-gray prose-p:text-xs prose-li:text-xs prose-headings:text-sm space-y-1"
                        dangerouslySetInnerHTML={{ __html: (product as any).descriptionHtml }}
                      />
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  ref={mainButtonRef}
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`w-full py-3 px-4 font-bold text-base uppercase tracking-wider transition-all ${!isAvailable
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : product.title.toLowerCase().includes('starter')
                      ? 'bg-gradient-to-r from-[#ecc67d] to-[#d6a958] text-[#3d2f11] hover:opacity-90 shadow-md'
                      : 'bg-black text-white hover:bg-gray-800'
                    }`}
                >
                  {!isAvailable
                    ? 'OUT OF STOCK'
                    : product.title.toLowerCase().includes('starter')
                      ? `ADD TO CART`
                      : `ADD TO CART`
                  }
                </button>

                {/* Money Back Guarantee Image */}
                {product.title.toLowerCase().includes('starter') && (
                  <div className="mt-4 -mx-4 sm:-mx-6 lg:mx-0 flex flex-col">
                    {/* Desktop Images */}
                    <div className="hidden md:flex flex-col gap-4">
                      <Image
                        src="/MONEYBACK DESKTOP.png"
                        alt="100% Money-Back Guarantee"
                        width={800}
                        height={200}
                        className="w-full h-auto object-contain"
                        priority
                      />
                      <Image
                        src="/timeline-desktoppng.png"
                        alt="Product Timeline"
                        width={800}
                        height={200}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </div>
                    {/* Mobile Images (Zero padding container) */}
                    <div className="w-full flex flex-col md:hidden">
                      <Image
                        src="/MONEYBACK MOBILE 2.png"
                        alt="100% Money-Back Guarantee"
                        width={800}
                        height={400}
                        className="w-full h-auto object-contain block"
                        priority
                      />
                      <Image
                        src="/timeline mobile.png"
                        alt="Timeline"
                        width={800}
                        height={400}
                        className="w-full h-auto object-contain block"
                        priority
                      />
                      <Image
                        src="/how to use mobile.png"
                        alt="How to Use"
                        width={800}
                        height={400}
                        className="w-full h-auto object-contain block"
                        priority
                      />
                      <Image
                        src="/safe and natural - mobile.png"
                        alt="Safe and Natural"
                        width={800}
                        height={400}
                        className="w-full h-auto object-contain block"
                        priority
                      />
                      <Image
                        src="/333diff-mobile.png"
                        alt="Difference"
                        width={800}
                        height={400}
                        className="w-full h-auto object-contain block"
                        priority
                      />
                    </div>
                  </div>
                )}

                {/* Timeline Image for Non-Starter Packs */}
                {!product.title.toLowerCase().includes('starter') && (
                  <div className="mt-4 flex flex-col">
                    <Image
                      src="/timeline-desktoppng.png"
                      alt="Product Timeline"
                      width={800}
                      height={200}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                )}

                {/* Trust strip + social proof */}
                <div className="text-sm text-gray-600 mt-4 space-y-1">
                  <p>Free shipping Pan India</p>
                  <p className="text-xs text-gray-500">Free delivery · Easy returns</p>
                </div>

                {/* Payment Icons - UPI first, then Visa, MC, Amex */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xs text-gray-600 font-medium">We accept:</span>
                  <PaymentIcons iconClassName="w-9 h-6 object-contain flex-shrink-0" />
                </div>

                {/* Accordion Sections */}
                <div className="mt-6 space-y-2">
                  {/* BENEFITS Accordion */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion('benefits')}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                        BENEFITS
                      </span>
                      <Plus
                        className={`w-5 h-5 text-gray-700 transition-transform ${expandedAccordion === 'benefits' ? 'rotate-45' : ''
                          }`}
                      />
                    </button>
                    {expandedAccordion === 'benefits' && (
                      <div className="pb-4 text-sm text-gray-700 leading-relaxed">
                        <ul className="space-y-2">
                          <li>✓ Smart craving control</li>
                          <li>✓ Supports weight management</li>
                          <li>✓ Prebiotic + Probiotic support</li>
                          <li>✓ Helps prevent glucose spikes &amp; crashes</li>
                          <li>✓ Encourages healthy fat metabolism</li>
                          <li>✓ Promotes steady energy</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* HOW TO TAKE SUPPLEMENT Accordion */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleAccordion('how-to-take')}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                        HOW TO TAKE SUPPLEMENT?
                      </span>
                      <Plus
                        className={`w-5 h-5 text-gray-700 transition-transform ${expandedAccordion === 'how-to-take' ? 'rotate-45' : ''
                          }`}
                      />
                    </button>
                    {expandedAccordion === 'how-to-take' && (
                      <div className="pb-4 text-sm text-gray-700 leading-relaxed">
                        {/* <p className="mb-2"><strong>How to Take:</strong></p> */}
                        <ul className="list-disc list-inside space-y-1">
                          <li>Mix one sachet in 200 ml of water, 30–60 minutes before a meal.</li>

                          <li>Consume 1–2 sachets daily.</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* INGREDIENTS Accordion */}
                  <div className="border-b border-gray-200" ref={ingredientsRef}>
                    <button
                      onClick={() => toggleAccordion('ingredients')}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                        INGREDIENTS
                      </span>
                      <Plus
                        className={`w-5 h-5 text-gray-700 transition-transform ${expandedAccordion === 'ingredients' ? 'rotate-45' : ''
                          }`}
                      />
                    </button>
                    {expandedAccordion === 'ingredients' && (
                      <div className="pb-4 text-sm text-gray-700 leading-relaxed space-y-3">
                        {/* <p><strong>Ingredients</strong></p> */}
                        <p>Patented Lean-X blend with:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Soluble dietary fiber</li>
                          <li>Lactobacillus gasseri ( Probiotic )</li>
                          <li>L-Carnitine &amp; L-tartrate (LCLT)</li>
                          <li>L-Tyrosine</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Science / feature video + metabolic explanation + benefits grid directly below hero */}
      <VideoSection />
      <MetabolismSection />
      {/* <BenefitsGrid /> */}

      {/* Full-width image below hero with marquee
      <div className="w-full relative">
        <Image
          src="/BlueSet.png"
          alt="Wellness"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
          <div
            className="flex whitespace-nowrap text-white uppercase tracking-[0.3em] text-2xl md:text-4xl lg:text-5xl font-normal animate-marquee"
            style={{ fontFamily: 'QuadratGrotesk, sans-serif' }}
          >
            <span className="inline-block px-8">Real Stories , Real Result</span>
            <span className="inline-block px-8">Real Stories , Real Result</span>
          </div>
        </div>
      </div> */}

      {/* <div className="w-full relative mt-10">
        <Image
          src="/product page routine images/FIBERISE A+-09.png"
          alt="Lean-X advanced fiber nutrition"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
      </div> */}

      {/* Traditional dieting vs Fyber banner */}
      {/* <div className="w-full relative mt-8">
        <Image
          src="/product page routine images/FIBERISE A+-10.png"
          alt="Traditional dieting vs Fyber comparison"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
      </div> */}

      {/* From first sip to long-term shift banner */}
      {/* <div className="w-full relative mt-8">
        <Image
          src="/product page routine images/FIBERISE A+-11.png"
          alt="From first sip to long-term shift"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
      </div> */}

      {/* Revolutionary science behind Fyber banner */}
      {/* <div className="w-full relative mt-8">
        <Image
          src="/product page routine images/FIBERISE A+-08.png"
          alt="The revolutionary science behind Fyber"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
      </div> */}

      {/* Calm, intelligent, effortless well-being banner with marquee text */}
      {/* <div className="w-full relative mt-8 aspect-[9/16] sm:aspect-square md:aspect-auto md:h-[70vh]">
        <Image
          src="/product page routine images/FIBERISE A+-16.png"
          alt="Calm and effortless well-being"
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
        <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
          <div
            className="flex whitespace-nowrap text-white tracking-[0.3em] text-xl md:text-3xl lg:text-4xl font-normal animate-marquee"
            style={{ fontFamily: 'QuadratGrotesk, sans-serif' }}
          >
            <span className="inline-block px-8">
              BECAUSE WEIGHT MANAGEMENT AND WELL-BEING SHOULD FEEL INTELLIGENT, CALM AND EFFORTLESS.
            </span>
            <span className="inline-block px-8">
              BECAUSE WEIGHT MANAGEMENT AND WELL-BEING SHOULD FEEL INTELLIGENT, CALM AND EFFORTLESS.
            </span>
          </div>
        </div>
      </div> */}

      {/* Reels Section */}
      {/* <section className="w-full bg-[#F5F3EF] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-sm md:text-base text-gray-600 font-medium mb-1">
              Your Health in Trusted Hands!
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black uppercase tracking-wide">
              Real Stories, Real Results
            </h2>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 justify-center md:justify-start">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden bg-black/5 shadow-sm"
              >
                <video
                  src={`/videos/${i}.webm`}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  autoPlay
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="w-full bg-white py-12 md:py-16" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-base md:text-lg text-gray-500 font-medium mb-2">
              Everything You Need to Know!
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black uppercase tracking-wide">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="border-t border-gray-200">
            {[
              {
                id: 'faq-1',
                question: 'CAN I LOSE WEIGHT JUST BY TAKING FYBER?',
                answer:
                  'Yes. When taken 30–60 minutes before meals, FYBER helps calm hunger signals so you naturally eat less. Eating less creates a calorie deficit, which is the primary driver of weight loss. The fiber also slows gastric emptying, helping reduce sugar and insulin spikes. This keeps you fuller for longer and lowers cravings, so you snack less. Over time, these effects help you stay in a calorie deficit and support sustainable weight loss.',
              },
              {
                id: 'faq-2',
                question: 'IS FYBER LIKE OZEMPIC?',
                answer:
                  'No. Ozempic is a prescription medication, while FYBER is a natural weight-management supplement. FYBER works by using a specialized fiber blend that naturally increases satiety and fullness, helping you eat less and manage cravings. Unlike prescription drugs, it does not interfere with hormones pharmacologically and is designed to be safe for regular, long-term use.',
              },
              {
                id: 'faq-3',
                question: 'DOES FYBER HAVE ANY SIDE EFFECTS?',
                answer:
                  'As long as FYBER is used as recommended, it does not have any known short-term or long-term side effects. The ingredients used in FYBER are widely used in nutrition and dietary supplements and are recognized as safe by regulatory bodies such as the U.S. FDA (GRAS) and the European Food Safety Authority (EFSA). Like any fiber-based supplement, it should be taken with adequate water and according to the suggested usage for the best experience.',
              },
              {
                id: 'faq-4',
                question: 'WILL I GAIN WEIGHT AFTER I STOP TAKING FYBER?',
                answer:
                  'No, as long as you continue to eat mindfully. When used consistently for a period of time, FYBER helps improve gut health and support better appetite regulation, which can naturally reduce cravings even after you stop taking it. The satiety effect also helps your body adapt to smaller portion sizes, so you tend to eat less naturally. Maintaining balanced eating habits will help you sustain your results.',
              },
              {
                id: 'faq-5',
                question: 'IS FYBER SAFE FOR WOMEN AND THEIR HORMONES?',
                answer:
                  'Yes, FYBER is safe for women. Ingredients like dietary fiber have been shown to support overall metabolic and hormonal balance. By helping reduce sugar spikes and improving metabolic stability, FYBER can indirectly support better hormonal regulation and thyroid function, while also supporting appetite control, gut health, and overall nutritional balance.',
              },
              {
                id: 'faq-6',
                question:
                  'CAN A PERSON SUFFERING FROM DIABETES, PCOS, PCOD, HYPERTENSION, HIGH CHOLESTEROL, OR FATTY LIVER CONSUME FYBER?',
                answer:
                  'Yes, FYBER is generally safe for individuals with conditions such as diabetes, PCOS/PCOD, hypertension, high cholesterol, or fatty liver. The ingredients used are widely consumed in nutritional supplements and are not known to interfere with medications commonly used to manage these conditions. However, if you are under medical treatment or on prescription medication, always consult your doctor before starting any new supplement.',
              },
              {
                id: 'faq-7',
                question: 'WILL I HAVE LOW ENERGY LEVELS WHILE CONSUMING FYBER?',
                answer:
                  'No, you will not experience low energy while consuming FYBER. It contains L-Carnitine L-Tartrate (LCLT) and L-Tyrosine, two non-stimulant amino acids that support energy metabolism, focus, and mental clarity, especially during a calorie deficit. Instead of causing fatigue, FYBER is designed to help you stay sharp, active, and productive, so you can comfortably maintain your daily routine and demanding lifestyle while managing your weight.',
              },
            ].map((faq) => (
              <div key={faq.id} className="border-b border-gray-200 py-6 md:py-8 first:pt-0">
                <button
                  onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between py-2 text-left"
                >
                  <span className="text-base md:text-lg font-semibold uppercase tracking-wider text-black pr-4">
                    {faq.question}
                  </span>
                  <Plus
                    className={`flex-shrink-0 w-6 h-6 text-black transition-transform ${expandedFaqId === faq.id ? 'rotate-45' : ''
                      }`}
                  />
                </button>
                {expandedFaqId === faq.id && (
                  <div className="pt-2 pb-2 text-base md:text-lg text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ratings & Reviews — user can add a review */}
      <ProductReviewsSection productSlug={product.slug || product.handle} productTitle={product.title} />

      {/* 2. Four feature pillars */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Image src="/icons/lab.png" alt="" width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Third-Party Tested</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We hold ourselves and our ingredients to the highest standards.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Image src="/icons/quality.png" alt="" width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Quality Ingredients</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We&apos;re dedicated to using scientifically backed, high-quality natural ingredients.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Image src="/icons/nogmo-2.png" alt="" width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Non-GMO</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We carefully evaluate every ingredient, ensuring they are non-GMO.
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Image src="/icons/vegan-2.png" alt="" width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Vegan</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We ensure the highest standards with 100% vegan, cruelty-free formulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Join Our Circle & Save */}
      <section className="w-full bg-[#168B6A] py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-3">
            Join Our Circle & Save!
          </h2>
          <p className="text-base text-white mb-8">
            Sign up now for 10% off your first order — because you deserve it!
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setJoinSubmitted(true)
              setJoinEmail('')
              setTimeout(() => setJoinSubmitted(false), 3000)
            }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center"
          >
            <input
              type="email"
              value={joinEmail}
              onChange={(e) => setJoinEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 min-w-0 px-5 py-3 bg-white border border-white/80 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider bg-white text-black hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {joinSubmitted ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>

      {/* Sticky Add to Cart - appears when hero scrolls out of view */}
      {showStickyAddToCart && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] py-4 px-4 block md:hidden">
          <div className="flex justify-center">
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`w-full py-3 px-4 font-bold text-base uppercase tracking-wider transition-all ${!isAvailable
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : product?.title.toLowerCase().includes('starter')
                    ? 'bg-gradient-to-r from-[#ecc67d] to-[#d6a958] text-[#3d2f11] hover:opacity-90'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              {!isAvailable
                ? 'OUT OF STOCK'
                : product?.title.toLowerCase().includes('starter')
                  ? `ADD TO CART`
                  : `ADD TO CART`
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
