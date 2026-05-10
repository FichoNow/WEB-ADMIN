'use server'

import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { fetchWithAuth } from '@/app/lib/api'
import { translateFirstIssue } from '@/app/lib/translate-zod'
import { updateCompanySchema } from '@/app/types/superadmin/schemas/company-schema'
import type { ActionState } from '@/app/types/superadmin/action-states/action-state'

export async function updateCompanyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const t = await getTranslations('actions')
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => String(v).trim() !== ''),
  )
  const result = updateCompanySchema.safeParse(raw)
  if (!result.success) return { error: await translateFirstIssue(result.error) }
  if (Object.keys(result.data).length === 0) return { error: t('company.noChanges') }

  try {
    const res = await fetchWithAuth('/superadmin/company', {
      method: 'PATCH',
      body: JSON.stringify(result.data),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.error?.message ?? t('errors.companyUpdate'))
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t('errors.generic') }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
