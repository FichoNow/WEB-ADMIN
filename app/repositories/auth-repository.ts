import type { LoginRequest } from '@/app/types/auth/login-request'
import type { LoginResponse } from '@/app/types/auth/login-response'
import type { RegisterRequest } from '@/app/types/auth/register-request'
import type { RegisterResponse } from '@/app/types/auth/register-response'

const API_URL = process.env.API_URL ?? 'http://localhost:3000'

export async function loginRequest(body: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('Credenciales incorrectas')
    throw new Error('Error, vuelve a probar en unos instantes')
  }

  const json = await res.json()
  return json.data as LoginResponse
}

export async function registerRequest(body: RegisterRequest): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    if (res.status === 409) throw new Error('Ya existe un usuario con ese email.')
    const json = await res.json().catch(() => null)
    const msg = json?.error?.message
    throw new Error(msg ?? 'Error al crear la empresa. Inténtalo de nuevo.')
  }

  const json = await res.json()
  return json.data as RegisterResponse
}
