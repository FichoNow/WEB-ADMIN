import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18n = createMiddleware(routing)

const DASHBOARD = /^\/(es|cat|en)\/dashboard(?:\/.*)?$/

function isValidJwt(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3 && parts.every(p => p.length > 0)
}

/** Host público de la petición (el que ve el navegador). */
function publicHost(request: NextRequest): string | null {
  const host = request.headers.get('host')
  const forwarded = request.headers.get('x-forwarded-host')
  // Next auto-rellena x-forwarded-host con el Host interno; solo es fiable si difiere.
  const h = forwarded && forwarded !== host ? forwarded : host
  return h ? h.split(',')[0].trim() : null
}

/** True si la petición entra por el túnel/proxy: el Host público no lleva el puerto interno. */
function isProxied(request: NextRequest): boolean {
  const host = publicHost(request)
  const port = request.nextUrl.port
  return Boolean(host && port && !host.endsWith(`:${port}`))
}

/**
 * Reescribe el Location de los redirects internos. Next construye las URLs absolutas
 * con su puerto interno (:3001), que no existe de cara al público detrás del túnel —
 * sin esto, el redirect de "/" a "/es" apunta a https://dominio:3001/es y no carga.
 */
function fixRedirectLocation(request: NextRequest, response: Response): Response {
  const location = response.headers.get('location')
  if (!location || !isProxied(request)) return response

  const host = publicHost(request)!
  const url = new URL(location, request.url)
  // Solo redirects internos: a otro dominio no se toca.
  if (url.hostname !== host.split(':')[0] && url.hostname !== request.nextUrl.hostname) {
    return response
  }

  url.host = host
  const proto = request.headers.get('x-forwarded-proto')
  if (proto === 'https' || proto === 'http') url.protocol = `${proto}:`
  response.headers.set('location', url.toString())
  return response
}

export function proxy(request: NextRequest) {
  // Detrás del túnel: si el cliente entró por HTTP, redirigir a HTTPS. No afecta al
  // acceso directo por IP:puerto ni a desarrollo (ahí el Host lleva el puerto interno).
  if (
    process.env.FORCE_HTTPS === 'true' &&
    isProxied(request) &&
    request.headers.get('x-forwarded-proto') === 'http'
  ) {
    const host = publicHost(request)
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
      return fixRedirectLocation(request, NextResponse.redirect(new URL(`/${locale}`, request.url)))
    }
  }

  return fixRedirectLocation(request, handleI18n(request))
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
