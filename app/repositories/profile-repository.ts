import { fetchWithAuth } from '@/app/lib/api'

export interface UpdateProfileRequest {
  name?: string
  email?: string
  password?: string
}

export interface UpdateProfileResponse {
  name: string
  email: string
}

export async function updateOwnProfile(body: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  const res = await fetchWithAuth('/user/update', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const code = json?.error?.code
    if (code === 'EMAIL_ALREADY_EXISTS') throw new Error('Ya existe un usuario con ese email.')
    throw new Error(json?.error?.message ?? 'No se ha podido actualizar el perfil.')
  }

  const json = await res.json()
  return json.data as UpdateProfileResponse
}
