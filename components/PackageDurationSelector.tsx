'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { formatInr } from '@/lib/utils'

export interface PackageOption {
  id: 'starter' | 'transformation' | 'ultimate'
  name: string
  duration: string
  badge?: string
  badgeBg?: string
  badgeTextColor?: string
  servings: string
  flavour: string
  price: number
  comparePrice: number
  handle: string
  variantId: string
  shopifyId: string
  image: string
  images: string[]
  description: string
  includes?: string
}

interface PackageDurationSelectorProps {
  packages: PackageOption[]
  selectedPackageId: string
  onSelect: (pkg: PackageOption) => void
}

export default function PackageDurationSelector({
  packages,
  selectedPackageId,
  onSelect,
}: PackageDurationSelectorProps) {
  return (
    <div className="w-full space-y-3" role="radiogroup" aria-label="Select Package Duration">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
        Select Duration
      </label>

      {/* 3 Selectable Duration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {packages.map((pkg) => {
          const isSelected = pkg.id === selectedPackageId
          const discountPercent =
            pkg.comparePrice > pkg.price
              ? Math.round((1 - pkg.price / pkg.comparePrice) * 100)
              : null

          return (
            <button
              key={pkg.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelect(pkg)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  onSelect(pkg)
                }
              }}
              className={`relative flex flex-col text-left p-3.5 sm:p-4 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isSelected
                  ? 'border-2 border-black bg-[#faf8f5] shadow-sm ring-1 ring-black/5'
                  : 'border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              {/* Top Row: Radio Circle, Duration & Badge */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-black text-white' : 'border border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
                    {pkg.duration}
                  </span>
                </div>
                {pkg.badge && (
                  <span
                    className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-xs"
                    style={{
                      background: pkg.badgeBg || '#187254',
                      color: pkg.badgeTextColor || '#ffffff',
                    }}
                  >
                    {pkg.badge}
                  </span>
                )}
              </div>

              {/* Price Row */}
              <div className="mt-auto pl-6 pt-1 flex items-baseline gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black text-black">
                  ₹{formatInr(pkg.price)}
                </span>
                {pkg.comparePrice > pkg.price && (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{formatInr(pkg.comparePrice)}
                    </span>
                    {discountPercent && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 py-0.2 rounded">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Flavour indicator */}
              <div className="mt-2 pt-2 border-t border-gray-100 pl-6 flex items-center justify-between text-[10px] text-gray-500">
                <span>Flavour</span>
                <span className="font-semibold text-gray-800">Assorted</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
