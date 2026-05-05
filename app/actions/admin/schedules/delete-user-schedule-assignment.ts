"use server"

import { revalidatePath } from "next/cache"
import { deleteUserScheduleAssignment } from "@/app/repositories/schedules-repository"
import type { ScheduleActionState } from "@/app/types/admin/action-states/schedule-state"

/**
 * Server Action para borrar una asignación de horario individual.
 */
export async function deleteUserScheduleAssignmentAction(
  departmentId: number,
  assignmentId: number,
): Promise<ScheduleActionState> {
  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    return { error: "ID de asignación no válido" }
  }

  try {
    await deleteUserScheduleAssignment(assignmentId)

    revalidatePath(`/dashboard/${departmentId}/schedules`)
    revalidatePath(`/dashboard/${departmentId}/employees`)

    return { success: "Asignación eliminada correctamente" }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al eliminar la asignación",
    }
  }
}
