'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCampaignStore } from '@/store/campaignStore'
import { Loader2 } from 'lucide-react'

interface Campaign {
  slug: string
  discountType: 'fixed' | 'percentage'
  discountValue: number
  applicableProducts: string[]
  expiresAt: string
  isActive: boolean
  redirectUrl: string
  shopifyDiscountCode?: string
}

interface CampaignActivatorProps {
  campaign: Campaign
}

export default function CampaignActivator({ campaign }: CampaignActivatorProps) {
  const router = useRouter()
  const activateCampaign = useCampaignStore((state) => state.activateCampaign)

  useEffect(() => {
    async function activate() {
      try {
        console.log(`🚀 [CampaignActivator] Activating campaign: ${campaign.slug}`)
        
        // 1. Persist the offer in Zustand store (which handles cookie + localStorage)
        activateCampaign({
          slug: campaign.slug,
          discountType: campaign.discountType,
          discountValue: campaign.discountValue,
          expiresAt: campaign.expiresAt,
          applicableProducts: campaign.applicableProducts,
        })

        // 2. Track activation client-side
        await fetch('/api/analytics/campaign-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug: campaign.slug,
            eventType: 'activation',
          }),
        }).catch((err) => console.error('Failed to log campaign activation event:', err))

        console.log(`✅ [CampaignActivator] Offer stored. Redirecting to: ${campaign.redirectUrl}`)
      } catch (err) {
        console.error('Error during campaign activation:', err)
      } finally {
        // 3. Redirect the user to the target product page
        router.replace(campaign.redirectUrl)
      }
    }

    activate()
  }, [campaign, activateCampaign, router])

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex flex-col items-center justify-center p-4">
      <div className="max-w-xs text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-black mx-auto" />
        <p className="text-sm font-semibold tracking-wider text-black uppercase">
          Activating Special Offer...
        </p>
        <p className="text-xs text-gray-400">
          Please wait while we apply your exclusive discount.
        </p>
      </div>
    </div>
  )
}
