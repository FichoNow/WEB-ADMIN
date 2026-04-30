'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, FileDown, TrendingUp, Zap, Sparkles, LayoutDashboard, UserCircle2, ArrowUpRight, ArrowDownRight, ChevronDown, Clock, Folder, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import type {
  UserStatsResponse, ProjectsOverviewResponse,
} from '@/app/types/admin/api/stats-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import type { DepartmentStatsBundle } from './page'
import { MONTH_LABELS, minutesToHours, buildChartData, calcTrend } from './stats-utils'
import { exportStatsCsv, exportProjectsCsv } from './export-utils'
import { generateInsights } from './insights-utils'
import GeneralStatsView from './GeneralStatsView'
import UserStatsView from './UserStatsView'
import ProjectsStatsView from './ProjectsStatsView'

interface Props {
  bundle: DepartmentStatsBundle
  userStats: UserStatsResponse | null
  employees: EmployeeListItem[]
  projectsOverview: ProjectsOverviewResponse
  currentUserId?: number
  departmentId: number
}

function MetricCard({ title, value, description, icon, trend, borderColor = 'border-l-primary' }: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: number
  borderColor?: string
  highlight?: boolean
  delay?: number
}) {
  return (
    <Card className={`bg-surface border border-divider rounded-2xl ring-0 border-l-4 ${borderColor} h-full`}>
      <CardContent className="p-4 flex flex-col justify-between gap-2 h-full">
        <div className="flex items-center gap-2 text-xs text-text-hint">
          {icon}
          <span>{title}</span>
        </div>
        <div className="text-2xl font-light text-text-primary tabular-nums leading-none">{value}</div>
        <div className="flex items-center gap-2">
          {trend !== undefined && trend !== 0 && (
            <div className={`flex items-center gap-0.5 text-xs ${trend > 0 ? 'text-success' : 'text-error'}`}>
              {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
          )}
          <p className="text-xs text-text-hint">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StatsClient({ bundle, userStats, employees, projectsOverview, currentUserId, departmentId }: Props) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'general' | 'individual' | 'proyectos'>(currentUserId ? 'individual' : 'general')

  const overview = bundle.overview
  const currentMonth = Number(searchParams.get('month')) || (new Date().getMonth() + 1)
  const currentYear  = Number(searchParams.get('year'))  || new Date().getFullYear()
  const isWeekly     = overview.period_label === 'Esta Semana'
  const currentGroupId = searchParams.get('groupId') ? Number(searchParams.get('groupId')) : undefined
  const isIndividualTab = tab === 'individual'
  const selectedUser = employees.find((e) => e.id === currentUserId)
  const [insightsOpen, setInsightsOpen] = useState(false)

  const chartData = useMemo(
    () => buildChartData(overview.daily, isWeekly, currentMonth, currentYear),
    [overview.daily, isWeekly, currentMonth, currentYear],
  )

  const insights = useMemo(
    () => generateInsights({
      overview:       bundle.overview,
      ranking:        bundle.ranking,
      breaks:         bundle.breaks,
      overtimeYearly: bundle.overtimeYearly,
      projectHours:   bundle.projectHours,
      activeNow:      bundle.activeNow,
    }),
    [bundle],
  )

  function updateQuery(newParams: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) params.delete(key)
      else params.set(key, value)
    })
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function handleMonthChange(val: string) {
    if (val === 'current') updateQuery({ month: null, year: null })
    else updateQuery({ month: val, year: String(currentYear) })
  }

  function handleGroupChange(val: string) {
    if (val === 'all') updateQuery({ groupId: null })
    else               updateQuery({ groupId: val })
  }

  function handleUserChange(val: string) {
    if (val === 'all') { updateQuery({ userId: null }); setTab('general') }
    else               { updateQuery({ userId: val });  setTab('individual') }
  }

  async function handleExport() {
    if (isProjectsTab) {
      exportProjectsCsv(projectsOverview)
      return
    }
    const params = new URLSearchParams({ departmentId: String(departmentId) })
    if (!isWeekly) {
      params.set('month', String(currentMonth))
      params.set('year',  String(currentYear))
    }
    if (currentGroupId) params.set('groupId', String(currentGroupId))
    const res = await fetch(`/api/stats/user-project-hours?${params}`)
    if (!res.ok) return
    const json = await res.json()
    exportStatsCsv(bundle.ranking, json.data, overview.period_label)
  }

  const isProjectsTab = tab === 'proyectos'

  return (
    <div className="flex flex-col gap-6">

      <PageHeader
        title={isProjectsTab ? 'Estadísticas de proyectos' : 'Estadísticas'}
        description={
          isProjectsTab
            ? 'Distribución histórica de horas por proyecto en el departamento.'
            : `Análisis de rendimiento del equipo · ${overview.period_label}`
        }
        actions={
          <>
            {!isProjectsTab && (
              <>
                <Select value={isWeekly ? 'current' : String(currentMonth)} onValueChange={(v) => handleMonthChange(v ?? 'current')}>
                  <SelectTrigger className="w-40 bg-surface">
                    <Calendar className="w-4 h-4 mr-1 text-primary" />
                    <SelectValue>{isWeekly ? 'Esta semana' : MONTH_LABELS[currentMonth - 1]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Esta semana</SelectItem>
                    {MONTH_LABELS.slice(0, new Date().getMonth() + 1).map((m, i) => (
                      <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={currentGroupId ? String(currentGroupId) : 'all'} onValueChange={(v) => handleGroupChange(v ?? 'all')}>
                  <SelectTrigger className="w-40 bg-surface">
                    <Users className="w-4 h-4 mr-1 text-primary" />
                    <SelectValue placeholder="Todos los grupos">
                      {currentGroupId
                        ? bundle.groups.groups.find((g) => g.id === currentGroupId)?.name ?? 'Todos los grupos'
                        : 'Todos los grupos'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los grupos</SelectItem>
                    {bundle.groups.groups.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isIndividualTab && (
                  <Select value={currentUserId ? String(currentUserId) : 'all'} onValueChange={(v) => handleUserChange(v ?? 'all')}>
                    <SelectTrigger className="w-48 bg-surface">
                      <UserCircle2 className="w-4 h-4 mr-1 text-primary" />
                      <SelectValue placeholder="Selecciona empleado">
                        {selectedUser?.name ?? 'Selecciona empleado'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los empleados</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
            <Button variant="outline" onClick={handleExport} className="gap-2 rounded-xl">
              <FileDown className="w-4 h-4" />
              Exportar
            </Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-divider rounded-xl w-fit">
        {(
          [
            { key: 'general',    label: 'Vista general', Icon: LayoutDashboard },
            { key: 'individual', label: 'Individual',    Icon: UserCircle2 },
            { key: 'proyectos',  label: 'Proyectos',     Icon: Folder },
          ] as const
        ).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key)
              if (key !== 'individual') updateQuery({ userId: null })
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-colors ${
              tab === key
                ? 'bg-primary/10 text-primary'
                : 'text-text-hint hover:text-text-secondary hover:bg-surface-variant/30'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* KPIs */}
      {!isProjectsTab && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Horas Trabajadas"
              value={minutesToHours(overview.total_minutes)}
              description="Total del período"
              icon={<Clock className="w-4 h-4 text-primary" />}
              borderColor="border-l-primary"
              trend={calcTrend(overview.total_minutes, overview.total_minutes_prev)}
            />
            <MetricCard
              title="Puntualidad Media"
              value={`${overview.punctuality_rate}%`}
              description="Rendimiento del equipo"
              icon={<TrendingUp className="w-4 h-4 text-success" />}
              borderColor="border-l-success"
              trend={calcTrend(overview.punctuality_rate, overview.punctuality_rate_prev)}
            />
            <MetricCard
              title="Horas Extras"
              value={minutesToHours(overview.overtime_minutes)}
              description="Exceso de jornada"
              icon={<Zap className="w-4 h-4 text-warning" />}
              borderColor="border-l-warning"
              highlight={overview.overtime_minutes > 0}
              trend={calcTrend(overview.overtime_minutes, overview.overtime_minutes_prev)}
            />
          </div>

          {/* IA Insights — collapsible */}
          <Card className="bg-surface border border-divider rounded-2xl ring-0 border-l-4 border-l-primary">
            <button
              type="button"
              onClick={() => setInsightsOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-2 p-5 text-left hover:bg-surface-variant/20 transition-colors rounded-2xl"
              aria-expanded={insightsOpen}
            >
              <div className="flex items-center gap-2 text-sm text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Insights del período</span>
                <span className="text-xs text-text-hint font-normal">· {insights.length} análisis</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-text-hint transition-transform ${insightsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {insightsOpen && (
              <div className="px-5 pb-5 -mt-1">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed">
                      <div className="w-1 h-1 rounded-full bg-primary shrink-0 mt-1.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={isProjectsTab ? '' : 'pb-20'}
        >
          {tab === 'general' && (
            <GeneralStatsView
              bundle={bundle}
              chartData={chartData}
              isWeekly={isWeekly}
              onViewUser={handleUserChange}
              departmentId={departmentId}
              month={isWeekly ? undefined : currentMonth}
              year={isWeekly ? undefined : currentYear}
            />
          )}
          {tab === 'individual' && (
            <UserStatsView
              userStats={userStats}
              employees={employees}
              currentUserId={currentUserId}
              chartData={chartData}
              onUserChange={handleUserChange}
              departmentId={departmentId}
              month={isWeekly ? undefined : currentMonth}
              year={isWeekly ? undefined : currentYear}
            />
          )}
          {tab === 'proyectos' && (
            <ProjectsStatsView overview={projectsOverview} departmentId={departmentId} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
