import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Stub route so the file is a valid module. Implement cart total preview when needed. */
export async function POST() {
  return NextResponse.json(
    { error: 'Cart total preview is not implemented yet.' },
    { status: 501 }
  )
}
