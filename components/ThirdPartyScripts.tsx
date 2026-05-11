'use client'

import { useEffect, useRef } from 'react'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1494405295572983'

/**
 * Injects third-party analytics scripts (Google Ads, Meta Pixel)
 * only after the user's first interaction (scroll, click, touch).
 *
 * GTM is loaded synchronously in layout.tsx <head> for accurate tracking.
 * This removes main-thread blocking from the remaining scripts.
 */
export default function ThirdPartyScripts() {
  const loaded = useRef(false)

  useEffect(() => {
    function loadAllScripts() {
      if (loaded.current) return
      loaded.current = true

      // 1. Google Ads (gtag.js) moved to layout.tsx for immediate loading

      // 3. Meta Pixel
      const f = window as any
      if (!f.fbq) {
        const n: any = (f.fbq = function (...args: any[]) {
          n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args)
        })
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = true
        n.version = '2.0'
        n.queue = []
        const fbScript = document.createElement('script')
        fbScript.async = true
        fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js'
        document.head.appendChild(fbScript)
        f.fbq('init', META_PIXEL_ID)
        f.fbq('track', 'PageView')
      }

      // Cleanup listeners
      window.removeEventListener('scroll', loadAllScripts)
      window.removeEventListener('click', loadAllScripts)
      window.removeEventListener('touchstart', loadAllScripts)
    }

    // Load scripts on first user interaction OR after 5s idle (whichever first)
    window.addEventListener('scroll', loadAllScripts, { once: true, passive: true })
    window.addEventListener('click', loadAllScripts, { once: true })
    window.addEventListener('touchstart', loadAllScripts, { once: true, passive: true })

    // Fallback: load after 5 seconds if user hasn't interacted
    const timer = setTimeout(loadAllScripts, 5000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', loadAllScripts)
      window.removeEventListener('click', loadAllScripts)
      window.removeEventListener('touchstart', loadAllScripts)
    }
  }, [])

  return null
}
