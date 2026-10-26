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
    void initializeAuth()
  }, [pathname, initializeAuth])

  return null
}
