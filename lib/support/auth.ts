/**
 * Shared auth utilities for all /api/support/* endpoints.
 * Validates x-salesiq-signature header against SALESIQ_SUPPORT_SHARED_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, isRateLimited } from './rate-limiter'

export interface AuthResult {
  ok: boolean
  ip: string
  errorResponse?: ReturnType<typeof NextResponse.json>
}

/**
 * Validate the shared secret and apply rate limiting.
 * Returns { ok: true, ip } on success.
 * Returns { ok: false, errorResponse } on failure — return errorResponse immediately.
 */
export function validateSupportRequest(req: NextRequest): AuthResult {
  const ip = getClientIp(req)

  // Rate limit: 10 requests / minute per IP
  if (isRateLimited(ip, { limit: 10, windowMs: 60_000 })) {
    return {
      ok: false,
      ip,
      errorResponse: NextResponse.json(
        { success: false, message: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      ),
    }
  }

  const sharedSecret = process.env.SALESIQ_SUPPORT_SHARED_SECRET
  if (!sharedSecret) {
    console.error('[support-auth] SALESIQ_SUPPORT_SHARED_SECRET not configured')
    return {
      ok: false,
      ip,
      errorResponse: NextResponse.json(
        { success: false, message: 'Something went wrong' },
        { status: 500 }
      ),
    }
  }

  const provided = (
    req.headers.get('x-salesiq-signature') ??
    req.headers.get('authorization')
  )
    ?.replace(/^Bearer\s+/i, '')
    .trim()

  if (!provided || provided !== sharedSecret) {
    return {
      ok: false,
      ip,
      errorResponse: NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  return { ok: true, ip }
}

/**
 * Sanitize and extract the numeric order ID from any user input.
 * Handles: "1021", "#1021", "order 1021", "my order is 1021", "ORDER#1021"
 */
export function extractOrderNumber(raw: string): string {
  // Step 1: lowercase and trim
  let cleaned = raw.toLowerCase().trim()

  // Step 2: remove common phrases
  const phrases = ['my order is', 'my order number is', 'order number', 'order no', 'order is', 'order']
  for (const phrase of phrases) {
    cleaned = cleaned.replace(phrase, '')
  }

  // Step 3: remove all non-digit, non-hash characters except spaces
  cleaned = cleaned.replace(/[^0-9#\s]/g, '').trim()

  // Step 4: remove # and spaces, keep only digits
  const digits = cleaned.replace(/[^0-9]/g, '').trim()

  if (!digits) return ''

  // Step 5: return with # prefix (Shopify format)
  return `#${digits}`
}
