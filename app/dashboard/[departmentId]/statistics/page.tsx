import React, { Suspense } from 'react'
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
import StatsClient, { type DepartmentStatsBundle } from './StatsClient'

interface Props {
  params: Promise<{ departmentId: string }>
  searchParams: Promise<{ userId?: string; month?: string; year?: string; groupId?: string }>
}


export default async function StatisticsPage({ params, searchParams }: Props) {
  const { departmentId } = await params
  const { userId, month, year, groupId } = await searchParams
  const deptId     = Number(departmentId)
  const userIdNum  = userId  ? Number(userId)  : undefined
  const monthNum   = month   ? Number(month)   : undefined
  const yearNum    = year    ? Number(year)    : undefined
  const groupIdNum = groupId ? Number(groupId) : undefined

  let userStats: UserStatsResponse | null = null
  const q = { departmentId: deptId, month: monthNum, year: yearNum, groupId: groupIdNum }

  let employees: EmployeeListItem[] = []
  let projectsOverview: ProjectsOverviewResponse = { projects: [], total_minutes: 0, total_projects: 0 }
  let bundle: DepartmentStatsBundle

  try {
    const [emps, projs] = await Promise.all([
      getEmployees(deptId).catch(() => []),
      getProjectsOverview(deptId).catch(() => ({ projects: [], total_minutes: 0, total_projects: 0 })),
    ])
    
    employees = emps
    projectsOverview = projs

    // Fetch bundle parts with individual catch to avoid total failure
    const [overview, ranking, projectHours, activeNow, hourly, absences, topDays, breaks, overtimeYearly, groups] =
      await Promise.all([
        getOverview(q).catch(() => ({ period_label: '', total_minutes: 0, overtime_minutes: 0, punctuality_rate: 0, active_absences: 0, pending_requests: 0, employees_active: 0, employees_total: 0, daily: [], total_minutes_prev: 0, overtime_minutes_prev: 0, punctuality_rate_prev: 0 })),
        getRanking(q).catch(() => ({ employees: [] })),
        getProjectsPeriod(q).catch(() => ({ projects: [] })),
        getActiveNow({ departmentId: deptId, groupId: groupIdNum }).catch(() => ({ active: [] })),
        getHourly(q).catch(() => ({ distribution: [] })),
        getAbsencesBreakdown(q).catch(() => ({ reasons: [] })),
        getTopDays(q).catch(() => ({ days: [] })),
        getBreaks(q).catch(() => ({ total_break_minutes: 0, fichajes_with_break: 0, total_fichajes: 0, avg_break_minutes: 0 })),
        getOvertimeYearly({ departmentId: deptId, groupId: groupIdNum }).catch(() => ({ entries: [] })),
        getGroups(deptId).catch(() => ({ groups: [] })),
      ])

    bundle = { overview, ranking, projectHours, activeNow, hourly, absences, topDays, breaks, overtimeYearly, groups }

    if (userIdNum) {
      userStats = await getUserStats(deptId, userIdNum, monthNum, yearNum).catch(() => null)
    }
  } catch (e) {
    console.error('Critical error loading statistics page:', e)
    // If we can't even get to here, redirect
    redirect('/dashboard')
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-6">
      <React.Suspense fallback={<div className="h-96 w-full animate-pulse bg-surface/50 rounded-[2rem]" />}>
        <StatsClient
          bundle={bundle!}
          userStats={userStats}
          employees={employees!}
          projectsOverview={projectsOverview!}
          currentUserId={userIdNum}
          departmentId={deptId}
        />
      </React.Suspense>
    </div>
  )
}
