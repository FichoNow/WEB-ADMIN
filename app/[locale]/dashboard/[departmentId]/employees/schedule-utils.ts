import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import type {
  GroupScheduleAssignmentItem,
  UserScheduleAssignmentItem,
} from '@/app/types/admin/api/schedule-response'

/**
 * Resultado de calcular el horario efectivo de un empleado.
 *
 * `source` indica de dónde viene la asignación:
 *  - "user"  → el empleado tiene una asignación individual (prioritaria).
 *  - "group" → hereda la asignación de su grupo.
 *  - "none"  → no hay horario asignado para hoy.
 */
export type EffectiveSchedule =
  | { source: 'user'; templateId: number; templateName: string; startDate: string; endDate: string | null }
  | { source: 'group'; templateId: number; templateName: string; startDate: string; endDate: string | null; groupName: string }
  | { source: 'none' }

export function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Devuelve el horario efectivo de un empleado a día de hoy aplicando la regla
 * "asignación individual > asignación de grupo".
 *
 * Si el usuario tiene varias asignaciones individuales activas, gana la de
 * `start_date` más reciente. Mismo criterio para grupos.
 */
export function computeEffectiveSchedule(
  emp: EmployeeListItem,
  userAssignments: UserScheduleAssignmentItem[],
  groupAssignments: GroupScheduleAssignmentItem[],
  today: string,
): EffectiveSchedule {
  const userMatch = userAssignments
    .filter((a) => a.user_id === emp.id)
    .filter((a) => a.start_date <= today && (a.end_date === null || a.end_date >= today))
    .sort((a, b) => b.start_date.localeCompare(a.start_date))[0]

  if (userMatch) {
    return {
      source: 'user',
      templateId: userMatch.template_id,
      templateName: userMatch.template_name,
      startDate: userMatch.start_date,
      endDate: userMatch.end_date,
    }
  }

  if (emp.group_id != null) {
    const groupMatch = groupAssignments
      .filter((a) => a.group_id === emp.group_id)
      .filter((a) => a.start_date <= today && (a.end_date === null || a.end_date >= today))
      .sort((a, b) => b.start_date.localeCompare(a.start_date))[0]

    if (groupMatch) {
      return {
        source: 'group',
        templateId: groupMatch.template_id,
        templateName: groupMatch.template_name,
        startDate: groupMatch.start_date,
        endDate: groupMatch.end_date,
        groupName: groupMatch.group_name,
      }
    }
  }

  return { source: 'none' }
}
