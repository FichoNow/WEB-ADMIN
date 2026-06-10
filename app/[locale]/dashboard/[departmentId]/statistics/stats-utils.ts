import type { DayStats } from '@/app/types/admin/api/stats-response'

export const DAY_LABELS    = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
export const MONTH_LABELS  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
export const COLORS        = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4']

export const barChartConfig = {
  regular_hours:  { label: 'Horas Regulares', color: '#6366F1' },
  overtime_hours: { label: 'Horas Extras',    color: '#F59E0B' },
}

export function calcTrend(current: number, prev: number): number {
  if (!prev) return 0
  return Math.round(((current - prev) / prev) * 100)
}

export function minutesToHours(minutes: number): string {
  // Solo horas redondeadas ("141h"); por debajo de 1h se muestran minutos ("45m").
  if (minutes < 60) return minutes > 0 ? `${minutes}m` : '0h'
  return `${Math.round(minutes / 60)}h`
}

export interface ChartPoint {
  label: string
  regular_hours: number
  overtime_hours: number
}

export function buildChartData(
  daily: DayStats[],
  isWeekly: boolean,
  currentMonth: number,
  currentYear: number,
): ChartPoint[] {
  if (isWeekly) {
    return DAY_LABELS.map((label, i) => {
      const d = daily.find((x) => x.weekday === i)
      return {
        label:          label.substring(0, 3),
        regular_hours:  d ? +(d.regular_minutes / 60).toFixed(1) : 0,
        overtime_hours: d ? +(d.overtime_minutes / 60).toFixed(1) : 0,
      }
    })
  }

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const yearStr     = String(currentYear)
  const monthStr    = String(currentMonth).padStart(2, '0')

  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum     = i + 1
    const dayStr     = String(dayNum).padStart(2, '0')
    const targetDate = `${yearStr}-${monthStr}-${dayStr}`
    const d = daily.find((x) => x.date && x.date.startsWith(targetDate))
    return {
      label:          String(dayNum),
      regular_hours:  d ? +(d.regular_minutes / 60).toFixed(1) : 0,
      overtime_hours: d ? +(d.overtime_minutes / 60).toFixed(1) : 0,
    }
  })
}

