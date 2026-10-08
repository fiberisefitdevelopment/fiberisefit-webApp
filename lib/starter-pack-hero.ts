export const STARTER_PACK_HERO_IMAGE = '/starter-pack-7-day-trial.jpg'

export function isStarterPackHandle(handle: string | null | undefined): boolean {
  return (handle || '').toLowerCase().includes('starter')
}

/** Shopify featured creative "FEEL LIGHTER IN JUST 7 DAYS" (files/Unknown.png). */
export function isFeelLighterImage(src: string | null | undefined): boolean {
  if (!src) return false
  const path = decodeURIComponent(src.split('?')[0] || '').toLowerCase()
  const file = path.split('/').pop() || ''
  return file === 'unknown.png' || file.startsWith('unknown.') || path.includes('/unknown.png')
}

export function withoutFeelLighterImages(images: string[]): string[] {
  return images.filter((src) => src && src !== STARTER_PACK_HERO_IMAGE && !isFeelLighterImage(src))
}

export function withStarterPackHero(handle: string | null | undefined, images: string[]): string[] {
  const rest = withoutFeelLighterImages(images)
  if (!isStarterPackHandle(handle)) return rest
  return [STARTER_PACK_HERO_IMAGE, ...rest]
}
