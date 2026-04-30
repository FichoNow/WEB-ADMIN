import type { DayStats } from '@/app/types/admin/api/stats-response'

export const DAY_LABELS    = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
export const MONTH_LABELS  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
export const COLORS        = ['#4F81E8','#FFB74D','#81C784','#E57373','#BA68C8','#4DB6AC']

export const barChartConfig = {
  regular_hours:  { label: 'Horas Regulares', color: '#4F81E8' },
  overtime_hours: { label: 'Horas Extras',    color: '#FFB74D' },
}

export function minutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
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
    const dayNum    = i + 1
    const dayStr    = String(dayNum).padStart(2, '0')
    const targetDate = `${yearStr}-${monthStr}-${dayStr}`
    const d = daily.find((x) => x.date && x.date.startsWith(targetDate))
    return {
      label:          String(dayNum),
      regular_hours:  d ? +(d.regular_minutes / 60).toFixed(1) : 0,
      overtime_hours: d ? +(d.overtime_minutes / 60).toFixed(1) : 0,
    }
  })
}
