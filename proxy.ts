import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18n = createMiddleware(routing)

const DASHBOARD = /^\/(es|cat|en)\/dashboard(?:\/.*)?$/

// Origen público de la web detrás del túnel (ej. https://fichonow.kena.bot).
// Si no está definido (desarrollo, acceso directo por IP) no se toca nada.
const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN
  ? new URL(process.env.PUBLIC_ORIGIN)
  : null

function isValidJwt(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3 && parts.every(p => p.length > 0)
}

/**
 * Reescribe el Location de los redirects que apuntan al dominio público.
 * Next construye las URLs absolutas con su puerto interno (:3001), que no existe
 * de cara al público detrás del túnel — sin esto, el redirect de "/" a "/es"
 * apunta a https://dominio:3001/es y no carga.
 */
function fixRedirectLocation(request: NextRequest, response: Response): Response {
  if (!PUBLIC_ORIGIN) return response
  const location = response.headers.get('location')
  if (!location) return response

  const url = new URL(location, request.url)
  if (url.hostname !== PUBLIC_ORIGIN.hostname) return response
  if (url.host === PUBLIC_ORIGIN.host && url.protocol === PUBLIC_ORIGIN.protocol) return response

  url.protocol = PUBLIC_ORIGIN.protocol
  url.host = PUBLIC_ORIGIN.host
  response.headers.set('location', url.toString())
  return response
}

export function proxy(request: NextRequest) {
  const requestHost = (request.headers.get('host') ?? '').split(':')[0]

  // Tráfico del dominio público que entró por HTTP → redirigir a HTTPS.
  // No afecta al acceso directo por IP:puerto ni a desarrollo (otro host).
  if (
    process.env.FORCE_HTTPS === 'true' &&
    PUBLIC_ORIGIN &&
    requestHost === PUBLIC_ORIGIN.hostname &&
    request.headers.get('x-forwarded-proto') === 'http'
  ) {
    return NextResponse.redirect(
      `${PUBLIC_ORIGIN.origin}${request.nextUrl.pathname}${request.nextUrl.search}`,
      308,
    )
  }

  const path = request.nextUrl.pathname

  if (DASHBOARD.test(path)) {
    const token = request.cookies.get('accessToken')?.value
    if (!token || !isValidJwt(token)) {
      const locale = path.split('/')[1]
      return fixRedirectLocation(request, NextResponse.redirect(new URL(`/${locale}`, request.url)))
    }
  }

  return fixRedirectLocation(request, handleI18n(request))
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
