import { fetchWithAuth } from '@/app/lib/api'
import type { UpdateProfileRequest } from '@/app/types/auth/api/profile-request'
import type { UpdateProfileResponse } from '@/app/types/auth/api/profile-response'

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
