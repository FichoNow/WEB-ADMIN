"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { approveRequest } from "@/app/repositories/requests-repository"
import type { RequestActionState } from "@/app/types/admin/action-states/request-state"

export async function approveRequestAction(
  departmentId: number,
  requestId: number,
  reviewComment?: string,
): Promise<RequestActionState> {
  const t = await getTranslations("actions")
  try {
    await approveRequest(requestId, {
      review_comment: reviewComment?.trim() || null,
    })

    revalidatePath(`/dashboard/${departmentId}/requests`)

    return { success: t("requests.approved") }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : t("errors.requestApprove"),
    }
  }
}
