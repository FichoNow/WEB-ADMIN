import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18n = createMiddleware(routing)

const DASHBOARD = /^\/(es|cat|en)\/dashboard(?:\/.*)?$/

function isValidJwt(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3 && parts.every(p => p.length > 0)
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (DASHBOARD.test(path)) {
    const token = request.cookies.get('accessToken')?.value
    if (!token || !isValidJwt(token)) {
      const locale = path.split('/')[1]
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
  }

  return handleI18n(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
