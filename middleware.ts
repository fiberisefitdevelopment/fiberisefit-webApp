import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  if (/^www\.fiberisefit\.com(?::\d+)?$/i.test(host)) {
    const url = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      'https://fiberisefit.com'
    )
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
