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

  if (request.nextUrl.pathname.startsWith('/contact/amazon')) {
    const url = request.nextUrl.clone()
    url.pathname = '/contact/marketplace'
    return NextResponse.redirect(url, 308)
  }

  if (
    request.nextUrl.pathname.startsWith('/guide/') ||
    request.nextUrl.pathname.startsWith('/contact/marketplace')
  ) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
