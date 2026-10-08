import { NextRequest, NextResponse } from 'next/server'
import { adminDb, isAdminInitialized, getInitError } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

interface CreateCommentBody {
  message?: string
  authorName?: string | null
  authorType?: 'user' | 'agent' | 'system'
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

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAdminInitialized() || !adminDb) {
    const error = getInitError()
    return NextResponse.json(
      { success: false, message: 'Firebase Admin not configured', details: error?.message },
      { status: 500 }
    )
  }

  try {
    const { id } = await context.params
    const ticketId = id?.trim()
    if (!ticketId) {
      return NextResponse.json({ success: false, message: 'Ticket id is required' }, { status: 400 })
    }

    const ticketRef = adminDb.collection('customer_service').doc(ticketId)
    const ticketSnap = await ticketRef.get()
    if (!ticketSnap.exists) {
      return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 })
    }

    const commentsSnap = await ticketRef
      .collection('comments')
      .orderBy('created_at', 'asc')
      .limit(500)
      .get()

    const comments = commentsSnap.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>
      return {
        id: doc.id,
        message: (data.message as string) ?? '',
        authorName: (data.author_name as string) ?? null,
        authorType: (data.author_type as string) ?? 'user',
        createdAt: toIsoString(data.created_at),
      }
    })

    return NextResponse.json({ success: true, count: comments.length, comments }, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[ticket-comments] Failed to fetch comments:', message)
    return NextResponse.json({ success: false, message: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAdminInitialized() || !adminDb) {
    const error = getInitError()
    return NextResponse.json(
      { success: false, message: 'Firebase Admin not configured', details: error?.message },
      { status: 500 }
    )
  }

  let body: CreateCommentBody
  try {
    body = (await request.json()) as CreateCommentBody
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 })
  }

  const { id } = await context.params
  const ticketId = id?.trim()
  if (!ticketId) {
    return NextResponse.json({ success: false, message: 'Ticket id is required' }, { status: 400 })
  }

  const message = (body.message || '').trim()
  if (!message) {
    return NextResponse.json({ success: false, message: 'Comment message is required' }, { status: 400 })
  }

  const authorType = body.authorType || 'user'
  if (!['user', 'agent', 'system'].includes(authorType)) {
    return NextResponse.json(
      { success: false, message: 'Invalid authorType. Use user, agent, or system.' },
      { status: 400 }
    )
  }

  try {
    const ticketRef = adminDb.collection('customer_service').doc(ticketId)
    const ticketSnap = await ticketRef.get()
    if (!ticketSnap.exists) {
      return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 })
    }

    const commentRef = await ticketRef.collection('comments').add({
      message,
      author_name: body.authorName?.trim() || null,
      author_type: authorType,
      created_at: new Date(),
    })

    await ticketRef.update({
      updated_at: new Date(),
      last_comment_at: new Date(),
    })

    return NextResponse.json({ success: true, commentId: commentRef.id }, { status: 201 })
  } catch (error: unknown) {
    const messageText = error instanceof Error ? error.message : 'Unknown error'
    console.error('[ticket-comments] Failed to create comment:', messageText)
    return NextResponse.json({ success: false, message: 'Failed to create comment' }, { status: 500 })
  }
}
