'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AUTH_LOGIN_TIMESTAMP_KEY, useAuth } from '@/contexts/AuthContext'

/** Loads Firebase only when likely needed — account routes or prior login hint. */
export default function AuthIdleWarmup() {
  const pathname = usePathname()
  const { initializeAuth } = useAuth()

  useEffect(() => {
    const onAccount = pathname?.startsWith('/account')
    const hadSession =
      typeof window !== 'undefined' && Boolean(localStorage.getItem(AUTH_LOGIN_TIMESTAMP_KEY))

    if (!onAccount && !hadSession) return

    const run = () => {
      void initializeAuth()
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: onAccount ? 500 : 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(run, onAccount ? 0 : 3000)
    return () => clearTimeout(timer)
  }, [pathname, initializeAuth])

  return null
}
