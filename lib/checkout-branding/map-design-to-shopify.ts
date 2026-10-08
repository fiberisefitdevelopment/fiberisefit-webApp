/**
 * Maps our design config to Shopify CheckoutBrandingInput.
 * Keeps GraphQL mutation logic separate from design config.
 */

import type { CheckoutDesignConfig } from './types'

/** Shopify expects hex strings for colors and specific enums for layout. */
export interface CheckoutBrandingInput {
  designSystem?: {
    colors?: {
      global?: {
        success?: string
        warning?: string
        critical?: string
        info?: string
        brand?: string
        accent?: string
        decorative?: string
      }
      schemes?: {
        scheme1?: {
          base?: { background?: string; text?: string; border?: string; accent?: string; icon?: string; decorative?: string }
          control?: { background?: string; border?: string; selected?: { background?: string; border?: string } }
          primaryButton?: {
            background?: string
            text?: string
            border?: string
            hover?: { background?: string; text?: string; border?: string }
          }
          secondaryButton?: {
            background?: string
            text?: string
            border?: string
            hover?: { background?: string; text?: string; border?: string }
          }
        }
        scheme2?: {
          base?: { background?: string; text?: string; border?: string; accent?: string; icon?: string; decorative?: string }
          control?: { background?: string; border?: string; selected?: { background?: string; border?: string } }
          primaryButton?: {
            background?: string
            text?: string
            border?: string
            hover?: { background?: string; text?: string; border?: string }
          }
          secondaryButton?: {
            background?: string
            text?: string
            border?: string
            hover?: { background?: string; text?: string; border?: string }
          }
        }
      }
    }
    typography?: {
      size?: { base?: number; ratio?: number }
      primary?: { shopifyFontGroup?: { name: string } }
      secondary?: { shopifyFontGroup?: { name: string } }
    }
    cornerRadius?: {
      base?: number
      small?: number
      large?: number
    }
  }
  customizations?: {
    main?: {
      colorScheme?: 'COLOR_SCHEME1' | 'COLOR_SCHEME2' | 'COLOR_SCHEME3' | 'COLOR_SCHEME4' | 'TRANSPARENT'
      section?: {
        cornerRadius?: 'NONE' | 'SMALL' | 'BASE' | 'LARGE'
        colorScheme?: 'COLOR_SCHEME1' | 'COLOR_SCHEME2' | 'COLOR_SCHEME3' | 'COLOR_SCHEME4' | 'TRANSPARENT'
        shadow?: 'BASE' | 'SMALL_100' | 'SMALL_200' | 'LARGE_100' | 'LARGE_200'
        padding?: string
      }
    }
    orderSummary?: {
      colorScheme?: 'COLOR_SCHEME1' | 'COLOR_SCHEME2' | 'COLOR_SCHEME3' | 'COLOR_SCHEME4' | 'TRANSPARENT'
      section?: {
        cornerRadius?: 'NONE' | 'SMALL' | 'BASE' | 'LARGE'
        colorScheme?: 'COLOR_SCHEME1' | 'COLOR_SCHEME2' | 'COLOR_SCHEME3' | 'COLOR_SCHEME4' | 'TRANSPARENT'
        shadow?: 'BASE' | 'SMALL_100' | 'SMALL_200' | 'LARGE_100' | 'LARGE_200'
        padding?: string
        border?: 'NONE' | 'FULL'
      }
    }
    primaryButton?: {
      cornerRadius?: 'NONE' | 'SMALL' | 'BASE' | 'LARGE'
      border?: 'NONE' | 'FULL'
      blockPadding?: 'NONE' | 'EXTRA_TIGHT' | 'TIGHT' | 'BASE' | 'LOOSE' | 'EXTRA_LOOSE'
      inlinePadding?: 'NONE' | 'EXTRA_TIGHT' | 'TIGHT' | 'BASE' | 'LOOSE' | 'EXTRA_LOOSE'
      typography?: { font?: 'PRIMARY' | 'SECONDARY' }
    }
    secondaryButton?: {
      cornerRadius?: 'NONE' | 'SMALL' | 'BASE' | 'LARGE'
      border?: 'NONE' | 'FULL'
      blockPadding?: 'NONE' | 'EXTRA_TIGHT' | 'TIGHT' | 'BASE' | 'LOOSE' | 'EXTRA_LOOSE'
      inlinePadding?: 'NONE' | 'EXTRA_TIGHT' | 'TIGHT' | 'BASE' | 'LOOSE' | 'EXTRA_LOOSE'
      typography?: { font?: 'PRIMARY' | 'SECONDARY' }
    }
    header?: {
      colorScheme?: 'COLOR_SCHEME1' | 'COLOR_SCHEME2' | 'COLOR_SCHEME3' | 'COLOR_SCHEME4' | 'TRANSPARENT'
      padding?: string
    }
    headingLevel1?: {
      typography?: {
        size?: 'SMALL' | 'BASE' | 'LARGE'
        letterCase?: 'UPPER' | 'LOWER' | 'NONE'
        weight?: 'BOLD' | 'NORMAL'
      }
    }
  }
}

const SCHEME_SELECTION = {
  scheme1: 'COLOR_SCHEME1' as const,
  scheme2: 'COLOR_SCHEME2' as const,
  scheme3: 'COLOR_SCHEME3' as const,
  scheme4: 'COLOR_SCHEME4' as const,
  transparent: 'TRANSPARENT' as const,
}

/**
 * Converts our CheckoutDesignConfig into Shopify CheckoutBrandingInput.
 * Used by the API route before calling checkoutBrandingUpsert.
 */
export function mapDesignToCheckoutBrandingInput(config: CheckoutDesignConfig): CheckoutBrandingInput {
  const c = config.colors
  const t = config.typography
  const s = config.sections
  const b = config.buttons
  const header = config.header

  return {
    designSystem: {
      colors: {
        global: c.global
          ? {
              success: c.global.success,
              warning: c.global.warning,
              critical: c.global.critical,
              info: c.global.info,
              brand: c.global.brand,
            }
          : undefined,
        schemes: {
          scheme1: {
            base: {
              background: c.primaryBackground,
              text: c.primaryText,
              border: c.border,
              accent: c.accent,
              icon: c.primaryText,
              decorative: c.border,
            },
            control: {
              background: c.controlBackground,
              border: c.controlBorder,
              selected: { background: '#f5f5f5', border: c.controlBorder },
            },
            primaryButton: {
              background: c.primaryButtonBackground,
              text: c.primaryButtonText,
              border: c.primaryButtonBackground,
              hover: {
                background: c.primaryButtonHoverBackground,
                text: c.primaryButtonText,
                border: c.primaryButtonHoverBackground,
              },
            },
            secondaryButton: {
              background: c.secondaryButtonBackground,
              text: c.secondaryButtonText,
              border: c.border,
              hover: {
                background: c.secondaryButtonHoverBackground,
                text: c.secondaryButtonHoverText,
                border: c.secondaryButtonHoverBackground,
              },
            },
          },
          scheme2: {
            base: {
              background: c.cardBackground,
              text: c.primaryText,
              border: c.border,
              accent: c.accent,
              icon: c.primaryText,
              decorative: c.border,
            },
            control: {
              background: c.controlBackground,
              border: c.controlBorder,
              selected: { background: '#f5f5f5', border: c.controlBorder },
            },
            primaryButton: {
              background: c.primaryButtonBackground,
              text: c.primaryButtonText,
              border: c.primaryButtonBackground,
              hover: {
                background: c.primaryButtonHoverBackground,
                text: c.primaryButtonText,
                border: c.primaryButtonHoverBackground,
              },
            },
            secondaryButton: {
              background: c.secondaryButtonBackground,
              text: c.secondaryButtonText,
              border: c.border,
              hover: {
                background: c.secondaryButtonHoverBackground,
                text: c.secondaryButtonHoverText,
                border: c.secondaryButtonHoverBackground,
              },
            },
          },
        },
      },
      typography: {
        size: { base: t.baseSize, ratio: t.ratio },
        primary: { shopifyFontGroup: { name: t.primaryFontName } },
        secondary: { shopifyFontGroup: { name: t.secondaryFontName } },
      },
      cornerRadius: {
        base: 8,
        small: 4,
        large: 12,
      },
    },
    customizations: {
      main: {
        colorScheme: s.mainColorScheme === 'scheme1' ? SCHEME_SELECTION.scheme1 : SCHEME_SELECTION.scheme2,
        section: {
          cornerRadius: s.mainCornerRadius,
          colorScheme: s.mainColorScheme === 'scheme1' ? SCHEME_SELECTION.scheme1 : SCHEME_SELECTION.scheme2,
          shadow: s.mainShadow,
          padding: s.mainPadding,
        },
      },
      orderSummary: {
        colorScheme: s.orderSummaryColorScheme === 'scheme1' ? SCHEME_SELECTION.scheme1 : SCHEME_SELECTION.scheme2,
        section: {
          cornerRadius: s.orderSummaryCornerRadius,
          colorScheme: s.orderSummaryColorScheme === 'scheme1' ? SCHEME_SELECTION.scheme1 : SCHEME_SELECTION.scheme2,
          shadow: s.orderSummaryShadow,
          padding: s.orderSummaryPadding,
          border: s.orderSummaryBorder,
        },
      },
      primaryButton: {
        cornerRadius: b.primaryCornerRadius,
        border: b.primaryBorder,
        blockPadding: b.primaryBlockPadding,
        inlinePadding: b.primaryInlinePadding,
        typography: t.primaryButtonFont ? { font: t.primaryButtonFont } : undefined,
      },
      secondaryButton: {
        cornerRadius: b.secondaryCornerRadius,
        border: b.secondaryBorder,
        blockPadding: b.secondaryBlockPadding,
        inlinePadding: b.secondaryInlinePadding,
      },
      header: header
        ? {
            colorScheme:
              header.colorScheme === 'transparent'
                ? SCHEME_SELECTION.transparent
                : header.colorScheme === 'scheme2'
                  ? SCHEME_SELECTION.scheme2
                  : SCHEME_SELECTION.scheme1,
            padding: header.padding,
          }
        : undefined,
      headingLevel1:
        t.heading1LetterCase || t.heading1Weight || t.heading1Size
          ? {
              typography: {
                size: t.heading1Size,
                letterCase: t.heading1LetterCase,
                weight: t.heading1Weight,
              },
            }
          : undefined,
    },
  }
}
