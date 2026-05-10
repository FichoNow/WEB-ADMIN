'use server'

import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { fetchWithAuth } from '@/app/lib/api'
import { translateFirstIssue } from '@/app/lib/translate-zod'
import { departmentSchema } from '@/app/types/superadmin/schemas/department-schema'
import type { DepartmentState } from '@/app/types/superadmin/action-states/department-state'

export async function createDepartmentAction(
  _prev: DepartmentState,
  formData: FormData,
): Promise<DepartmentState> {
  const t = await getTranslations('actions')
  const result = departmentSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return { error: await translateFirstIssue(result.error) }
  }

  try {
    const res = await fetchWithAuth('/superadmin/department', {
      method: 'POST',
      body: JSON.stringify({ name: result.data.name.trim() }),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => null)
      const code = json?.error?.code
      if (code === 'DEPARTMENT_NAME_TAKEN') return { error: t('department.nameTaken') }
      throw new Error(json?.error?.message ?? t('errors.departmentCreate'))
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t('errors.generic') }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
