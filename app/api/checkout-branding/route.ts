/**
 * POST /api/checkout-branding
 * Applies checkout branding via Shopify Admin GraphQL (checkoutBrandingUpsert).
 * Body (optional): { theme?: Partial<CheckoutDesignConfig>, checkoutProfileId?: string }
 * If theme is omitted, uses default Fiberise Fit design config.
 * If checkoutProfileId is omitted, uses the store's published checkout profile.
 */

import { NextRequest, NextResponse } from 'next/server'
import { applyCheckoutBranding } from '@/lib/checkout-branding/apply-branding'
import type { CheckoutBrandingApiPayload } from '@/lib/checkout-branding/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    let payload: CheckoutBrandingApiPayload = {}
    const contentType = request.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const body = await request.json().catch(() => ({}))
      if (body && typeof body === 'object') {
        payload = {
          theme: body.theme,
          checkoutProfileId: body.checkoutProfileId,
        }
      }
    }

    const result = await applyCheckoutBranding(payload)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          userErrors: result.userErrors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      checkoutBranding: result.checkoutBranding,
      userErrors: result.userErrors,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
