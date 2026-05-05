"use server"

import { revalidatePath } from "next/cache"
import { deleteGroupScheduleAssignment } from "@/app/repositories/schedules-repository"
import type { ScheduleActionState } from "@/app/types/admin/action-states/schedule-state"

/**
 * Server Action para borrar una asignación de horario de grupo.
 */
export async function deleteGroupScheduleAssignmentAction(
  departmentId: number,
  assignmentId: number,
): Promise<ScheduleActionState> {
  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    return { error: "ID de asignación no válido" }
  }

  try {
    await deleteGroupScheduleAssignment(assignmentId)

    revalidatePath(`/dashboard/${departmentId}/schedules`)
    revalidatePath(`/dashboard/${departmentId}/employees`)

    return { success: "Asignación eliminada correctamente" }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al eliminar la asignación",
    }
  }
}
