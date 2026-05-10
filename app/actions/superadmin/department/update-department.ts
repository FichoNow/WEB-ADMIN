'use server'

import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { fetchWithAuth } from '@/app/lib/api'
import { translateFirstIssue } from '@/app/lib/translate-zod'
import { departmentSchema } from '@/app/types/superadmin/schemas/department-schema'
import type { DepartmentState } from '@/app/types/superadmin/action-states/department-state'

export async function updateDepartmentAction(
  departmentId: number,
  _prev: DepartmentState,
  formData: FormData,
): Promise<DepartmentState> {
  const t = await getTranslations('actions')
  const result = departmentSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { error: await translateFirstIssue(result.error) }

  try {
    const res = await fetchWithAuth(`/superadmin/department/${departmentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name: result.data.name.trim() }),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.error?.message ?? t('errors.departmentUpdate'))
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t('errors.generic') }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/[departmentId]`, 'layout')
  return { success: true }
}
