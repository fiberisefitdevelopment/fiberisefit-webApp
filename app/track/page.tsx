'use client'

import { useState } from 'react'

interface TrackingActivity {
  date: string
  status: string
  location: string
}

interface ShipmentTracking {
  awb: string
  status: string
  courier: string
  origin: string
  destination: string
  estimatedDelivery: string
  trackingUrl: string
  activities: TrackingActivity[]
}

function formatStatus(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatTrackingDate(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.toUpperCase() === 'NA') return ''
  const midnight = /00:00:00/.test(trimmed)
  const parsed = new Date(trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) return trimmed
  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(midnight ? {} : { hour: 'numeric', minute: '2-digit' }),
  })
}

function displayLocation(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.toUpperCase() === 'NA') return ''
  return trimmed
}

export default function TrackOrderPage() {
  const [awb, setAwb] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [shipment, setShipment] = useState<ShipmentTracking | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = awb.trim()
    if (!/^[A-Za-z0-9-]{6,30}$/.test(value)) {
      setShipment(null)
      setStatus('error')
      setMessage('Enter a valid AWB number (letters and numbers, at least 6 characters).')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ awb: value }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setShipment(null)
        setStatus('error')
        setMessage(typeof data.error === 'string' ? data.error : 'We could not track that shipment.')
        return
      }

      setShipment(data.shipment as ShipmentTracking)
      setStatus('success')
    } catch {
      setShipment(null)
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  const route = shipment
    ? [shipment.origin, shipment.destination].filter(Boolean).join(' → ')
    : ''
  const facts = shipment
    ? [
        { label: 'AWB', value: shipment.awb },
        { label: 'Courier', value: shipment.courier },
        { label: 'Route', value: route },
        { label: 'Estimated delivery', value: formatTrackingDate(shipment.estimatedDelivery) || shipment.estimatedDelivery },
      ].filter((fact) => fact.value)
    : []
  const journey = shipment ? [...shipment.activities].reverse() : []

  return (
    <div className="min-h-screen bg-[#f4f5f7] pt-28 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="mx-auto max-w-lg rounded-2xl bg-white px-6 py-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:px-8">
          <div className="text-center">
            <h1
              className="text-3xl font-bold text-black"
              style={{ fontFamily: 'QuadratGrotesk, sans-serif' }}
            >
              Track Shipment
            </h1>
            <p className="mt-2 text-sm font-semibold tracking-wide text-black">AWB NUMBER</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label htmlFor="awb" className="sr-only">
              AWB number
            </label>
            <input
              id="awb"
              name="awb"
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              value={awb}
              onChange={(event) => setAwb(event.target.value)}
              placeholder="Enter your AWB number"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3.5 text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-black py-3.5 text-base font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'loading' ? 'Tracking…' : 'Track'}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-800" role="alert">
              {message}
            </p>
          )}
        </section>

        {shipment && status === 'success' && (
          <section className="mx-auto mt-5 max-w-lg rounded-2xl bg-white px-6 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:px-8 lg:max-w-6xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Current status
                  </p>
                  <p className="text-2xl font-bold text-black md:text-3xl">{formatStatus(shipment.status)}</p>
                </div>
                {shipment.trackingUrl.startsWith('https://') && (
                  <a
                    href={shipment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold uppercase tracking-wider underline"
                  >
                    Open full tracking
                  </a>
                )}
              </div>

              <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {facts.map((fact) => (
                  <div key={fact.label} className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{fact.label}</dt>
                    <dd className="mt-1 font-medium text-black break-words">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              {shipment.activities.length > 0 && (
                <>
                  <ol className="mt-8 space-y-4 lg:hidden">
                    {shipment.activities.map((activity, index) => (
                      <li key={`${activity.date}-${activity.status}-${index}`} className="flex gap-4">
                        <span
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                            index === 0 ? 'bg-black' : 'bg-gray-300'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-black">{formatStatus(activity.status)}</p>
                          <p className="text-sm text-gray-500">
                            {[displayLocation(activity.location), formatTrackingDate(activity.date) || activity.date]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <ol className="mt-10 hidden lg:flex lg:gap-0 lg:overflow-x-auto lg:pb-2">
                    {journey.map((activity, index) => {
                      const isLatest = index === journey.length - 1
                      const location = displayLocation(activity.location)
                      const when = formatTrackingDate(activity.date) || activity.date
                      return (
                        <li
                          key={`${activity.date}-${activity.status}-${index}`}
                          className="relative min-w-[11rem] flex-1 pr-6 pt-8"
                        >
                          {index < journey.length - 1 && (
                            <span className="absolute left-3 right-0 top-[7px] h-px bg-gray-300" />
                          )}
                          <span
                            className={`absolute left-0 top-1 h-3 w-3 rounded-full ${
                              isLatest ? 'bg-black' : 'bg-gray-300'
                            }`}
                          />
                          <p className="font-medium text-black">{formatStatus(activity.status)}</p>
                          {when && <p className="mt-1 text-sm text-gray-500">{when}</p>}
                          {location && <p className="mt-1 text-sm text-gray-500">{location}</p>}
                        </li>
                      )
                    })}
                  </ol>
                </>
              )}
          </section>
        )}

        <section className="mx-auto mt-5 max-w-lg rounded-2xl bg-white px-6 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] sm:px-8">
          <h2 className="text-2xl font-semibold leading-snug text-black">
            Having trouble tracking your order? We&apos;re here to help!
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            For quick assistance, the Fiberise Fit support team is available via:
          </p>
          <dl className="mt-5 space-y-3 text-[15px] text-gray-800">
            <div>
              <dt className="inline font-semibold text-black">Phone: </dt>
              <dd className="inline">
                <a href="tel:+917070705026" className="underline-offset-2 hover:underline">
                  +91 7070705026
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline font-semibold text-black">Email: </dt>
              <dd className="inline">
                <a href="mailto:support@fiberisefit.com" className="underline-offset-2 hover:underline">
                  support@fiberisefit.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline font-semibold text-black">WhatsApp: </dt>
              <dd className="inline">
                <a
                  href="https://wa.me/918679036275"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline"
                >
                  +91 8679036275
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline font-semibold text-black">Website: </dt>
              <dd className="inline">
                <a href="https://fiberisefit.com" className="underline-offset-2 hover:underline">
                  fiberisefit.com
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-6 space-y-1 text-[15px] leading-relaxed text-gray-800">
            <p className="font-semibold text-black">FIBERISE FIT PRIVATE LIMITED</p>
            <p>Pride Corporate Park, Building A-153, Sector 136, Noida, Uttar Pradesh – 201304</p>
          </div>
          <p className="mt-5 text-[15px] text-gray-700">We look forward to assisting you.</p>
        </section>
      </div>
    </div>
  )
}
