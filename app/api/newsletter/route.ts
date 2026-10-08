import { NextRequest, NextResponse } from 'next/server'
import { adminDb, isAdminInitialized, getInitError } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!isAdminInitialized() || !adminDb) {
      const err = getInitError()
      console.error('Newsletter: Firebase not initialized', err?.message)
      return NextResponse.json(
        { error: 'Newsletter signup is temporarily unavailable' },
        { status: 503 }
      )
    }

    await adminDb.collection('newsletter').add({
      email: email.toLowerCase(),
      createdAt: new Date(),
      source: 'footer-newsletter',
    })

    return NextResponse.json({ success: true, message: 'Thanks for subscribing!' })
  } catch (error: any) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
