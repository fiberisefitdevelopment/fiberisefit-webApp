/**
 * Applies checkout branding: resolves profile ID, merges config, maps to Shopify input, runs mutation.
 * Used by the Next.js API route; can be called from admin scripts or cron.
 */

import { shopifyAdminFetch } from '@/lib/shopify/admin-client'
import { FIBERISE_FIT_DESIGN_CONFIG, mergeDesignConfig } from './design-config'
import { mapDesignToCheckoutBrandingInput } from './map-design-to-shopify'
import {
  CHECKOUT_BRANDING_UPSERT_MUTATION,
  CHECKOUT_PROFILES_QUERY,
  type CheckoutBrandingUpsertVariables,
} from './mutations'
import type { CheckoutDesignConfig, CheckoutBrandingApiPayload } from './types'

export interface ApplyBrandingResult {
  success: boolean
  checkoutBranding?: Record<string, unknown>
  userErrors?: Array<{ field?: string[]; message: string; code?: string }>
  error?: string
}

/**
 * Fetches the published checkout profile ID for the store.
 * Uses Admin GraphQL checkoutProfiles(query: "is_published:true").
 *
 * Returns `string | undefined` instead of `null` so it can be
 * safely assigned to optional `checkoutProfileId?: string`.
 */
export async function getPublishedCheckoutProfileId(): Promise<string | undefined> {
  const data = await shopifyAdminFetch<{
    checkoutProfiles: {
      edges: Array<{
        node: { id: string; name: string; isPublished: boolean }
      }>
    }
  }>({
    query: CHECKOUT_PROFILES_QUERY,
    variables: { query: 'is_published:true', first: 5 },
  })

  const profile = data?.checkoutProfiles?.edges?.[0]?.node
  return profile?.isPublished ? profile.id : undefined
}

/**
 * Applies checkout branding from a design config.
 * If checkoutProfileId is not provided, fetches the published profile ID first.
 */
export async function applyCheckoutBranding(payload: CheckoutBrandingApiPayload = {}): Promise<ApplyBrandingResult> {
  try {
    let checkoutProfileId = payload.checkoutProfileId
    if (!checkoutProfileId) {
      checkoutProfileId = await getPublishedCheckoutProfileId()
      if (!checkoutProfileId) {
        return {
          success: false,
          error: 'No published checkout profile found. Publish a checkout profile in Shopify admin.',
        }
      }
    }

    const config: CheckoutDesignConfig = mergeDesignConfig(FIBERISE_FIT_DESIGN_CONFIG, payload.theme)
    const input = mapDesignToCheckoutBrandingInput(config)

    const variables: CheckoutBrandingUpsertVariables = {
      checkoutProfileId,
      input,
    }

    const data = await shopifyAdminFetch<{
      checkoutBrandingUpsert: {
        checkoutBranding: Record<string, unknown> | null
        userErrors: Array<{ field?: string[]; message: string; code?: string }>
      }
    }>({
      query: CHECKOUT_BRANDING_UPSERT_MUTATION,
      variables,
    })

    const result = data?.checkoutBrandingUpsert
    const userErrors = result?.userErrors ?? []
    const hasErrors = userErrors.length > 0

    return {
      success: !hasErrors,
      checkoutBranding: result?.checkoutBranding ?? undefined,
      userErrors: hasErrors ? userErrors : undefined,
      error: hasErrors ? userErrors.map((e) => e.message).join('; ') : undefined,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error applying checkout branding'
    return { success: false, error: message }
  }
}
