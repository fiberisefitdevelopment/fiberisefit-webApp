export type ReelMedia = {
  id: string
  videoUrl: string
  posterUrl: string
}

const HIDDEN_REELS = new Set([3, 4, 5, 6, 7, 12])
const REEL_NUMBERS = Array.from({ length: 14 }, (_, i) => i + 1).filter((n) => !HIDDEN_REELS.has(n))

/** Original WebMs (with audio); posters are lightweight WebP previews. */
export function buildHomepageReels(): ReelMedia[] {
  return REEL_NUMBERS.map((n) => ({
    id: `reel-${n}`,
    videoUrl: `/reels/reel${n}.webm`,
    posterUrl: `/reels/posters/reel${n}.webp`,
  }))
}
