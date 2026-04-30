'use client'

import React, { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Calendar, FileDown, TrendingUp, Zap, Sparkles, LayoutDashboard, UserCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { StatsResponse } from '@/app/types/admin/api/stats-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import { MONTH_LABELS, minutesToHours, buildChartData } from './stats-utils'
import GeneralStatsView from './GeneralStatsView'
import UserStatsView from './UserStatsView'

interface Props {
  stats: StatsResponse
  employees: EmployeeListItem[]
  currentUserId?: number
  departmentId: number
}

function MetricCard({ title, value, description, icon, trend, highlight }: {
  title: string; value: string; description: string; icon: React.ReactNode; trend?: number; highlight?: boolean
}) {
  return (
    <Card className={`bg-surface border-divider shadow-none rounded-3xl transition-all duration-200 hover:border-primary/30 ${highlight ? 'border-error/30 bg-error/5' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-hint">{title}</CardTitle>
        <div className="p-2 bg-surface-variant/50 rounded-xl border border-divider">{icon}</div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="text-4xl font-light text-text-primary tracking-tighter tabular-nums mb-1">{value}</div>
        <div className="flex items-center gap-2">
          {trend !== undefined && (
            <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trend > 0 ? 'text-success' : 'text-error'}`}>
              {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(trend)}%
            </div>
          )}
          <p className="text-[10px] text-text-hint font-medium uppercase tracking-wider">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StatsClient({ stats, employees, currentUserId }: Props) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'general' | 'individual'>(currentUserId ? 'individual' : 'general')

  const currentMonth = Number(searchParams.get('month')) || (new Date().getMonth() + 1)
  const currentYear  = Number(searchParams.get('year'))  || new Date().getFullYear()
  const isWeekly     = stats.period_label === 'Esta Semana'

  const chartData = React.useMemo(
    () => buildChartData(stats.daily, isWeekly, currentMonth, currentYear),
    [stats.daily, isWeekly, currentMonth, currentYear],
  )

  function updateQuery(newParams: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) params.delete(key)
      else params.set(key, value)
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleMonthChange(val: string) {
    if (val === 'current') updateQuery({ month: null, year: null })
    else updateQuery({ month: val, year: String(currentYear) })
  }

  function handleUserChange(val: string) {
    if (val === 'all') { updateQuery({ userId: null }); setTab('general') }
    else               { updateQuery({ userId: val });  setTab('individual') }
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700 pb-12">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="text-text-hint text-[10px] font-bold uppercase tracking-widest">{stats.period_label}</span>
          <h1 className="text-4xl font-light tracking-tight text-text-primary mt-1">Centro de Estadísticas</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={isWeekly ? 'current' : String(currentMonth)} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-44 h-11 bg-surface border-divider text-text-primary rounded-xl">
              <Calendar className="w-4 h-4 mr-2 text-text-hint" />
              <SelectValue>{isWeekly ? 'Esta Semana' : MONTH_LABELS[currentMonth - 1]}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-surface border-divider">
              <SelectItem value="current">Esta Semana</SelectItem>
              {MONTH_LABELS.slice(0, new Date().getMonth() + 1).map((m, i) => (
                <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11 gap-2 rounded-xl border-divider text-text-primary">
            <FileDown className="w-4 h-4" /> CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-variant/20 border border-divider rounded-2xl w-fit">
        <button
          onClick={() => { setTab('general'); updateQuery({ userId: null }) }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${tab === 'general' ? 'bg-surface text-primary shadow-sm' : 'text-text-hint hover:text-text-secondary'}`}
        >
          <LayoutDashboard className="w-4 h-4" /> General
        </button>
        <button
          onClick={() => setTab('individual')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${tab === 'individual' ? 'bg-surface text-primary shadow-sm' : 'text-text-hint hover:text-text-secondary'}`}
        >
          <UserCircle2 className="w-4 h-4" /> Individual
        </button>
      </div>

      {/* Insights + métricas globales (siempre visibles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 rounded-3xl shadow-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-24 h-24 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> IA Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {stats.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-primary leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <MetricCard title="Puntualidad Media" value={`${stats.punctuality_rate}%`} description="Global equipo" icon={<TrendingUp className="w-4 h-4 text-success" />} />
        <MetricCard title="Horas Extras" value={minutesToHours(stats.overtime_minutes)} description="Acumulado periodo" icon={<Zap className="w-4 h-4 text-warning" />} highlight={stats.overtime_minutes > 0} />
      </div>

      {/* Contenido por pestaña */}
      {tab === 'general'
        ? <GeneralStatsView stats={stats} chartData={chartData} isWeekly={isWeekly} onViewUser={handleUserChange} />
        : <UserStatsView stats={stats} employees={employees} currentUserId={currentUserId} chartData={chartData} onUserChange={handleUserChange} />
      }
    </div>
  )
}
