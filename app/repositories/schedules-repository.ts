import { fetchWithAuth } from '@/app/lib/api'
import type {
  CreateScheduleBody,
  CreateGroupScheduleAssignmentBody,
  CreateUserScheduleAssignmentBody,
} from '@/app/types/admin/api/schedule-request'
import type {
  ScheduleTemplateItem,
  ScheduleTemplateResponse,
  GroupScheduleAssignmentResponse,
  UserScheduleAssignmentResponse,
} from '@/app/types/admin/api/schedule-response'

/**
 * Obtiene las plantillas de horario de un departamento.
 *
 * Llama a:
 * GET /admin/schedules?departmentId=...
 */
export async function getSchedules(departmentId: number): Promise<ScheduleTemplateItem[]> {
  const res = await fetchWithAuth(`/admin/schedules?departmentId=${departmentId}`)

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'No se pudo cargar la lista de horarios')
  }

  const json = await res.json()
  return json.data as ScheduleTemplateItem[]
}

/**
 * Crea una plantilla de horario con sus días.
 *
 * Llama a:
 * POST /admin/schedule
 */
export async function createSchedule(
  body: CreateScheduleBody,
): Promise<ScheduleTemplateResponse> {
  const res = await fetchWithAuth('/admin/schedule', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al crear la plantilla de horario')
  }

  const json = await res.json()
  return json.data as ScheduleTemplateResponse
}

/**
 * Asigna una plantilla de horario a un grupo.
 *
 * Llama a:
 * POST /admin/schedule/group-assignment
 */
export async function createGroupScheduleAssignment(
  body: CreateGroupScheduleAssignmentBody,
): Promise<GroupScheduleAssignmentResponse> {
  const res = await fetchWithAuth('/admin/schedule/group-assignment', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al asignar la plantilla al grupo')
  }

  const json = await res.json()
  return json.data as GroupScheduleAssignmentResponse
}

/**
 * Asigna una plantilla de horario a un usuario individual.
 *
 * Llama a:
 * POST /admin/schedule/user-assignment
 */
export async function createUserScheduleAssignment(
  body: CreateUserScheduleAssignmentBody,
): Promise<UserScheduleAssignmentResponse> {
  const res = await fetchWithAuth('/admin/schedule/user-assignment', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al asignar la plantilla al usuario')
  }

  const json = await res.json()
  return json.data as UserScheduleAssignmentResponse
}