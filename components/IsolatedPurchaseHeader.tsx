'use client'

import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function IsolatedPurchaseHeader() {
  const { openCart, getItemCount } = useCartStore()
  const itemCount = getItemCount()

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#187254] py-2.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wider uppercase text-white">
        Exclusive offer — add to cart below to complete your purchase
      </div>
      <header className="fixed left-0 right-0 z-40 top-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="relative h-7 w-28 opacity-90 pointer-events-none select-none" aria-hidden>
            <Image
              src="/icons/I Mark - BC 01.png"
              alt=""
              fill
              className="object-contain object-left"
              sizes="112px"
            />
          </div>
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 text-[#1a1a1a] hover:opacity-70 transition-opacity"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#1a1a1a] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  )
}
