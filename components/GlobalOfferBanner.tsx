'use client'

import { useEffect, useState } from 'react'
import { useCampaignStore } from '@/store/campaignStore'
import { usePathname } from 'next/navigation'

export default function GlobalOfferBanner() {
  const { activeCampaign, isHydrated, hydrateCampaign, checkCampaignExpiry } = useCampaignStore()
  const [countdownText, setCountdownText] = useState('')
  const [isLinkExpired, setIsLinkExpired] = useState(false)

  const pathname = usePathname()
  const isTransformationPack = pathname === '/products/transformation-pack'

  // Hydrate store on mount
  useEffect(() => {
    hydrateCampaign()
  }, [hydrateCampaign])

  // Manage viewport theme-color dynamically to match the banner or standard layout
  useEffect(() => {
    const updateThemeColorMeta = (color: string | null) => {
      if (typeof document === 'undefined') return
      let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'theme-color')
        document.head.appendChild(meta)
      }
      if (color) {
        meta.setAttribute('content', color)
      } else {
        meta.remove()
      }
    }

    if (isTransformationPack && isLinkExpired) {
      updateThemeColorMeta('#000000') // Standard black announcement bar
      return
    }

    if (activeCampaign || (isTransformationPack && !isLinkExpired)) {
      updateThemeColorMeta('#187254') // Campaign green banner
    } else {
      updateThemeColorMeta('#000000') // Standard black announcement bar
    }

    return () => {
      updateThemeColorMeta('#000000')
    }
  }, [activeCampaign, isTransformationPack, isLinkExpired])

  // Countdown timer effect
  useEffect(() => {
    const storageKey = 'transformation_pack_opened_at'
    const fortyEightHours = 1 * 60 * 1000 // 1 minute for testing (originally 48 * 60 * 60 * 1000)

    const getCookieVal = (name: string): string | null => {
      if (typeof document === 'undefined') return null
      const nameEQ = `${name}=`
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1)
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length))
      }
      return null
    }

    // Initial check
    if (isTransformationPack) {
      const firstOpenedStr = localStorage.getItem(storageKey) || getCookieVal(storageKey)
      if (firstOpenedStr) {
        const firstOpened = parseInt(firstOpenedStr, 10)
        if (!isNaN(firstOpened) && Date.now() - firstOpened > fortyEightHours) {
          setIsLinkExpired(true)
          return
        }
      }
    }

    if (!activeCampaign && !isTransformationPack) return

    const updateCountdown = () => {
      let diff = 0

      if (isTransformationPack) {
        // Read the custom first opened timestamp
        const firstOpenedStr = localStorage.getItem(storageKey) || getCookieVal(storageKey)
        if (firstOpenedStr) {
          const firstOpened = parseInt(firstOpenedStr, 10)
          if (!isNaN(firstOpened)) {
            diff = firstOpened + fortyEightHours - Date.now()
          }
        } else {
          // If not initialized yet, fallback to 1 minute
          diff = fortyEightHours
        }
      } else {
        // Standard campaign behavior
        if (!activeCampaign) return
        const isExpired = checkCampaignExpiry()
        if (isExpired) return
        const expiry = new Date(activeCampaign.expiresAt).getTime()
        diff = expiry - Date.now()
      }

      if (diff <= 0) {
        setCountdownText('00:00:00')
        if (isTransformationPack) {
          setIsLinkExpired(true)
        }
        return
      }

      // Calculate time components
      const totalSeconds = Math.floor(diff / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      // Format with leading zeros
      const formattedHours = hours.toString().padStart(2, '0')
      const formattedMinutes = minutes.toString().padStart(2, '0')
      const formattedSeconds = seconds.toString().padStart(2, '0')

      setCountdownText(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [activeCampaign, checkCampaignExpiry, isTransformationPack])

  // Don't render until store is hydrated or if no campaign is active (unless it's the transformation pack)
  if (!isHydrated) return null
  if (isTransformationPack && isLinkExpired) return null
  if (!activeCampaign && !isTransformationPack) return null

  const discountValue = activeCampaign?.discountValue ?? 250

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#187254] text-[#E8F5E9] py-2 px-4 text-center overflow-hidden border-b border-[#0f543c]/20 shadow-md">
      <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase select-none animate-fade-in">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#E8F5E9] text-[#187254] font-black mr-1 text-[10px]">
          OFFER
        </span>
        <span className="hidden sm:inline">🎉</span>
        <span>Special Offer Applied:</span>
        <span className="text-white font-extrabold underline decoration-white/30 underline-offset-2">
          Extra ₹{discountValue} OFF
        </span>
        <span>activated</span>
        <span className="mx-1 opacity-50">•</span>
        <span className="text-white font-mono font-medium tracking-normal lowercase">
          expires in <strong className="font-extrabold font-mono tracking-wider uppercase text-amber-300">{countdownText}</strong>
        </span>
      </div>
    </div>
  )
}
