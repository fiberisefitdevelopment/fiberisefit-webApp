import { NextRequest, NextResponse } from 'next/server'
import { adminDb, isAdminInitialized, getInitError } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const source = body.source === 'amazon-qr' ? 'amazon-qr' : 'contact-form'

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.replace(/\D/g, '').slice(-10) : ''
    const pincode = typeof body.pincode === 'string' ? body.pincode.replace(/\D/g, '').slice(0, 6) : ''
    const city = typeof body.city === 'string' ? body.city.trim() : ''
    const region = typeof body.state === 'string' ? body.state.trim() : ''
    const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (source === 'amazon-qr') {
      if (!name || !phone || !email || !pincode || !city || !region) {
        return NextResponse.json(
          { error: 'Please fill name, phone, email and a valid pincode.' },
          { status: 400 }
        )
      }
      if (!/^\d{10}$/.test(phone)) {
        return NextResponse.json({ error: 'Enter a valid 10-digit mobile number.' }, { status: 400 })
      }
      if (body.phoneVerified !== true) {
        return NextResponse.json(
          { error: 'Please verify your phone number with the WhatsApp OTP first.' },
          { status: 400 }
        )
      }
      if (!/^\d{6}$/.test(pincode)) {
        return NextResponse.json({ error: 'Enter a valid 6-digit pincode.' }, { status: 400 })
      }
    } else if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (!isAdminInitialized() || !adminDb) {
      const err = getInitError()
      console.error('Contact: Firebase not initialized', err?.message)
      return NextResponse.json(
        { error: 'Contact form is temporarily unavailable.' },
        { status: 503 }
      )
    }

    if (source === 'amazon-qr') {
      await adminDb.collection('QrCustomers').add({
        name,
        email: email.toLowerCase(),
        phone,
        pincode,
        city,
        state: region,
        createdAt: new Date(),
        status: 'new',
        source,
        phoneVerified: body.phoneVerified === true,
      })
    } else {
      await adminDb.collection('userFeedback').add({
        name,
        email: email.toLowerCase(),
        ...(phone ? { phone } : {}),
        subject,
        message,
        createdAt: new Date(),
        status: 'new',
        source,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    })
  } catch (error: unknown) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
