import { redirect } from 'next/navigation'
import {
  getEmployees, getProjectsOverview,
  getOverview, getRanking, getProjectsPeriod, getActiveNow,
  getHourly, getAbsencesBreakdown, getTopDays, getBreaks,
  getOvertimeYearly, getGroups,
  getUserStats,
} from '@/app/repositories/admin-repository'
import type {
  OverviewResponse, RankingResponse, ProjectsPeriodResponse,
  ActiveNowResponse, HourlyResponse, AbsencesResponse, TopDaysResponse,
  BreaksResponse, OvertimeYearlyResponse, GroupsResponse,
  UserStatsResponse, ProjectsOverviewResponse,
} from '@/app/types/admin/api/stats-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import StatsClient from './StatsClient'

interface Props {
  params: Promise<{ departmentId: string }>
  searchParams: Promise<{ userId?: string; month?: string; year?: string; groupId?: string }>
}

export interface DepartmentStatsBundle {
  overview:        OverviewResponse
  ranking:         RankingResponse
  projectHours:    ProjectsPeriodResponse
  activeNow:       ActiveNowResponse
  hourly:          HourlyResponse
  absences:        AbsencesResponse
  topDays:         TopDaysResponse
  breaks:          BreaksResponse
  overtimeYearly:  OvertimeYearlyResponse
  groups:          GroupsResponse
}

export default async function StatisticsPage({ params, searchParams }: Props) {
  const { departmentId } = await params
  const { userId, month, year, groupId } = await searchParams
  const deptId     = Number(departmentId)
  const userIdNum  = userId  ? Number(userId)  : undefined
  const monthNum   = month   ? Number(month)   : undefined
  const yearNum    = year    ? Number(year)    : undefined
  const groupIdNum = groupId ? Number(groupId) : undefined

  const q = { departmentId: deptId, month: monthNum, year: yearNum, groupId: groupIdNum }

  let employees: EmployeeListItem[]
  let projectsOverview: ProjectsOverviewResponse
  let bundle: DepartmentStatsBundle
  let userStats: UserStatsResponse | null = null

  try {
    const [emps, projs, overview, ranking, projectHours, activeNow, hourly, absences, topDays, breaks, overtimeYearly, groups] =
      await Promise.all([
        getEmployees(deptId),
        getProjectsOverview(deptId),
        getOverview(q),
        getRanking(q),
        getProjectsPeriod(q),
        getActiveNow({ departmentId: deptId, groupId: groupIdNum }),
        getHourly(q),
        getAbsencesBreakdown(q),
        getTopDays(q),
        getBreaks(q),
        getOvertimeYearly({ departmentId: deptId, groupId: groupIdNum }),
        getGroups(deptId),
      ])

    employees        = emps
    projectsOverview = projs
    bundle = { overview, ranking, projectHours, activeNow, hourly, absences, topDays, breaks, overtimeYearly, groups }

    if (userIdNum) {
      userStats = await getUserStats(deptId, userIdNum, monthNum, yearNum)
    }
  } catch {
    redirect('/dashboard')
  }

  return (
    <div className="px-10 py-12 flex flex-col gap-6">
      <StatsClient
        bundle={bundle!}
        userStats={userStats}
        employees={employees!}
        projectsOverview={projectsOverview!}
        currentUserId={userIdNum}
        departmentId={deptId}
      />
    </div>
  )
}
