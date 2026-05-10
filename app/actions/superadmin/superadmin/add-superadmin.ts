'use server'

import { revalidatePath } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { fetchWithAuth } from '@/app/lib/api'
import { translateFirstIssue } from '@/app/lib/translate-zod'
import { addSuperadminSchema } from '@/app/types/superadmin/schemas/superadmin-schema'
import type { ActionState } from '@/app/types/superadmin/action-states/action-state'

export async function addSuperadminAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const t = await getTranslations('actions')
  const result = addSuperadminSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { error: await translateFirstIssue(result.error) }

  try {
    const res = await fetchWithAuth('/superadmin/superadmin', {
      method: 'POST',
      body: JSON.stringify(result.data),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      const code = json?.error?.code
      if (code === 'EMAIL_ALREADY_EXISTS') return { error: t('superadmin.emailTaken') }
      throw new Error(json?.error?.message ?? t('errors.superadminCreate'))
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t('errors.generic') }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
