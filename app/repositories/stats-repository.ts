import { fetchWithAuth } from '@/app/lib/api'
import type {
  OverviewResponse, RankingResponse, ProjectsPeriodResponse,
  ActiveNowResponse, HourlyResponse, AbsencesResponse, TopDaysResponse,
  BreaksResponse, OvertimeYearlyResponse, GroupsResponse,
  UserProjectHoursResponse,
  UserStatsResponse, ProjectStatsResponse, ProjectsOverviewResponse,
} from '@/app/types/admin/api/stats-response'

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
