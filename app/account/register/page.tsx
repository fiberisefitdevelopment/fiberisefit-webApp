'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountRegisterPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/account/login')
  }, [router])

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-32 pb-16 flex items-center justify-center">
      <p className="text-gray-600">Redirecting to login...</p>
    </div>
  )
}
