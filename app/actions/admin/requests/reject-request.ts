"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { rejectRequest } from "@/app/repositories/requests-repository"
import type { RequestActionState } from "@/app/types/admin/action-states/request-state"

export async function rejectRequestAction(
  departmentId: number,
  requestId: number,
  reviewComment?: string,
): Promise<RequestActionState> {
  const t = await getTranslations("actions")
  try {
    await rejectRequest(requestId, {
      review_comment: reviewComment?.trim() || null,
    })

    revalidatePath(`/dashboard/${departmentId}/requests`)

    return { success: t("requests.rejected") }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : t("errors.requestReject"),
    }
  }
}
