import { NextRequest, NextResponse } from 'next/server'
import { logCampaignEvent } from '@/lib/campaigns'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, eventType, metadata } = body as {
      slug: string
      eventType: 'visit' | 'activation' | 'add_to_cart' | 'checkout' | 'order_success'
      metadata?: any
    }

    if (!slug || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: slug and eventType' },
        { status: 400 }
      )
    }

    // Call server-side campaigns helper to save event and update stats
    await logCampaignEvent(slug, eventType, metadata)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Error logging campaign event via API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
