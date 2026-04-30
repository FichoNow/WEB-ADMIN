import { redirect } from 'next/navigation'
import { getDepartmentStats, getUserStats, getEmployees } from '@/app/repositories/admin-repository'
import type { StatsResponse } from '@/app/types/admin/api/stats-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import StatsClient from './StatsClient'

interface Props {
  params: Promise<{ departmentId: string }>
  searchParams: Promise<{ userId?: string; month?: string; year?: string }>
}

export default async function StatisticsPage({ params, searchParams }: Props) {
  const { departmentId } = await params
  const { userId, month, year } = await searchParams
  const deptId   = Number(departmentId)
  const userIdNum = userId ? Number(userId) : undefined
  const monthNum  = month  ? Number(month)  : undefined
  const yearNum   = year   ? Number(year)   : undefined

  let stats: StatsResponse
  let employees: EmployeeListItem[]

  try {
    ;[stats, employees] = await Promise.all([
      userIdNum
        ? getUserStats(deptId, userIdNum, monthNum, yearNum)
        : getDepartmentStats(deptId, monthNum, yearNum),
      getEmployees(deptId),
    ])
  } catch {
    redirect('/dashboard')
  }

  return (
    <div className="px-10 py-12 flex flex-col gap-8">
      <StatsClient
        stats={stats!}
        employees={employees!}
        currentUserId={userIdNum}
        departmentId={deptId}
      />
    </div>
  )
}
