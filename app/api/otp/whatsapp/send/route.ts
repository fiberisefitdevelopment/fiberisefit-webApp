import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppOtp, WhatsAppOtpError } from '@/lib/whatsapp-otp'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const result = await sendWhatsAppOtp(String(body.phone || ''))
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not send the WhatsApp code.'
    const status = error instanceof WhatsAppOtpError ? error.status : 502
    return NextResponse.json({ error: message }, { status })
  }
}
