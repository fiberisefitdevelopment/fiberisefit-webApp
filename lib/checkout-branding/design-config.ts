/**
 * Fiberise Fit checkout design config
 * Single source of truth – extracted from fiberisefit.com (globals.css, CartDrawer, ProductPage, etc.)
 * Premium, clean, fitness + performance feel; high-contrast CTAs; modern card-style checkout.
 */

import type { CheckoutDesignConfig } from './types'

/** Hex values and tokens aligned with site (Ivory Dream, Midnight Obsidian, QuadratGrotesk feel). */
export const FIBERISE_FIT_DESIGN_CONFIG: CheckoutDesignConfig = {
  colors: {
    primaryBackground: '#faf8f3', // Ivory Dream – body background
    primaryText: '#1a1a1a', // Midnight Obsidian
    cardBackground: '#ffffff',
    border: '#e5e7eb', // gray-200
    accent: '#1a1a1a',
    primaryButtonBackground: '#000000',
    primaryButtonText: '#ffffff',
    primaryButtonHoverBackground: '#1f2937', // gray-800
    secondaryButtonBackground: '#ffffff',
    secondaryButtonText: '#1a1a1a',
    secondaryButtonHoverBackground: '#1a1a1a',
    secondaryButtonHoverText: '#ffffff',
    controlBackground: '#ffffff',
    controlBorder: '#e5e7eb',
    global: {
      success: '#16a34a',
      warning: '#ca8a04',
      critical: '#dc2626',
      info: '#2563eb',
      brand: '#1a1a1a',
    },
  },
  typography: {
    baseSize: 16,
    ratio: 1.25,
    primaryFontName: 'Inter', // Clean, matches site fallback; QuadratGrotesk would need custom font upload
    secondaryFontName: 'Inter',
    heading1LetterCase: 'UPPER',
    heading1Weight: 'BOLD',
    heading1Size: 'LARGE',
    primaryButtonFont: 'SECONDARY',
  },
  sections: {
    mainCornerRadius: 'LARGE',
    mainColorScheme: 'scheme1',
    mainShadow: 'LARGE_200',
    mainPadding: 'LARGE_400',
    orderSummaryCornerRadius: 'LARGE',
    orderSummaryColorScheme: 'scheme2',
    orderSummaryShadow: 'LARGE_200',
    orderSummaryPadding: 'LARGE_400',
    orderSummaryBorder: 'FULL',
  },
  buttons: {
    primaryCornerRadius: 'BASE',
    primaryBackgroundStyle: 'SOLID',
    primaryBorder: 'NONE',
    primaryBlockPadding: 'BASE',
    primaryInlinePadding: 'LOOSE',
    secondaryCornerRadius: 'BASE',
    secondaryBorder: 'FULL',
    secondaryBlockPadding: 'BASE',
    secondaryInlinePadding: 'LOOSE',
  },
  header: {
    colorScheme: 'scheme1',
    padding: 'SMALL_200',
  },
}

/**
 * Merges partial theme overrides into the default config.
 * Used when API receives a custom theme payload.
 */
export function mergeDesignConfig(
  base: CheckoutDesignConfig,
  overrides: Partial<CheckoutDesignConfig> | undefined
): CheckoutDesignConfig {
  if (!overrides) return base
  return {
    colors: { ...base.colors, ...overrides.colors },
    typography: { ...base.typography, ...overrides.typography },
    sections: { ...base.sections, ...overrides.sections },
    buttons: { ...base.buttons, ...overrides.buttons },
    header: overrides.header !== undefined ? { ...base.header, ...overrides.header } : base.header,
  }
}
