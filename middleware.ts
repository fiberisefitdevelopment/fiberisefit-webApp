import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CONTACT_NAV_FLAG = 'from'
const CONTACT_NAV_VALUE = 'nav'

function isBareContactPath(pathname: string) {
  return pathname === '/contact-us' || pathname === '/contact'
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  if (/^www\.fiberisefit\.com(?::\d+)?$/i.test(host)) {
    const url = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      'https://fiberisefit.com'
    )
    return NextResponse.redirect(url, 301)
  }

  if (
    isBareContactPath(request.nextUrl.pathname) &&
    request.nextUrl.searchParams.get(CONTACT_NAV_FLAG) !== CONTACT_NAV_VALUE
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/special-offer'
    url.searchParams.delete(CONTACT_NAV_FLAG)
    const response = NextResponse.redirect(url, 307)
    response.headers.set('Cache-Control', 'no-store')
    return response
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
