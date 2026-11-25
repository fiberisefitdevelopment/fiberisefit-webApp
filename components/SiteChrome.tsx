'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import IsolatedPurchaseHeader from '@/components/IsolatedPurchaseHeader'
import AuthIdleWarmup from '@/components/auth/AuthIdleWarmup'
import { isIsolatedPurchasePath } from '@/lib/isolated-purchase-routes'
import { trackMetaEvent } from '@/lib/meta-pixel'

const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false })

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isIsolatedPurchase = isIsolatedPurchasePath(pathname)
  const hasTrackedInitialPageView = useRef(false)

  useEffect(() => {
    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true
      return
    }
    trackMetaEvent('PageView')
  }, [pathname])

  useEffect(() => {
    const sticky =
      pathname === '/special-offer' || pathname.startsWith('/products/')
    document.documentElement.classList.toggle('has-mobile-sticky-cta', sticky)

    if (!sticky || window.matchMedia('(min-width: 768px)').matches) {
      return () => document.documentElement.classList.remove('has-mobile-sticky-cta')
    }

    const offset = 'calc(4.5rem + env(safe-area-inset-bottom, 0px))'
    const lift = () => {
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        const style = getComputedStyle(el)
        if (style.position !== 'fixed') return
        const width = el.offsetWidth
        const height = el.offsetHeight
        if (width < 48 || width > 96 || height < 48 || height > 96) return
        const right = parseFloat(style.right)
        if (Number.isNaN(right) || right > 40) return
        if (el.dataset.waLifted === '1') {
          el.style.setProperty('bottom', offset, 'important')
          return
        }
        const bottom = parseFloat(style.bottom)
        if (Number.isNaN(bottom) || bottom > 48) return
        el.dataset.waLifted = '1'
        el.style.setProperty('bottom', offset, 'important')
      })
    }

    lift()
    const timer = window.setInterval(lift, 1500)
    const observer = new MutationObserver(lift)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      window.clearInterval(timer)
      observer.disconnect()
      document.documentElement.classList.remove('has-mobile-sticky-cta')
    }
  }, [pathname])

  return (
    <>
      <AuthIdleWarmup />
      {isIsolatedPurchase ? <IsolatedPurchaseHeader /> : <Header />}
      <main className="min-h-screen">{children}</main>
      {!isIsolatedPurchase && (
        <Footer
          mobileStickyClearance={
            pathname === '/special-offer' || pathname.startsWith('/products/')
          }
        />
      )}
      <CartDrawer isolatedPurchase={isIsolatedPurchase} />
    </>
  )
}
