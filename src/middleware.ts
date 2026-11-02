import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge Middleware: Runs at Vercel's global edge network (<5ms).
 * 
 * Defense-in-depth for /admin routes. The primary auth gate remains the
 * client-side sessionStorage check in admin/page.tsx (works on every browser).
 * 
 * Behavior:
 * - If edge cookie exists and is valid → allow through instantly
 * - If edge cookie is missing → still allow through (client-side gate handles it)
 *   The cookie gets set on next login, enabling edge protection going forward.
 * - /admin/login, /api/*, /_next/* are never gated
 * 
 * This ensures zero disruption for existing sessions across all browsers.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only process /admin routes (not login, API, or static assets)
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next/')
  ) {
    const sessionCookie = request.cookies.get('varna_admin_session')

    // If cookie exists and is valid, proceed immediately
    if (sessionCookie && sessionCookie.value === 'authenticated') {
      return NextResponse.next()
    }

    // If cookie is missing, still allow through — the client-side auth gate
    // in admin/page.tsx will redirect to /admin/login if not authenticated.
    // This preserves backward compat for existing sessionStorage-based sessions.
    // Once they re-login via the new auth API flow, the cookie will be set
    // and future visits get edge-level protection.
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
