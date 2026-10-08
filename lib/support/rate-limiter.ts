/**
 * In-memory IP-based rate limiter for support endpoints.
 * Resets per window. Safe for single-instance Next.js deployments.
 * For multi-instance/serverless, replace with Redis (Upstash).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of Array.from(store.entries())) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  /** Max requests per window */
  limit: number
  /** Window in milliseconds */
  windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 10,
  windowMs: 60_000, // 1 minute
}

/**
 * Returns true if the given key (IP or identifier) is over the rate limit.
 */
export function isRateLimited(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return false
  }

  if (entry.count >= config.limit) return true

  entry.count += 1
  return false
}

/**
 * Extract the real client IP from Next.js request headers.
 */
export function getClientIp(req: { headers: { get: (key: string) => string | null } }): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}
