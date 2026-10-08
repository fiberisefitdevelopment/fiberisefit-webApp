'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import IsolatedPurchaseHeader from '@/components/IsolatedPurchaseHeader'
import AuthIdleWarmup from '@/components/auth/AuthIdleWarmup'
import { isIsolatedPurchasePath } from '@/lib/isolated-purchase-routes'

const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false })

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isIsolatedPurchase = isIsolatedPurchasePath(pathname)

  return (
    <>
      <AuthIdleWarmup />
      {isIsolatedPurchase ? <IsolatedPurchaseHeader /> : <Header />}
      <main className="min-h-screen">{children}</main>
      {!isIsolatedPurchase && <Footer />}
      <CartDrawer isolatedPurchase={isIsolatedPurchase} />
    </>
  )
}
