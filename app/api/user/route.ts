import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb, isAdminInitialized, getInitError } from '@/lib/firebase/admin'
export const dynamic = 'force-dynamic'

async function getDecodedToken(request: NextRequest) {
  if (!isAdminInitialized() || !adminAuth || !adminDb) return null
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const idToken = authHeader.split('Bearer ')[1]
  try {
    return await adminAuth.verifyIdToken(idToken)
  } catch {
    return null
  }
}

/** GET /api/user – return current user profile from Firestore */
export async function GET(request: NextRequest) {
  if (!isAdminInitialized() || !adminDb) {
    const error = getInitError()
    return NextResponse.json(
      { error: 'Firebase Admin not configured', details: error?.message },
      { status: 500 }
    )
  }
  const decoded = await getDecodedToken(request)
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const phone = decoded.phone_number as string | undefined
  if (!phone) {
    return NextResponse.json(
      { error: 'Phone number required. Please sign in with phone.' },
      { status: 400 }
    )
  }
  const userDocId = phone
  const userDoc = await adminDb.collection('users').doc(userDocId).get()
  if (!userDoc.exists) {
    return NextResponse.json({
      phone,
      firstName: '',
      lastName: '',
      displayName: '',
    })
  }
  const data = userDoc.data()
  return NextResponse.json({
    phone: data?.phone ?? phone ?? null,
    firstName: data?.firstName ?? '',
    lastName: data?.lastName ?? '',
    displayName: data?.displayName ?? '',
  })
}

/** PATCH /api/user – update profile (firstName, lastName, displayName) in Firestore */
export async function PATCH(request: NextRequest) {
  if (!isAdminInitialized() || !adminDb) {
    const error = getInitError()
    return NextResponse.json(
      { error: 'Firebase Admin not configured', details: error?.message },
      { status: 500 }
    )
  }
  const decoded = await getDecodedToken(request)
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const phone = decoded.phone_number as string | undefined
  if (!phone) {
    return NextResponse.json(
      { error: 'Phone number required. Please sign in with phone.' },
      { status: 400 }
    )
  }
  const userDocId = phone
  const body = await request.json().catch(() => ({}))
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (typeof body.firstName === 'string') updates.firstName = body.firstName
  if (typeof body.lastName === 'string') updates.lastName = body.lastName
  if (typeof body.displayName === 'string') updates.displayName = body.displayName
  if (Object.keys(updates).length <= 1) {
    return NextResponse.json({ success: true })
  }
  const userRef = adminDb.collection('users').doc(userDocId)
  const userDoc = await userRef.get()
  if (userDoc.exists) {
    await userRef.update(updates)
  } else {
    await userRef.set({
      phone,
      ...updates,
      createdAt: new Date(),
    })
  }
  return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest) {
  // Check if Firebase Admin is initialized
  if (!isAdminInitialized() || !adminAuth || !adminDb) {
    const error = getInitError()
    console.error('Firebase Admin not initialized:', error)
    return NextResponse.json(
      { 
        error: 'Firebase Admin not configured. Please check FIREBASE_SERVICE_ACCOUNT_KEY in .env.local',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }

  try {
    const decoded = await getDecodedToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      )
    }

    const phone = decoded.phone_number as string | undefined
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required. Please sign in with phone.' },
        { status: 400 }
      )
    }

    const userDocId = phone
    const userRef = adminDb.collection('users').doc(userDocId)
    const userDoc = await userRef.get()
    const now = new Date()

    if (userDoc.exists) {
      await userRef.update({
        phone,
        updatedAt: now,
      })
    } else {
      await userRef.set({
        phone,
        createdAt: now,
        updatedAt: now,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in /api/user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
