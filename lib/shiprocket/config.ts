/**
 * Shiprocket API configuration.
 * Option A: Set SHIPROCKET_TOKEN in .env.local (Bearer token from Shiprocket auth).
 * Option B: Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD (API user from Shiprocket Panel > Settings > API).
 */
export const SHIPROCKET_CONFIG = {
  /** External API (auth, orders list, print invoice) - use .in with API credentials */
  baseUrl: 'https://apiv2.shiprocket.in/v1/external',
  token: process.env.SHIPROCKET_TOKEN?.trim() ?? '',
  email: process.env.SHIPROCKET_EMAIL ?? '',
  password: process.env.SHIPROCKET_PASSWORD ?? '',
}

export function isShiprocketConfigured(): boolean {
  return Boolean(
    SHIPROCKET_CONFIG.token ||
    (SHIPROCKET_CONFIG.email && SHIPROCKET_CONFIG.password)
  )
}
