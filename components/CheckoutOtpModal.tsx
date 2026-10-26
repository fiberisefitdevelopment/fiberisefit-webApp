'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Lock, X } from 'lucide-react'
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

type CheckoutOtpModalProps = {
  isOpen: boolean
  orderLabel: string
  orderTotal: number
  onClose: () => void
  onVerified: (idToken: string) => Promise<void>
  onBypass: (phoneDigits: string) => Promise<void>
}

const RESEND_SECONDS = 30
const OTP_ATTEMPT_MS = 8000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('OTP_TIMEOUT')), ms)
    promise.then(
      (value) => {
        window.clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        window.clearTimeout(timer)
        reject(error)
      }
    )
  })
}

function formatRupee(amount: number) {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatPhoneDisplay(digits: string) {
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)} ${digits.slice(5)}`
}

export default function CheckoutOtpModal({
  isOpen,
  orderLabel,
  orderTotal,
  onClose,
  onVerified,
  onBypass,
}: CheckoutOtpModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)
  const recaptchaHostRef = useRef<HTMLDivElement>(null)
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([])

  const clearVerifier = () => {
    try {
      recaptchaVerifierRef.current?.clear()
    } catch {
      // The widget may already be gone.
    }
    recaptchaVerifierRef.current = null
    recaptchaHostRef.current?.replaceChildren()
  }

  const createVerifier = () => {
    clearVerifier()
    const host = recaptchaHostRef.current
    if (!auth || !host) {
      throw new Error('Verification is not ready. Refresh the page and try again.')
    }
    const slot = document.createElement('div')
    host.appendChild(slot)
    const verifier = new RecaptchaVerifier(auth, slot, {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        setError('Verification expired. Please try again.')
      },
    })
    recaptchaVerifierRef.current = verifier
    return verifier
  }

  useEffect(() => {
    if (!isOpen) {
      clearVerifier()
      setStep('phone')
      setPhoneDigits('')
      setOtpDigits(Array(6).fill(''))
      setError(null)
      setLoading(false)
      setConfirmationResult(null)
    }
    // Reset only when the dialog closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || step !== 'otp') return
    setSecondsLeft(RESEND_SECONDS)
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)
    otpInputRefs.current[0]?.focus()
    return () => window.clearInterval(timer)
  }, [isOpen, step, confirmationResult])

  const continueWithoutOtp = async (digits: string) => {
    clearVerifier()
    await onBypass(digits)
  }

  const sendOtp = async () => {
    if (phoneDigits.length !== 10) {
      throw new Error('Enter a valid 10-digit mobile number.')
    }
    const verifier = createVerifier()
    const confirmation = await withTimeout(
      signInWithPhoneNumber(auth, `+91${phoneDigits}`, verifier),
      OTP_ATTEMPT_MS
    )
    setConfirmationResult(confirmation)
    setOtpDigits(Array(6).fill(''))
    setStep('otp')
  }

  const handlePhoneSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await sendOtp()
    } catch (err) {
      if (err instanceof Error && err.message === 'Enter a valid 10-digit mobile number.') {
        setError(err.message)
        clearVerifier()
        return
      }
      console.error('OTP skipped, continuing to checkout:', err)
      try {
        await continueWithoutOtp(phoneDigits)
      } catch (checkoutError) {
        setError(
          checkoutError instanceof Error
            ? checkoutError.message
            : 'Could not start checkout. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (secondsLeft > 0 || loading) return
    setError(null)
    setLoading(true)
    try {
      await sendOtp()
    } catch (err) {
      console.error('OTP resend skipped, continuing to checkout:', err)
      try {
        await continueWithoutOtp(phoneDigits)
      } catch (checkoutError) {
        setError(
          checkoutError instanceof Error
            ? checkoutError.message
            : 'Could not start checkout. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const otp = otpDigits.join('')
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      if (!confirmationResult) {
        throw new Error('OTP expired. Send a new code.')
      }
      const credential = await confirmationResult.confirm(otp)
      const idToken = await credential.user.getIdToken(true)
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Could not save this number. Please try again.')
      }
      await onVerified(idToken)
    } catch (err) {
      const code = (err as { code?: string }).code
      const blocking =
        code === 'auth/internal-error' ||
        code === 'auth/invalid-app-credential' ||
        code === 'auth/captcha-check-failed' ||
        code === 'auth/network-request-failed' ||
        code === 'auth/too-many-requests' ||
        code === 'auth/app-not-authorized'
      if (blocking) {
        console.error('OTP confirm skipped, continuing to checkout:', err)
        try {
          await continueWithoutOtp(phoneDigits)
        } catch (checkoutError) {
          setError(
            checkoutError instanceof Error
              ? checkoutError.message
              : 'Could not start checkout. Please try again.'
          )
        }
      } else {
        setError('That code did not match. Please try again.')
      }
      setLoading(false)
    }
  }

  const updateOtpDigit = (index: number, value: string) => {
    const digitsOnly = value.replace(/\D/g, '')
    if (digitsOnly.length > 1) {
      const next = Array(6).fill('')
      digitsOnly.slice(0, 6).split('').forEach((digit, digitIndex) => {
        next[digitIndex] = digit
      })
      setOtpDigits(next)
      otpInputRefs.current[Math.min(digitsOnly.length, 5)]?.focus()
      return
    }
    const next = [...otpDigits]
    next[index] = digitsOnly
    setOtpDigits(next)
    if (digitsOnly && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleClose = () => {
    if (loading) return
    clearVerifier()
    onClose()
  }

  if (!isOpen) return null

  const timerLabel = `0:${String(secondsLeft).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close verification"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-otp-title"
        className="relative w-full max-w-[420px] rounded-2xl bg-[#FFFcf8] shadow-2xl"
      >
        <div ref={recaptchaHostRef} />
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
          <p className="text-[15px] font-semibold tracking-tight text-neutral-900">fiberise</p>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-5 pt-4">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="mb-4 flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  1
                </span>
                <div>
                  <h2 id="checkout-otp-title" className="text-[15px] font-semibold text-neutral-900">
                    Verify Your Mobile Number
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Enter your 10-digit mobile number to proceed with fast checkout & tracking updates.
                  </p>
                </div>
              </div>

              <label htmlFor="checkout-phone" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-gray-700">
                Mobile number
              </label>
              <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                  +91
                </span>
                <input
                  id="checkout-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={formatPhoneDisplay(phoneDigits)}
                  onChange={(event) => setPhoneDigits(event.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  className="w-full px-3 py-3 text-sm text-neutral-900 outline-none"
                />
              </div>

              <OrderSummary orderLabel={orderLabel} orderTotal={orderTotal} />
              {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || phoneDigits.length !== 10}
                className="mt-4 flex w-full items-center justify-center rounded-lg bg-black py-3.5 text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-4 flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  2
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h2 id="checkout-otp-title" className="text-[15px] font-semibold text-neutral-900">
                        Enter 6-Digit OTP
                      </h2>
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Step 2 of 2
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-medium text-gray-500 underline"
                      onClick={() => {
                        clearVerifier()
                        setError(null)
                        setOtpDigits(Array(6).fill(''))
                        setStep('phone')
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Sent via SMS to +91 {formatPhoneDisplay(phoneDigits)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      otpInputRefs.current[index] = node
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={index === 0 ? 6 : 1}
                    value={digit}
                    aria-label={`OTP digit ${index + 1}`}
                    onChange={(event) => updateOtpDigit(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
                        otpInputRefs.current[index - 1]?.focus()
                      }
                    }}
                    className="h-12 w-full rounded-lg border border-gray-200 bg-white text-center text-lg font-medium text-neutral-900 outline-none focus:border-black"
                  />
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                {secondsLeft > 0 ? (
                  <span>Resend OTP in {timerLabel}</span>
                ) : (
                  <button type="button" onClick={handleResend} className="font-semibold text-neutral-900 underline">
                    Resend OTP
                  </button>
                )}
              </div>

              <OrderSummary orderLabel={orderLabel} orderTotal={orderTotal} summary />
              {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="mt-4 flex w-full items-center justify-center rounded-lg bg-black py-3.5 text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Please wait...' : 'Verify & Continue →'}
              </button>
            </form>
          )}

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Lock className="h-3 w-3" />
            {step === 'phone'
              ? '100% Secure Checkout · Instant SMS Verification'
              : '100% Secure Checkout · 256-Bit SSL Encrypted'}
          </p>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({
  orderLabel,
  orderTotal,
  summary = false,
}: {
  orderLabel: string
  orderTotal: number
  summary?: boolean
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-[#F4F1EA] px-3 py-2.5">
      <p className="min-w-0 truncate text-xs text-gray-600">
        <span className="font-medium text-gray-500">{summary ? 'Order Summary:' : 'Order Total:'}</span>{' '}
        <span className="font-semibold text-neutral-800">{orderLabel}</span>
      </p>
      <span className="shrink-0 text-sm font-semibold text-[#1B7A43]">{formatRupee(orderTotal)}</span>
    </div>
  )
}
