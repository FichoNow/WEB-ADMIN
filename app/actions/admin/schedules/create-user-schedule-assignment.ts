"use server"

import { revalidatePath } from "next/cache"
import { createUserScheduleAssignment } from "@/app/repositories/schedules-repository"
import type { ScheduleActionState } from "@/app/types/admin/action-states/schedule-state"

/**
 * Server Action para asignar una plantilla de horario a un usuario individual.
 *
 * Recibe el FormData del formulario y llama al repository,
 * que a su vez llama a la API.
 */
export async function createUserScheduleAssignmentAction(
  departmentId: number,
  _prev: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const userIdRaw = formData.get("user_id") as string | null
  const templateIdRaw = formData.get("template_id") as string | null
  const startDate = formData.get("start_date") as string | null
  const endDateRaw = formData.get("end_date") as string | null

  const user_id = Number(userIdRaw)
  const template_id = Number(templateIdRaw)

  if (!Number.isInteger(user_id) || user_id <= 0) {
    return { error: "Selecciona un usuario válido" }
  }

  if (!Number.isInteger(template_id) || template_id <= 0) {
    return { error: "Selecciona una plantilla válida" }
  }

  if (!startDate) {
    return { error: "La fecha de inicio es obligatoria" }
  }

  try {
    await createUserScheduleAssignment({
      user_id,
      template_id,
      start_date: startDate,
      end_date: endDateRaw || null,
    })

    revalidatePath(`/dashboard/${departmentId}/schedules`)

    return { success: "Horario asignado al usuario correctamente" }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al asignar el horario al usuario",
    }
  }
}