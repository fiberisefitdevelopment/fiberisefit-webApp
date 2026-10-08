/**
 * Customer service ticket service.
 * Handles:
 *   1. Atomic ticket ID generation (#FF101, #FF102, ...)
 *   2. Image upload to Firebase Storage
 *   3. Firestore document creation in customer_service collection
 *
 * Uses Firebase v9 modular SDK.
 */

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { db, storage } from '@/lib/firebase/client-firestore'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TicketInput {
  name: string
  phone: string
  orderId?: string
  description: string
  imageFile?: File | null
}

export interface TicketResult {
  ticketId: string
  docId: string
}

export class ActiveTicketExistsError extends Error {
  activeTicketId: string | null
  activeTicketDocId: string | null

  constructor(message: string, activeTicketId?: string | null, activeTicketDocId?: string | null) {
    super(message)
    this.name = 'ActiveTicketExistsError'
    this.activeTicketId = activeTicketId ?? null
    this.activeTicketDocId = activeTicketDocId ?? null
  }
}

export interface TicketCommentInput {
  ticketDocId: string
  message: string
  authorName?: string
  authorType?: 'user' | 'agent' | 'system'
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

async function uploadTicketImage(file: File, ticketNumber: number): Promise<string> {
  const timestamp = Date.now()
  const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `customer_service_images/FF${ticketNumber}_${timestamp}_${safeFilename}`

  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000',
  })

  return getDownloadURL(snapshot.ref)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function createSupportTicket(input: TicketInput): Promise<TicketResult> {
  console.log('[ticketService] Starting ticket creation...')

  // Step 1: Upload image (non-blocking on failure)
  let imageUrl: string | null = null
  if (input.imageFile) {
    try {
      console.log('[ticketService] Uploading image...')
      imageUrl = await uploadTicketImage(input.imageFile, Date.now())
      console.log('[ticketService] Image uploaded:', imageUrl)
    } catch (err) {
      console.error('[ticketService] Image upload failed (continuing without image):', err)
    }
  }

  // Step 2: Create ticket via server API (enforces one-active-ticket rule)
  const response = await fetch('/api/support/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name.trim(),
      phone: input.phone.trim(),
      orderId: input.orderId?.trim() || null,
      description: input.description.trim(),
      imageUrl,
    }),
  })

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean
    code?: string
    message?: string
    ticketId?: string
    docId?: string
    activeTicket?: {
      id?: string
      ticketId?: string | null
      status?: string
    }
  }

  if (response.status === 409 && payload.code === 'ACTIVE_TICKET_EXISTS') {
    throw new ActiveTicketExistsError(
      payload.message || 'You already have an active ticket. Please continue updates on that ticket.',
      payload.activeTicket?.ticketId ?? null,
      payload.activeTicket?.id ?? null
    )
  }

  if (!response.ok || !payload.success || !payload.ticketId || !payload.docId) {
    throw new Error(payload.message || 'Failed to create ticket')
  }

  return { ticketId: payload.ticketId, docId: payload.docId }
}

export async function addTicketComment(input: TicketCommentInput): Promise<{ commentId: string }> {
  const ticketDocId = input.ticketDocId.trim()
  const message = input.message.trim()
  const authorType = input.authorType || 'user'
  const authorName = input.authorName?.trim() || null

  if (!ticketDocId) {
    throw new Error('Ticket id is required')
  }
  if (!message) {
    throw new Error('Comment message is required')
  }

  const ticketRef = doc(db, 'customer_service', ticketDocId)
  const ticketSnap = await getDoc(ticketRef)
  if (!ticketSnap.exists()) {
    throw new Error('Ticket not found')
  }

  const commentsRef = collection(db, 'customer_service', ticketDocId, 'comments')
  const commentDoc = await addDoc(commentsRef, {
    message,
    author_name: authorName,
    author_type: authorType,
    created_at: serverTimestamp(),
  })

  await updateDoc(ticketRef, {
    updated_at: serverTimestamp(),
    last_comment_at: serverTimestamp(),
  })

  return { commentId: commentDoc.id }
}
