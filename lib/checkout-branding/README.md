# Checkout Branding

Applies Fiberise Fit design system to Shopify hosted checkout via Admin GraphQL `checkoutBrandingUpsert`. Keeps checkout visually aligned with fiberisefit.com (colors, typography, sections, buttons).

## Requirements

- **Shopify Plus** or **development store**
- **Admin API** access with `read_checkout_branding_settings` and `write_checkout_branding_settings` (or `preferences`) scope
- Env: `SHOPIFY_ADMIN_ACCESS_TOKEN` (Admin API token); shop domain and API version from `lib/shopify/config.ts`

## Usage

**Apply default Fiberise Fit branding (from Next.js or any server):**

```ts
import { applyCheckoutBranding } from '@/lib/checkout-branding'

const result = await applyCheckoutBranding({})
// result.success, result.checkoutBranding, result.userErrors, result.error
```

**Apply with theme overrides:**

```ts
const result = await applyCheckoutBranding({
  theme: {
    colors: { primaryButtonBackground: '#111' },
    sections: { mainCornerRadius: 'LARGE' },
  },
  checkoutProfileId: 'gid://shopify/CheckoutProfile/123', // optional; otherwise uses published profile
})
```

**From the browser (e.g. admin settings page):**

```ts
const res = await fetch('/api/checkout-branding', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    theme: { colors: { primaryButtonBackground: '#111' } },
    checkoutProfileId: undefined, // optional
  }),
})
const data = await res.json()
```

## Structure

- **`types.ts`** – Design config and API payload types
- **`design-config.ts`** – Single source of truth (Fiberise Fit colors, typography, sections, buttons)
- **`map-design-to-shopify.ts`** – Converts our config → Shopify `CheckoutBrandingInput`
- **`mutations.ts`** – GraphQL: `checkoutBrandingUpsert`, `checkoutProfiles`
- **`apply-branding.ts`** – Resolves profile ID, merges config, maps, runs mutation
- **`index.ts`** – Re-exports public API

## What this does *not* do

- Does not change checkout **flow** or **logic** (information → shipping → payment)
- Does not replace Shopify checkout; only **styling/branding** via supported APIs
- For custom UI blocks in checkout, use **Checkout UI Extensions** separately
