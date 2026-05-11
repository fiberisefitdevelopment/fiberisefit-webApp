'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
        return
      }
      setStatus('success')
      setMessage(data.message || 'Thanks for subscribing!')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          disabled={status === 'loading'}
          className="flex-1 min-w-0 rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-white focus:outline-none focus:ring-1 focus:ring-white disabled:opacity-50"
          aria-label="Email for newsletter"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}
          role="alert"
        >
          {message}
        </p>
      )}
    </div>
  )
}
