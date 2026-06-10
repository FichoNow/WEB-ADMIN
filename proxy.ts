import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18n = createMiddleware(routing)

const DASHBOARD = /^\/(es|cat|en)\/dashboard(?:\/.*)?$/

const API_URL = process.env.API_URL ?? 'http://localhost:3000'
const SECURE_COOKIES = process.env.FORCE_HTTPS === 'true'

// Origen público de la web detrás del túnel (ej. https://fichonow.kena.bot).
// Si no está definido (desarrollo, acceso directo por IP) no se toca nada.
const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN
  ? new URL(process.env.PUBLIC_ORIGIN)
  : null

function isValidJwt(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3 && parts.every(p => p.length > 0)
}

/** Expiración del JWT en ms (sin verificar firma — eso lo hace la API). */
function jwtExpiresAt(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

function serializeCookie(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=lax${SECURE_COOKIES ? '; Secure' : ''}`
}

/** Copia la respuesta añadiendo Set-Cookie (las de next-intl llevan cabeceras inmutables). */
function withCookies(response: Response, cookies: string[]): Response {
  const headers = new Headers(response.headers)
  for (const c of cookies) headers.append('set-cookie', c)
  return new Response(response.body, { status: response.status, headers })
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
  url.hostname = PUBLIC_ORIGIN.hostname
  // Asignar host sin puerto NO borra el puerto anterior (spec de URL): hay que
  // limpiarlo explícitamente, si no el :3001 interno sobrevive.
  url.port = PUBLIC_ORIGIN.port

  const headers = new Headers(response.headers)
  headers.set('location', url.toString())
  return new Response(response.body, { status: response.status, headers })
}

export async function proxy(request: NextRequest) {
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
    const locale = path.split('/')[1]
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    // Caducado o a punto (<30s): renovar antes de que las cargas de la página fallen.
    const expiresAt = accessToken && isValidJwt(accessToken) ? jwtExpiresAt(accessToken) : null
    const stale = expiresAt === null || expiresAt < Date.now() + 30_000

    if (stale) {
      // Los prefetch del router no deben ni consumir el refresh token (es de un solo
      // uso) ni cachear un redirect al login: se rechazan sin efectos y la navegación
      // real ya renovará.
      const isPrefetch =
        request.headers.has('next-router-prefetch') ||
        request.headers.get('purpose') === 'prefetch' ||
        (request.headers.get('sec-purpose') ?? '').includes('prefetch')

      const toLogin = () =>
        fixRedirectLocation(request, NextResponse.redirect(new URL(`/${locale}`, request.url)))

      if (isPrefetch) {
        return new Response(null, { status: 401, headers: { 'cache-control': 'no-store' } })
      }

      if (!refreshToken) return toLogin()

      // La rotación de refresh tokens exige renovar aquí: el middleware es el único
      // punto del flujo de render que puede persistir las cookies nuevas.
      let tokens: { accessToken: string; refreshToken: string } | null = null
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
          cache: 'no-store',
        })
        if (res.ok) tokens = (await res.json())?.data ?? null
      } catch {
        // API caída: se trata igual que un refresh fallido.
      }

      if (!tokens) return toLogin()

      // La petición sigue su curso con el token nuevo (los Server Components lo leen
      // de las cookies del request) y el navegador recibe las cookies renovadas.
      request.cookies.set('accessToken', tokens.accessToken)
      request.cookies.set('refreshToken', tokens.refreshToken)
      const response = fixRedirectLocation(request, handleI18n(request))
      return withCookies(response, [
        serializeCookie('accessToken', tokens.accessToken, 60 * 15),
        serializeCookie('refreshToken', tokens.refreshToken, 60 * 60 * 24 * 7),
      ])
    }
  }

  return fixRedirectLocation(request, handleI18n(request))
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
