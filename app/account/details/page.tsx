'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { updateProfile } from 'firebase/auth'

interface SavedAddress {
  address1: string
  address2: string
  city: string
  province: string
  zip: string
  country: string
}

const emptyAddress = (): SavedAddress => ({
  address1: '',
  address2: '',
  city: '',
  province: '',
  zip: '',
  country: 'India',
})

interface UserProfile {
  firstName: string
  lastName: string
  displayName: string
  phone: string | null
  address: SavedAddress
}

export default function AccountDetailsPage() {
  const { phone, user, getIdToken } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState<SavedAddress>(emptyAddress)
  const [pinLookup, setPinLookup] = useState<'idle' | 'loading' | 'error'>('idle')
  const pinRequestRef = useRef(0)

  const displayPhone = profile?.phone ?? phone ?? ''

  const handlePinChange = (value: string) => {
    const zip = value.replace(/\D/g, '').slice(0, 6)
    setAddress((current) => ({ ...current, zip }))
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
        setAddress((current) =>
          current.zip === zip
            ? {
                ...current,
                city: data.city || current.city,
                province: data.state || current.province,
                country: 'India',
              }
            : current
        )
        setPinLookup('idle')
      })
      .catch(() => {
        if (pinRequestRef.current === requestId) setPinLookup('error')
      })
  }

  useEffect(() => {
    let cancelled = false
    async function fetchProfile() {
      const token = await getIdToken()
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          setLoading(false)
          return
        }
        const data = await res.json()
        if (!cancelled) {
          setProfile(data)
          setFirstName(data.firstName ?? '')
          setLastName(data.lastName ?? '')
          setAddress({ ...emptyAddress(), ...(data.address ?? {}) })
        }
      } catch {
        if (!cancelled) setProfile(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [getIdToken])

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)
    try {
      const token = await getIdToken()
      if (!token) {
        setMessage({ type: 'error', text: 'Not signed in.' })
        return
      }
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          displayName: firstName.trim(),
          address: {
            address1: address.address1.trim(),
            address2: address.address2.trim(),
            city: address.city.trim(),
            province: address.province.trim(),
            zip: address.zip.trim(),
            country: address.country.trim() || 'India',
          },
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMessage({ type: 'error', text: err.error || 'Failed to save.' })
        return
      }
      setMessage({ type: 'success', text: 'Details saved.' })
      setProfile((p) =>
        p
          ? {
              ...p,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              displayName: firstName.trim(),
              address: {
                address1: address.address1.trim(),
                address2: address.address2.trim(),
                city: address.city.trim(),
                province: address.province.trim(),
                zip: address.zip.trim(),
                country: address.country.trim() || 'India',
              },
            }
          : null
      )
      if (user && firstName.trim()) {
        try {
          await updateProfile(user, { displayName: firstName.trim() })
        } catch {
          // Firestore is source of truth; displayName in Auth is best-effort
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account details</h1>
        <p className="text-gray-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account details</h1>

      <form onSubmit={handleSaveDetails} className="space-y-5">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone number (login)
          </label>
          <input
            id="phone"
            type="tel"
            value={displayPhone}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            value={firstName}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-500">
            Taken from your first name. This is how your name appears in the account section and in reviews.
          </p>
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
            PIN code
          </label>
          <input
            id="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            value={address.zip}
            onChange={(e) => handlePinChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">
            {pinLookup === 'loading'
              ? 'Finding city and state…'
              : pinLookup === 'error'
                ? 'No city found for this PIN code. You can type them below.'
                : 'Enter a 6-digit PIN code to fill city and state.'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              value={address.city}
              onChange={(e) => setAddress((current) => ({ ...current, city: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              id="province"
              type="text"
              autoComplete="address-level1"
              value={address.province}
              onChange={(e) => setAddress((current) => ({ ...current, province: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>
        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            id="address1"
            type="text"
            value={address.address1}
            onChange={(e) => setAddress((current) => ({ ...current, address1: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, suite, etc. (optional)
          </label>
          <input
            id="address2"
            type="text"
            value={address.address2}
            onChange={(e) => setAddress((current) => ({ ...current, address2: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            id="country"
            type="text"
            value={address.country}
            onChange={(e) => setAddress((current) => ({ ...current, country: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save details'}
          </button>
          {message && (
            <p
              className={`rounded-lg px-4 py-2 text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
