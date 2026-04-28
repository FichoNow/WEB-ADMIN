import { fetchPublic } from '@/app/lib/api'
import type { LoginRequest } from '@/app/types/auth/login-request'
import type { LoginResponse } from '@/app/types/auth/login-response'
import type { RegisterRequest } from '@/app/types/auth/register-request'
import type { RegisterResponse } from '@/app/types/auth/register-response'

export async function loginRequest(body: LoginRequest): Promise<LoginResponse> {
  const res = await fetchPublic('/auth/login', {
    method: 'POST',
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
  const res = await fetchPublic('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const code = json?.error?.code
    if (code === 'EMAIL_ALREADY_EXISTS') throw new Error('Ya existe un usuario con ese email.')
    if (code === 'CIF_NIF_ALREADY_EXISTS') throw new Error('Ya existe una empresa con ese CIF/NIF.')
    throw new Error(json?.error?.message ?? 'Error al crear la empresa. Inténtalo de nuevo.')
  }

  const json = await res.json()
  return json.data as RegisterResponse
}
