'use client'

import { useEffect, useState } from 'react'
import {
  X,
  Plus,
  Minus,
  Tag,
  Loader2,
  Check,
  Trash2,
  Lock,
  ArrowRight,
  ChevronUp,
  Truck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import { useCampaignStore } from '@/store/campaignStore'
import { getPdCheckoutDiscountCode } from '@/lib/hidden-products'
import { trackInitiateCheckout } from '@/lib/meta-pixel'
import { useCheckoutOtp } from '@/hooks/useCheckoutOtp'
import Image from 'next/image'
import Link from 'next/link'

type CartDrawerProps = {
  isolatedPurchase?: boolean
}

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function unitSellingPrice(
  item: CartItem,
  campaign: { discountType: 'fixed' | 'percentage'; discountValue: number; applicableProducts: string[] } | null,
  isCampaignValid: boolean
) {
  if (!isCampaignValid || !campaign || !item.handle || !campaign.applicableProducts.includes(item.handle)) {
    return item.price
  }
  if (campaign.discountType === 'fixed') {
    return Math.max(0, item.price - campaign.discountValue)
  }
  return Math.max(0, item.price * (1 - campaign.discountValue / 100))
}

function EmptyCartArt() {
  return (
    <svg viewBox="0 0 320 210" className="h-40 w-full max-w-[300px]" aria-hidden>
      <circle cx="160" cy="108" r="74" fill="#F3F1E8" />
      <g fill="#D7E0D4">
        <ellipse cx="52" cy="78" rx="22" ry="9" transform="rotate(-35 52 78)" />
        <ellipse cx="70" cy="58" rx="20" ry="8" transform="rotate(-12 70 58)" />
        <ellipse cx="40" cy="104" rx="16" ry="7" transform="rotate(28 40 104)" />
        <ellipse cx="248" cy="64" rx="24" ry="9" transform="rotate(18 248 64)" />
        <ellipse cx="270" cy="84" rx="22" ry="8" transform="rotate(48 270 84)" />
        <ellipse cx="232" cy="92" rx="18" ry="7" transform="rotate(-8 232 92)" />
        <ellipse cx="258" cy="112" rx="20" ry="8" transform="rotate(72 258 112)" />
      </g>
      <g stroke="#E0A15A" strokeWidth="3" strokeLinecap="round">
        <path d="M132 46v14" />
        <path d="M146 38l2 14" />
        <path d="M160 44l-1 13" />
      </g>
      <path d="M118 86h86l12 92H106l12-92z" fill="#FFFcf8" stroke="#1C1C1C" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M188 90l14 84" stroke="#E8E2D8" strokeWidth="16" />
      <path d="M118 100h86" stroke="#1C1C1C" strokeWidth="3" />
      <path
        d="M136 86c1-20 16-32 28-32s27 12 28 32"
        fill="none"
        stroke="#1C1C1C"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M146 132c8 10 22 10 30 0" fill="none" stroke="#1C1C1C" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

function TrustRow() {
  const items = [
    { icon: Truck, title: 'Free Shipping', detail: 'On prepaid orders' },
    { icon: RotateCcw, title: 'Easy Returns', detail: 'Hassle free' },
    { icon: ShieldCheck, title: '100% Secure', detail: 'Checkout' },
  ]
  return (
    <div className="grid grid-cols-3 gap-1 px-1 pt-2">
      {items.map((item, index) => (
        <div
          key={item.title}
          className={`flex items-center justify-center gap-1.5 px-1 ${
            index > 0 ? 'border-l border-gray-200' : ''
          }`}
        >
          <item.icon className="h-5 w-5 shrink-0 text-[#1F7A45]" strokeWidth={1.75} />
          <div className="min-w-0 leading-tight">
            <p className="text-[10px] font-bold text-[#1F7A45] sm:text-[11px]">{item.title}</p>
            <p className="text-[10px] text-gray-500">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CartDrawer({ isolatedPurchase = false }: CartDrawerProps) {
  const { isOpen, items, closeCart, updateQuantity, removeItem, getTotal, paymentMethod, getItemCount } =
    useCartStore()
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod) || useCartStore.getState().setPaymentMethod
  const { loading: authLoading } = useAuth()
  const { requireVerifiedPhone, checkoutOtpModal } = useCheckoutOtp()
  const { activeCampaign } = useCampaignStore()
  const isCampaignValid = Boolean(
    activeCampaign && new Date().getTime() < new Date(activeCampaign.expiresAt).getTime()
  )
  const hasBogo = items.some((item) => item.handle === 'bogo')
  const pdCheckoutDiscountCode = getPdCheckoutDiscountCode(items)
  const hasJuneTransform =
    items.some((item) => item.handle === 'transformation-pack') &&
    isCampaignValid &&
    activeCampaign?.slug === 'june-transform'
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoOpen, setPromoOpen] = useState(true)
  const [pendingCheckoutUrl, setPendingCheckoutUrl] = useState<string | null>(null)
  const itemCount = getItemCount()

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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

  const startCheckout = async (token: string | null, phoneDigits?: string) => {
    setIsProcessingCheckout(true)
    try {
      const cartItems = items.map((item) => ({
        id: item.variantId || item.id,
        quantity: item.quantity,
        ...(item.variant ? { flavor: item.variant } : {}),
      }))

      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: cartItems,
          discountCode:
            promoCode.trim() ||
            (paymentMethod === 'prepaid' && hasBogo ? 'PREPAID200' : undefined) ||
            pdCheckoutDiscountCode,
          campaignSlug: isCampaignValid ? activeCampaign?.slug : undefined,
          ...(!token && phoneDigits ? { phone: phoneDigits } : {}),
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

      if (!checkoutUrl) {
        throw new Error('No checkout URL returned')
      }

      trackInitiateCheckout(
        items.map((item) => ({
          contentName: item.title,
          contentIds: [item.variantId, item.id],
          value: item.price * item.quantity,
          quantity: item.quantity,
        })),
        getTotal()
      )
      closeCart()
      window.location.href = checkoutUrl
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    const orderLabel =
      items.length === 1 ? items[0].title : `${items[0].title} + ${items.length - 1} more`
    void requireVerifiedPhone({
      orderLabel,
      orderTotal: getTotal(),
      onVerified: startCheckout,
    })
  }

  const isPrepaidDiscount = paymentMethod === 'prepaid' && hasBogo
  const prepaidDiscountAmount = isPrepaidDiscount ? 200 : 0
  const sellingTotal = getTotal()
  const finalTotal = Math.max(0, sellingTotal - prepaidDiscountAmount)

  return (
    <>
      {checkoutOtpModal}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[70] bg-black/50" onClick={closeCart} />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="animate-cart-panel fixed inset-x-0 bottom-0 z-[70] flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[28px] bg-[#F7F6F3] shadow-2xl lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:max-h-none lg:w-[380px] lg:rounded-none lg:border-l lg:border-black/5"
          >
            
            <div className="shrink-0 border-b border-black/5 bg-white">
              <div className="flex justify-center pt-2.5 lg:hidden" aria-hidden>
                <span className="h-1 w-10 rounded-full bg-gray-300" />
              </div>
              <div className="relative flex items-center justify-center px-5 pb-4 pt-3 lg:px-6 lg:py-5">
                <h2 className="text-center text-[15px] font-extrabold uppercase tracking-[0.06em] text-[#171717] sm:text-base">
                  Shopping Cart ({itemCount})
                </h2>
                <button
                  onClick={closeCart}
                  className="absolute right-4 rounded-full p-1 text-[#1a1a1a] transition-colors hover:bg-gray-100"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-5 pt-5 sm:px-5 lg:px-6 lg:pb-6 lg:pt-8">
              {items.length === 0 ? (
                <div className="flex min-h-full flex-1 flex-col">
                  <div className="flex flex-1 flex-col items-center justify-center px-2 text-center lg:px-4">
                    <EmptyCartArt />
                    <h3 className="mt-2 text-[26px] font-bold tracking-tight text-[#171717]">
                      Your cart is empty
                    </h3>
                    <p className="mt-2 max-w-[320px] text-[14px] leading-relaxed text-[#8A8F98]">
                      Looks like you haven&apos;t added anything yet.
                      <br />
                      Explore our bestsellers and start your wellness journey today!
                    </p>
                    {isolatedPurchase ? (
                      <button
                        type="button"
                        onClick={closeCart}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-neutral-900"
                      >
                        Return to product
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <Link
                        href="/#products"
                        onClick={closeCart}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-neutral-900"
                      >
                        Continue shopping
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-full flex-1 flex-col">
                  <div className="space-y-4">
                    {items.map((item) => {
                      const unit = unitSellingPrice(item, isCampaignValid ? activeCampaign : null, isCampaignValid)
                      const compare =
                        item.compareAtPrice != null && item.compareAtPrice > unit
                          ? item.compareAtPrice
                          : item.price > unit
                            ? item.price
                            : null
                      return (
                        <article key={item.id} className="border-b border-gray-200 pb-4">
                          <div className="flex gap-3">
                            <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-xl bg-white">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="84px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-[15px] font-bold leading-tight text-[#171717]">
                                  {item.title}
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="shrink-0 p-0.5 text-gray-400 transition-colors hover:text-black"
                                  aria-label={`Remove ${item.title}`}
                                >
                                  <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
                                </button>
                              </div>
                              {item.variant && (
                                <p className="mt-0.5 text-xs text-gray-500">{item.variant}</p>
                              )}
                              <p className="mt-0.5 text-[13px] text-[#8B919A]">Free shipping • Easy returns</p>
                              <p className="mt-1 text-[15px] font-bold text-[#171717]">
                                {formatInr(unit)}
                                {compare != null && (
                                  <span className="ml-2 text-[13px] font-medium text-gray-400 line-through">
                                    {formatInr(compare)}
                                  </span>
                                )}
                              </p>
                              <div className="mt-2.5 inline-flex items-center rounded-xl border border-gray-200 bg-white">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-[1.6rem] text-center text-sm font-semibold text-[#171717]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-50"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>

                  {(hasBogo || hasJuneTransform) && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                        Payment Method
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('prepaid')}
                          className={`rounded-xl border p-3 text-left transition-all ${
                            paymentMethod === 'prepaid'
                              ? 'border-black bg-white ring-2 ring-black'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">Prepaid</span>
                            <span className="rounded bg-red-100 px-1 py-0.5 text-[9px] font-extrabold text-red-700">
                              -{hasJuneTransform ? '₹250' : '₹200'}
                            </span>
                          </div>
                          <p className="mt-1 text-[9px] leading-tight text-gray-500">
                            {hasJuneTransform ? 'UPI, Cards, Net Banking' : 'UPI, Card (Extra ₹200 OFF)'}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cod')}
                          className={`rounded-xl border p-3 text-left transition-all ${
                            paymentMethod === 'cod'
                              ? 'border-black bg-white ring-2 ring-black'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">COD</span>
                            {hasJuneTransform && (
                              <span className="rounded bg-red-100 px-1 py-0.5 text-[9px] font-extrabold text-red-700">
                                -₹250
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[9px] leading-tight text-gray-500">Cash on Delivery</p>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-[#E3EBE3] bg-[#F3F6F1] px-3.5 py-3">
                    <button
                      type="button"
                      onClick={() => setPromoOpen((open) => !open)}
                      className="flex w-full items-center justify-between text-left"
                      aria-expanded={promoOpen}
                    >
                      <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2A2A2A]">
                        <Tag className="h-4 w-4 -rotate-90 text-gray-500" strokeWidth={1.75} />
                        Promotion code
                      </span>
                      <ChevronUp
                        className={`h-4 w-4 text-gray-500 transition-transform ${promoOpen ? '' : 'rotate-180'}`}
                      />
                    </button>
                    {promoOpen && (
                      <div className="mt-3">
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
                            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-[#171717] outline-none placeholder:text-gray-400 focus:border-gray-300 disabled:bg-gray-50"
                          />
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            disabled={isProcessingCheckout || !promoCode.trim()}
                            className="rounded-xl bg-[#D7E4D4] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[#4E624C] transition-colors hover:bg-[#c9dcc5] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Apply
                          </button>
                        </div>
                        {promoApplied && promoCode.trim() && (
                          <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#1F7A45]">
                            <Check className="h-3.5 w-3.5" />
                            <span>
                              Code <strong>{promoCode.trim()}</strong> will be applied at checkout.
                            </span>
                          </p>
                        )}
                        {promoError && <p className="mt-2 text-xs font-semibold text-red-600">{promoError}</p>}
                        {pendingCheckoutUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              closeCart()
                              window.location.href = pendingCheckoutUrl
                            }}
                            className="mt-2 text-xs font-semibold text-[#171717] underline underline-offset-2"
                          >
                            Continue to checkout without this code
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 space-y-2.5 text-[15px] text-[#3A3A3A]">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatInr(sellingTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Shipping</span>
                      <span className="font-semibold text-[#1F7A45]">Free</span>
                    </div>
                    {isPrepaidDiscount && (
                      <div className="flex items-center justify-between font-semibold text-[#1F7A45]">
                        <span>Prepaid discount</span>
                        <span>-{formatInr(prepaidDiscountAmount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 text-[#171717]">
                      <span className="text-base font-extrabold">Total</span>
                      <span className="text-lg font-extrabold text-[#1F7A45]">{formatInr(finalTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isProcessingCheckout || authLoading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessingCheckout ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" strokeWidth={2} />
                        Checkout securely
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-black/5 bg-[#F7F6F3] px-3 py-4 lg:px-5 lg:py-5">
              <TrustRow />
            </div>
          </div>
        </>
      )}
    </>
  )
}
