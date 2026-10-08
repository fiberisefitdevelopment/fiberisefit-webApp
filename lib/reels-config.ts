export type ReelMedia = {
  id: string
  videoUrl: string
  posterUrl: string
}

const REEL_NUMBERS = Array.from({ length: 14 }, (_, i) => i + 1).filter((n) => n !== 5)

/** Original WebMs (with audio); posters are lightweight WebP previews. */
export function buildHomepageReels(): ReelMedia[] {
  return REEL_NUMBERS.map((n) => ({
    id: `reel-${n}`,
    videoUrl: `/reels/reel${n}.webm`,
    posterUrl: `/reels/posters/reel${n}.webp`,
  }))
}
