export function getProductRatingBySlug(slug?: string): number {
  const key = (slug || '').toLowerCase()

  const map: Record<string, number> = {
    'starter-pack': 4.6,
    'transformation-pack': 4.9,
    'transformation-pack-lyte-band': 4.9,
    'ultimate-pack': 4.8,
    'elite-pack': 4.8,
    lyte: 4.7,
  }

  return map[key] ?? 4.5
}
