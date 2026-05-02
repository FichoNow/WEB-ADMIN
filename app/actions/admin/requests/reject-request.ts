"use server"

import { revalidatePath } from "next/cache"
import { rejectRequest } from "@/app/repositories/requests-repository"
import type { RequestActionState } from "@/app/types/admin/action-states/request-state"

export async function rejectRequestAction(
  departmentId: number,
  requestId: number,
  reviewComment?: string,
): Promise<RequestActionState> {
  try {
    await rejectRequest(requestId, {
      review_comment: reviewComment?.trim() || null,
    })

    revalidatePath(`/dashboard/${departmentId}/requests`)

    return { success: "Solicitud rechazada correctamente" }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al rechazar la solicitud",
    }
  }
}
