'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Minus, ShoppingBag, Tag, Loader2, Check } from 'lucide-react'
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
    if (!isAuthenticated) {
      closeCart()
      router.push('/account/login')
      return
    }

    if (items.length === 0) {
      return
    }

    setIsProcessingCheckout(true)

    try {
      const token = await getIdToken()
      if (!token) {
        throw new Error('Failed to get authentication token')
      }

      // Prepare cart items for checkout
      const cartItems = items.map((item) => ({
        id: item.id, // This should be the Shopify variant ID (GID format)
        quantity: item.quantity,
      }))

      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
      <div className="fixed right-0 top-0 bottom-0 w-full sm:max-w-[420px] sm:w-[420px] bg-[#F5F3EF] z-50 shadow-2xl overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white">
            <h2 className="text-lg sm:text-xl font-semibold uppercase tracking-wider text-black">
              Shopping Cart
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items — card format inspired by product card layout */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[280px] text-center px-4">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Your cart is empty</p>
                <Link
                  href="/#products"
                  onClick={closeCart}
                  className="text-black font-medium underline underline-offset-2"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm"
                  >
                    {/* Product image — prominent top */}
                    <div className="relative w-full aspect-square max-h-40 sm:max-h-44 bg-gray-50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 384px) 100vw, 384px"
                      />
                    </div>

                    {/* Content block — name, descriptor, price, quantity */}
                    <div className="p-4 space-y-3">
                      {/* Product name */}
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {item.title}
                      </h3>

                      {/* Variant / short descriptor (USP-style line) */}
                      {item.variant && (
                        <p className="text-xs text-gray-600 border-l-2 border-gray-200 pl-2">
                          {item.variant}
                        </p>
                      )}

                      {/* Trust / benefit line (format only, project copy) */}
                      <p className="text-xs text-gray-500">
                        Free shipping · Easy returns
                      </p>

                      {/* Price block — unit price + line total */}
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <span className="text-lg font-bold text-black">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            (₹{item.price.toFixed(2)} × {item.quantity})
                          </span>
                        </div>
                      </div>

                      {/* Quantity + Remove row — full-width CTA style */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2.5 hover:bg-gray-100 transition-colors text-gray-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2.5 hover:bg-gray-100 transition-colors text-gray-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-medium text-gray-500 hover:text-black underline underline-offset-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Footer — card-style section with full-width CTA */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 sm:p-6 space-y-4 bg-white">
              {/* Promotion code — labelled block */}
              <div className="space-y-2">
                <label htmlFor="cart-promo" className="text-xs font-semibold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
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
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isProcessingCheckout || !promoCode.trim()}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold uppercase tracking-wider text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && promoCode.trim() && (
                  <p className="text-xs text-gray-700 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 flex-shrink-0 text-black" />
                    <span>Code <strong>{promoCode.trim()}</strong> will be applied at checkout.</span>
                  </p>
                )}
                {promoError && (
                  <p className="text-xs text-red-600">{promoError}</p>
                )}
                {pendingCheckoutUrl && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-gray-600">Code not applied. You can continue without it.</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (pendingCheckoutUrl) {
                          closeCart()
                          window.location.href = pendingCheckoutUrl
                        }
                      }}
                      className="text-sm font-medium text-black underline hover:no-underline"
                    >
                      Continue to checkout anyway
                    </button>
                  </div>
                )}
              </div>

              {/* Subtotal row */}
              <div className="flex justify-between text-base font-semibold text-black">
                <span>Subtotal</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Shipping and discounts applied at checkout.
              </p>
              <p className="text-xs text-gray-600">
                Keep the pre-filled email at checkout so your order appears in Order History.
              </p>

              {/* Full-width primary CTA — same format as card “ADD TO CART” */}
              <button
                onClick={handleCheckout}
                disabled={isProcessingCheckout || authLoading}
                className="w-full py-4 px-6 rounded-lg font-semibold text-sm uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingCheckout ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin flex-shrink-0 inline-block mr-2 align-middle" aria-hidden />
                    <span>Applying...</span>
                  </>
                ) : authLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin flex-shrink-0 inline-block mr-2 align-middle" aria-hidden />
                    <span>Loading...</span>
                  </>
                ) : (
                  'Checkout'
                )}
              </button>
              <Link
                href="/#products"
                onClick={closeCart}
                className="block w-full text-center py-3 text-sm font-medium text-gray-700 hover:text-black underline underline-offset-2 transition-colors"
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

