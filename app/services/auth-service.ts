import type { LoginResponse } from '@/app/types/auth/login-response'

const API_URL = process.env.API_URL ?? 'http://localhost:3000'

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    if (res.status === 401) throw new Error('Credenciales incorrectas')
    throw new Error('Error, vuelve a probar en unos instantes')
  }

  const json = await res.json()
  return json.data as LoginResponse
}
