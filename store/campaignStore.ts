import { create } from 'zustand'

export interface ActiveOffer {
  slug: string
  discountValue: number
  expiresAt: string // ISO date string
  applicableProducts: string[]
  discountType: 'fixed' | 'percentage'
}

interface CampaignStore {
  activeCampaign: ActiveOffer | null
  isHydrated: boolean
  activateCampaign: (campaign: {
    slug: string
    discountValue: number
    expiresAt: string
    applicableProducts: string[]
    discountType: 'fixed' | 'percentage'
  }) => void
  clearCampaign: () => void
  hydrateCampaign: () => void
  checkCampaignExpiry: () => boolean // Returns true if expired and cleared
}

const COOKIE_NAME = 'active_campaign'
const LOCAL_STORAGE_KEY = 'active_campaign'

// Cookie helpers
const getCookie = (name: string): string | null => {
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

const setCookie = (name: string, value: string, expiresAt?: string) => {
  if (typeof document === 'undefined') return
  let expires = ''
  if (expiresAt) {
    const date = new Date(expiresAt)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`
}

const eraseCookie = (name: string) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  activeCampaign: null,
  isHydrated: false,

  activateCampaign: (campaign) => {
    // 1. Save to state
    set({ activeCampaign: campaign })

    // 2. Save to localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(campaign))
    } catch (e) {
      console.error('Error saving campaign to localStorage', e)
    }

    // 3. Save to cookie
    setCookie(COOKIE_NAME, JSON.stringify(campaign), campaign.expiresAt)
  },

  clearCampaign: () => {
    set({ activeCampaign: null })
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } catch (e) {
      console.error('Error removing campaign from localStorage', e)
    }
    eraseCookie(COOKIE_NAME)
  },

  checkCampaignExpiry: () => {
    const { activeCampaign } = get()
    if (!activeCampaign) return false

    const now = new Date().getTime()
    const expiry = new Date(activeCampaign.expiresAt).getTime()

    if (now >= expiry) {
      console.log('⏰ Active campaign has expired, clearing from state.')
      get().clearCampaign()
      return true
    }
    return false
  },

  hydrateCampaign: () => {
    if (typeof window === 'undefined') return

    let campaign: ActiveOffer | null = null

    // 1. Try reading from localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        campaign = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Error reading campaign from localStorage', e)
    }

    // 2. Try cookie if localStorage fails / is empty
    if (!campaign) {
      try {
        const cookieVal = getCookie(COOKIE_NAME)
        if (cookieVal) {
          campaign = JSON.parse(cookieVal)
        }
      } catch (e) {
        console.error('Error reading campaign from cookie', e)
      }
    }

    // 3. Validate expiry before setting state
    if (campaign) {
      const now = new Date().getTime()
      const expiry = new Date(campaign.expiresAt).getTime()

      if (now >= expiry) {
        console.log('⏰ Hydrated campaign was expired, clearing.')
        eraseCookie(COOKIE_NAME)
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY)
        } catch (e) {}
        campaign = null
      }
    }

    set({ activeCampaign: campaign, isHydrated: true })
  },
}))
