'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithAuth } from '@/app/lib/api'
import { updateCompanySchema } from '@/app/types/superadmin/schemas/company-schema'
import { addSuperadminSchema } from '@/app/types/superadmin/schemas/superadmin-schema'

type ActionState = { error?: string; success?: true }

export async function updateCompanyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => String(v).trim() !== ''),
  )
  const result = updateCompanySchema.safeParse(raw)
  if (!result.success) return { error: result.error.issues[0].message }
  if (Object.keys(result.data).length === 0) return { error: 'No hay cambios que guardar' }

  try {
    const res = await fetchWithAuth('/superadmin/company', {
      method: 'PATCH',
      body: JSON.stringify(result.data),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.error?.message ?? 'Error al actualizar la empresa')
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error de conexión' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

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
