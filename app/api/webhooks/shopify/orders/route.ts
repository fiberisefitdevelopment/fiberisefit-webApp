import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { logCampaignEvent } from '@/lib/campaigns'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256')
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET

    const rawBody = await request.text()

    // 1. Signature Verification
    if (secret && hmacHeader) {
      const generatedHmac = crypto
        .createHmac('sha256', secret)
        .update(rawBody, 'utf8')
        .digest('base64')

      if (generatedHmac !== hmacHeader) {
        console.error('❌ [Shopify Webhook] HMAC signature mismatch!')
        return NextResponse.json({ error: 'HMAC verification failed' }, { status: 401 })
      }
    } else {
      console.warn('⚠️ [Shopify Webhook] Webhook secret or HMAC header missing. Verification bypassed.')
    }

    // 2. Parse Order details
    const order = JSON.parse(rawBody)
    const orderId = order.id
    const noteAttributes = order.note_attributes || []
    const subtotalPrice = order.subtotal_price || '0'

    console.log(`📦 [Shopify Webhook] Processing order ${orderId}, subtotal: ₹${subtotalPrice}`)

    // Find the campaign_slug note attribute
    const campaignAttr = noteAttributes.find(
      (attr: { name: string; value: string }) => attr.name === 'campaign_slug'
    )
    const campaignSlug = campaignAttr?.value

    if (campaignSlug) {
      console.log(`🎉 [Shopify Webhook] Campaign attribute found: "${campaignSlug}" for order ${orderId}`)
      
      // 3. Log the successful order and revenue
      await logCampaignEvent(campaignSlug, 'order_success', {
        orderId: String(orderId),
        revenue: parseFloat(subtotalPrice),
      })
    } else {
      console.log(`ℹ️ [Shopify Webhook] No campaign attribute associated with order ${orderId}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ [Shopify Webhook] Error processing Shopify webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
