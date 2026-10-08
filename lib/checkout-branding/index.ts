/**
 * Checkout branding module
 * Design config → Shopify CheckoutBrandingInput → Admin API
 */

export { applyCheckoutBranding, getPublishedCheckoutProfileId } from './apply-branding'
export type { ApplyBrandingResult } from './apply-branding'
export { FIBERISE_FIT_DESIGN_CONFIG, mergeDesignConfig } from './design-config'
export { mapDesignToCheckoutBrandingInput } from './map-design-to-shopify'
export type { CheckoutBrandingInput } from './map-design-to-shopify'
export { CHECKOUT_BRANDING_UPSERT_MUTATION, CHECKOUT_PROFILES_QUERY } from './mutations'
export type {
  CheckoutDesignConfig,
  CheckoutDesignColors,
  CheckoutDesignTypography,
  CheckoutDesignSections,
  CheckoutDesignButtons,
  CheckoutDesignHeader,
  CheckoutBrandingApiPayload,
} from './types'
