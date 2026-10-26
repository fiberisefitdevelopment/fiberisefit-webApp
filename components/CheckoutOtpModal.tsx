'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Lock, Smartphone, X } from 'lucide-react'
// SMS OTP is paused. Buy Now uses WhatsApp only.
// import { MessageCircle } from 'lucide-react'
// import {
//   ConfirmationResult,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from 'firebase/auth'
// import { auth } from '@/lib/firebase/config'
import { requestWhatsAppOtp, signInWithWhatsAppOtp } from '@/lib/whatsapp-login'

type CheckoutOtpModalProps = {
  isOpen: boolean
  orderLabel: string
  orderTotal: number
  onClose: () => void
  onVerified: (idToken: string) => Promise<void>
  onBypass: (phoneDigits: string) => Promise<void>
}

// const RESEND_SECONDS = 30
// const OTP_ATTEMPT_MS = 8000
//
// function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
//   return new Promise((resolve, reject) => {
//     const timer = window.setTimeout(() => reject(new Error('OTP_TIMEOUT')), ms)
//     promise.then(
//       (value) => {
//         window.clearTimeout(timer)
//         resolve(value)
//       },
//       (error) => {
//         window.clearTimeout(timer)
//         reject(error)
//       }
//     )
//   })
// }

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
}: CheckoutOtpModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [whatsappNote, setWhatsappNote] = useState<string | null>(null)
  // const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  // const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms')
  // const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)
  // const recaptchaHostRef = useRef<HTMLDivElement>(null)
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([])

  // const clearVerifier = () => {
  //   try {
  //     recaptchaVerifierRef.current?.clear()
  //   } catch {
  //     // The widget may already be gone.
  //   }
  //   recaptchaVerifierRef.current = null
  //   recaptchaHostRef.current?.replaceChildren()
  // }
  //
  // const createVerifier = () => {
  //   clearVerifier()
  //   const host = recaptchaHostRef.current
  //   if (!auth || !host) {
  //     throw new Error('Verification is not ready. Refresh the page and try again.')
  //   }
  //   const slot = document.createElement('div')
  //   host.appendChild(slot)
  //   const verifier = new RecaptchaVerifier(auth, slot, {
  //     size: 'invisible',
  //     callback: () => {},
  //     'expired-callback': () => {
  //       setError('Verification expired. Please try again.')
  //     },
  //   })
  //   recaptchaVerifierRef.current = verifier
  //   return verifier
  // }

  useEffect(() => {
    if (!isOpen) {
      setStep('phone')
      setPhoneDigits('')
      setOtpDigits(Array(6).fill(''))
      setError(null)
      setLoading(false)
      setWhatsappNote(null)
    }
    // Reset only when the dialog closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || step !== 'otp') return
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)
    otpInputRefs.current[0]?.focus()
    return () => window.clearInterval(timer)
  }, [isOpen, step])

  // const continueWithoutOtp = async (digits: string) => {
  //   clearVerifier()
  //   await onBypass(digits)
  // }
  //
  // const sendOtp = async () => {
  //   if (phoneDigits.length !== 10) {
  //     throw new Error('Enter a valid 10-digit mobile number.')
  //   }
  //   setChannel('sms')
  //   const verifier = createVerifier()
  //   const confirmation = await withTimeout(
  //     signInWithPhoneNumber(auth, `+91${phoneDigits}`, verifier),
  //     OTP_ATTEMPT_MS
  //   )
  //   setConfirmationResult(confirmation)
  //   setOtpDigits(Array(6).fill(''))
  //   setStep('otp')
  // }

  const sendWhatsApp = async () => {
    if (phoneDigits.length !== 10) {
      throw new Error('Enter a valid 10-digit mobile number.')
    }
    const result = await requestWhatsAppOtp(phoneDigits)
    setSecondsLeft(result.expiresIn)
    setWhatsappNote(
      result.alreadySent
        ? 'A code is already on WhatsApp. Enter that code. A new one is not sent until it expires.'
        : null
    )
    setOtpDigits(Array(6).fill(''))
    setStep('otp')
  }

  // const handleSms = async () => {
  //   setError(null)
  //   setLoading(true)
  //   try {
  //     await sendOtp()
  //   } catch (err) {
  //     if (err instanceof Error && err.message === 'Enter a valid 10-digit mobile number.') {
  //       setError(err.message)
  //       clearVerifier()
  //       return
  //     }
  //     console.error('OTP skipped, continuing to checkout:', err)
  //     try {
  //       await continueWithoutOtp(phoneDigits)
  //     } catch (checkoutError) {
  //       setError(
  //         checkoutError instanceof Error
  //           ? checkoutError.message
  //           : 'Could not start checkout. Please try again.'
  //       )
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleWhatsApp = async () => {
    setError(null)
    setLoading(true)
    try {
      await sendWhatsApp()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the WhatsApp code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (secondsLeft > 0 || loading) return
    setError(null)
    setLoading(true)
    try {
      await sendWhatsApp()
      // SMS resend is paused.
      // await sendOtp()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the WhatsApp code.')
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
      const idToken = await signInWithWhatsAppOtp(phoneDigits, otp)
      // SMS confirm is paused.
      // const idToken = channel === 'whatsapp'
      //   ? await signInWithWhatsAppOtp(phoneDigits, otp)
      //   : await (async () => {
      //       if (!confirmationResult) {
      //         throw new Error('OTP expired. Send a new code.')
      //       }
      //       const credential = await confirmationResult.confirm(otp)
      //       return credential.user.getIdToken(true)
      //     })()
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
      setError(err instanceof Error ? err.message : 'That code did not match. Please try again.')
      setLoading(false)
      // SMS failure used to skip OTP and continue to checkout.
      // const code = (err as { code?: string }).code
      // const blocking =
      //   code === 'auth/internal-error' ||
      //   code === 'auth/invalid-app-credential' ||
      //   code === 'auth/captcha-check-failed' ||
      //   code === 'auth/network-request-failed' ||
      //   code === 'auth/too-many-requests' ||
      //   code === 'auth/app-not-authorized'
      // if (blocking) {
      //   await continueWithoutOtp(phoneDigits)
      // }
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
    onClose()
  }

  if (!isOpen) return null

  const timerLabel = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`

  const ready = phoneDigits.length === 10 && !loading

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
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
        className="relative max-h-[100dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-h-[92dvh] sm:max-w-[440px] sm:rounded-3xl md:max-w-[480px]"
      >
        {/* <div ref={recaptchaHostRef} /> */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 sm:px-6">
          <p className="font-serif text-[22px] leading-none tracking-tight text-neutral-900">fiberise</p>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          {step === 'phone' ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                void handleWhatsApp()
              }}
            >
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Smartphone className="h-5 w-5" />
                </span>
                <div>
                  <h2 id="checkout-otp-title" className="text-lg font-bold tracking-tight text-neutral-950 sm:text-xl">
                    Verify Your Mobile Number
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-500 sm:text-sm">
                    Enter your 10-digit mobile number to receive an OTP for fast checkout & order tracking updates.
                  </p>
                </div>
              </div>

              <label htmlFor="checkout-phone" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                Mobile number
              </label>
              <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
                <span className="flex items-center gap-1 border-r border-gray-200 bg-white px-3 text-sm font-medium text-neutral-800">
                  +91
                  <span className="text-[10px] text-gray-400" aria-hidden>
                    ▾
                  </span>
                </span>
                <input
                  id="checkout-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={formatPhoneDisplay(phoneDigits)}
                  onChange={(event) => setPhoneDigits(event.target.value.replace(/\D/g, '').slice(-10))}
                  placeholder="98765 43210"
                  className="w-full px-3 py-3.5 text-base text-neutral-900 outline-none sm:text-[15px]"
                />
              </div>

              <OrderSummary orderLabel={orderLabel} orderTotal={orderTotal} />
              {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={!ready}
                className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-[#22C55E] px-4 py-3 text-left text-white shadow-sm transition-colors hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4ADE80]">
                  <WhatsAppIcon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold uppercase tracking-wide sm:text-sm">
                    {loading ? 'Sending...' : 'Send OTP on WhatsApp'}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-white/90">
                    Recommended · Faster · Instant
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>

              {/* SMS OTP button is paused.
              <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-[11px] font-medium tracking-wide text-gray-400">OR</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>

              <button
                type="button"
                disabled={!ready}
                onClick={() => void handleSms()}
                className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold uppercase tracking-wide text-neutral-900 sm:text-sm">
                    {loading && channel === 'sms' ? 'Sending...' : 'Send OTP via SMS'}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-gray-500">
                    Try this if WhatsApp doesn&apos;t work
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
              </button>
              */}
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Smartphone className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 id="checkout-otp-title" className="text-lg font-bold tracking-tight text-neutral-950 sm:text-xl">
                      Enter 6-digit OTP
                    </h2>
                    <button
                      type="button"
                      className="shrink-0 text-xs font-semibold text-emerald-700 underline"
                      onClick={() => {
                        setError(null)
                        setOtpDigits(Array(6).fill(''))
                        setStep('phone')
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-500 sm:text-sm">
                    {whatsappNote ||
                      `Sent via WhatsApp to +91 ${formatPhoneDisplay(phoneDigits)}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
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
                    className="h-12 rounded-xl border border-gray-200 bg-white text-center text-lg font-semibold text-neutral-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 sm:h-14 sm:text-xl"
                  />
                ))}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                {secondsLeft > 0 ? (
                  <span>
                    {`This code stays valid for ${timerLabel}. A new WhatsApp code can be sent after that.`}
                  </span>
                ) : (
                  <button type="button" onClick={handleResend} className="font-semibold text-emerald-700 underline">
                    Resend OTP
                  </button>
                )}
              </div>

              <OrderSummary orderLabel={orderLabel} orderTotal={orderTotal} />
              {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#22C55E] py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Please wait...' : 'Verify & Continue'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400 sm:text-xs">
            <Lock className="h-3.5 w-3.5" />
            100% Secure Checkout · Instant OTP Verification
          </p>
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#fff"
        d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.89-4.43 9.89-9.89C21.94 6.43 17.5 2 12.04 2Zm5.8 14.01c-.24.68-1.4 1.29-1.93 1.37-.49.07-1.1.1-1.77-.11-.41-.13-.93-.3-1.61-.59-2.83-1.22-4.67-4.08-4.81-4.27-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.35.24-.25.64-.36.85-.36h.61c.2 0 .46-.04.72.55.27.61.91 2.11.99 2.26.08.16.13.34.03.54-.1.2-.15.33-.3.51-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.12.64-.07.18-.2.73-.85.93-1.14.2-.3.39-.24.66-.14.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.12.07.7-.17 1.38Z"
      />
    </svg>
  )
}

function OrderSummary({
  orderLabel,
  orderTotal,
}: {
  orderLabel: string
  orderTotal: number
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#F7F6F3] px-3.5 py-3">
      <p className="min-w-0 truncate text-[13px] text-gray-500 sm:text-sm">
        Order Total: <span className="font-semibold text-neutral-900">{orderLabel}</span>
      </p>
      <span className="shrink-0 text-sm font-bold text-[#16A34A] sm:text-base">{formatRupee(orderTotal)}</span>
    </div>
  )
}
