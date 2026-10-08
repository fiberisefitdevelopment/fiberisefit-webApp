import { NextRequest, NextResponse } from 'next/server'
import { adminDb, isAdminInitialized, getInitError } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

type TicketStatus = 'open' | 'closed' | 'in_progress'

interface TicketResponseItem {
  id: string
  ticketId: string | null
  name: string | null
  phone: string | null
  orderId: string | null
  description: string | null
  imageUrl: string | null
  status: string | null
  createdAt: string | null
}

interface UpdateTicketBody {
  id?: string
  ticketId?: string | null
  name?: string | null
  phone?: string | null
  orderId?: string | null
  description?: string | null
  imageUrl?: string | null
  status?: string | null
}

interface CreateTicketBody {
  name?: string
  phone?: string
  orderId?: string | null
  description?: string
  imageUrl?: string | null
}

function parseLimit(raw: string | null): number {
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return 100
  return Math.min(parsed, 500)
}

function normalizeStatus(raw: string | null): TicketStatus | null {
  if (!raw) return null
  const value = raw.trim().toLowerCase()
  if (value === 'open' || value === 'closed' || value === 'in_progress') return value
  return null
}

function toIsoString(value: unknown): string | null {
  if (!value) return null
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const maybeTimestamp = value as { toDate?: () => Date }
    const date = maybeTimestamp.toDate?.()
    return date instanceof Date ? date.toISOString() : null
  }
  return null
}

function normalizeOptionalString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined
  if (value === null) return null
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

async function getNextTicketNumber(): Promise<number> {
  if (!adminDb) throw new Error('Firestore not initialized')

  const counterRef = adminDb.collection('counters').doc('ticket_counter')
  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef)
    if (!snap.exists) {
      tx.set(counterRef, { last_ticket_number: 101 })
      return 101
    }

    const last = Number(snap.data()?.last_ticket_number ?? 100)
    const next = last + 1
    tx.update(counterRef, { last_ticket_number: next })
    return next
  })
}

export async function GET(request: NextRequest) {
  if (!isAdminInitialized() || !adminDb) {
    const error = getInitError()
    return NextResponse.json(
      { success: false, message: 'Firebase Admin not configured', details: error?.message },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseLimit(searchParams.get('limit'))
    const status = normalizeStatus(searchParams.get('status'))

    // Keep query index-free: fetch newest, then apply status filter in memory.
    // This avoids requiring a composite index for (status, created_at).
    const snapshot = await adminDb
      .collection('customer_service')
      .orderBy('created_at', 'desc')
      .limit(500)
      .get()

    const allTickets: TicketResponseItem[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>
      return {
        id: doc.id,
        ticketId: (data.ticket_id as string) ?? null,
        name: (data.name as string) ?? null,
        phone: (data.phone as string) ?? null,
        orderId: (data.order_id as string) ?? null,
        description: (data.description as string) ?? null,
        imageUrl: (data.image_url as string) ?? null,
        status: (data.status as string) ?? null,
        createdAt: toIsoString(data.created_at),
      }
    })
    const tickets = status
      ? allTickets.filter((ticket) => (ticket.status ?? '').toLowerCase() === status)
      : allTickets
    const limitedTickets = tickets.slice(0, limit)

    return NextResponse.json(
      {
        success: true,
        count: limitedTickets.length,
        filters: { status, limit },
        tickets: limitedTickets,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[support-tickets] Failed to fetch tickets:', message)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminInitialized() || !adminDb) {
    const error = getInitError()
    return NextResponse.json(
      { success: false, message: 'Firebase Admin not configured', details: error?.message },
      { status: 500 }
    )
  }

  let body: CreateTicketBody
  try {
    body = (await request.json()) as CreateTicketBody
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 })
  }

  const name = normalizeOptionalString(body.name)
  const phone = normalizeOptionalString(body.phone)
  const description = normalizeOptionalString(body.description)
  const orderId = normalizeOptionalString(body.orderId)
  const imageUrl = normalizeOptionalString(body.imageUrl)

  if (!name || !phone || !description) {
    return NextResponse.json(
      { success: false, message: 'name, phone, and description are required' },
      { status: 400 }
    )
  }

  try {
    // One active ticket per user phone (open/in_progress).
    const activeByPhone = await adminDb
      .collection('customer_service')
      .where('phone', '==', phone)
      .where('status', 'in', ['open', 'in_progress'])
      .limit(1)
      .get()

    if (!activeByPhone.empty) {
      const activeDoc = activeByPhone.docs[0]
      const activeData = activeDoc.data() as Record<string, unknown>
      return NextResponse.json(
        {
          success: false,
          code: 'ACTIVE_TICKET_EXISTS',
          message: 'You already have an active ticket. Please continue updates on that ticket.',
          activeTicket: {
            id: activeDoc.id,
            ticketId: (activeData.ticket_id as string) ?? null,
            status: (activeData.status as string) ?? 'open',
          },
        },
        { status: 409 }
      )
    }

    const ticketNumber = await getNextTicketNumber()
    const ticketId = `#FF${ticketNumber}`

    const docRef = await adminDb.collection('customer_service').add({
      ticket_id: ticketId,
      name,
      phone,
      order_id: orderId ?? null,
      description,
      image_url: imageUrl ?? null,
      status: 'open',
      created_at: new Date(),
      updated_at: FieldValue.serverTimestamp(),
    })

    return NextResponse.json(
      { success: true, ticketId, docId: docRef.id },
      { status: 201 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[support-tickets] Failed to create ticket:', message)
    return NextResponse.json(
      { success: false, message: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminInitialized() || !adminDb) {
    const error = getInitError()
    return NextResponse.json(
      { success: false, message: 'Firebase Admin not configured', details: error?.message },
      { status: 500 }
    )
  }

  let body: UpdateTicketBody
  try {
    body = (await request.json()) as UpdateTicketBody
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const id = normalizeOptionalString(body.id)
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Ticket id is required' },
      { status: 400 }
    )
  }

  const status = body.status === undefined || body.status === null
    ? body.status
    : normalizeStatus(body.status)
  if (body.status !== undefined && body.status !== null && !status) {
    return NextResponse.json(
      { success: false, message: 'Invalid status. Use open, closed, or in_progress.' },
      { status: 400 }
    )
  }

  const updates: Record<string, unknown> = { updated_at: new Date() }
  const ticketId = normalizeOptionalString(body.ticketId)
  const name = normalizeOptionalString(body.name)
  const phone = normalizeOptionalString(body.phone)
  const orderId = normalizeOptionalString(body.orderId)
  const description = normalizeOptionalString(body.description)
  const imageUrl = normalizeOptionalString(body.imageUrl)

  if (ticketId !== undefined) updates.ticket_id = ticketId
  if (name !== undefined) updates.name = name
  if (phone !== undefined) updates.phone = phone
  if (orderId !== undefined) updates.order_id = orderId
  if (description !== undefined) updates.description = description
  if (imageUrl !== undefined) updates.image_url = imageUrl
  if (status !== undefined) updates.status = status

  if (Object.keys(updates).length === 1) {
    return NextResponse.json(
      { success: false, message: 'No fields provided to update' },
      { status: 400 }
    )
  }

  try {
    const docRef = adminDb.collection('customer_service').doc(id)
    const snap = await docRef.get()
    if (!snap.exists) {
      return NextResponse.json(
        { success: false, message: 'Ticket not found' },
        { status: 404 }
      )
    }

    await docRef.update(updates)
    const updatedSnap = await docRef.get()
    const data = updatedSnap.data() as Record<string, unknown>

    return NextResponse.json(
      {
        success: true,
        ticket: {
          id: updatedSnap.id,
          ticketId: (data.ticket_id as string) ?? null,
          name: (data.name as string) ?? null,
          phone: (data.phone as string) ?? null,
          orderId: (data.order_id as string) ?? null,
          description: (data.description as string) ?? null,
          imageUrl: (data.image_url as string) ?? null,
          status: (data.status as string) ?? null,
          createdAt: toIsoString(data.created_at),
        } satisfies TicketResponseItem,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[support-tickets] Failed to update ticket:', message)
    return NextResponse.json(
      { success: false, message: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}
