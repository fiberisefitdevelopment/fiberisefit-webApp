# CRO Phase 1 — Current State Analysis (fiberisefit.com)

## CURRENT STATE

### Product Listing (PLP)
- **Locations**: `FeaturedProductsSection` (homepage), `ProductsCarouselSection` (homepage/other). No dedicated `/collections/[handle]` page in app (API exists at `api/shopify/collections/[handle]`).
- **Product cards**: Title, image, servings (Featured only), price (Featured shows MRP strikethrough + sale when `maxPrice > price`), Add to Cart (hover-reveal in Featured; always visible in Carousel). Carousel does NOT show maxPrice/servings.
- **Data**: From `/api/shopify/products?all=true`. Response includes `price`, `maxPrice`, `servings`, `available`, `variants`, `id` (variant GID).

### Product Detail Page (PDP)
- **File**: `components/pages/ProductPage.tsx`
- **Existing**: Breadcrumb, image gallery, title, ingredient tags, description, variant selection, single price (no MRP/savings), quantity + Add to Cart, “+10000 Happy Customers | Free shipping on US”, payment icons (VISA, MC, AMEX, PP), accordions (Benefits, How to Take, Ingredients), “Enhance Your Daily Routine” images, full-width marquee, VideoSection, Why Women’s Multi, Reels, FAQ accordion, testimonial, 4 trust pillars, Join Our Circle, **Sticky Add to Cart** (mobile/desktop when hero out of view).
- **Missing**: Frequently Bought Together, Bundle offers, Limited time offer banner with timer, Trust strip (COD / Easy Returns / Delivery promise), Review section above fold (summary), FAQ above fold (currently below), explicit “How to Use” section (content in accordion).

### Cart
- **Component**: `CartDrawer.tsx`. Items, quantity controls, remove, promo code, subtotal, Checkout CTA, OTP gate when not logged in.
- **No**: Trust badges near CTA, delivery promise text.

### Checkout
- **Flow**: Redirect to Shopify checkout via `/api/checkout/create` (cart create + optional discount + redirect). No on-site checkout UI.
- **DO NOT MODIFY**: Checkout API, redirect logic, cart line items structure.

### Header / Footer
- **Header**: Announcement marquee (delivery/shipping), logo, nav (Science, Contact, Lyte), cart, login. No trust badges in header.
- **Footer**: Products, Social, Legal, payment icons (UPI, VISA, MC, AMEX, Diners), brand logo.

---

## MISSING CRO

| Area | Missing |
|------|--------|
| PLP cards | USP badges (max 3), rating below title, discount %, consistent MRP/sale/discount across both sections, weight/quantity (servings), Quick Add (already present as “Add to Cart”) |
| PDP | FBT, Bundle (Buy 2 Save More), Limited time banner + timer, Trust strip (COD / Returns / Delivery), Review summary above fold, FAQ above fold optional |
| Pricing | PDP shows only sale price; no MRP strikethrough, savings amount, or savings % |
| Trust | Near CTA: Secure Payment, COD, Easy Returns, Delivery promise (partial in PDP line) |
| Urgency | Stock low (only if real data), sale timer (server-synced or safe client fallback) |
| Support | WhatsApp / Live chat entry (floating, non-intrusive) |
| Analytics | Events: Viewed FBT, Clicked Bundle, Timer Viewed, Sticky ATC Clicked, FAQ Expanded (add only if missing, do not change existing) |

---

## LOW RISK ADDITIONS

- New components only, no changes to cart/checkout/variant logic: **TrustStrip**, **TrustBadgesNearCTA**, **LimitedTimeBanner** (timer fails gracefully), **FBT section** (async, hide if no data), **Bundle section** (async, hide if no data), **ReviewSummary** (static or optional data), **FloatingSupport** (WhatsApp/support).
- Add optional fields to API response: `compareAtPrice` (variant) in Shopify formatter; keep existing fields unchanged.
- Product card: Reusable **ProductCard** with USPs, rating placeholder (lazy), MRP/sale/discount %, servings; same Add to Cart behavior (no new cart logic).
- PDP: Pricing psychology block (MRP, sale, savings) using existing price + optional compareAtPrice.
- Feature flags for new CRO sections (env or config object).
- Analytics: Fire new events only when `window.gtag` or existing analytics exists; no changes to current events.

---

## MEDIUM RISK MODIFICATIONS

- **ProductPage.tsx**: Adding multiple sections and moving FAQ/Review above fold could shift layout; implement as additive sections with stable ATC position and lazy/async loading so ATC and hero are not blocked.
- **FeaturedProductsSection / ProductsCarouselSection**: Replacing inline card with shared **ProductCard**; must preserve `addItem` payload (id, title, price, image) and link to `/products/[slug]`. Use first variant id for addItem when multiple variants.
- **Shopify queries**: Adding `compareAtPrice` to product/variant queries and formatter; ensure backward compatibility (optional field, no removal of existing fields).

---

## DO NOT TOUCH ZONES

- `app/api/checkout/create/route.ts` — no changes.
- `store/cartStore.ts` — no changes to interface or addItem/updateQuantity/removeItem logic.
- `CartDrawer.tsx` — no changes to checkout flow, promo apply, or cart line structure; trust copy/badges near CTA allowed as additive only.
- Variant selection logic on PDP — no changes to state or how selected variant is passed to addItem.
- Route names and query params — no changes.
- Database schema — no changes.
- Existing analytics event names and payloads — only add new events; do not modify existing ones.
- Checkout redirect and Shopify cart creation flow.

---

## DATA AVAILABILITY

- **Compare at price**: Not in current Storefront queries; Shopify supports `compareAtPrice` on variant. Add to GraphQL and formatter (optional).
- **Ratings**: No ratings API found; use placeholder or “No ratings” and lazy-load if/when API exists.
- **FBT / Bundles**: No backend endpoints; implement with static/config or optional API; sections hide when no data.
- **Stock level**: Not in current product response; do not show “low stock” until real data exists.
- **Sale end time**: No server field; timer can be config-driven or product metafield later; fail gracefully (no block, no fake urgency).
