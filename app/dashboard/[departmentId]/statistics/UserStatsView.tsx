'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { StatsResponse } from '@/app/types/admin/api/stats-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import { barChartConfig, type ChartPoint } from './stats-utils'

interface Props {
  stats: StatsResponse
  employees: EmployeeListItem[]
  currentUserId?: number
  chartData: ChartPoint[]
  onUserChange: (val: string) => void
}

export default function UserStatsView({ stats, employees, currentUserId, chartData, onUserChange }: Props) {
  const selectedUser = employees.find((e) => e.id === currentUserId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card className="bg-surface border-divider shadow-none rounded-2xl">
          <CardHeader className="pb-4 border-b border-divider/50 mb-6">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-hint">Filtro Individual</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Select value={currentUserId ? String(currentUserId) : 'all'} onValueChange={onUserChange}>
              <SelectTrigger className="w-full h-12 bg-surface-variant/30 border-divider text-text-primary rounded-xl">
                <SelectValue>{selectedUser?.name || 'Seleccionar...'}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-surface border-divider">
                <SelectItem value="all" className="italic opacity-70">Quitar filtro</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedUser && (
              <div className="flex flex-col items-center p-6 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-light text-primary border border-primary/20 mb-4">
                  {selectedUser.name.charAt(0)}
                </div>
                <span className="text-lg font-semibold text-text-primary">{selectedUser.name}</span>
                <Badge variant="secondary" className="mt-2 text-[10px] uppercase font-bold tracking-widest bg-primary/10 text-primary border-none">
                  {selectedUser.role}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3 flex flex-col gap-6">
        <Card className="bg-surface border-divider shadow-none rounded-3xl overflow-hidden">
          <CardHeader className="p-6 border-b border-divider/50">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-primary">Evolución Individual</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-10">
            <ChartContainer config={barChartConfig} className="h-[300px] w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRegularInd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F81E8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F81E8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#757575', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#757575', fontSize: 10 }} tickFormatter={(v) => `${v}h`} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" className="bg-surface border-divider text-text-primary" />} />
                <Area type="monotone" dataKey="regular_hours" stroke="#4F81E8" strokeWidth={3} fillOpacity={1} fill="url(#colorRegularInd)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
