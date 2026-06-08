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
  // Detrás del túnel: si el cliente entró por HTTP, redirigir a HTTPS.
  // El túnel reenvía el esquema real del cliente en X-Forwarded-Proto, así que
  // por HTTPS esta cabecera vale 'https' y no entra aquí (no hay bucle). En acceso
  // directo por IP o en desarrollo la cabecera no llega, así que tampoco afecta.
  if (request.headers.get('x-forwarded-proto') === 'http') {
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
    if (host) {
      return NextResponse.redirect(
        `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`,
        308,
      )
    }
  }

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
