'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Minus, ShoppingBag, Tag, Loader2, Check, Copy, Gift, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const router = useRouter()
  const { isOpen, items, closeCart, updateQuantity, removeItem, getTotal } =
    useCartStore()
  const { isAuthenticated, getIdToken, loading: authLoading } = useAuth()
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [pendingCheckoutUrl, setPendingCheckoutUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText('PREPAID5')
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleApplyPrepaidDiscount = () => {
    setPromoCode('PREPAID5')
    setPromoError(null)
    setPromoApplied(true)
    setPendingCheckoutUrl(null)
  }

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
          discountCode: promoCode.trim() || undefined,
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
                      <span>₹{item.price.toFixed(2)} </span>
                      <span className="text-xs text-gray-400 font-medium">
                        (₹{item.price.toFixed(2)} × {item.quantity})
                      </span>
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

              {/* Card 2: Prepaid Promo Banner */}
              <div className="p-4 bg-[#F2FAF2] border border-[#E0EEE0] rounded-xl flex items-start gap-4 shadow-sm">
                {/* Angled green tag SVG */}
                <div className="shrink-0 mt-0.5">
                  <svg className="w-12 h-12 text-[#2E7D32]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 22L22 4H44V26L26 44H4L4 22Z" fill="currentColor" />
                    {/* Circle punch hole */}
                    <circle cx="36" cy="12" r="3" fill="#F2FAF2" />
                    {/* Percent sign */}
                    <path d="M19 23C20.1046 23 21 22.1046 21 21C21 19.8954 20.1046 19 19 19C17.8954 19 17 19.8954 17 21C17 22.1046 17.8954 23 19 23Z" fill="white" />
                    <path d="M29 31C30.1046 31 31 30.1046 31 29C31 27.8954 30.1046 27 29 27C27.8954 27 27 27.8954 27 29C27 30.1046 27.8954 31 29 31Z" fill="white" />
                    <line x1="28" y1="19" x2="20" y2="31" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="space-y-3.5 flex-1">
                  <h4 className="text-sm font-black text-[#114B1F] tracking-wide uppercase leading-tight">
                    SAVE EXTRA 5% ON PREPAID ORDERS!
                  </h4>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-700 font-semibold">Use code:</span>
                    <div className="px-4 py-1.5 border border-dashed border-[#2E7D32] rounded bg-white text-[#2E7D32] font-bold text-xs tracking-wider min-w-[100px] text-center">
                      PREPAID5
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3.5 py-1.5 bg-[#0E441E] hover:bg-[#082E13] text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      {isCopied ? (
                        <>
                          <span className="inline-flex items-center justify-center w-3 h-3 bg-white text-[#0E441E] rounded-full text-[8px] font-bold">✓</span>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 2h8a1 1 0 011 1v1h1a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-1H4a1 1 0 01-1-1V3a1 1 0 011-1zm2 10h7V5H6v7zm-2-2h1V4h6V3H4v7z" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                    <li className="flex items-center gap-2 text-[#114B1F]">
                      <span className="inline-flex items-center justify-center w-4 h-4 bg-[#2E7D32] rounded-full text-white text-[8px] font-bold">
                        ✓
                      </span>
                      Valid on UPI, Cards & Online Payments
                    </li>
                    <li className="flex items-center gap-2 text-[#961A22]">
                      <span className="inline-flex items-center justify-center w-4 h-4 bg-[#D32F2F] rounded-full text-white text-[8px] font-bold">
                        ✕
                      </span>
                      Cash on Delivery not available with this offer
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3: Promo, Subtotal & Checkout Controls */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 space-y-4 shadow-sm">
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
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-baseline text-black">
                    <span className="text-sm sm:text-base font-extrabold">Subtotal</span>
                    <span className="text-base sm:text-lg font-black">
                      ₹{promoCode.trim() === 'PREPAID5' && promoApplied 
                        ? (getTotal() * 0.95).toFixed(2) 
                        : getTotal().toFixed(2)
                      }
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-semibold pt-1">
                    Shipping and discounts applied at checkout.
                  </p>
                </div>

                {/* Quick-Apply Promo Box */}
                <button
                  type="button"
                  onClick={handleApplyPrepaidDiscount}
                  className={`w-full p-3 rounded-lg text-left text-xs transition-all flex items-center gap-2.5 border ${
                    promoCode.trim() === 'PREPAID5' && promoApplied
                      ? 'bg-[#F2FAF2] border-[#D0E7D0] text-[#114B1F]'
                      : 'bg-[#F9FAF9] hover:bg-[#F0F5F0] border-[#E2E8E2] text-gray-700'
                  }`}
                >
                  <Gift className={`w-4 h-4 shrink-0 ${
                    promoCode.trim() === 'PREPAID5' && promoApplied ? 'text-[#2E7D32]' : 'text-gray-500'
                  }`} />
                  <div className="flex-1 font-semibold text-[11px] sm:text-xs">
                    {promoCode.trim() === 'PREPAID5' && promoApplied ? (
                      <span>Discount <strong>PREPAID5</strong> applied! You get 5% OFF and pay online.</span>
                    ) : (
                      <span>Apply <strong className="text-[#2E7D32]">PREPAID5</strong> to get 5% OFF and pay online.</span>
                    )}
                  </div>
                </button>

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
            </div>
          )}
        </div>
      </div>
    </>
  )
}
