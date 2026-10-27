'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import CheckoutOtpModal from '@/components/CheckoutOtpModal'
import { useCartStore } from '@/store/cartStore'

type CheckoutOtpRequest = {
  orderLabel: string
  orderTotal: number
  onVerified: (idToken: string | null, phoneDigits?: string) => Promise<void>
}

export function useCheckoutOtp() {
  const { initializeAuth, getIdToken } = useAuth()
  const [request, setRequest] = useState<CheckoutOtpRequest | null>(null)

  const requireVerifiedPhone = async ({ orderLabel, orderTotal, onVerified }: CheckoutOtpRequest) => {
    await initializeAuth()
    const existingToken = await getIdToken()
    if (existingToken) {
      try {
        await onVerified(existingToken)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to proceed to checkout. Please try again.'
        alert(message)
      }
      return
    }

    useCartStore.getState().closeCart()
    setRequest({ orderLabel, orderTotal, onVerified })
  }

  const checkoutOtpModal = (
    <CheckoutOtpModal
      isOpen={request !== null}
      orderLabel={request?.orderLabel ?? ''}
      orderTotal={request?.orderTotal ?? 0}
      onClose={() => setRequest(null)}
      onVerified={async (idToken) => {
        if (!request) return
        await request.onVerified(idToken)
        setRequest(null)
      }}
      onBypass={async (phoneDigits) => {
        if (!request) return
        await request.onVerified(null, phoneDigits)
        setRequest(null)
      }}
    />
  )

  return { requireVerifiedPhone, checkoutOtpModal }
}
