'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Folder, Clock, Layers, Trophy, ChevronRight, BarChart3, Users, Search, X,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SectionHeader from '@/components/SectionHeader'
import type { ProjectsOverviewResponse } from '@/app/types/admin/api/stats-response'
import { minutesToHours, COLORS } from './stats-utils'
import ProjectDetailDialog from './ProjectDetailDialog'

interface Props {
  overview: ProjectsOverviewResponse
  departmentId: number
}

function StatCard({
  title, value, sub, icon, borderColor = 'bg-primary',
}: {
  title: string; value: string; sub: string; icon: React.ReactNode; borderColor?: string
}) {
  return (
    <Card className="bg-surface border border-divider rounded-2xl ring-0 overflow-hidden relative group hover:bg-surface-variant/40 transition-all duration-300">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderColor.replace('border-l-', 'bg-')} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
      <CardHeader className="p-4 pl-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-xs text-text-hint">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pl-6 pt-0 flex flex-col gap-1">
        <div className="text-3xl font-light text-text-primary tabular-nums">{value}</div>
        <p className="text-xs text-text-hint">{sub}</p>
      </CardContent>
    </Card>
  )
}

interface TooltipPayload {
  payload?: { fullName: string; minutes: number }
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  if (!d) return null
  return (
    <div className="bg-surface border border-divider rounded-xl px-3 py-2">
      <p className="text-xs text-text-primary mb-0.5">{d.fullName}</p>
      <p className="text-xs text-primary tabular-nums">{minutesToHours(d.minutes)}</p>
    </div>
  )
}

export default function ProjectsStatsView({ overview, departmentId }: Props) {
  const t = useTranslations('statistics.client.projects')
  const { projects, total_minutes, total_projects } = overview
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const activeProjects = projects.filter((p) => p.minutes > 0)
  const topProject     = projects[0]

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((p) => p.project_name.toLowerCase().includes(q))
  }, [projects, query])

  const chartData = filteredProjects.slice(0, 12).map((p) => ({
    name:     p.project_name.length > 22 ? `${p.project_name.slice(0, 19)}…` : p.project_name,
    fullName: p.project_name,
    hours:    parseFloat((p.minutes / 60).toFixed(1)),
    minutes:  p.minutes,
  }))

  const chartHeight = Math.max(chartData.length * 44, 160)

  return (
    <div className="flex flex-col gap-6">

      {/* KPIs */}
      <SectionHeader
        title={t('summaryTitle')}
        description={t('summaryDesc')}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('totalHours')}
          value={minutesToHours(total_minutes)}
          sub={t('totalHoursSub')}
          icon={<Clock className="w-4 h-4 text-primary" />}
          borderColor="border-l-primary"
        />
        <StatCard
          title={t('totalProjects')}
          value={String(total_projects)}
          sub={t('totalProjectsSub')}
          icon={<Layers className="w-4 h-4 text-success" />}
          borderColor="border-l-success"
        />
        <StatCard
          title={t('withActivity')}
          value={String(activeProjects.length)}
          sub={t('withActivitySub')}
          icon={<Folder className="w-4 h-4 text-warning" />}
          borderColor="border-l-warning"
        />
        <StatCard
          title={t('topProject')}
          value={topProject && topProject.minutes > 0 ? minutesToHours(topProject.minutes) : '—'}
          sub={topProject?.project_name ?? t('noData')}
          icon={<Trophy className="w-4 h-4 text-warning" />}
          borderColor="border-l-warning"
        />
      </div>

      {/* Chart + list */}
      <SectionHeader
        title={t('compareTitle')}
        description={t('compareDesc')}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-hint pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface border border-divider/60 text-sm text-text-primary placeholder:text-text-hint focus:outline-none focus:border-primary/60 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-surface-variant/50 text-text-hint hover:text-text-primary transition-colors"
            aria-label={t('clearSearch')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Horizontal bar chart */}
        <Card className="bg-surface border border-divider rounded-2xl ring-0 lg:col-span-3">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <BarChart3 className="w-4 h-4 text-primary" />
              {t('accumulated')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-text-hint">
                <Folder className="w-8 h-8" />
                <p className="text-sm">{t('noneRegistered')}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
                  onClick={(d: unknown) => {
                    const payload = (d as { activePayload?: { payload?: { fullName?: string } }[] })?.activePayload
                    const name = payload?.[0]?.payload?.fullName
                    if (name) setSelectedProject(name)
                  }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    tickFormatter={(v: number) => `${v}h`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#E0E0E0', fontSize: 11 }}
                    width={130}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="hours" radius={[0, 6, 6, 0]} barSize={22} cursor="pointer">
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Project list */}
        <Card className="bg-surface border border-divider rounded-2xl ring-0 lg:col-span-2">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <Folder className="w-4 h-4 text-primary" />
              {query ? t('results', { n: filteredProjects.length }) : t('allProjects')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-1">
              {projects.length === 0 ? (
                <p className="text-sm text-text-hint text-center py-10">{t('noProjects')}</p>
              ) : filteredProjects.length === 0 ? (
                <p className="text-sm text-text-hint text-center py-10">
                  {t('noMatch', { query })}
                </p>
              ) : (
                filteredProjects.map((project, i) => {
                  const pct        = total_minutes > 0 ? (project.minutes / total_minutes) * 100 : 0
                  const isSelected = selectedProject === project.project_name
                  const color      = COLORS[i % COLORS.length]

                  return (
                    <button
                      key={project.project_name}
                      onClick={() => setSelectedProject(isSelected ? null : project.project_name)}
                      className={`flex flex-col gap-2 p-3 rounded-xl border transition-colors text-left w-full ${
                        isSelected
                          ? 'bg-surface-variant border-primary/40'
                          : 'bg-surface-variant/30 border-divider hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium shrink-0 border"
                            style={{
                              backgroundColor: `${color}20`,
                              borderColor:     `${color}40`,
                              color,
                            }}
                          >
                            {project.project_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm truncate ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                              {project.project_name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Users className="w-3 h-3 text-text-hint" />
                              <span className="text-xs text-text-hint">
                                {project.user_count} {project.user_count === 1 ? t('participant') : t('participants')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm text-text-primary tabular-nums">
                            {minutesToHours(project.minutes)}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isSelected ? 'rotate-90 text-primary' : 'text-text-hint'
                            }`}
                          />
                        </div>
                      </div>
                      <div className="h-1 bg-surface-variant/40 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ProjectDetailDialog
        projectName={selectedProject}
        departmentId={departmentId}
        allTime
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
