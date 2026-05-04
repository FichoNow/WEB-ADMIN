import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = process.env.API_URL ?? 'http://localhost:3000'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

/**
 * Petición pública sin token de autorización.
 * Usar para endpoints abiertos: /auth/login, /auth/register, /auth/refresh.
 */
export async function fetchPublic(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
}

/**
 * Petición autenticada con accessToken.
 *
 * Flujo:
 * 1. Lee el accessToken de las cookies.
 * 2. Hace la petición con Authorization: Bearer <token>.
 * 3. Si la API devuelve 401 (token expirado):
 *    a. Lee el refreshToken de las cookies.
 *    b. Llama a POST /auth/refresh para obtener nuevos tokens.
 *    c. Actualiza las cookies con los nuevos tokens.
 *    d. Reintenta la petición original con el nuevo accessToken.
 * 4. Si cualquier paso falla → redirige a '/' (login).
 *
 * Nota: la actualización de cookies (paso c) solo funciona desde Server Actions
 * y Route Handlers. Desde un Server Component el set() lanzará error,
 * que capturamos para redirigir al login en su lugar.
 */
export async function fetchWithAuth(path: string, options?: RequestInit): Promise<Response> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) redirect('/')

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
  })

  if (res.status !== 401) return res

  // —— Token expirado: intentar refresh ——
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) redirect('/error?reason=session-expired')

  const refreshRes = await fetchPublic('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })

  if (!refreshRes.ok) redirect('/error?reason=refresh-failed')

  const { data } = await refreshRes.json()

  try {
    cookieStore.set('accessToken', data.accessToken, { ...COOKIE_OPTS, maxAge: 60 * 15 })
    cookieStore.set('refreshToken', data.refreshToken, { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 * 7 })
  } catch {
    // set() solo funciona en Server Actions / Route Handlers.
    redirect('/error?reason=cookie')
  }

  // —— Reintentar con el nuevo accessToken ——
  return fetch(`${API_URL}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.accessToken}`,
      ...options?.headers,
    },
  })
}
