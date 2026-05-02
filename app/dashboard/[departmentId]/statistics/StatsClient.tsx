'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, FileDown, TrendingUp, Zap, Sparkles, LayoutDashboard, UserCircle2, ArrowUpRight, ArrowDownRight, ChevronDown, Clock, Folder, Users, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/PageHeader'
import type {
  UserStatsResponse, ProjectsOverviewResponse,
  OverviewResponse, RankingResponse, ProjectsPeriodResponse, ActiveNowResponse,
  HourlyResponse, AbsencesResponse, TopDaysResponse, BreaksResponse,
  OvertimeYearlyResponse, GroupsResponse
} from '@/app/types/admin/api/stats-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import { getUserProjectHoursAction } from '@/app/actions/admin/stats/get-user-project-hours'
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

function MetricCard({ title, value, description, icon, trend, borderColor = 'border-l-primary', highlight = false, delay = 0 }: {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="h-full"
    >
      <Card className="bg-surface/50 backdrop-blur-sm border border-divider/50 rounded-[2rem] ring-0 h-full hover:shadow-lg hover:bg-surface transition-all duration-300 group relative overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderColor.replace('border-l-', 'bg-')} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
        <CardContent className="p-6 pl-8 flex flex-col justify-between gap-4 h-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-hint opacity-70 group-hover:opacity-100 transition-opacity">
              {icon}
              <span>{title}</span>
            </div>
            {trend !== undefined && trend !== 0 && (
              <div className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-bold ${trend > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-light text-text-primary tabular-nums tracking-tight">{value}</div>
            <p className="text-xs text-text-hint font-medium opacity-80">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export default function StatsClient({ bundle, userStats, employees, projectsOverview, currentUserId, departmentId }: Props) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'general' | 'individual' | 'proyectos'>(currentUserId ? 'individual' : 'general')

  if (!bundle?.overview) {
    return <div className="flex items-center justify-center h-64 text-text-hint">No hay datos disponibles para este período.</div>
  }

  const overview = bundle.overview
  const currentMonth = Number(searchParams.get('month')) || (new Date().getMonth() + 1)
  const currentYear  = Number(searchParams.get('year'))  || new Date().getFullYear()
  const isWeekly     = overview.period_label === 'Esta Semana'
  const currentGroupId = searchParams.get('groupId') ? Number(searchParams.get('groupId')) : undefined
  const isProjectsTab = tab === 'proyectos'
  const isIndividualTab = tab === 'individual'
  const selectedUser = employees.find((e) => e.id === currentUserId)
  const [insightsOpen, setInsightsOpen] = useState(false)
  const [empSearch, setEmpSearch] = useState('')

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
    try {
      const data = await getUserProjectHoursAction(
        departmentId,
        isWeekly ? undefined : currentMonth,
        isWeekly ? undefined : currentYear,
        currentGroupId ?? undefined,
      )
      exportStatsCsv(bundle.ranking, data, overview.period_label)
    } catch {
      return
    }
  }

  return (
    <div className="flex flex-col gap-8">

      <PageHeader
        title={isProjectsTab ? 'Estadísticas de proyectos' : 'Estadísticas'}
        description={
          isProjectsTab
            ? 'Distribución histórica de horas por proyecto en el departamento.'
            : `Análisis de rendimiento del equipo · ${overview.period_label}`
        }
        actions={
          <Button variant="outline" onClick={handleExport} className="gap-2 rounded-xl">
            <FileDown className="w-4 h-4" />
            Exportar
          </Button>
        }
      />

      {/* Tabs + filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => {
          setTab(v as any)
          if (v !== 'individual') updateQuery({ userId: null })
        }} className="w-full sm:w-fit min-w-0">
          <TabsList className="bg-surface border border-divider/50 p-1 h-11 rounded-xl w-full sm:w-auto grid grid-cols-3 sm:flex">
            {(
              [
                { key: 'general',    label: 'Vista general', shortLabel: 'General',    Icon: LayoutDashboard },
                { key: 'individual', label: 'Individual',    shortLabel: 'Individual', Icon: UserCircle2 },
                { key: 'proyectos',  label: 'Proyectos',     shortLabel: 'Proyectos',  Icon: Folder },
              ] as const
            ).map(({ key, label, shortLabel, Icon }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-lg px-2 sm:px-5 text-[11px] sm:text-xs font-bold transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary min-w-0"
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline truncate">{label}</span>
                <span className="sm:hidden ml-1 truncate">{shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {!isProjectsTab && (
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <Select value={isWeekly ? 'current' : String(currentMonth)} onValueChange={(v) => handleMonthChange(v ?? 'current')}>
              <SelectTrigger className="w-full sm:w-44 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium min-w-0">
                <Calendar className="w-4 h-4 mr-2 text-primary shrink-0" />
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
              <SelectTrigger className="w-full sm:w-52 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium min-w-0">
                <Users className="w-4 h-4 mr-2 text-primary shrink-0" />
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
              <Select
                value={currentUserId ? String(currentUserId) : 'all'}
                onValueChange={(v) => { handleUserChange(v ?? 'all'); setEmpSearch('') }}
              >
                <SelectTrigger className="col-span-2 w-full sm:w-52 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium min-w-0">
                  <UserCircle2 className="w-4 h-4 mr-2 text-primary shrink-0" />
                  <span className="truncate">{selectedUser?.name ?? 'Todos los empleados'}</span>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-divider p-0 overflow-hidden" style={{ width: 240 }}>
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-divider/50">
                    <Search className="w-3.5 h-3.5 text-text-hint shrink-0" />
                    <input
                      className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-hint outline-none"
                      placeholder="Buscar empleado..."
                      value={empSearch}
                      onChange={(e) => setEmpSearch(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="overflow-y-auto max-h-56 py-1">
                    {[{ id: 'all', name: 'Todos los empleados' }, ...employees]
                      .filter((e) => e.name.toLowerCase().includes(empSearch.toLowerCase()))
                      .map((e) => (
                        <SelectItem key={e.id} value={String(e.id)} className="text-xs px-3 py-2">
                          {e.name}
                        </SelectItem>
                      ))
                    }
                  </div>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
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

          <Card className="bg-surface/40 backdrop-blur-md border border-divider/50 rounded-[2.5rem] ring-0 overflow-hidden group hover:bg-surface/60 transition-all duration-300 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary shadow-[0_0_10px_rgba(0,0,0,0.1)]" />
            <button
              type="button"
              onClick={() => setInsightsOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-4 p-6 text-left transition-colors"
              aria-expanded={insightsOpen}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">Análisis Inteligente</span>
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">AI Beta</Badge>
                  </div>
                  <span className="text-[11px] text-text-hint font-medium uppercase tracking-wider mt-0.5">
                    {insights.length} hallazgos clave en el período
                  </span>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface border border-divider/50 transition-all ${insightsOpen ? 'rotate-180 bg-primary/10 text-primary border-primary/20' : 'text-text-hint'}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            <AnimatePresence>
              {insightsOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8 pt-2">
                    <div className="h-px bg-divider/30 mb-6" />
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {insights.map((insight, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 group/item"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 group-hover/item:scale-150 transition-transform" />
                          <span className="text-xs text-text-secondary leading-relaxed font-medium">
                            {insight}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
