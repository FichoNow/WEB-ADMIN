"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { createSchedule } from "@/app/repositories/schedules-repository"
import { translateFirstIssue } from "@/app/lib/translate-zod"
import { createScheduleSchema } from "@/app/types/admin/schemas/schedule-schema"
import type { ScheduleActionState } from "@/app/types/admin/action-states/schedule-state"

/**
 * Server Action para crear una plantilla de horario desde el panel admin.
 *
 * Recibe el FormData del formulario, construye los 7 días de la semana,
 * valida con Zod y llama al repository.
 */
export async function createScheduleAction(
  departmentId: number,
  _prev: ScheduleActionState,
  formData: FormData,
): Promise<ScheduleActionState> {
  const t = await getTranslations("actions")
  const days = Array.from({ length: 7 }, (_, i) => {
    const weekday = i + 1
    const isWorkingDay = formData.get(`day_${weekday}_is_working_day`) === "on"
    const startTimeRaw = (formData.get(`day_${weekday}_start_time`) as string | null) ?? ""
    const endTimeRaw = (formData.get(`day_${weekday}_end_time`) as string | null) ?? ""
    const breakMinutesRaw = (formData.get(`day_${weekday}_break_minutes`) as string | null) ?? "0"

    return {
      weekday,
      is_working_day: isWorkingDay,
      start_time: startTimeRaw,
      end_time: endTimeRaw,
      break_minutes: Number(breakMinutesRaw),
    }
  })

  const parsed = createScheduleSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
    is_active: formData.get("is_active") ?? "true",
    days,
  })

  if (!parsed.success) {
    return { error: await translateFirstIssue(parsed.error) }
  }

  const data = parsed.data

  try {
    await createSchedule({
      department_id: departmentId,
      name: data.name,
      description: data.description?.length ? data.description : null,
      is_active: data.is_active === "true",
      days: data.days.map((d) => ({
        weekday: d.weekday,
        is_working_day: d.is_working_day,
        start_time: d.is_working_day && d.start_time ? `${d.start_time}:00` : null,
        end_time: d.is_working_day && d.end_time ? `${d.end_time}:00` : null,
        break_minutes: d.break_minutes,
      })),
    })

    revalidatePath(`/dashboard/${departmentId}/schedules`)

    return { success: t("schedules.templateCreated") }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : t("errors.scheduleTemplateCreate"),
    }
  }
}
