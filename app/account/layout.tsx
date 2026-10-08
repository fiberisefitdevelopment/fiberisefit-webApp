'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { AccountBreadcrumb } from '@/components/account/AccountBreadcrumb'

const BREADCRUMB_LABELS: Record<string, string> = {
  '/account/orders': 'Orders',
  '/account/addresses': 'Addresses',
  '/account/details': 'Account details',
}

function getBreadcrumbItems(pathname: string): { label: string; href?: string }[] {
  const items: { label: string; href?: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account/orders' },
  ]
  if (pathname === '/account') return items
  if (pathname.match(/^\/account\/orders\/[^/]+$/)) {
    items.push({ label: 'Orders', href: '/account/orders' })
    items.push({ label: 'Order details' })
    return items
  }
  const label = BREADCRUMB_LABELS[pathname] || pathname.split('/').pop() || 'Account'
  items.push({ label })
  return items
}

const PUBLIC_PATHS = ['/account/login', '/account/register']

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading, initializeAuth } = useAuth()
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  useEffect(() => {
    void initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (isPublic) return
    if (!loading && !isAuthenticated) {
      router.push('/account/login')
    }
  }, [isAuthenticated, loading, router, isPublic])

  if (isPublic) return <>{children}</>

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-32 pb-16 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const breadcrumbItems = getBreadcrumbItems(pathname)

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AccountBreadcrumb items={breadcrumbItems} />
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />
          <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
