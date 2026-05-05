"use server"

import { revalidatePath } from "next/cache"
import { createSchedule } from "@/app/repositories/schedules-repository"
import type { ScheduleActionState } from "@/app/types/admin/action-states/schedule-state"

/**
 * Server Action para crear una plantilla de horario desde el panel admin.
 *
 * Recibe el FormData del formulario, construye los 7 días de la semana
 * y llama al repository, que a su vez llama a la API.
 */
export async function createScheduleAction(
  departmentId: number,
  _prev: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const name = (formData.get("name") as string).trim()
  const descriptionRaw = (formData.get("description") as string | null)?.trim()
  const isActiveRaw = formData.get("is_active") as string | null

  if (!name) {
    return { error: "El nombre del horario es obligatorio" }
  }

  const days = []

  for (let weekday = 1; weekday <= 7; weekday++) {
    const isWorkingDay = formData.get(`day_${weekday}_is_working_day`) === "on"
    const startTimeRaw = (formData.get(`day_${weekday}_start_time`) as string | null) || ""
    const endTimeRaw = (formData.get(`day_${weekday}_end_time`) as string | null) || ""
    const breakMinutesRaw = (formData.get(`day_${weekday}_break_minutes`) as string | null) || "0"

    const start_time = isWorkingDay ? `${startTimeRaw}:00` : null
    const end_time = isWorkingDay ? `${endTimeRaw}:00` : null
    const break_minutes = Number(breakMinutesRaw)

    if (isWorkingDay && (!startTimeRaw || !endTimeRaw)) {
      return { error: `Faltan horas en el día ${weekday}` }
    }

    if (!Number.isInteger(break_minutes) || break_minutes < 0) {
      return { error: `El descanso del día ${weekday} no es válido` }
    }

    days.push({
      weekday,
      is_working_day: isWorkingDay,
      start_time,
      end_time,
      break_minutes,
    })
  }

  try {
    await createSchedule({
      department_id: departmentId,
      name,
      description: descriptionRaw || null,
      is_active: isActiveRaw === "true",
      days,
    })

    revalidatePath(`/dashboard/${departmentId}/schedules`)

    return { success: "Plantilla de horario creada correctamente" }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al crear la plantilla de horario",
    }
  }
}