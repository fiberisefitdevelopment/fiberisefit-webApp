import { NextRequest, NextResponse } from 'next/server'
import { customerLogin } from '@/lib/shopify/customer'

const COOKIE_NAME = 'sf_customer_token'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { token, errors } = await customerLogin({ email, password })

    if (!token) {
      return NextResponse.json(
        { error: errors.join(', ') || 'Invalid email or password' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })
    const secure = process.env.NODE_ENV === 'production'

    response.cookies.set(COOKIE_NAME, token.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      // Shopify tokens are typically long-lived; we use 30 days here.
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

