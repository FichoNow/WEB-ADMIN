import { fetchWithAuth } from '@/app/lib/api'
import type { CompanyInfoResponse } from '@/app/types/admin/api/company-info-response'
import type { CreateEmployeeBody, UpdateEmployeeBody } from '@/app/types/admin/api/employee-request'
import type { EmployeeResponse, EmployeeListItem } from '@/app/types/admin/api/employee-response'
import type { CreateGroupBody, UpdateGroupBody } from '@/app/types/admin/api/group-request'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import type { AdminRequestListItem } from '@/app/types/admin/api/admin-request-response'
import type { ReviewRequestBody } from '@/app/types/admin/api/review-request-body'
import type { ReviewRequestResponse } from '@/app/types/admin/api/review-request-response'
import type {
  OverviewResponse, RankingResponse, ProjectsPeriodResponse,
  ActiveNowResponse, HourlyResponse, AbsencesResponse, TopDaysResponse,
  BreaksResponse, OvertimeYearlyResponse, GroupsResponse,
  UserProjectHoursResponse,
  UserStatsResponse, ProjectStatsResponse, ProjectsOverviewResponse,
} from '@/app/types/admin/api/stats-response'

// ── Empresa / empleados / solicitudes ──

export async function getCompanyInfo(): Promise<CompanyInfoResponse> {
  const res = await fetchWithAuth('/admin/company-info')
  if (!res.ok) throw new Error('No se pudo cargar la información del dashboard')
  const json = await res.json()
  return json.data as CompanyInfoResponse
}

export async function getEmployees(departmentId: number): Promise<EmployeeListItem[]> {
  const res = await fetchWithAuth(`/admin/users?departmentId=${departmentId}`)
  if (!res.ok) throw new Error('No se pudo cargar la lista de empleados')
  const json = await res.json()
  return json.data as EmployeeListItem[]
}

export async function createEmployee(body: CreateEmployeeBody): Promise<EmployeeResponse> {
  const res = await fetchWithAuth('/admin/user', { method: 'POST', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al crear el empleado')
  }
  const json = await res.json()
  return json.data as EmployeeResponse
}

export async function updateEmployee(id: number, body: UpdateEmployeeBody): Promise<EmployeeResponse> {
  const res = await fetchWithAuth(`/admin/user/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al actualizar el empleado')
  }
  const json = await res.json()
  return json.data as EmployeeResponse
}

export async function deleteEmployee(id: number): Promise<void> {
  const res = await fetchWithAuth(`/admin/user/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al eliminar el empleado')
  }
}

// ── Grupos (admin CRUD) ──

export async function listGroups(departmentId: number): Promise<GroupResponse[]> {
  const res = await fetchWithAuth(`/admin/groups?departmentId=${departmentId}`)
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'No se pudieron cargar los grupos')
  }
  const json = await res.json()
  return json.data as GroupResponse[]
}

export async function createGroup(body: CreateGroupBody): Promise<GroupResponse> {
  const res = await fetchWithAuth('/admin/group', { method: 'POST', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al crear el grupo')
  }
  const json = await res.json()
  return json.data as GroupResponse
}

export async function updateGroup(id: number, body: UpdateGroupBody): Promise<GroupResponse> {
  const res = await fetchWithAuth(`/admin/group/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al actualizar el grupo')
  }
  const json = await res.json()
  return json.data as GroupResponse
}

export async function deleteGroup(id: number): Promise<void> {
  const res = await fetchWithAuth(`/admin/group/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al eliminar el grupo')
  }
}

export async function getRequests(departmentId: number): Promise<AdminRequestListItem[]> {
  const res = await fetchWithAuth(`/admin/requests?departmentId=${departmentId}`)
  if (!res.ok) throw new Error('No se pudo cargar la lista de solicitudes')
  const json = await res.json()
  return json.data as AdminRequestListItem[]
}

export async function approveRequest(id: number, body: ReviewRequestBody): Promise<ReviewRequestResponse> {
  const res = await fetchWithAuth(`/admin/requests/${id}/approve`, { method: 'PATCH', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al aprobar la solicitud')
  }
  const json = await res.json()
  return json.data as ReviewRequestResponse
}

export async function rejectRequest(id: number, body: ReviewRequestBody): Promise<ReviewRequestResponse> {
  const res = await fetchWithAuth(`/admin/requests/${id}/reject`, { method: 'PATCH', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al rechazar la solicitud')
  }
  const json = await res.json()
  return json.data as ReviewRequestResponse
}

export async function getCompanyDetails() {
  const res = await fetchWithAuth('/superadmin/company')
  if (!res.ok) throw new Error('No se pudo cargar la información de la empresa')
  const json = await res.json()
  return json.data as {
    id: number; name: string; cif_nif: string; email: string
    address_line: string; city: string; postal_code: string
  }
}

export async function getSuperadmins() {
  const res = await fetchWithAuth('/superadmin/superadmins')
  if (!res.ok) throw new Error('No se pudieron cargar los administradores')
  const json = await res.json()
  return json.data as { id: number; name: string; email: string; is_active: boolean }[]
}

// ── Stats: query helper ──

interface StatsQuery {
  departmentId: number
  month?:   number
  year?:    number
  groupId?: number
  userId?:  number
}

function buildStatsParams(q: StatsQuery): string {
  const p = new URLSearchParams({ departmentId: String(q.departmentId) })
  if (q.month)   p.set('month',   String(q.month))
  if (q.year)    p.set('year',    String(q.year))
  if (q.groupId) p.set('groupId', String(q.groupId))
  if (q.userId)  p.set('userId',  String(q.userId))
  return p.toString()
}

async function fetchStats<T>(path: string, errMsg: string): Promise<T> {
  const res = await fetchWithAuth(path)
  if (!res.ok) throw new Error(errMsg)
  const json = await res.json()
  return json.data as T
}

// ── Stats endpoints granulares ──

export const getOverview = (q: StatsQuery) =>
  fetchStats<OverviewResponse>(`/admin/stats/overview?${buildStatsParams(q)}`, 'No se pudo cargar overview')

export const getRanking = (q: StatsQuery) =>
  fetchStats<RankingResponse>(`/admin/stats/ranking?${buildStatsParams(q)}`, 'No se pudo cargar ranking')

export const getProjectsPeriod = (q: StatsQuery) =>
  fetchStats<ProjectsPeriodResponse>(`/admin/stats/projects-period?${buildStatsParams(q)}`, 'No se pudieron cargar proyectos del período')

export const getActiveNow = (q: StatsQuery) =>
  fetchStats<ActiveNowResponse>(`/admin/stats/active-now?${buildStatsParams(q)}`, 'No se pudo cargar actividad actual')

export const getHourly = (q: StatsQuery) =>
  fetchStats<HourlyResponse>(`/admin/stats/hourly?${buildStatsParams(q)}`, 'No se pudo cargar distribución horaria')

export const getAbsencesBreakdown = (q: StatsQuery) =>
  fetchStats<AbsencesResponse>(`/admin/stats/absences?${buildStatsParams(q)}`, 'No se pudieron cargar ausencias')

export const getTopDays = (q: StatsQuery) =>
  fetchStats<TopDaysResponse>(`/admin/stats/top-days?${buildStatsParams(q)}`, 'No se pudieron cargar top días')

export const getBreaks = (q: StatsQuery) =>
  fetchStats<BreaksResponse>(`/admin/stats/breaks?${buildStatsParams(q)}`, 'No se pudieron cargar pausas')

export const getOvertimeYearly = (q: StatsQuery) =>
  fetchStats<OvertimeYearlyResponse>(`/admin/stats/overtime-yearly?${buildStatsParams(q)}`, 'No se pudieron cargar horas extras anuales')

export const getGroups = (departmentId: number) =>
  fetchStats<GroupsResponse>(`/admin/stats/groups?departmentId=${departmentId}`, 'No se pudieron cargar los grupos')

export const getUserProjectHours = (q: StatsQuery) =>
  fetchStats<UserProjectHoursResponse>(`/admin/stats/user-project-hours?${buildStatsParams(q)}`, 'No se pudieron cargar horas usuario-proyecto')

// ── Composites ──

export async function getUserStats(
  departmentId: number, userId: number, month?: number, year?: number,
): Promise<UserStatsResponse> {
  const params = new URLSearchParams({ departmentId: String(departmentId) })
  if (month) params.set('month', String(month))
  if (year)  params.set('year',  String(year))
  return fetchStats<UserStatsResponse>(
    `/admin/stats/user/${userId}?${params}`,
    'No se pudieron cargar las estadísticas del empleado',
  )
}

export async function getProjectsOverview(departmentId: number): Promise<ProjectsOverviewResponse> {
  return fetchStats<ProjectsOverviewResponse>(
    `/admin/stats/projects?departmentId=${departmentId}`,
    'No se pudo cargar el resumen de proyectos',
  )
}

export async function getProjectStats(
  departmentId: number, projectName: string, month?: number, year?: number,
): Promise<ProjectStatsResponse> {
  const params = new URLSearchParams({ departmentId: String(departmentId), projectName })
  if (month) params.set('month', String(month))
  if (year)  params.set('year',  String(year))
  return fetchStats<ProjectStatsResponse>(
    `/admin/stats/project?${params}`,
    'No se pudieron cargar los detalles del proyecto',
  )
}
