/**
 * Structured support request logger.
 * Logs to Firestore (collection: supportLogs) for CRM visibility.
 * All writes are fire-and-forget — never block the response.
 */

import { adminDb, isAdminInitialized } from '@/lib/firebase/admin'

export type SupportAction =
  | 'order_lookup'
  | 'cancel_request'
  | 'return_request'
  | 'escalation'
  | 'product_inquiry'

export interface SupportLogEntry {
  action: SupportAction
  orderNumber?: string
  phone?: string
  /** Result: found, not_found, error, already_fulfilled, already_cancelled, etc. */
  result: string
  /** Extra metadata: status, tracking, error message, etc. */
  meta?: Record<string, unknown>
  /** ISO timestamp (set automatically) */
  timestamp?: string
  ip?: string
}

/**
 * Fire-and-forget log to Firestore.
 * Never throws — safe to call without await.
 */
export function logSupportEvent(entry: SupportLogEntry): void {
  if (!isAdminInitialized() || !adminDb) return

  const doc: SupportLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  }

  adminDb
    .collection('supportLogs')
    .add(doc)
    .catch((err: unknown) => {
      console.error('[support-logger] Failed to write log:', err)
    })
}
