import { NextRequest, NextResponse } from 'next/server'
import { verifyWhatsAppOtp, WhatsAppOtpError } from '@/lib/whatsapp-otp'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = await verifyWhatsAppOtp(String(body.phone || ''), String(body.otp || ''))
    return NextResponse.json({ token })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not verify the code.'
    const status = error instanceof WhatsAppOtpError ? error.status : 500
    return NextResponse.json({ error: message }, { status })
  }
}
