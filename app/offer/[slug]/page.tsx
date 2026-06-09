import { getCampaignBySlug, logCampaignEvent } from '@/lib/campaigns'
import CampaignActivator from '../../../components/CampaignActivator'
import Link from 'next/link'
import { AlertCircle, ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface OfferPageProps {
  params: Promise<{ slug: string }>
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { slug } = await params

  // 1. Fetch campaign details
  const campaign = await getCampaignBySlug(slug)

  // 2. Validate campaign
  const now = new Date().getTime()
  const isValid =
    campaign &&
    campaign.isActive &&
    now < new Date(campaign.expiresAt).getTime()

  if (!isValid) {
    // Render a premium "Offer Expired" UI
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 text-center relative overflow-hidden">
          {/* Subtle Decorative Background Element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full opacity-50 blur-xl" />
          
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Offer Expired
          </h1>
          
          <p className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
            We're sorry, this campaign is no longer active. The promotional period has ended, or the offer link is incorrect.
          </p>

          <div className="space-y-3">
            <Link
              href="/#products"
              className="w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider bg-black text-white hover:bg-gray-900 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              View Current Shop Packs
            </Link>
            <Link
              href="/"
              className="block w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 3. Log the campaign visit server-side
  try {
    await logCampaignEvent(campaign.slug, 'visit')
  } catch (error) {
    console.error('Error logging campaign visit event:', error)
  }

  // 4. Render the client-side activator which handles storage activation & client redirect
  return <CampaignActivator campaign={campaign} />
}
