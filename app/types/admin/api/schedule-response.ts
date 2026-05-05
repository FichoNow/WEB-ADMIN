/**
 * Día concreto dentro de una plantilla de horario.
 *
 * weekday:
 * 1 = Lunes
 * 2 = Martes
 * ...
 * 7 = Domingo
 */
export interface ScheduleDayItem {
  id: number
  weekday: number
  is_working_day: boolean
  start_time: string | null
  end_time: string | null
  break_minutes: number
}

/**
 * Plantilla de horario completa recibida desde la API.
 *
 * La usa:
 * GET /admin/schedules?departmentId=...
 */
export interface ScheduleTemplateItem {
  id: number
  department_id: number
  name: string
  description: string | null
  weekly_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
  days: ScheduleDayItem[]
}

/**
 * Respuesta al crear una plantilla de horario.
 *
 * La usa:
 * POST /admin/schedule
 */
export interface ScheduleTemplateResponse {
  id: number
  department_id: number
  name: string
  description: string | null
  weekly_minutes: number
  is_active: boolean
}

/**
 * Respuesta al asignar una plantilla a un grupo.
 *
 * La usa:
 * POST /admin/schedule/group-assignment
 */
export interface GroupScheduleAssignmentResponse {
  id: number
  group_id: number
  template_id: number
  start_date: string
  end_date: string | null
}

/**
 * Respuesta al asignar una plantilla a un usuario.
 *
 * La usa:
 * POST /admin/schedule/user-assignment
 */
export interface UserScheduleAssignmentResponse {
  id: number
  user_id: number
  template_id: number
  start_date: string
  end_date: string | null
}

/**
 * Asignación de horario individual de un usuario, enriquecida con nombre del
 * usuario y de la plantilla. La devuelve GET /admin/schedule/assignments.
 */
export interface UserScheduleAssignmentItem {
  id: number
  user_id: number
  user_name: string
  user_email: string
  template_id: number
  template_name: string
  start_date: string
  end_date: string | null
}

/**
 * Asignación de horario de un grupo, enriquecida con nombre del grupo y de la
 * plantilla. La devuelve GET /admin/schedule/assignments.
 */
export interface GroupScheduleAssignmentItem {
  id: number
  group_id: number
  group_name: string
  template_id: number
  template_name: string
  start_date: string
  end_date: string | null
}

/**
 * Respuesta de GET /admin/schedule/assignments?departmentId=...
 */
export interface ScheduleAssignmentsResponse {
  user_assignments: UserScheduleAssignmentItem[]
  group_assignments: GroupScheduleAssignmentItem[]
}