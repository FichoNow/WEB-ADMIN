"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { deleteSuperadminRequest } from "@/app/repositories/company-repository"

export type DeleteSuperadminState =
  | { error: string }
  | { success: string }
  | undefined

export async function deleteSuperadminAction(id: number): Promise<DeleteSuperadminState> {
  const t = await getTranslations("actions")
  if (!Number.isFinite(id) || id <= 0) {
    return { error: t("superadmin.invalidId") }
  }
  try {
    await deleteSuperadminRequest(id)
    revalidatePath("/dashboard")
    return { success: t("superadmin.deleted") }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.superadminDelete") }
  }
}
