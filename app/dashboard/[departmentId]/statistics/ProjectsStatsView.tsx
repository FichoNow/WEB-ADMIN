'use client'

import { useState } from 'react'
import {
  Folder, Clock, Layers, Trophy, ChevronRight, BarChart3, Users,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SectionHeader from '@/components/SectionHeader'
import type { ProjectsOverviewResponse } from '@/app/types/admin/api/stats-response'
import { minutesToHours, COLORS } from './stats-utils'
import ProjectDetailModal from './ProjectDetailModal'

interface Props {
  overview: ProjectsOverviewResponse
  departmentId: number
}

function StatCard({
  title, value, sub, icon, borderColor = 'border-l-primary',
}: {
  title: string; value: string; sub: string; icon: React.ReactNode; borderColor?: string
}) {
  return (
    <Card className={`bg-surface border border-divider rounded-2xl ring-0 border-l-4 ${borderColor}`}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-xs text-text-hint">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col gap-1">
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
  const { projects, total_minutes, total_projects } = overview
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const activeProjects = projects.filter((p) => p.minutes > 0)
  const topProject     = projects[0]

  const chartData = projects.slice(0, 12).map((p) => ({
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
        title="Resumen histórico"
        description="Indicadores acumulados de todos los proyectos del departamento."
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Horas totales"
          value={minutesToHours(total_minutes)}
          sub="Acumulado histórico"
          icon={<Clock className="w-4 h-4 text-primary" />}
          borderColor="border-l-primary"
        />
        <StatCard
          title="Total proyectos"
          value={String(total_projects)}
          sub="En el departamento"
          icon={<Layers className="w-4 h-4 text-success" />}
          borderColor="border-l-success"
        />
        <StatCard
          title="Con actividad"
          value={String(activeProjects.length)}
          sub="Con horas registradas"
          icon={<Folder className="w-4 h-4 text-warning" />}
          borderColor="border-l-warning"
        />
        <StatCard
          title="Proyecto líder"
          value={topProject && topProject.minutes > 0 ? minutesToHours(topProject.minutes) : '—'}
          sub={topProject?.project_name ?? 'Sin datos'}
          icon={<Trophy className="w-4 h-4 text-warning" />}
          borderColor="border-l-warning"
        />
      </div>

      {/* Chart + list */}
      <SectionHeader
        title="Comparativa de proyectos"
        description="Click en una barra o tarjeta para ver el detalle del proyecto."
      />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Horizontal bar chart */}
        <Card className="bg-surface border border-divider rounded-2xl ring-0 lg:col-span-3">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <BarChart3 className="w-4 h-4 text-primary" />
              Horas acumuladas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-text-hint">
                <Folder className="w-8 h-8" />
                <p className="text-sm">Sin proyectos registrados.</p>
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
              Todos los proyectos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-1">
              {projects.length === 0 ? (
                <p className="text-sm text-text-hint text-center py-10">Sin proyectos.</p>
              ) : (
                projects.map((project, i) => {
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
                                {project.user_count} {project.user_count === 1 ? 'participante' : 'participantes'}
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

      <ProjectDetailModal
        projectName={selectedProject}
        departmentId={departmentId}
        allTime
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
