"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { updateSuperadminRequest } from "@/app/repositories/company-repository"
import { translateFirstIssue } from "@/app/lib/translate-zod"
import { editSuperadminSchema } from "@/app/types/superadmin/schemas/superadmin-schema"
import type { UpdateSuperadminRequest } from "@/app/types/superadmin/api/superadmin-request"

export type UpdateSuperadminState =
  | { error: string }
  | { success: string }
  | undefined

export async function updateSuperadminAction(
  id: number,
  data: unknown,
): Promise<UpdateSuperadminState> {
  const t = await getTranslations("actions")
  const parsed = editSuperadminSchema.safeParse(data)
  if (!parsed.success) {
    return { error: await translateFirstIssue(parsed.error) }
  }

  const body: UpdateSuperadminRequest = {}
  if (parsed.data.name) body.name = parsed.data.name.trim()
  if (parsed.data.email) body.email = parsed.data.email.trim().toLowerCase()

  if (!body.name && !body.email) {
    return { error: t("superadmin.noChanges") }
  }

  try {
    await updateSuperadminRequest(id, body)
    revalidatePath("/dashboard")
    return { success: t("superadmin.updated") }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.superadminUpdate") }
  }
}
