"use server"

import { revalidatePath } from "next/cache"
import { createGroupScheduleAssignment } from "@/app/repositories/schedules-repository"
import { createGroupScheduleAssignmentSchema } from "@/app/types/admin/schemas/schedule-schema"
import type { ScheduleActionState } from "@/app/types/admin/action-states/schedule-state"

/**
 * Server Action para asignar una plantilla de horario a un grupo.
 */
export async function createGroupScheduleAssignmentAction(
  departmentId: number,
  _prev: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const parsed = createGroupScheduleAssignmentSchema.safeParse({
    group_id: formData.get("group_id") ?? "",
    template_id: formData.get("template_id") ?? "",
    start_date: formData.get("start_date") ?? "",
    end_date: (formData.get("end_date") as string | null) || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  try {
    await createGroupScheduleAssignment({
      group_id: Number(data.group_id),
      template_id: Number(data.template_id),
      start_date: data.start_date,
      end_date: data.end_date?.length ? data.end_date : null,
    })

    revalidatePath(`/dashboard/${departmentId}/schedules`)

    return { success: "Horario asignado al grupo correctamente" }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al asignar el horario al grupo",
    }
  }
}
