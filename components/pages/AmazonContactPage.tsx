'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, FlaskConical, Headphones, Mail, MapPin, Package, Phone, User } from 'lucide-react'
import { requestWhatsAppOtp } from '@/lib/whatsapp-login'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  pincode: '',
  city: '',
  state: '',
}

export default function AmazonContactPage() {
  const [formData, setFormData] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')
  const [pinLookup, setPinLookup] = useState<'idle' | 'loading' | 'error'>('idle')
  const pinRequestRef = useRef(0)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [otpBusy, setOtpBusy] = useState<'send' | 'verify' | null>(null)
  const [otpMessage, setOtpMessage] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = window.setTimeout(() => setResendIn((seconds) => seconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [resendIn])

  const resetPhoneVerification = () => {
    setPhoneVerified(false)
    setOtp('')
    setOtpSent(false)
    setOtpMessage('')
    setOtpError('')
    setResendIn(0)
    setOtpBusy(null)
  }

  const sendOtp = async () => {
    if (formData.phone.length !== 10 || otpBusy || phoneVerified) return
    setOtpBusy('send')
    setOtpError('')
    try {
      const result = await requestWhatsAppOtp(formData.phone)
      setOtpSent(true)
      setResendIn(result.expiresIn || 300)
      setOtpMessage(
        result.alreadySent
          ? 'A code is already on WhatsApp. Enter that code.'
          : `Code sent by WhatsApp to +91 ${formData.phone}`
      )
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : 'Could not send the WhatsApp code.')
    } finally {
      setOtpBusy(null)
    }
  }

  const verifyOtp = async () => {
    if (otp.replace(/\D/g, '').length !== 6 || otpBusy) return
    setOtpBusy('verify')
    setOtpError('')
    try {
      const response = await fetch('/api/otp/whatsapp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp }),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof body.error === 'string' ? body.error : 'That code did not match.')
      }
      setPhoneVerified(true)
      setOtpSent(false)
      setOtp('')
      setOtpMessage('Phone number verified.')
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : 'Could not verify the code.')
    } finally {
      setOtpBusy(null)
    }
  }

  const setField = (key: keyof typeof emptyForm, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  const handlePincodeChange = (value: string) => {
    const zip = value.replace(/\D/g, '').slice(0, 6)
    setFormData((current) => ({ ...current, pincode: zip, city: '', state: '' }))
    if (zip.length !== 6) {
      setPinLookup('idle')
      return
    }

    const requestId = pinRequestRef.current + 1
    pinRequestRef.current = requestId
    setPinLookup('loading')
    void fetch(`/api/pincode/${zip}`)
      .then(async (response) => {
        if (pinRequestRef.current !== requestId) return
        if (!response.ok) {
          setPinLookup('error')
          return
        }
        const data = (await response.json()) as { city?: string; state?: string }
        setFormData((current) =>
          current.pincode === zip
            ? { ...current, city: data.city || '', state: data.state || '' }
            : current
        )
        setPinLookup('idle')
      })
      .catch(() => {
        if (pinRequestRef.current === requestId) setPinLookup('error')
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return
    if (!phoneVerified) {
      setStatus('error')
      setFeedback('Please verify your phone number with the WhatsApp OTP first.')
      return
    }
    setStatus('loading')
    setFeedback('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'amazon-qr',
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state,
          phoneVerified: true,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setFeedback(data.error || 'Something went wrong. Please try again.')
        return
      }
      setStatus('success')
      setFeedback(data.message || 'Thank you. We will get back to you within 24 hours.')
      setFormData(emptyForm)
      setPinLookup('idle')
      resetPhoneVerification()
    } catch {
      setStatus('error')
      setFeedback('Something went wrong. Please try again.')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[#e6e1d8] bg-[#faf9f6] px-4 py-3 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-transparent'

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
          <div>
            <h1
              className="text-4xl md:text-[3.4rem] leading-[1.1] text-[#1a1a1a] font-medium mb-5"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              Unlock Your FREE FYBER Guide
            </h1>
            <p className="text-[#5c5c5c] text-base md:text-lg leading-relaxed max-w-xl mb-3">
              Discover how to use FYBER, build the right daily routine, and get the most out of
              every sachet.
            </p>
            <p className="text-[#5c5c5c] text-base md:text-lg leading-relaxed max-w-xl mb-8">
              Fill in your details to access your FREE guide.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { icon: Headphones, label: 'Product Support' },
                { icon: Package, label: 'Order Help' },
                { icon: FlaskConical, label: 'Expert Guidance' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/80 border border-[#ece7de] px-2 py-4 text-center"
                >
                  <item.icon className="mx-auto h-6 w-6 text-[#1a1a1a] mb-2" strokeWidth={1.6} />
                  <p className="text-[11px] md:text-xs text-[#5c5c5c] leading-snug">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[1.6rem] p-6 md:p-8 shadow-sm border border-[#eeeae3]">
              <h2 className="text-xl font-medium mb-1">Your details</h2>
              <p className="text-sm text-[#6b6b6b] mb-6">
                Fill in your details to access your FREE guide.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium text-[#3f3f3f] mb-1.5">Full Name *</span>
                  <span className="relative block">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setField('name', e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </span>
                </label>

                <div>
                  <span className="block text-sm font-medium text-[#3f3f3f] mb-1.5">Phone Number *</span>
                  <div className="flex h-12 overflow-hidden rounded-xl border border-[#e6e1d8] bg-[#faf9f6] focus-within:ring-2 focus-within:ring-black/80 focus-within:border-transparent">
                    <span className="inline-flex shrink-0 items-center border-r border-[#e6e1d8] bg-[#f3eee6] px-3 text-sm text-[#5c5c5c]">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="Enter your mobile number"
                      value={formData.phone}
                      onChange={(e) => {
                        setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                        resetPhoneVerification()
                      }}
                      className="min-w-0 flex-1 bg-transparent px-4 text-[#1a1a1a] placeholder:text-gray-400 outline-none"
                    />
                  </div>
                  {phoneVerified ? (
                    <div className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl border border-[#cfe3d6] bg-[#eaf6ee] text-sm font-semibold text-[#1b4332]">
                      <Check className="h-4 w-4" />
                      WhatsApp number verified
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void sendOtp()}
                      disabled={formData.phone.length !== 10 || otpBusy !== null || (otpSent && resendIn > 0)}
                      className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white hover:bg-[#1DA851] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <WhatsAppIcon />
                      {otpBusy === 'send' ? 'Sending OTP…' : otpSent ? 'Resend WhatsApp OTP' : 'Send OTP on WhatsApp'}
                    </button>
                  )}
                  {otpSent && !phoneVerified && (
                    <div className="mt-3 space-y-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="6-digit WhatsApp code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={`${inputClass} h-12 text-center tracking-[0.35em]`}
                      />
                      <button
                        type="button"
                        onClick={() => void verifyOtp()}
                        disabled={otp.length !== 6 || otpBusy !== null}
                        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#25D366] text-sm font-semibold text-white hover:bg-[#1DA851] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {otpBusy === 'verify' ? 'Verifying…' : 'Verify OTP'}
                      </button>
                    </div>
                  )}
                  {(otpMessage || otpError) && (
                    <p className={`mt-1.5 text-xs ${otpError ? 'text-red-600' : 'text-[#2b5844]'}`}>
                      {otpError || otpMessage}
                    </p>
                  )}
                  {otpSent && !phoneVerified && resendIn > 0 && (
                    <p className="mt-1 text-xs text-[#6b6b6b]">
                      You can resend after {Math.floor(resendIn / 60)}:
                      {String(resendIn % 60).padStart(2, '0')}.
                    </p>
                  )}
                </div>

                <label className="block">
                  <span className="block text-sm font-medium text-[#3f3f3f] mb-1.5">Email Address *</span>
                  <span className="relative block">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setField('email', e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-[#3f3f3f] mb-1.5">Pincode *</span>
                  <span className="relative block">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={6}
                      placeholder="6-digit pincode"
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className={`${inputClass} pl-10`}
                    />
                  </span>
                  <span className="mt-1.5 block text-xs text-[#6b6b6b]">
                    {pinLookup === 'loading'
                      ? 'Finding city and state…'
                      : pinLookup === 'error'
                        ? 'No city found for this pincode. Please check and try again.'
                        : formData.city && formData.state
                          ? 'City and state filled from this pincode — confirm they look right.'
                          : 'Enter a 6-digit pincode to fill city and state.'}
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-medium text-[#3f3f3f] mb-1.5">City *</span>
                    <input
                      type="text"
                      required
                      readOnly
                      tabIndex={-1}
                      autoComplete="address-level2"
                      placeholder=""
                      value={formData.city}
                      className={`${inputClass} bg-[#f3eee6] text-[#5c5c5c] cursor-default`}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium text-[#3f3f3f] mb-1.5">State *</span>
                    <input
                      type="text"
                      required
                      readOnly
                      tabIndex={-1}
                      autoComplete="address-level1"
                      placeholder=""
                      value={formData.state}
                      className={`${inputClass} bg-[#f3eee6] text-[#5c5c5c] cursor-default`}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={
                    status === 'loading' ||
                    pinLookup === 'loading' ||
                    !formData.city ||
                    !formData.state ||
                    !phoneVerified
                  }
                  className={`w-full rounded-xl py-3.5 text-sm font-semibold uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed ${
                    phoneVerified
                      ? 'bg-[#2b5844] text-white hover:bg-[#244a39] disabled:opacity-60'
                      : 'bg-[#cfd6d2] text-white/80 pointer-events-none'
                  }`}
                >
                  {status === 'loading' ? 'Sending request…' : 'Request Consultation'}
                </button>
                {!phoneVerified && (
                  <p className="text-center text-xs text-[#6b6b6b]">
                    Verify your WhatsApp number to continue.
                  </p>
                )}
              </form>

              {feedback && (
                <p
                  className={`mt-4 text-sm ${status === 'success' ? 'text-green-700' : 'text-red-600'}`}
                >
                  {feedback}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:pt-16">
            <div className="relative overflow-hidden rounded-[1.6rem] bg-[#f3eee4] border border-[#e8e2d6] p-7 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7d63] mb-3">
                Free consultation
              </p>
              <h2
                className="text-2xl md:text-3xl font-medium text-[#1a1a1a] mb-3"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                Get Expert Guidance on FYBER
              </h2>
              <p className="text-sm text-[#5c5c5c] leading-relaxed">
                Scan, connect and get a complimentary consultation tailored to your wellness goals.
              </p>
            </div>

            <div className="rounded-[1.6rem] bg-white border border-[#eeeae3] p-7 md:p-8">
              <h3 className="text-lg font-medium mb-2">Other Ways to Reach Us</h3>
              <p className="text-sm text-[#6b6b6b] mb-6">
                You can also contact us using the details below:
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Telephone No</p>
                    <a href="tel:7070705026" className="text-sm text-[#5c5c5c]">
                      7070705026
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">E-Mail ID</p>
                    <a href="mailto:support@fiberisefit.com" className="text-sm text-[#5c5c5c]">
                      support@fiberisefit.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
