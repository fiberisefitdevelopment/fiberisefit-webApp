export type ReelMedia = {
  id: string
  videoUrl: string
  posterUrl: string
}

const HIDDEN_REELS = new Set([3, 4, 5, 6, 7, 12])

/** Shopify CDN videos, in the same 1–14 order as the old /reels/reelN.webm files. */
const SHOPIFY_REEL_VIDEOS = [
  'https://cdn.shopify.com/videos/c/o/v/576d4b981fb1474cba5bce735fa50ed9.webm',
  'https://cdn.shopify.com/videos/c/o/v/c650ab96f48b493eaae344969cf84be3.webm',
  'https://cdn.shopify.com/videos/c/o/v/e2b4fe8bb52f4fa6ba9b7efa4b0f64f5.webm',
  'https://cdn.shopify.com/videos/c/o/v/f98a8d9202b242e1bfe5a8a7d6545ced.webm',
  'https://cdn.shopify.com/videos/c/o/v/4b3c4a6fb98644269bac05bb9a939b42.webm',
  'https://cdn.shopify.com/videos/c/o/v/fb334990c7e7447f9dbea91aeaeadf57.webm',
  'https://cdn.shopify.com/videos/c/o/v/7258ea35777f4b4b931c21fb954a92e9.webm',
  'https://cdn.shopify.com/videos/c/o/v/7258ea35777f4b4b931c21fb954a92e9.webm',
  'https://cdn.shopify.com/videos/c/o/v/a99ea90a781a4f798934bf7c129b116d.webm',
  'https://cdn.shopify.com/videos/c/o/v/8145dc584e324467b3627e76a2875239.webm',
  'https://cdn.shopify.com/videos/c/o/v/35070c28bcb94192be8abe0e996a1c48.webm',
  'https://cdn.shopify.com/videos/c/o/v/5ead0ac56b5a4c98bb64f5751c01a54c.webm',
  'https://cdn.shopify.com/videos/c/o/v/b7e7771987eb4eb7b518f794ca2586d2.webm',
  'https://cdn.shopify.com/videos/c/o/v/f06e8743ac3d4481aaf6f604f46d3e91.webm',
] as const

/** Shopify CDN posters keyed by reel number in the filename (reel1.webp … reel14.webp). */
const SHOPIFY_REEL_POSTERS = [
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel1.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel2.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel3.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel4.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel5.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel6.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel7.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel8.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel9.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel10.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel11.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel12.webp?v=1795154685',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel13.webp?v=1795154686',
  'https://cdn.shopify.com/s/files/1/0959/3680/7187/files/reel14.webp?v=1795154686',
] as const

const REEL_NUMBERS = Array.from({ length: SHOPIFY_REEL_VIDEOS.length }, (_, i) => i + 1).filter(
  (n) => !HIDDEN_REELS.has(n)
)

export function buildHomepageReels(): ReelMedia[] {
  return REEL_NUMBERS.map((n) => ({
    id: `reel-${n}`,
    videoUrl: SHOPIFY_REEL_VIDEOS[n - 1],
    posterUrl: SHOPIFY_REEL_POSTERS[n - 1],
  }))
}
