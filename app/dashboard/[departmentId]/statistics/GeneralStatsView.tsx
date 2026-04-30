'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, Tooltip,
  BarChart as ReBarChart, Bar as ReBar,
  ResponsiveContainer,
} from 'recharts'
import { Zap, Sparkles, UserCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { StatsResponse } from '@/app/types/admin/api/stats-response'
import { minutesToHours, barChartConfig, COLORS, type ChartPoint } from './stats-utils'

interface Props {
  stats: StatsResponse
  chartData: ChartPoint[]
  isWeekly: boolean
  onViewUser: (userId: string) => void
}

export default function GeneralStatsView({ stats, chartData, isWeekly, onViewUser }: Props) {
  const overtimeEmployees = stats.top_employees?.filter((e) => e.overtime_minutes > 0) ?? []

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-6">

          {/* Actividad temporal */}
          <Card className="bg-surface border-divider shadow-none rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-divider/50">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-primary">Actividad Temporal</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-10">
              <ChartContainer config={barChartConfig} className="h-[320px] w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRegular" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F81E8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F81E8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExtra" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFB74D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFB74D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#757575', fontSize: 10, fontWeight: 700 }} dy={10} interval={isWeekly ? 0 : 4} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#757575', fontSize: 10, fontWeight: 700 }} tickFormatter={(v) => `${v}h`} />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" className="bg-surface border-divider text-text-primary" />} />
                  <Area type="monotone" dataKey="regular_hours" stroke="#4F81E8" strokeWidth={3} fillOpacity={1} fill="url(#colorRegular)" />
                  <Area type="monotone" dataKey="overtime_hours" stroke="#FFB74D" strokeWidth={3} fillOpacity={1} fill="url(#colorExtra)" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Flujo de entradas por hora */}
          <Card className="bg-surface border-divider shadow-none rounded-3xl overflow-hidden">
            <CardHeader className="p-6 border-b border-divider/50">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-primary">Flujo de Entradas por Hora</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-10">
              <ChartContainer config={{ count: { label: 'Entradas', color: '#81C784' } }} className="h-[200px] w-full">
                <ReBarChart data={stats.hourly_distribution}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#757575', fontSize: 10 }} tickFormatter={(v) => `${v}h`} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent className="bg-surface border-divider text-text-primary" />} />
                  <ReBar dataKey="count" fill="#81C784" radius={[4, 4, 0, 0]} barSize={20} />
                </ReBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Motivos de ausencia */}
          <Card className="bg-surface border-divider shadow-none rounded-2xl overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-hint">Motivos de Ausencia</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.absences_breakdown} dataKey="count" nameKey="reason" innerRadius={50} outerRadius={70} paddingAngle={5}>
                      {stats.absences_breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1B1D24', border: '1px solid #262933', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 px-4">
                {stats.absences_breakdown.map((abs, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] font-bold text-text-hint uppercase tracking-tighter">{abs.reason}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertas extras */}
          <Card className="bg-surface border-divider shadow-none rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-warning flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Alertas Extras
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {overtimeEmployees.length === 0 ? (
                <p className="text-[10px] text-text-hint text-center py-2 italic font-medium uppercase tracking-widest">Sin horas extras</p>
              ) : overtimeEmployees.map((emp) => (
                <div key={emp.id} className="flex flex-col gap-1 p-2.5 rounded-xl bg-warning/5 border border-warning/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-text-primary">{emp.name}</span>
                    <Badge className="text-[9px] bg-warning text-bg font-bold border-none">+{minutesToHours(emp.overtime_minutes)}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabla de personal */}
      <Card className="bg-surface border-divider shadow-none rounded-3xl overflow-hidden">
        <CardHeader className="p-6 border-b border-divider/50 bg-surface-variant/5">
          <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-text-primary">Análisis Detallado del Personal</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-divider/50">
                <TableHead className="w-12 text-[10px] font-bold uppercase tracking-widest text-text-hint text-center">#</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-hint">Empleado</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-hint text-right">Regulares</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-hint text-right">Extras</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-hint text-right">Total</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-hint text-center">Puntualidad</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.top_employees?.map((emp, i) => (
                <TableRow key={emp.id} className="border-divider/30 hover:bg-surface-variant/10 group">
                  <TableCell className="text-center">
                    {i < 3
                      ? <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] font-bold ${i === 0 ? 'bg-warning text-bg' : i === 1 ? 'bg-text-secondary text-bg' : 'bg-orange-400 text-bg'}`}>{i + 1}</div>
                      : <span className="text-[10px] font-bold text-text-hint">{i + 1}</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{emp.name}</span>
                      <span className="text-[10px] text-text-hint uppercase tracking-tighter">ID: {emp.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium text-text-secondary">{minutesToHours(emp.regular_minutes)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`text-xs font-bold ${emp.overtime_minutes > 0 ? 'text-warning' : 'text-text-hint opacity-30'}`}>
                      {emp.overtime_minutes > 0 ? `+${minutesToHours(emp.overtime_minutes)}` : '0h'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm font-bold text-text-primary">{minutesToHours(emp.total_minutes)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex-1 max-w-[60px] h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div className={`h-full ${emp.punctuality_rate > 90 ? 'bg-success' : emp.punctuality_rate > 75 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${emp.punctuality_rate}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-text-primary w-8">{emp.punctuality_rate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onViewUser(String(emp.id))}>
                      <UserCircle2 className="w-4 h-4 text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
