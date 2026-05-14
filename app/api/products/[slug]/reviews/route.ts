import { NextRequest, NextResponse } from 'next/server'
import { adminDb, isAdminInitialized, getInitError, adminAuth } from '@/lib/firebase/admin'
import { normalizePhone } from '@/lib/user-identifier'
import type { DocumentSnapshot } from 'firebase-admin/firestore'
import globalReviews from '@/data/globalReviews.json'

export const dynamic = 'force-dynamic'

export interface ProductReview {
  id: string
  productSlug: string
  rating: number
  comment: string
  authorName: string
  authorId?: string | null
  createdAt: string
  translation?: string
}

function toISOString(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString()
  }
  if (value && typeof (value as { seconds?: number }).seconds === 'number') {
    return new Date((value as { seconds: number }).seconds * 1000).toISOString()
  }
  if (typeof value === 'string') return value
  return ''
}

function serializeReview(doc: DocumentSnapshot): ProductReview {
  const d = doc.data()
  const createdAt = toISOString(d?.createdAt ?? '')
  return {
    id: doc.id,
    productSlug: (d?.productSlug as string) ?? '',
    rating: typeof d?.rating === 'number' ? d.rating : 0,
    comment: (d?.comment as string) ?? '',
    authorName: (d?.authorName as string) ?? 'Anonymous',
    authorId: d?.authorId ?? null,
    createdAt,
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Product slug is required.' },
        { status: 400 }
      )
    }

    if (!isAdminInitialized() || !adminDb) {
      const err = getInitError()
      return NextResponse.json(
        { error: 'Reviews are temporarily unavailable.', reviews: [], averageRating: 0, totalCount: 0 },
        { status: 200 }
      )
    }

    const snapshot = await adminDb
      .collection('productReviews')
      .where('productSlug', '==', slug)
      .limit(100)
      .get()

    const firebaseReviews = snapshot.docs
      .map(serializeReview)

    // Merge with global reviews
    const allReviews = [...firebaseReviews, ...(globalReviews as ProductReview[])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const totalCount = allReviews.length
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0)
    const averageRating = totalCount > 0 ? Math.round((sum / totalCount) * 10) / 10 : 0

    return NextResponse.json({
      reviews: allReviews,
      averageRating,
      totalCount,
    })
  } catch (error: unknown) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to load reviews.', reviews: [], averageRating: 0, totalCount: 0 },
      { status: 200 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Product slug is required.' },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const rating = typeof body.rating === 'number' ? body.rating : Number(body.rating)
    const comment = typeof body.comment === 'string' ? body.comment.trim() : ''
    const authorName = typeof body.authorName === 'string' ? body.authorName.trim() : ''

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Please select a rating from 1 to 5 stars.' },
        { status: 400 }
      )
    }

    if (!comment || comment.length < 10) {
      return NextResponse.json(
        { error: 'Please write at least 10 characters for your review.' },
        { status: 400 }
      )
    }

    let authorId: string | null = null
    let displayName = authorName || ''

    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7)
        if (adminAuth) {
          const decoded = await adminAuth.verifyIdToken(token)
          const phone = decoded.phone_number as string | undefined
          if (phone) {
            authorId = normalizePhone(phone)
            const userDocId = phone
            if (adminDb) {
              const userDoc = await adminDb.collection('users').doc(userDocId).get()
              const userData = userDoc.data()
              const firstName = (userData?.firstName as string)?.trim()
              const displayNameFromProfile = (userData?.displayName as string)?.trim()
              if (firstName) displayName = firstName
              else if (displayNameFromProfile) displayName = displayNameFromProfile
            }
            if (!displayName) displayName = (decoded.name as string)?.trim() || ''
            if (!displayName) displayName = `User ***${phone.slice(-4)}`
          }
        }
      } catch {
        // continue without auth
      }
    }
    if (!displayName) displayName = authorName || 'Anonymous'

    if (!isAdminInitialized() || !adminDb) {
      const err = getInitError()
      return NextResponse.json(
        { error: 'Unable to submit review right now. Please try again later.' },
        { status: 503 }
      )
    }

    await adminDb.collection('productReviews').add({
      productSlug: slug,
      rating,
      comment,
      authorName: displayName,
      authorId: authorId ?? null,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
    })
  } catch (error: unknown) {
    console.error('Review submit error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
