'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = process.env.API_URL ?? 'http://localhost:3000'

export type LoginState =
  | {
      error: string
    }
  | undefined

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email y contraseña son obligatorios' }
  }

  let data: {
    accessToken: string
    refreshToken: string
    userData: {
      name: string
      role: string
      email: string
      companyName: string
      mustChangePassword: boolean
    }
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      if (res.status === 401) return { error: 'Credenciales incorrectas' }
      return { error: 'Error, vuelve a probar en unos instantes' }
    }

    const json = await res.json()
    data = json.data
  } catch {
    return { error: 'Error de conexión. Comprueba tu internet.' }
  }

  if (data.userData.role !== 'ADMINISTRATOR') {
    return { error: 'No tienes permiso para acceder al panel de administración' }
  }

  const cookieStore = await cookies()

  cookieStore.set('accessToken', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  })

  cookieStore.set('refreshToken', data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect('/dashboard')
}
