/**
 * Phone-only user identification (no Firebase UID).
 */

export function normalizePhone(phone?: string | null): string {
  return phone ? phone.replace(/\D/g, '') : ''
}
