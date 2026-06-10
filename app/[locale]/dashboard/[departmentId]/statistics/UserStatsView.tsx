'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { User, Target, Award, Clock, Folder, Trophy, TrendingUp, TrendingDown, GitCompare, Calendar, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SectionHeader from '@/components/SectionHeader'
import type { UserStatsResponse } from '@/app/types/admin/api/stats-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import { minutesToHours, calcTrend, COLORS } from './stats-utils'
import LegalComplianceCard from './LegalComplianceCard'
import EmployeeCompareForm from './EmployeeCompareForm'
import AttendanceCalendar from './AttendanceCalendar'

interface Props {
  userStats: UserStatsResponse | null
  employees: EmployeeListItem[]
  currentUserId?: number
  onUserChange: (val: string) => void
  departmentId: number
  month?: number
  year?: number
  isWeekly?: boolean
}

const accentBorder: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
}

export default function UserStatsView({ userStats, employees, currentUserId, departmentId, month, year, isWeekly }: Props) {
  const t = useTranslations('statistics.client.user')
  const [compareOpen, setCompareOpen] = useState(false)
  const selectedUser = employees.find((e) => e.id === currentUserId)

  if (!selectedUser) {
    return (
      <div className="flex flex-col gap-4">
        <Card className="bg-surface border border-divider rounded-2xl ring-0">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-text-hint">
            <User className="w-10 h-10" />
            <p className="text-sm">{t('selectEmployeePrompt')}</p>
            <Button variant="outline" onClick={() => setCompareOpen(true)} className="gap-2 mt-2">
              <GitCompare className="w-4 h-4" />
              {t('compareEmployees')}
            </Button>
          </CardContent>
        </Card>
        <EmployeeCompareForm
          open={compareOpen}
          employees={employees}
          departmentId={departmentId}
          month={month}
          year={year}
          onClose={() => setCompareOpen(false)}
        />
      </div>
    )
  }

  const projectHours = userStats?.project_hours ?? []
  const topDays      = userStats?.top_days      ?? []
  const prevTotal    = userStats?.total_minutes_prev    ?? 0
  const prevPunct    = userStats?.punctuality_rate_prev ?? 0
  const prevOT       = userStats?.overtime_minutes_prev ?? 0

  return (
    <div className="flex flex-col gap-8">

      {/* Empleado actual */}
      <Card className="bg-surface border border-divider rounded-2xl ring-0">
        <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-base font-medium text-primary border border-primary/20">
              {selectedUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium text-text-primary">{selectedUser.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-[10px]">{selectedUser.role === 'ADMINISTRATOR' ? t('roleAdmin') : t('roleUser')}</Badge>
                <span className="text-xs text-text-hint">#{selectedUser.id}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setCompareOpen(true)} className="gap-2">
            <GitCompare className="w-4 h-4" />
            {t('compareEmployees')}
          </Button>
        </CardContent>
      </Card>

      {userStats && (
        <>
          {/* KPIs */}
          <SectionHeader title={t('summaryTitle')} description={t('summaryDesc')} />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: t('totalHours'),  icon: <Clock className="w-4 h-4 text-primary" />,  value: minutesToHours(userStats.total_minutes),    trend: calcTrend(userStats.total_minutes, prevTotal),    color: 'primary' },
              { label: t('punctuality'), icon: <Target className="w-4 h-4 text-success" />, value: `${userStats.punctuality_rate}%`,           trend: calcTrend(userStats.punctuality_rate, prevPunct), color: 'success' },
              { label: t('overtime'),    icon: <Award className="w-4 h-4 text-warning" />,  value: minutesToHours(userStats.overtime_minutes), trend: calcTrend(userStats.overtime_minutes, prevOT),    color: 'warning' },
              { label: t('absences'),    icon: <Calendar className="w-4 h-4 text-error" />, value: String(userStats.active_absences),          trend: undefined,                                         color: 'error' },
              { label: t('editedFichajes'), icon: <Pencil className="w-4 h-4 text-warning" />, value: String(userStats.edited_fichajes ?? 0),  trend: undefined,                                         color: 'warning' },
            ].map((kpi, i) => (
              <Card key={i} className="bg-surface border border-divider rounded-2xl ring-0 overflow-hidden relative group hover:bg-surface-variant/40 transition-all duration-300">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentBorder[kpi.color]} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                <CardContent className="p-4 pl-6 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {kpi.icon}
                    <span className="text-xs text-text-hint">{kpi.label}</span>
                  </div>
                  <span className="text-2xl font-light text-text-primary tabular-nums">{kpi.value}</span>
                  {kpi.trend !== undefined && kpi.trend !== 0 && (
                    <div className={`flex items-center gap-1 text-xs ${kpi.trend > 0 ? 'text-success' : 'text-error'}`}>
                      {kpi.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {t('trendVsPrev', { pct: Math.abs(kpi.trend) })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Asistencia */}
          <SectionHeader
            title={isWeekly ? t('attendanceWeekTitle') : t('attendanceMonthTitle')}
            description={t('attendanceDesc')}
          />
          <Card className="bg-surface border border-divider rounded-2xl ring-0">
            <CardContent className="p-6">
              {isWeekly ? (
                <AttendanceCalendar daily={userStats.daily} isWeekly />
              ) : month !== undefined && year !== undefined ? (
                <AttendanceCalendar daily={userStats.daily} month={month} year={year} />
              ) : null}
            </CardContent>
          </Card>

          {/* Cumplimiento legal */}
          <SectionHeader title={t('legalTitle')} description={t('legalDesc')} />
          <LegalComplianceCard breaks={userStats.breaks} overtimeYearly={userStats.overtime_yearly} />

          {/* Proyectos + Top días */}
          <SectionHeader title={t('periodDetailTitle')} description={t('periodDetailDesc')} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-surface border border-divider rounded-2xl ring-0">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-text-primary">{t('hoursByProject')}</h3>
                </div>
                {projectHours.length === 0 ? (
                  <p className="text-sm text-text-hint text-center py-4">{t('noData')}</p>
                ) : (() => {
                  const total = projectHours.reduce((s, p) => s + p.minutes, 0)
                  return (
                    <div className="flex flex-col gap-3">
                      {projectHours.slice(0, 5).map((p, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-text-primary truncate max-w-[180px]">{p.project_name}</span>
                            <span className="text-xs text-text-hint tabular-nums">{minutesToHours(p.minutes)}</span>
                          </div>
                          <div className="h-1.5 bg-surface-variant/30 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${(p.minutes / total) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            <Card className="bg-surface border border-divider rounded-2xl ring-0">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-warning" />
                  <h3 className="text-sm font-medium text-text-primary">{t('topDays')}</h3>
                </div>
                {topDays.length === 0 ? (
                  <p className="text-sm text-text-hint text-center py-4">{t('noData')}</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {topDays.map((day, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-variant/30 border border-divider">
                        <div className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xs tabular-nums">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary">{day.day_label}</p>
                          <p className="text-xs text-text-hint tabular-nums">{minutesToHours(day.total_minutes)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <EmployeeCompareForm
        open={compareOpen}
        employees={employees}
        departmentId={departmentId}
        month={month}
        year={year}
        onClose={() => setCompareOpen(false)}
      />
    </div>
  )
}
