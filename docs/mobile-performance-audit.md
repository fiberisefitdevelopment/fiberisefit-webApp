# Fiberise Fit — Mobile load & UX audit

**Scope:** Mobile view on fiberisefit.com  
**Pages:** Homepage, Product pages, Science, Contact, Account login, Special offers, plus site-wide chrome  
**Date:** 20 Nov 2026  
**Method:** Code and asset inspection of this repo. Homepage Lighthouse numbers are from the existing mobile run in `scratch/iteration3-mobile.json` (local, throttled). Not a live field RUM report.

---

## Snapshot

| Issue | Severity | Where it hits first |
|---|---|---|
| Homepage LCP ~**4.1 s**, Time to Interactive ~**7.9 s** | High | First paint of ads / organic landing |
| Homepage reels load **original** WebMs (6–16 MB each), not the smaller `optimized/` copies | Critical | Scroll on homepage and product pages |
| Full-width “sustainable” video is **20 MB** | Critical | Lower homepage |
| Product page ships **uncompressed PNGs up to 15 MB** | Critical | PDP scroll, special-offer lower content |
| Product + special-offer pages are large **client components** that also pull homepage reels/video/science | High | Every pack page |
| GTM + Meta Pixel + Google Ads on **every** page | Medium | Contact, login, and all others |
| Science page loads many Framer Motion sections eagerly | Medium | `/science` |

On a typical Indian 4G connection these media files stall scrolling, heat the phone, and burn data before the customer can tap Buy Now.

---

## Site-wide (every page)

These run even when the page itself is light (Contact, Login).

1. **Third-party tags in `app/layout.tsx`**  
   Meta Pixel, Google Ads (`AW-17953867063`), and GTM (`GTM-W8MBF3JG`). Scripts are delayed until idle/scroll/click, but they still compete with first interaction on mobile.

2. **Header + announcement marquee**  
   Fixed bar, logo image, cart. The marquee duplicates ticker text many times. Light compared with video, but always on screen.

3. **Footer**  
   Full policy/link block on every route. Extra HTML on a phone; not the main bottleneck.

4. **Cart drawer**  
   Dynamically imported (good). Opens as a bottom sheet on mobile.

5. **Shopify product fetch**  
   Homepage and PDPs wait on Shopify. If Admin/Storefront is slow, hero/catalog appear late.

**UX:** A simple page (Contact) still feels like “the whole site is loading” because chrome + tags run first.

---

## 1. Main landing page (`/`)

**Measured (mobile Lighthouse, local):** FCP **1.5 s** · LCP **4.1 s** (score 0.46) · TTI **7.9 s** (score 0.43).

| Section | Why it is slow / heavy | UX impact |
|---|---|---|
| **Hero carousel** | Full-bleed 4:5 mobile banners, auto-rotate every 6s, Shopify products for Order Now. Optimized WebPs (~75–97 KB) are fine; LCP still ~4 s because JS/hydration + above-fold work. | Delayed first “real” image; CTA can feel dead until JS hydrates. |
| **Featured products carousel** | Client carousel: 3 copies of every pack for infinite loop, product images from Shopify CDN. | Extra layout/JS; swipe can hitch on first visit. |
| **Press marquee** | Several press logos (some PNG/JPG from `/news_logo`). Duplicated for infinite scroll. | Minor; extra requests right after hero. |
| **Reels** | **Worst homepage cost.** Config points at `/reels/reelN.webm` (e.g. reel9 **16 MB**, reel1 **12 MB**). Optimized copies exist under `/reels/optimized/` but are unused. 8 reels, DOM duplicated. IntersectionObserver still can pull multiple large files. | Scroll freeze, data spike, audio decode, battery. Customers often bounce here. |
| **Meditation / journey / ritual / energy images** | Mixed PNG/JPG/WebP in `/ritual/` and related paths; several large stills. | Jank while scrolling the story block. |
| **Conversion video** | `/videos/conversion.webm` (~**1.8 MB**), plays when in view. | Acceptable if truly lazy; still extra decode. |
| **Empowering / flavour mockups** | `lime and lemon mockup front.png` ~**9.5 MB**, `unflavoured mockup front.png` ~**8.7 MB**. Scroll animation is off on mobile, but images still load. | Long blank-then-pop on a mid-page section. |
| **Full-width video** | `/videos/sustainable-video.webm` **20 MB**, full viewport height, preload when ~300px away. | Biggest single stall on the landing page. Cellular users pay for a 20 MB loop they did not ask for. |
| **FAQ** | Mostly text. Light. | Fine. |

Below-fold sections use `next/dynamic` (good for JS). **Media weight is not deferred the same way** — videos and huge PNGs still download when they enter (or approach) the viewport.

---

## 2. Product pages (`/products/[slug]`)

`ProductPage.tsx` is a **~1,600-line client component**. It is not split. It **eagerly imports** Reels, VideoSection, Ritual, Energy Reset, Metabolism, Benefits, reviews.

| Section | Why it is slow / heavy | UX impact |
|---|---|---|
| **Hero + gallery** | Shopify images + variant UI + OTP checkout modal. | Buy box is usable if CDN images are sized; hydration still blocks buttons. |
| **How to use / safe / 333 / moneyback** | `/how to use mobile.png` **3.6 MB**, `/safe and natural - mobile.png` **2.6 MB**, `/333diff-mobile.png` **2.2 MB**. | Large stills stacked; scroll hitch. |
| **BlueSet / metabolic visual** | `/BlueSet.png` **6.1 MB**. | Heavy decode for one graphic. |
| **Routine strip** | `FIBERISE A+-08.png` **15 MB**, `A+-09` **8.2 MB**, `A+-10` **2.3 MB**, `A+-11` **3.7 MB**, `A+-16` **1.7 MB**. | Worst PDP media. Phones will stutter or skip frames. |
| **Reels (again)** | Same original 6–16 MB WebMs as homepage. | Repeats the homepage tax on every PDP. |
| **Conversion video + science blocks** | Homepage VideoSection + Metabolism + Benefits pulled into PDP. | Extra JS + video on a page that should stay shoppable. |
| **Reviews / FAQ** | Text-heavy. Light. | Fine. |

**UX:** Add to cart and Buy Now compete with megabytes of content below the fold. On 4G the page can feel unfinished for many seconds after the price is visible.

---

## 3. Science page (`/science`)

No `dynamic()` split. All sections mount together. Several use **Framer Motion** (`ScienceCards`, trust bar, data strip, Lyte-style motion on related blocks).

| Section | Why it is slow / heavy | UX impact |
|---|---|---|
| **Science hero** | `hero-image.png` **833 KB**, `priority`, `min-h-screen` layout. | Slow first image vs homepage’s small WebP banners. |
| **Cravings / glucose / metabolism / SCFA / gut** | Many illustrated sections + scroll animation hooks. | Long JS parse; scroll-linked work on a mid-range phone. |
| **Benefits grid** | Client component + scroll animation. Light assets. | Extra JS, not huge media. |
| **Featured products** | Same catalog grid/carousel as home. | Second Shopify/image burst. |
| **CTA** | Light. | Fine. |

**UX:** Educational page feels like a long animated microsite. Motion + hero image delay first useful read.

---

## 4. Contact page (`/contact`)

The form itself is small (name, email, subject, message). **Not a media problem.**

What still hurts mobile:

- Full Header, Footer, tags, cart JS.
- Client page (`'use client'`) for a simple form.

Marketplace QR form (`/contact/marketplace`) adds pincode lookup + WhatsApp OTP. That is network-bound (AiSensy / postal API), not megabyte media.

**UX:** Feels “heavy” because of site chrome, not the form. Should be one of the fastest pages after tags are trimmed or delayed further.

---

## 5. Account login (`/account/login`)

Light UI. Cost is **auth**, not images.

- Firebase initializes on `/account/*` (`AuthIdleWarmup`).
- WhatsApp OTP hits `/api/otp/whatsapp/send` + AiSensy.
- Recaptcha / SMS path is commented out (good for this page).

**UX:** First visit can pause on “loading” while Firebase boots. OTP send depends on WhatsApp API latency. No large media.

---

## 6. Special offers (`/special-offer`, `/offers/*`, campaign PDPs)

`SpecialOfferPage` is a large client page. It loads:

- Multi-pack image carousels (`/specialOfferCarousel/`, including several WhatsApp-export images, folder ~**8.1 MB**).
- `ProductPageLowerSections` — **same reels, conversion video, ritual, energy, metabolism, reviews** as the PDP.

Isolated offer URLs hide nav but **do not remove** the heavy lower sections.

**UX:** Offer landing should convert in the first screen. Instead it inherits the full PDP/homepage media stack. Slow gallery swaps (desktop comment in code about Chrome LCP) also apply on mobile.

---

## 7. Other pages worth noting

| Page | Load risk |
|---|---|
| **Lyte (`/lyte`)** | Entire page is client. Hero autoplays `/videos/lyte.webm` (**2.1 MB**). Multiple Framer Motion + scroll-transform sections. |
| **Blogs** | Images per post; usually lighter than home/PDP. |
| **Policies** | Text. Fine aside from chrome. |
| **Pack QR guide (`/guide/fyber`)** | Uses `how to use mobile.png` (3.6 MB) and routine PNGs — same oversized assets. |

---

## Ranked list: what damages mobile UX most

1. **Reels using uncompressed `/reels/reel*.webm` (6–16 MB)** on Home + PDP + Special offer.  
2. **`sustainable-video.webm` (20 MB)** full-screen on Home.  
3. **Product routine PNGs (especially 15 MB `FIBERISE A+-08.png`)** on PDP / offers / guide.  
4. **Flavour mockup PNGs (~9 MB)** on Home Empowering section.  
5. **`BlueSet.png` (6.1 MB)** and other 2–4 MB instructional PNGs on PDP.  
6. **Monolithic client ProductPage / SpecialOfferPage** bundling reels + video + science.  
7. **Science hero 833 KB PNG + eager Framer Motion.**  
8. **Always-on GTM / Meta / Google Ads** on Contact and Login.  
9. **Homepage TTI ~8 s** — Order Now / carousel feel delayed.  
10. **Firebase boot** on Account (acceptable, but visible).

---

## What is already in good shape

- Homepage hero banners in `/banners/optimized/` are small WebPs.  
- Below-fold homepage **JS** is dynamically imported.  
- Cart drawer is code-split.  
- Firebase is not initialized on every route.  
- Conversion / sustainable videos use `preload="none"` and intersection observers (the **file size** is still the problem).  
- Contact and Login pages have almost no local media.

---

## Recommended order of work (mobile)

1. Point reels at `/reels/optimized/` (or HLS/short muted clips ~300–800 KB). Cap concurrent videos at **one**.  
2. Replace `sustainable-video.webm` with a compressed poster + short loop (&lt;1 MB) or a still.  
3. Re-encode product/routine/how-to/mockup PNGs to WebP/AVIF under **150–250 KB**.  
4. Split ProductPage: shoppable hero first; lazy-load reels/video/science only near the viewport. Do the same for Special offer.  
5. Dynamic-import Science motion sections. Serve a compressed hero WebP.  
6. Keep GTM/Ads/Pixel off the critical path on Contact and Login (or load after form paint).

---

## File map (largest mobile offenders)

| File | Size | Used on |
|---|---|---|
| `public/videos/sustainable-video.webm` | 20 MB | Homepage |
| `public/reels/reel9.webm` (and peers 6–16 MB) | up to 16 MB | Home, PDP, Special offer |
| `public/product page routine images/FIBERISE A+-08.png` | 15 MB | PDP, guide |
| `public/team-photos/* mockup front.png` | ~9 MB each | Homepage |
| `public/product page routine images/FIBERISE A+-09.png` | 8.2 MB | PDP |
| `public/BlueSet.png` | 6.1 MB | PDP |
| `public/how to use mobile.png` | 3.6 MB | PDP, guide |
| `public/videos/lyte.webm` | 2.1 MB | Lyte |
| `public/videos/conversion.webm` | 1.8 MB | Home, PDP |
| `public/hero-image.png` | 833 KB | Science |

`public/reels/optimized/` already has smaller WebMs; the live player still requests the originals.
