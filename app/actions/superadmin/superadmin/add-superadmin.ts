'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithAuth } from '@/app/lib/api'
import { addSuperadminSchema } from '@/app/types/superadmin/schemas/superadmin-schema'
import type { ActionState } from '@/app/types/superadmin/action-states/action-state'

export async function addSuperadminAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = addSuperadminSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { error: result.error.issues[0].message }

  try {
    const res = await fetchWithAuth('/superadmin/superadmin', {
      method: 'POST',
      body: JSON.stringify(result.data),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      const code = json?.error?.code
      if (code === 'EMAIL_ALREADY_EXISTS') return { error: 'Ya existe un usuario con ese email' }
      throw new Error(json?.error?.message ?? 'Error al crear el administrador')
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error de conexión' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
