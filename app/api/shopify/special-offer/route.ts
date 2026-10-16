import { NextResponse } from 'next/server'
import { getSpecialOfferMedia } from '@/lib/shopify/special-offer-media'

export const revalidate = 300

export async function GET() {
  try {
    const media = await getSpecialOfferMedia()
    return NextResponse.json(media, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch special offer media'
    console.error('Error fetching special offer media:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
