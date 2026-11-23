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
        Select Pack
      </label>

      {/* 3 Selectable Duration Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
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
              className={`relative flex flex-col text-left px-2 py-3 sm:px-3 sm:py-4 rounded-xl border-2 overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isSelected
                  ? 'border-black bg-[#faf8f5] shadow-sm ring-1 ring-black/5'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <div
                  className={`w-4 h-4 sm:w-[1.125rem] sm:h-[1.125rem] rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-black text-white' : 'border border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />}
                </div>
                <span className="whitespace-nowrap font-extrabold text-sm sm:text-lg text-gray-900 leading-tight">
                  {pkg.duration}
                </span>
              </div>

              <div className="mt-auto pt-2 sm:pt-2.5 flex flex-col gap-1 whitespace-nowrap">
                <span className="text-sm sm:text-base font-black text-black leading-none">
                  ₹{formatInr(pkg.price)}
                </span>
                {pkg.comparePrice > pkg.price && (
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] sm:text-xs text-gray-400 line-through leading-none">
                      ₹{formatInr(pkg.comparePrice)}
                    </span>
                    {discountPercent && (
                      <span className="text-[11px] sm:text-xs font-bold text-red-600 leading-none">
                        {discountPercent}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
