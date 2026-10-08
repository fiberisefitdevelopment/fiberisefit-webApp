'use client'

import { useMemo } from 'react'

const iconClass = 'w-9 h-6 object-contain flex-shrink-0'

/** UPI (India) - green logo style, shown first */
function UpiIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="UPI">
      <rect width="48" height="24" rx="4" fill="#0F8558" />
      <text x="24" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">UPI</text>
    </svg>
  )
}

/** Visa - navy wordmark */
function VisaIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
      <rect width="48" height="24" rx="3" fill="#1A1F71" />
      <text x="24" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial, sans-serif">VISA</text>
    </svg>
  )
}

/** Mastercard - overlapping red & orange circles (standard logo) */
function MastercardIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
      <circle cx="17" cy="12" r="8" fill="#EB001B" />
      <circle cx="31" cy="12" r="8" fill="#F79E1B" />
      <path d="M24 6.5a9.5 9.5 0 0 1 0 11 9.5 9.5 0 0 1 0-11z" fill="#FF5F00" />
    </svg>
  )
}

/** Amex - blue wordmark */
function AmexIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="American Express">
      <rect width="48" height="24" rx="3" fill="#006FCF" />
      <text x="24" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">AMEX</text>
    </svg>
  )
}

const icons = {
  upi: UpiIcon,
  visa: VisaIcon,
  mc: MastercardIcon,
  amex: AmexIcon,
} as const

export type PaymentIconKey = keyof typeof icons

export interface PaymentIconsProps {
  /** Order: UPI first, then others. Default: upi, visa, mc, amex */
  order?: PaymentIconKey[]
  /** Optional class for the container */
  className?: string
  /** Optional class for each icon */
  iconClassName?: string
}

const defaultOrder: PaymentIconKey[] = ['upi', 'visa', 'mc', 'amex']

export function PaymentIcons({ order = defaultOrder, className = '', iconClassName }: PaymentIconsProps) {
  const list = useMemo(() => order.filter((k) => k in icons), [order])
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`.trim()}>
      {list.map((key) => {
        const Icon = icons[key]
        return <Icon key={key} className={iconClassName ?? iconClass} />
      })}
    </div>
  )
}

export default PaymentIcons
