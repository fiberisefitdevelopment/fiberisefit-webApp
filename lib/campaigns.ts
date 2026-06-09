import { adminDb, isAdminInitialized } from '@/lib/firebase/admin'

export interface Campaign {
  slug: string
  discountType: 'fixed' | 'percentage'
  discountValue: number
  applicableProducts: string[] // Shopify handles/slugs
  expiresAt: string
  isActive: boolean
  redirectUrl: string
  shopifyDiscountCode?: string // Optional custom Shopify discount code mapping
}

export const FALLBACK_CAMPAIGNS: Record<string, Campaign> = {
  'june-transform': {
    slug: 'june-transform',
    discountType: 'fixed',
    discountValue: 250,
    applicableProducts: ['transformation-pack'],
    expiresAt: '2026-06-04T23:59:59Z',
    isActive: true,
    redirectUrl: '/products/transformation-pack',
    shopifyDiscountCode: 'JUNE-TRANSFORM',
  },
  'june-starter': {
    slug: 'june-starter',
    discountType: 'fixed',
    discountValue: 150,
    applicableProducts: ['starter-pack'],
    expiresAt: '2026-06-10T23:59:59Z',
    isActive: true,
    redirectUrl: '/products/starter-pack',
    shopifyDiscountCode: 'JUNE-STARTER',
  },
}

/**
 * Retrieves a campaign configuration by its slug.
 * Checks Firestore first, then falls back to the local config.
 */
export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const normalizedSlug = slug.trim().toLowerCase()

  if (isAdminInitialized() && adminDb) {
    try {
      console.log(`🔍 [Campaigns] Querying Firestore for campaign: ${normalizedSlug}`)
      const doc = await adminDb.collection('campaigns').doc(normalizedSlug).get()
      if (doc.exists) {
        const data = doc.data()
        if (data) {
          console.log(`✅ [Campaigns] Found campaign in Firestore: ${normalizedSlug}`)
          return {
            slug: data.slug || doc.id,
            discountType: data.discountType || 'fixed',
            discountValue: typeof data.discountValue === 'number' ? data.discountValue : 0,
            applicableProducts: Array.isArray(data.applicableProducts) ? data.applicableProducts : [],
            expiresAt: data.expiresAt || '',
            isActive: typeof data.isActive === 'boolean' ? data.isActive : false,
            redirectUrl: data.redirectUrl || '/',
            shopifyDiscountCode: data.shopifyDiscountCode || data.slug || doc.id,
          }
        }
      }
      console.log(`⚠️ [Campaigns] Campaign not found in Firestore: ${normalizedSlug}`)
    } catch (error) {
      console.error(`❌ [Campaigns] Error fetching campaign from Firestore:`, error)
    }
  }

  // Fallback to local config
  const fallback = FALLBACK_CAMPAIGNS[normalizedSlug]
  if (fallback) {
    console.log(`ℹ️ [Campaigns] Found campaign in local fallback configuration: ${normalizedSlug}`)
    return fallback
  }

  return null
}

/**
 * Server-side helper to log campaign analytics events and update campaign stats in Firestore.
 */
export async function logCampaignEvent(
  slug: string,
  eventType: 'visit' | 'activation' | 'add_to_cart' | 'checkout' | 'order_success',
  metadata?: {
    orderId?: string
    revenue?: number
    productId?: string
    quantity?: number
  }
): Promise<void> {
  const normalizedSlug = slug.trim().toLowerCase()
  console.log(`📊 [Analytics] Logging event "${eventType}" for campaign: ${normalizedSlug}`)

  if (!isAdminInitialized() || !adminDb) {
    console.warn(`⚠️ [Analytics] Firebase Admin is not initialized. Skipping event write.`)
    return
  }

  try {
    const timestamp = new Date().toISOString()

    // 1. Log event details
    await adminDb.collection('campaign_events').add({
      campaignSlug: normalizedSlug,
      eventType,
      timestamp,
      metadata: metadata || null,
    })

    // 2. Update campaign statistics document
    const statsDocRef = adminDb.collection('campaign_stats').doc(normalizedSlug)
    await adminDb.runTransaction(async (transaction) => {
      const statsDoc = await transaction.get(statsDocRef)
      const data = statsDoc.data() || {}

      const visits = (data.visits || 0) + (eventType === 'visit' ? 1 : 0)
      const activations = (data.activations || 0) + (eventType === 'activation' ? 1 : 0)
      const addToCart = (data.addToCart || 0) + (eventType === 'add_to_cart' ? 1 : 0)
      const checkouts = (data.checkouts || 0) + (eventType === 'checkout' ? 1 : 0)
      const orders = (data.orders || 0) + (eventType === 'order_success' ? 1 : 0)
      const revenue = (data.revenue || 0) + (eventType === 'order_success' && metadata?.revenue ? metadata.revenue : 0)

      transaction.set(
        statsDocRef,
        {
          slug: normalizedSlug,
          visits,
          activations,
          addToCart,
          checkouts,
          orders,
          revenue,
          lastUpdatedAt: timestamp,
        },
        { merge: true }
      )
    })
    console.log(`✅ [Analytics] Successfully updated stats for campaign: ${normalizedSlug}`)
  } catch (error) {
    console.error(`❌ [Analytics] Error logging campaign event:`, error)
  }
}
