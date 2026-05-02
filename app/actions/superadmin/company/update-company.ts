'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithAuth } from '@/app/lib/api'
import { updateCompanySchema } from '@/app/types/superadmin/schemas/company-schema'
import type { ActionState } from '@/app/types/superadmin/action-states/action-state'

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
