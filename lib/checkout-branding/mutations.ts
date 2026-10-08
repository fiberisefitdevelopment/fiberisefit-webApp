/**
 * Admin GraphQL: checkout branding upsert + checkout profiles query.
 * Requires Shopify Plus or development store; read_checkout_branding_settings + write_checkout_branding_settings (or preferences).
 */

import type { CheckoutBrandingInput } from './map-design-to-shopify'

/** Fetch published checkout profile ID (required for checkoutBrandingUpsert). */
export const CHECKOUT_PROFILES_QUERY = `
  query CheckoutProfiles($query: String, $first: Int!) {
    checkoutProfiles(first: $first, query: $query) {
      edges {
        node {
          id
          name
          isPublished
        }
      }
    }
  }
`

/**
 * Full checkoutBrandingUpsert mutation.
 * Variables: $checkoutProfileId: ID!, $input: CheckoutBrandingInput!
 */
export const CHECKOUT_BRANDING_UPSERT_MUTATION = `
  mutation CheckoutBrandingUpsert($checkoutProfileId: ID!, $input: CheckoutBrandingInput!) {
    checkoutBrandingUpsert(checkoutProfileId: $checkoutProfileId, checkoutBrandingInput: $input) {
      checkoutBranding {
        designSystem {
          colors {
            schemes {
              scheme1 { base { background text } }
              scheme2 { base { background text } }
            }
          }
          typography {
            size { base ratio }
            primary { base { sources } }
            secondary { base { sources } }
          }
        }
        customizations {
          main { section { cornerRadius colorScheme shadow padding } }
          orderSummary { section { cornerRadius colorScheme shadow padding border } }
          primaryButton { cornerRadius border blockPadding inlinePadding typography { font } }
          secondaryButton { cornerRadius border blockPadding inlinePadding }
          header { colorScheme padding }
          headingLevel1 { typography { size letterCase weight } }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`

export type CheckoutProfilesQueryVariables = {
  query?: string
  first: number
}

export type CheckoutBrandingUpsertVariables = {
  checkoutProfileId: string
  input: CheckoutBrandingInput
}
