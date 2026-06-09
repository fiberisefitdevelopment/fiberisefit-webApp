'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Minus, ShoppingBag, Tag, Loader2, Check, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import { useCampaignStore } from '@/store/campaignStore'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const router = useRouter()
  const { isOpen, items, closeCart, updateQuantity, removeItem, getTotal, paymentMethod } =
    useCartStore()
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod) || useCartStore.getState().setPaymentMethod
  const { isAuthenticated, getIdToken, loading: authLoading } = useAuth()
  const { activeCampaign } = useCampaignStore()
  const isCampaignValid = activeCampaign && new Date().getTime() < new Date(activeCampaign.expiresAt).getTime()
  const hasBogo = items.some((item) => item.handle === 'bogo')
  console.log('🛒 Cart Items in Drawer:', items.map(i => ({ id: i.id, title: i.title, handle: i.handle, price: i.price })))
  console.log('🛒 hasBogo:', hasBogo)
  const hasJuneTransform = items.some((item) => item.handle === 'transformation-pack') && isCampaignValid && activeCampaign.slug === 'june-transform'
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [pendingCheckoutUrl, setPendingCheckoutUrl] = useState<string | null>(null)

  const handleApplyPromo = () => {
    const code = promoCode.trim()
    if (!code) {
      setPromoError('Enter a promotion code')
      setPromoApplied(false)
      return
    }
    setPromoError(null)
    setPromoApplied(true)
    setPendingCheckoutUrl(null)
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      return
    }

    setIsProcessingCheckout(true)

    try {
      let token: string | null = null
      if (isAuthenticated) {
        token = await getIdToken()
      }

      // Prepare cart items for checkout
      const cartItems = items.map((item) => ({
        id: item.id, // This should be the Shopify variant ID (GID format)
        quantity: item.quantity,
      }))

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cartItems,
          discountCode: promoCode.trim() || (paymentMethod === 'prepaid' && hasBogo ? 'PREPAID200' : undefined),
          campaignSlug: (isCampaignValid && (activeCampaign.slug !== 'june-transform' || paymentMethod === 'prepaid')) ? activeCampaign.slug : undefined,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to create checkout'
        if (errorMessage.includes('does not exist') || errorMessage.includes('no longer available')) {
          throw new Error(
            `${errorMessage}\n\nPlease clear your cart and add products fresh from the Shop page.`
          )
        }
        throw new Error(errorMessage)
      }

      const { checkoutUrl, discountError } = data

      if (discountError) {
        setPromoError(discountError)
        setPendingCheckoutUrl(checkoutUrl || null)
        return
      }

      if (checkoutUrl) {
        closeCart()
        window.location.href = checkoutUrl
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Failed to proceed to checkout. Please try again.')
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={closeCart}
      />

      {/* Drawer — width accommodates card layout */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:max-w-[420px] sm:w-[420px] bg-[#F5F3EF] z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
            Shopping Cart
          </h2>
          <button
            onClick={closeCart}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable container for cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2 font-medium">Your cart is empty</p>
              <Link
                href="/#products"
                onClick={closeCart}
                className="text-black font-semibold underline underline-offset-2"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Card 1: Product Item Cards */}
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  {/* Centered Image */}
                  <div className="relative w-full aspect-[4/3] max-h-48 bg-white flex justify-center items-center mb-3">
                    <div className="relative w-full h-full max-w-[200px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 384px) 100vw, 384px"
                        priority
                      />
                    </div>
                  </div>

                  {/* Title, Details, Price */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-base leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold">
                      Free shipping • Easy returns
                    </p>
                    <div className="text-sm sm:text-base font-extrabold text-black pt-1">
                      {isCampaignValid && item.handle && activeCampaign.applicableProducts.includes(item.handle) && (activeCampaign.slug !== 'june-transform' || paymentMethod === 'prepaid') ? (
                        (() => {
                          const discountedPrice = item.price - activeCampaign.discountValue
                          return (
                            <>
                              <span className="text-[#187254]">₹{discountedPrice.toFixed(2)} </span>
                              <span className="text-xs text-gray-400 line-through mr-1.5">₹{item.price.toFixed(2)}</span>
                              <span className="text-xs text-gray-400 font-medium font-sans block sm:inline">
                                (₹{discountedPrice.toFixed(2)} × {item.quantity})
                              </span>
                            </>
                          )
                        })()
                      ) : (
                        <>
                          <span>₹{item.price.toFixed(2)} </span>
                          <span className="text-xs text-gray-400 font-medium">
                            (₹{item.price.toFixed(2)} × {item.quantity})
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Thin Divider */}
                  <hr className="my-3.5 border-gray-100" />

                  {/* Quantity Control & Remove Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors text-gray-600 font-bold"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-xs font-semibold text-gray-800 min-w-[1.8rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors text-gray-600 font-bold"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-bold text-gray-400 hover:text-black underline underline-offset-2 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}

              {/* Promo, Subtotal & Checkout Controls */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 space-y-4 shadow-sm">
                {/* Payment Method Selector */}
                {(hasBogo || hasJuneTransform) && (
                  <div className="space-y-2 pb-2">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-700">
                      Payment Method
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('prepaid')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMethod === 'prepaid'
                            ? 'border-black bg-white ring-2 ring-black shadow-sm'
                            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Prepaid</span>
                          <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-1 py-0.5 rounded">
                            -{hasJuneTransform ? '₹250' : '₹200'}
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-1 leading-tight">
                          UPI, Card (Extra {hasJuneTransform ? '₹250' : '₹200'} OFF)
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-black bg-white ring-2 ring-black shadow-sm'
                            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-bold text-gray-900">COD</span>
                        <p className="text-[9px] text-gray-500 mt-1 leading-tight">
                          Cash on Delivery
                        </p>
                      </button>
                    </div>
                  </div>
                )}
                {/* Promotion Input */}
                <div className="space-y-2">
                  <label htmlFor="cart-promo" className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 transform -rotate-90 text-gray-500" />
                    Promotion code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="cart-promo"
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase())
                        setPromoError(null)
                        setPromoApplied(false)
                        setPendingCheckoutUrl(null)
                      }}
                      placeholder="e.g. FYBER10"
                      disabled={isProcessingCheckout}
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 outline-none disabled:bg-gray-50 disabled:text-gray-500 focus:border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={isProcessingCheckout || !promoCode.trim()}
                      className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-800 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && promoCode.trim() && (
                    <p className="text-xs text-[#2B7A2B] font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Code <strong>{promoCode.trim()}</strong> will be applied at checkout.</span>
                    </p>
                  )}
                  {promoError && (
                    <p className="text-xs text-red-600 font-semibold">{promoError}</p>
                  )}
                </div>

                {/* Subtotal Display */}
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  {(() => {
                    const regularSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                    const campaignDiscount = regularSubtotal - getTotal()
                    
                    const isPrepaidDiscount = paymentMethod === 'prepaid' && hasBogo
                    const prepaidDiscountAmount = isPrepaidDiscount ? 200 : 0
                    
                    const finalTotal = Math.max(0, getTotal() - prepaidDiscountAmount)

                    return (
                      <>
                        <div className="flex justify-between items-baseline text-gray-500 text-xs sm:text-sm font-semibold">
                          <span>Subtotal (Regular)</span>
                          <span>₹{regularSubtotal.toFixed(2)}</span>
                        </div>
                        {campaignDiscount > 0 && (
                          <div className="flex justify-between items-baseline text-[#187254] text-xs sm:text-sm font-bold">
                            <span>Campaign Discount</span>
                            <span>-₹{campaignDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        {isPrepaidDiscount && (
                          <div className="flex justify-between items-baseline text-[#187254] text-xs sm:text-sm font-bold">
                            <span>Prepaid Discount</span>
                            <span>-₹{prepaidDiscountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline text-black border-t border-dashed border-gray-100 pt-1.5">
                          <span className="text-sm sm:text-base font-extrabold">Final Price</span>
                          <span className="text-base sm:text-lg font-black text-[#187254]">
                            ₹{finalTotal.toFixed(2)}
                          </span>
                        </div>
                      </>
                    )
                  })()}
                  <p className="text-xs text-gray-400 font-semibold pt-1">
                    Shipping and discounts applied at checkout.
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessingCheckout || authLoading}
                  className="w-full py-4 px-6 rounded-lg font-extrabold text-sm uppercase tracking-wider bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isProcessingCheckout ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Applying...
                    </span>
                  ) : (
                    'Checkout'
                  )}
                </button>
              </div>

              {/* Continue Shopping Link */}
              <Link
                href="/#products"
                onClick={closeCart}
                className="block w-full text-center py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-black underline underline-offset-2 transition-colors"
              >
                Continue shopping
              </Link>
              <div className="text-[10px] text-gray-400 font-mono mt-4 p-2 bg-gray-100 rounded overflow-x-auto">
                Debug Items: {JSON.stringify(items.map(i => ({ handle: i.handle, title: i.title, qty: i.quantity, price: i.price })))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
