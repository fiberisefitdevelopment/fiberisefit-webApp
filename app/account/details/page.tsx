'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { updateProfile } from 'firebase/auth'

interface UserProfile {
  firstName: string
  lastName: string
  displayName: string
  phone: string | null
}

export default function AccountDetailsPage() {
  const { phone, user, getIdToken } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [displayName, setDisplayName] = useState('')

  const displayPhone = profile?.phone ?? phone ?? ''

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
          setDisplayName(data.displayName ?? '')
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
          displayName: displayName.trim(),
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
              displayName: displayName.trim(),
            }
          : null
      )
      if (user && displayName.trim()) {
        try {
          await updateProfile(user, { displayName: displayName.trim() })
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

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

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
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">
            How your name appears in the account section and in reviews.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save details'}
          </button>
        </div>
      </form>
    </div>
  )
}
