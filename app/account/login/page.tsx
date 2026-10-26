'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
// SMS OTP is paused. Login uses WhatsApp only.
// import {
//   signInWithPhoneNumber,
//   RecaptchaVerifier,
//   ConfirmationResult,
// } from 'firebase/auth'
// import { auth } from '@/lib/firebase/config'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { requestWhatsAppOtp, signInWithWhatsAppOtp } from '@/lib/whatsapp-login'

export default function AccountLoginPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState<'whatsapp' | 'verify' | null>(null)
  const [error, setError] = useState<string | null>(null)
  // const [confirmationResult, setConfirmationResult] =
  //   useState<ConfirmationResult | null>(null)
  const [channel, setChannel] = useState<'whatsapp'>('whatsapp')
  const [resendIn, setResendIn] = useState(0)
  const [otpNote, setOtpNote] = useState<string | null>(null)
  // const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  useEffect(() => {
    if (step !== 'otp' || channel !== 'whatsapp' || resendIn <= 0) return
    const timer = window.setInterval(() => {
      setResendIn((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [step, channel, resendIn])

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/account/orders')
    }
  }, [authLoading, isAuthenticated, router])

  // SMS OTP recaptcha setup is paused.
  // useEffect(() => {
  //   if (authLoading || isAuthenticated) return
  //   if (!auth) return
  //   if (!recaptchaVerifierRef.current) {
  //     try {
  //       recaptchaVerifierRef.current = new RecaptchaVerifier(
  //         auth,
  //         'recaptcha-container-login',
  //         {
  //           size: 'invisible',
  //           callback: () => { },
  //           'expired-callback': () => {
  //             setError('Verification expired. Please try again.')
  //           },
  //         }
  //       )
  //     } catch (err: any) {
  //       setError(err.message || 'Failed to initialize. Refresh and try again.')
  //     }
  //   }
  //   return () => {
  //     try {
  //       recaptchaVerifierRef.current?.clear()
  //     } catch { }
  //     recaptchaVerifierRef.current = null
  //   }
  // }, [authLoading, isAuthenticated])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneDigits(e.target.value.replace(/\D/g, '').slice(-10))
  }

  // const handlePhoneSubmit = async () => {
  //   setError(null)
  //   setLoading('sms')
  //   try {
  //     if (!recaptchaVerifierRef.current) {
  //       throw new Error('Verification not ready. Please refresh the page.')
  //     }
  //     if (phoneDigits.length !== 10) {
  //       throw new Error('Please enter a valid 10-digit mobile number.')
  //     }
  //     const formattedPhone = '+91' + phoneDigits
  //     const confirmation = await signInWithPhoneNumber(
  //       auth,
  //       formattedPhone,
  //       recaptchaVerifierRef.current
  //     )
  //     setConfirmationResult(confirmation)
  //     setChannel('sms')
  //     setStep('otp')
  //   } catch (err: any) {
  //     if (err.code === 'auth/invalid-phone-number') {
  //       setError('Invalid phone number. Enter a valid 10-digit Indian number.')
  //     } else if (err.code === 'auth/too-many-requests') {
  //       setError('Too many attempts. Please try again later.')
  //     } else {
  //       setError(err.message || 'Failed to send OTP. Please try again.')
  //     }
  //   } finally {
  //     setLoading(null)
  //   }
  // }

  const handleWhatsAppSubmit = async () => {
    setError(null)
    setLoading('whatsapp')
    try {
      if (phoneDigits.length !== 10) {
        throw new Error('Please enter a valid 10-digit mobile number.')
      }
      const result = await requestWhatsAppOtp(phoneDigits)
      setChannel('whatsapp')
      setResendIn(result.expiresIn)
      setOtpNote(
        result.alreadySent
          ? 'A code is already on WhatsApp. Enter that code. A new one is not sent until it expires.'
          : null
      )
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the WhatsApp code.')
    } finally {
      setLoading(null)
    }
  }

  const finishLogin = async (idToken: string) => {
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
    router.replace('/account/orders')
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading('verify')
    try {
      const idToken = await signInWithWhatsAppOtp(phoneDigits, otp)
      // SMS confirm is paused.
      // const idToken = channel === 'whatsapp'
      //   ? await signInWithWhatsAppOtp(phoneDigits, otp)
      //   : await (async () => {
      //       if (!confirmationResult) {
      //         throw new Error('Session expired. Please start again.')
      //       }
      //       const userCredential = await confirmationResult.confirm(otp)
      //       return userCredential.user.getIdToken(true)
      //     })()
      await finishLogin(idToken)
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please check and try again.')
    } finally {
      setLoading(null)
    }
  }

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F3EFE8] pt-28 pb-16 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const busy = loading !== null

  return (
    <div className="bg-[#F3EFE8] px-3 pb-4 pt-[5.5rem] sm:px-5 sm:pb-5 sm:pt-24 lg:flex lg:h-dvh lg:flex-col lg:overflow-hidden lg:px-6 lg:pb-4 lg:pt-[5.75rem]">
      {/* <div id="recaptcha-container-login" className="hidden" /> */}

      <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(40,32,20,0.08)] sm:rounded-[28px] lg:min-h-0 lg:flex-1 lg:flex-row">
        <div className="relative h-[min(38vh,320px)] w-full shrink-0 bg-[#1c3a2e] sm:h-[min(40vh,360px)] lg:h-auto lg:max-w-[42%] lg:w-auto lg:min-w-[240px] lg:self-stretch lg:aspect-[682/1024]">
          <Image
            src="/login/smarter-wellness.webp"
            alt="Smarter wellness made simple with Fiberise"
            fill
            priority
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-contain object-center lg:object-cover"
          />
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col px-6 py-6 sm:px-12 lg:px-14 lg:py-8">
          <Link
            href="/"
            className="inline-flex w-fit shrink-0 items-center gap-2 text-sm text-[#8A8680] hover:text-[#1a1a1a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>

          <div className="relative mt-6 h-8 w-32 shrink-0 sm:mt-7 sm:h-9 sm:w-36">
            <Image
              src="/fiberisefit dark logo.png"
              alt="fiberise"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <div className="flex flex-1 flex-col justify-start pt-8">
          <div className="w-full max-w-[440px]">

          <h1 className="mb-2 font-serif text-[1.85rem] font-semibold leading-none text-[#1C1C1C] sm:text-[2.15rem]">
            Let&apos;s Begin
          </h1>
          <p className="mb-8 text-sm text-[#8A8680] sm:text-[15px]">
            Your journey to better shape starts here
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                void handleWhatsAppSubmit()
              }}
            >
              <label htmlFor="login-phone" className="mb-2 block text-sm font-medium text-[#2A2A2A]">
                Mobile number
              </label>
              <div className="relative mb-8">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6B6762]">
                  +91
                </span>
                <input
                  id="login-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phoneDigits}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit number"
                  className="w-full rounded-xl border border-[#E4E0D8] bg-white py-3.5 pl-14 pr-4 text-[#1C1C1C] placeholder:text-[#B0AAA2] transition-colors [-webkit-text-fill-color:#1C1C1C] focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#ffffff]"
                  maxLength={10}
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-semibold text-white transition-colors hover:bg-[#1DA851] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <WhatsAppIcon />
                {loading === 'whatsapp' ? 'Sending OTP...' : 'Continue with WhatsApp'}
                {loading !== 'whatsapp' && <span aria-hidden>›</span>}
              </button>

              {/* SMS OTP button is paused.
              <div className="my-4 flex items-center gap-4 text-[11px] tracking-[0.18em] text-[#B0AAA2] sm:my-5">
                <span className="h-px flex-1 bg-[#E8E4DC]" />
                OR
                <span className="h-px flex-1 bg-[#E8E4DC]" />
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={() => void handlePhoneSubmit()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4E0D8] bg-[#F7F5F2] py-3.5 font-semibold text-[#2A2A2A] transition-colors hover:bg-[#F1EEE9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === 'sms' ? 'Sending OTP...' : 'Send OTP via SMS'}
                {loading !== 'sms' && <span aria-hidden>→</span>}
              </button>
              */}
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <p className="text-sm text-[#6B6762]">
                {otpNote || `Code sent by WhatsApp to +91 ${phoneDigits}`}
              </p>
              {channel === 'whatsapp' && (
                <p className="text-sm text-[#8A8680]">
                  {resendIn > 0
                    ? `This code stays valid for ${Math.floor(resendIn / 60)}:${String(resendIn % 60).padStart(2, '0')}. A new WhatsApp code can be sent after that.`
                    : null}
                  {resendIn === 0 && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleWhatsAppSubmit()}
                      className="font-semibold text-[#1B4332] underline"
                    >
                      Resend WhatsApp code
                    </button>
                  )}
                </p>
              )}
              <div>
                <label htmlFor="login-otp" className="mb-2 block text-sm font-medium text-[#2A2A2A]">
                  Enter OTP
                </label>
                <input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code"
                  maxLength={6}
                  className="w-full rounded-xl border border-[#E4E0D8] px-4 py-3.5 text-center text-xl tracking-[0.4em] transition-colors focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-[#25D366] py-3.5 font-semibold text-white transition-colors hover:bg-[#1DA851] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === 'verify' ? 'Verifying...' : 'Verify & login'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setOtp('')
                  setError(null)
                  setChannel('whatsapp')
                }}
                className="w-full py-2 text-sm text-[#8A8680] hover:text-[#1a1a1a]"
              >
                Use a different number
              </button>
            </form>
          )}

          </div>
          </div>

          <p className="mt-auto max-w-[440px] pt-8 text-sm leading-relaxed text-[#8A8680]">
            By continuing, you agree to our{' '}
            <Link href="/policies/terms" className="text-[#1B4332] underline underline-offset-2">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/policies/privacy-policy" className="text-[#1B4332] underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.89-4.43 9.89-9.89C21.94 6.43 17.5 2 12.04 2Zm5.8 14.01c-.24.68-1.4 1.29-1.93 1.37-.49.07-1.1.1-1.77-.11-.41-.13-.93-.3-1.61-.59-2.83-1.22-4.67-4.08-4.81-4.27-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.35.24-.25.64-.36.85-.36h.61c.2 0 .46-.04.72.55.27.61.91 2.11.99 2.26.08.16.13.34.03.54-.1.2-.15.33-.3.51-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.12.64-.07.18-.2.73-.85.93-1.14.2-.3.39-.24.66-.14.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.12.07.7-.17 1.38Z"
      />
    </svg>
  )
}
