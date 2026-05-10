"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { deleteGroupScheduleAssignment } from "@/app/repositories/schedules-repository"
import type { ScheduleActionState } from "@/app/types/admin/action-states/schedule-state"

export async function deleteGroupScheduleAssignmentAction(
  departmentId: number,
  assignmentId: number,
): Promise<ScheduleActionState> {
  const t = await getTranslations("actions")
  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    return { error: t("schedules.invalidAssignmentId") }
  }

  try {
    await deleteGroupScheduleAssignment(assignmentId)

    revalidatePath(`/dashboard/${departmentId}/schedules`)
    revalidatePath(`/dashboard/${departmentId}/employees`)

    return { success: t("schedules.assignmentDeleted") }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : t("errors.scheduleAssignmentDelete"),
    }
  }
}
