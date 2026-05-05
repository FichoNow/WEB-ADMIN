/**
 * Día de una plantilla de horario que la web envía a la API.
 */
export interface CreateScheduleDayBody {
  weekday: number
  is_working_day: boolean
  start_time: string | null
  end_time: string | null
  break_minutes: number
}

/**
 * Body para crear una plantilla de horario.
 *
 * Lo usa:
 * POST /admin/schedule
 */
export interface CreateScheduleBody {
  department_id: number
  name: string
  description?: string | null
  is_active: boolean
  days: CreateScheduleDayBody[]
}

/**
 * Body para actualizar una plantilla de horario existente.
 *
 * Lo usa:
 * PUT /admin/schedule/:id
 */
export interface UpdateScheduleBody {
  name: string
  description?: string | null
  is_active: boolean
  days: CreateScheduleDayBody[]
}

/**
 * Body para asignar una plantilla de horario a un grupo.
 *
 * Lo usa:
 * POST /admin/schedule/group-assignment
 */
export interface CreateGroupScheduleAssignmentBody {
  group_id: number
  template_id: number
  start_date: string
  end_date?: string | null
}

/**
 * Body para asignar una plantilla de horario a un usuario.
 *
 * Lo usa:
 * POST /admin/schedule/user-assignment
 */
export interface CreateUserScheduleAssignmentBody {
  user_id: number
  template_id: number
  start_date: string
  end_date?: string | null
}