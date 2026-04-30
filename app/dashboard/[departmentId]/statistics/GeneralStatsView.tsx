'use client'

import { useMemo, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, Tooltip,
  BarChart as ReBarChart, Bar as ReBar,
  ResponsiveContainer,
} from 'recharts'
import { Activity, ArrowRight, ArrowUpDown, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SectionHeader from '@/components/SectionHeader'
import type { DepartmentStatsBundle } from './page'
import { minutesToHours, barChartConfig, COLORS, type ChartPoint } from './stats-utils'
import MonthHeatmap from './MonthHeatmap'
import LegalComplianceCard from './LegalComplianceCard'

interface Props {
  bundle: DepartmentStatsBundle
  chartData: ChartPoint[]
  isWeekly: boolean
  onViewUser: (userId: string) => void
  departmentId: number
  month?: number
  year?: number
}

type ActivityFilter = 'both' | 'regular' | 'overtime'
type RankingSort = 'total' | 'regular' | 'overtime' | 'punctuality'

export default function GeneralStatsView({ bundle, chartData, isWeekly, onViewUser, month, year }: Props) {
  const { overview, ranking, activeNow, hourly, absences, breaks, overtimeYearly } = bundle

  const overtimeEmployees = ranking.employees.filter((e) => e.overtime_minutes > 0)

  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('both')
  const [rankingSort, setRankingSort] = useState<RankingSort>('total')

  const sortedRanking = useMemo(() => {
    const arr = [...ranking.employees]
    switch (rankingSort) {
      case 'regular':
        return arr.sort((a, b) => b.regular_minutes - a.regular_minutes)
      case 'overtime':
        return arr.sort((a, b) => b.overtime_minutes - a.overtime_minutes)
      case 'punctuality':
        return arr.sort((a, b) => b.punctuality_rate - a.punctuality_rate)
      default:
        return arr.sort((a, b) => b.total_minutes - a.total_minutes)
    }
  }, [ranking.employees, rankingSort])

  const totalAbsences = absences.reasons.reduce((acc, c) => acc + c.count, 0)

  return (
    <div className="flex flex-col gap-8">

      {/* ── Sección 1: Actividad del período ── */}
      <SectionHeader
        title="Actividad del período"
        description="Distribución temporal de horas trabajadas por el departamento."
      />

      <Card className="bg-surface border border-divider rounded-2xl ring-0">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-sm font-medium text-text-primary">Horas trabajadas</h3>
              <p className="text-xs text-text-hint">Regulares vs extras a lo largo del período seleccionado.</p>
            </div>
            <Select value={activityFilter} onValueChange={(v) => setActivityFilter((v ?? 'both') as ActivityFilter)}>
              <SelectTrigger className="w-44 bg-surface" size="sm">
                <SelectValue>
                  {activityFilter === 'both' ? 'Regulares + Extras' : activityFilter === 'regular' ? 'Solo regulares' : 'Solo extras'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Regulares + Extras</SelectItem>
                <SelectItem value="regular">Solo regulares</SelectItem>
                <SelectItem value="overtime">Solo extras</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ChartContainer config={barChartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRegular" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExtra" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                dy={10}
                interval={isWeekly ? 0 : 4}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              {(activityFilter === 'both' || activityFilter === 'regular') && (
                <Area type="monotone" dataKey="regular_hours" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRegular)" activeDot={{ r: 5 }} />
              )}
              {(activityFilter === 'both' || activityFilter === 'overtime') && (
                <Area type="monotone" dataKey="overtime_hours" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExtra)" activeDot={{ r: 5 }} />
              )}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {!isWeekly && month && year && (
          <Card className="bg-surface border border-divider rounded-2xl ring-0">
            <CardContent className="p-6 flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium text-text-primary">Mapa de actividad mensual</h3>
                <p className="text-xs text-text-hint">Intensidad de jornada por día. Punto naranja = jornada {'>'}9h.</p>
              </div>
              <MonthHeatmap daily={overview.daily} month={month} year={year} />
            </CardContent>
          </Card>
        )}

        <Card className="bg-surface border border-divider rounded-2xl ring-0">
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary">Distribución horaria de fichajes</h3>
              <p className="text-xs text-text-hint">A qué horas del día se concentran las entradas.</p>
            </div>
            <ChartContainer config={{ count: { label: 'Entradas', color: '#6366F1' } }} className="h-[200px] w-full">
              <ReBarChart data={hourly.distribution}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `${v}h`} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReBar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={20} />
              </ReBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Sección 2: Estado actual ── */}
      <SectionHeader
        title="Estado actual"
        description="Quién está fichado ahora, alertas y motivos de ausencia del período."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* En este momento */}
        <Card className="bg-surface border border-divider rounded-2xl ring-0">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-success" />
              <h3 className="text-sm font-medium text-text-primary">En este momento</h3>
            </div>
            <p className="text-xs text-text-hint -mt-2">{activeNow.active.length} empleados fichados ahora.</p>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {activeNow.active.length === 0 ? (
                <p className="text-sm text-text-hint text-center py-6">Nadie fichado.</p>
              ) : activeNow.active.map((emp) => {
                const since = new Date(emp.clock_in)
                const mins  = Math.floor((Date.now() - since.getTime()) / 60000)
                const label = mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
                return (
                  <div key={emp.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-variant/30 border border-divider">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-sm text-text-primary">{emp.name}</span>
                    </div>
                    <span className="text-xs text-text-hint tabular-nums">{label}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Ausencias */}
        <Card className="bg-surface border border-divider rounded-2xl ring-0">
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary">Ausencias</h3>
              <p className="text-xs text-text-hint">Reparto por motivo en el período.</p>
            </div>
            {totalAbsences === 0 ? (
              <p className="text-sm text-text-hint text-center py-10">Sin ausencias.</p>
            ) : (
              <>
                <div className="h-[180px] w-full relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-light text-text-primary tabular-nums">{totalAbsences}</span>
                    <span className="text-xs text-text-hint">total</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={absences.reasons} dataKey="count" nameKey="reason" innerRadius={56} outerRadius={76} paddingAngle={4} stroke="none">
                        {absences.reasons.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(27, 29, 36, 0.95)', border: '1px solid rgba(38, 41, 51, 0.5)', borderRadius: '12px', fontSize: '12px', color: '#E0E0E0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {absences.reasons.map((abs, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-text-secondary truncate">{abs.reason}</span>
                      <span className="text-xs text-text-primary tabular-nums ml-auto">{abs.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Alertas overtime */}
        <Card className="bg-surface border border-divider rounded-2xl ring-0">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-medium text-text-primary">Alertas de horas extra</h3>
            </div>
            <p className="text-xs text-text-hint -mt-2">Empleados con exceso de jornada en el período.</p>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {overtimeEmployees.length === 0 ? (
                <p className="text-sm text-text-hint text-center py-6">Todo bajo control.</p>
              ) : overtimeEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-variant/30 border border-divider">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-warning" />
                    <span className="text-sm text-text-primary">{emp.name}</span>
                  </div>
                  <span className="text-xs text-warning tabular-nums font-medium">
                    +{minutesToHours(emp.overtime_minutes)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Sección 3: Cumplimiento legal ── */}
      <SectionHeader
        title="Cumplimiento legal"
        description="Pausas obligatorias y límite anual de horas extras (RD 8/2019, máx. 80h/año)."
      />
      <LegalComplianceCard breaks={breaks} overtimeYearly={overtimeYearly.entries} />

      {/* ── Sección 4: Ranking del equipo ── */}
      <SectionHeader
        title="Ranking del equipo"
        description="Clasificación de empleados por horas y puntualidad. Click en un empleado para ver su detalle."
      />

      <Card className="bg-surface border border-divider rounded-2xl ring-0">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 px-2">
            <p className="text-xs text-text-hint">{ranking.employees.length} empleados</p>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-text-hint" />
              <Select value={rankingSort} onValueChange={(v) => setRankingSort((v ?? 'total') as RankingSort)}>
                <SelectTrigger className="w-44 bg-surface" size="sm">
                  <SelectValue>
                    {rankingSort === 'total' ? 'Total acumulado' :
                     rankingSort === 'regular' ? 'Horas regulares' :
                     rankingSort === 'overtime' ? 'Horas extras' :
                     'Puntualidad'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Total acumulado</SelectItem>
                  <SelectItem value="regular">Horas regulares</SelectItem>
                  <SelectItem value="overtime">Horas extras</SelectItem>
                  <SelectItem value="punctuality">Puntualidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center text-xs">#</TableHead>
                  <TableHead className="text-xs">Empleado</TableHead>
                  <TableHead className="text-right text-xs">Regulares</TableHead>
                  <TableHead className="text-right text-xs">Extras</TableHead>
                  <TableHead className="text-right text-xs">Total</TableHead>
                  <TableHead className="text-center text-xs">Puntualidad</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRanking.map((emp, i) => (
                  <TableRow key={emp.id} className="group">
                    <TableCell className="text-center text-xs text-text-hint tabular-nums">{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-variant/60 flex items-center justify-center text-xs text-text-secondary">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-text-primary">{emp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-text-secondary tabular-nums">{minutesToHours(emp.regular_minutes)}</TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {emp.overtime_minutes > 0 ? (
                        <span className="text-warning">+{minutesToHours(emp.overtime_minutes)}</span>
                      ) : (
                        <span className="text-text-hint">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-text-primary tabular-nums">{minutesToHours(emp.total_minutes)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-1 min-w-[100px]">
                        <div className="w-full h-1.5 bg-surface-variant/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              emp.punctuality_rate > 90 ? 'bg-success' :
                              emp.punctuality_rate > 75 ? 'bg-primary' : 'bg-error'
                            }`}
                            style={{ width: `${emp.punctuality_rate}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-hint tabular-nums">{emp.punctuality_rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                        onClick={() => onViewUser(String(emp.id))}
                      >
                        Detalle
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
