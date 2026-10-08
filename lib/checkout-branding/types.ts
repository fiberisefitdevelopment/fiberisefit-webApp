/**
 * Checkout branding types
 * Design config is our single source of truth; it gets mapped to Shopify CheckoutBrandingInput.
 */

/** Our design system – matches fiberisefit.com (colors, typography, sections, buttons). */
export interface CheckoutDesignConfig {
  colors: CheckoutDesignColors
  typography: CheckoutDesignTypography
  sections: CheckoutDesignSections
  buttons: CheckoutDesignButtons
  /** Optional: header logo image URL (must be hosted; PNG preferred). */
  header?: CheckoutDesignHeader
}

export interface CheckoutDesignColors {
  /** Main area background (e.g. Ivory Dream #faf8f3). */
  primaryBackground: string
  /** Primary text (e.g. Midnight Obsidian #1a1a1a). */
  primaryText: string
  /** Card / order summary background (e.g. white #ffffff). */
  cardBackground: string
  /** Border color (e.g. #e5e7eb). */
  border: string
  /** Links and accent (e.g. #1a1a1a). */
  accent: string
  /** Primary CTA background (e.g. black #000000). */
  primaryButtonBackground: string
  /** Primary CTA text (e.g. white #ffffff). */
  primaryButtonText: string
  /** Primary CTA hover background (e.g. #1f2937). */
  primaryButtonHoverBackground: string
  /** Secondary button background (e.g. transparent / white). */
  secondaryButtonBackground: string
  /** Secondary button text and border. */
  secondaryButtonText: string
  /** Secondary button hover background. */
  secondaryButtonHoverBackground: string
  /** Secondary button hover text. */
  secondaryButtonHoverText: string
  /** Form control background (inputs). */
  controlBackground: string
  /** Form control border. */
  controlBorder: string
  /** Global semantic colors (optional). */
  global?: {
    success?: string
    warning?: string
    critical?: string
    info?: string
    brand?: string
  }
}

export interface CheckoutDesignTypography {
  /** Base font size in px (e.g. 16). */
  baseSize: number
  /** Scale ratio for type scale (e.g. 1.25). */
  ratio: number
  /** Shopify font name for body/text (e.g. "Inter", "Assistant"). */
  primaryFontName: string
  /** Shopify font name for headings (e.g. same or "Inter"). */
  secondaryFontName: string
  /** Heading level 1: UPPER to match site's uppercase CTAs. */
  heading1LetterCase?: 'UPPER' | 'LOWER' | 'NONE'
  /** Heading level 1 weight: BOLD. */
  heading1Weight?: 'BOLD' | 'NORMAL'
  /** Heading level 1 size relative to base (e.g. "LARGE"). */
  heading1Size?: 'SMALL' | 'BASE' | 'LARGE'
  /** Primary button font: PRIMARY or SECONDARY. */
  primaryButtonFont?: 'PRIMARY' | 'SECONDARY'
}

export interface CheckoutDesignSections {
  /** Main content area: corner radius (BASE = 0.5rem feel, LARGE = card). */
  mainCornerRadius: 'NONE' | 'SMALL' | 'BASE' | 'LARGE'
  /** Main area color scheme reference (we map to COLOR_SCHEME1). */
  mainColorScheme: 'scheme1' | 'scheme2'
  /** Main section shadow (e.g. LARGE_200 for card feel). */
  mainShadow: 'BASE' | 'SMALL_100' | 'SMALL_200' | 'LARGE_100' | 'LARGE_200'
  /** Main section padding (e.g. LARGE_400). */
  mainPadding: string
  /** Order summary section corner radius. */
  orderSummaryCornerRadius: 'NONE' | 'SMALL' | 'BASE' | 'LARGE'
  /** Order summary color scheme. */
  orderSummaryColorScheme: 'scheme1' | 'scheme2'
  /** Order summary shadow. */
  orderSummaryShadow: 'BASE' | 'SMALL_100' | 'SMALL_200' | 'LARGE_100' | 'LARGE_200'
  /** Order summary padding. */
  orderSummaryPadding: string
  /** Order summary border: NONE, FULL, etc. */
  orderSummaryBorder: 'NONE' | 'FULL'
}

export interface CheckoutDesignButtons {
  /** Primary: corner radius (BASE = rounded-lg). */
  primaryCornerRadius: 'NONE' | 'SMALL' | 'BASE' | 'LARGE'
  /** Primary background style if using enum (we use colors from scheme). */
  primaryBackgroundStyle?: 'SOLID' | 'OUTLINE'
  /** Primary border: NONE, FULL. */
  primaryBorder: 'NONE' | 'FULL'
  /** Primary block padding (vertical). */
  primaryBlockPadding: 'NONE' | 'EXTRA_TIGHT' | 'TIGHT' | 'BASE' | 'LOOSE' | 'EXTRA_LOOSE'
  /** Primary inline padding (horizontal). */
  primaryInlinePadding: 'NONE' | 'EXTRA_TIGHT' | 'TIGHT' | 'BASE' | 'LOOSE' | 'EXTRA_LOOSE'
  /** Secondary same. */
  secondaryCornerRadius: 'NONE' | 'SMALL' | 'BASE' | 'LARGE'
  secondaryBorder: 'NONE' | 'FULL'
  secondaryBlockPadding: 'NONE' | 'EXTRA_TIGHT' | 'TIGHT' | 'BASE' | 'LOOSE' | 'EXTRA_LOOSE'
  secondaryInlinePadding: 'NONE' | 'EXTRA_TIGHT' | 'TIGHT' | 'BASE' | 'LOOSE' | 'EXTRA_LOOSE'
}

export interface CheckoutDesignHeader {
  /** Logo image URL (HTTPS; PNG preferred). Shopify may require media upload – see docs. */
  logoUrl?: string
  /** Header color scheme: COLOR_SCHEME1, COLOR_SCHEME2, TRANSPARENT. */
  colorScheme?: 'scheme1' | 'scheme2' | 'transparent'
  /** Padding keyword – must match CheckoutBrandingSpacingKeyword enum. */
  padding?: 'NONE' | 'BASE' | 'SMALL' | 'SMALL_100' | 'SMALL_200' | 'SMALL_300' | 'SMALL_400' | 'SMALL_500' | 'LARGE' | 'LARGE_100' | 'LARGE_200' | 'LARGE_300' | 'LARGE_400' | 'LARGE_500'
}

/** API payload: optional theme overrides + optional checkoutProfileId. */
export interface CheckoutBrandingApiPayload {
  /** If omitted, server uses default FIBERISE_FIT_DESIGN_CONFIG. */
  theme?: Partial<CheckoutDesignConfig>
  /** If omitted, server fetches published checkout profile ID. */
  checkoutProfileId?: string
}
