import { NextRequest, NextResponse } from 'next/server'
import { trackShipmentByAwb } from '@/lib/shiprocket/client'
import { getClientIp, isRateLimited } from '@/lib/support/rate-limiter'

export const dynamic = 'force-dynamic'

const AWB_PATTERN = /^[A-Za-z0-9-]{6,30}$/

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(`track:${ip}`, { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json(
      { error: 'Too many tracking requests. Please wait a minute and try again.' },
      { status: 429 }
    )
  }

  const body = await request.json().catch(() => ({}))
  const awb = typeof body.awb === 'string' ? body.awb.trim() : ''

  if (!AWB_PATTERN.test(awb)) {
    return NextResponse.json(
      { error: 'Enter a valid AWB number.' },
      { status: 400 }
    )
  }

  try {
    const shipment = await trackShipmentByAwb(awb)
    if (!shipment) {
      return NextResponse.json(
        { error: 'No shipment found for this AWB number.' },
        { status: 404 }
      )
    }
    return NextResponse.json({ shipment })
  } catch (error) {
    console.error('AWB tracking failed', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Tracking is temporarily unavailable. Please try again shortly.' },
      { status: 503 }
    )
  }
}
