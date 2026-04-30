'use server'

import { revalidatePath } from 'next/cache'
import { fetchWithAuth } from '@/app/lib/api'
import { departmentSchema } from '@/app/types/superadmin/schemas/department-schema'
import type { DepartmentState } from '@/app/types/superadmin/states/department-state'

export async function createDepartmentAction(
  _prev: DepartmentState,
  formData: FormData,
): Promise<DepartmentState> {
  const result = departmentSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    const res = await fetchWithAuth('/superadmin/department', {
      method: 'POST',
      body: JSON.stringify({ name: result.data.name.trim() }),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => null)
      const code = json?.error?.code
      if (code === 'DEPARTMENT_NAME_TAKEN') return { error: 'Ya existe un departamento con ese nombre' }
      throw new Error(json?.error?.message ?? 'Error al crear el departamento')
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error de conexión' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateDepartmentAction(
  departmentId: number,
  _prev: DepartmentState,
  formData: FormData,
): Promise<DepartmentState> {
  const result = departmentSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { error: result.error.issues[0].message }

  try {
    const res = await fetchWithAuth(`/superadmin/department/${departmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: result.data.name.trim() }),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.error?.message ?? 'Error al actualizar el departamento')
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error de conexión' }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/[departmentId]`, 'layout')
  return { success: true }
}
