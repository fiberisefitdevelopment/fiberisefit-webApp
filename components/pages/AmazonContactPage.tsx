'use client'

import { useRef, useState } from 'react'
import { FlaskConical, Headphones, Mail, MapPin, Package, Phone, User } from 'lucide-react'

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

                <label className="block">
                  <span className="block text-sm font-medium text-[#3f3f3f] mb-1.5">Phone Number *</span>
                  <span className="flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-[#e6e1d8] bg-[#f3eee6] px-3 text-sm text-[#5c5c5c]">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="Enter your mobile number"
                      value={formData.phone}
                      onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`${inputClass} rounded-l-none`}
                    />
                  </span>
                </label>

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
                  disabled={status === 'loading' || pinLookup === 'loading' || !formData.city || !formData.state}
                  className="w-full rounded-xl bg-[#1a1a1a] text-white py-3.5 text-sm font-semibold uppercase tracking-[0.16em] hover:bg-black transition-colors disabled:opacity-60"
                >
                  {status === 'loading' ? 'Sending request…' : 'Request Consultation'}
                </button>
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
