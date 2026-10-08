'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { Smartphone, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function AccountLoginPage() {
  const router = useRouter()
  const openCart = useCartStore((state) => state.openCart)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  useEffect(() => {
    if (!auth) return
    if (!recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          'recaptcha-container-login',
          {
            size: 'invisible',
            callback: () => { },
            'expired-callback': () => {
              setError('Verification expired. Please try again.')
            },
          }
        )
      } catch (err: any) {
        setError(err.message || 'Failed to initialize. Refresh and try again.')
      }
    }
    return () => {
      try {
        recaptchaVerifierRef.current?.clear()
      } catch { }
      recaptchaVerifierRef.current = null
    }
  }, [])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error('Verification not ready. Please refresh the page.')
      }
      if (phoneDigits.length !== 10) {
        throw new Error('Please enter a valid 10-digit mobile number.')
      }
      const formattedPhone = '+91' + phoneDigits
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifierRef.current
      )
      setConfirmationResult(confirmation)
      setStep('otp')
    } catch (err: any) {
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Enter a valid 10-digit Indian number.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!confirmationResult) {
        throw new Error('Session expired. Please start again.')
      }
      const userCredential = await confirmationResult.confirm(otp)
      const idToken = await userCredential.user.getIdToken(true)
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) {
        throw new Error('Something went wrong. Please try again.')
      }
      
      // Open cart drawer and redirect to home
      openCart()
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white lg:bg-[#F5F3EF] pt-24 pb-12 flex items-center justify-center lg:px-8">
      <div id="recaptcha-container-login" className="hidden" />

      {/* Split card container */}
      <div className="w-full max-w-5xl bg-white lg:rounded-3xl shadow-none lg:shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[560px]">
        {/* Left: Promo panel - Midnight Obsidian */}
        <div className="hidden lg:flex lg:w-[44%] bg-[#1a1a1a] p-8 sm:p-10 lg:p-12 flex-col justify-between items-center text-center lg:items-start lg:text-left text-white rounded-t-2xl sm:rounded-t-3xl lg:rounded-tr-none lg:rounded-l-2xl lg:rounded-l-3xl">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
              Simplify your wellness journey.
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-sm">
              Sign in with your mobile number for a seamless experience. No password needed.
            </p>
          </div>
          <div className="mt-10 flex justify-center lg:justify-start">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-6 flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold">Login with mobile only</p>
                <p className="text-sm text-white/80">Quick OTP verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form panel */}
        <div className="w-full lg:w-[56%] p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to store
          </Link>

          <div className="relative h-8 w-32 mb-8">
            <Image
              src="/fiberisefit dark logo.png"
              alt="Fiberise"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-1">
            Let's Begin
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mb-6">
            Your journey to better shape starts here
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Mobile number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneDigits}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/30 focus:border-[#1a1a1a] transition-colors"
                    required
                    maxLength={10}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#187254] hover:bg-[#146147] text-white py-3.5 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-5">
              <p className="text-sm text-gray-600">
                Code sent to +91 {phoneDigits}
              </p>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/30 focus:border-[#1a1a1a] text-center text-xl tracking-[0.4em] transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#187254] hover:bg-[#146147] text-white py-3.5 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & login'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setOtp('')
                  setError(null)
                  setConfirmationResult(null)
                }}
                className="w-full text-sm text-gray-500 hover:text-[#1a1a1a] py-2"
              >
                Use a different number
              </button>
            </form>
          )}

          <p className="mt-8 text-sm text-gray-500 text-center lg:text-left">
            By continuing, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}
