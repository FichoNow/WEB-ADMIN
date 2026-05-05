"use server"

import { revalidatePath } from "next/cache"
import { createGroupScheduleAssignment } from "@/app/repositories/schedules-repository"
import type { ScheduleActionState } from "@/app/types/admin/action-states/schedule-state"

/**
 * Server Action para asignar una plantilla de horario a un grupo.
 *
 * Recibe el FormData del formulario y llama al repository,
 * que a su vez llama a la API.
 */
export async function createGroupScheduleAssignmentAction(
  departmentId: number,
  _prev: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const groupIdRaw = formData.get("group_id") as string | null
  const templateIdRaw = formData.get("template_id") as string | null
  const startDate = formData.get("start_date") as string | null
  const endDateRaw = formData.get("end_date") as string | null

  const group_id = Number(groupIdRaw)
  const template_id = Number(templateIdRaw)

  if (!Number.isInteger(group_id) || group_id <= 0) {
    return { error: "Selecciona un grupo válido" }
  }

  if (!Number.isInteger(template_id) || template_id <= 0) {
    return { error: "Selecciona una plantilla válida" }
  }

  if (!startDate) {
    return { error: "La fecha de inicio es obligatoria" }
  }

  try {
    await createGroupScheduleAssignment({
      group_id,
      template_id,
      start_date: startDate,
      end_date: endDateRaw || null,
    })

    revalidatePath(`/dashboard/${departmentId}/schedules`)

    return { success: "Horario asignado al grupo correctamente" }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al asignar el horario al grupo",
    }
  }
}