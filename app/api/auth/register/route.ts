import { NextRequest, NextResponse } from 'next/server'
import { customerLogin, customerRegister } from '@/lib/shopify/customer'

const COOKIE_NAME = 'sf_customer_token'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, password, firstName, lastName } = body as {
      email?: string
      password?: string
      firstName?: string
      lastName?: string
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { customer, errors } = await customerRegister({
      email,
      password,
      firstName,
      lastName,
    })

    if (!customer) {
      return NextResponse.json(
        { error: errors.join(', ') || 'Failed to create account' },
        { status: 400 }
      )
    }

    // Auto-login after registration for smoother UX
    const { token, errors: loginErrors } = await customerLogin({ email, password })
    if (!token) {
      return NextResponse.json(
        { error: loginErrors.join(', ') || 'Account created but login failed' },
        { status: 200 }
      )
    }

    const response = NextResponse.json({ success: true })
    const secure = process.env.NODE_ENV === 'production'

    response.cookies.set(COOKIE_NAME, token.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })

    return response
  } catch (error: any) {
    console.error('Error in /api/auth/register:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

