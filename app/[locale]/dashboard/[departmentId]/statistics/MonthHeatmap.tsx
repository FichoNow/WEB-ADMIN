'use client'

import { useTranslations } from 'next-intl'
import type { DayStats } from '@/app/types/admin/api/stats-response'
import { minutesToHours } from './stats-utils'

interface Props {
  daily: DayStats[]
  month: number
  year: number
}

function getMonthCells(month: number, year: number) {
  const first = new Date(year, month - 1, 1)
  const days  = new Date(year, month, 0).getDate()
  const startDow = (first.getDay() + 6) % 7
  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function intensityClass(minutes: number, max: number): { bg: string; ring: string } {
  if (minutes === 0)        return { bg: 'bg-surface-variant/20',                 ring: 'ring-divider/20' }
  const ratio = max > 0 ? minutes / max : 0
  if (ratio < 0.25)         return { bg: 'bg-primary/15 text-primary',            ring: 'ring-primary/20' }
  if (ratio < 0.5)          return { bg: 'bg-primary/30 text-text-primary',       ring: 'ring-primary/30' }
  if (ratio < 0.75)         return { bg: 'bg-primary/55 text-white',              ring: 'ring-primary/50' }
  if (ratio <= 1)           return { bg: 'bg-primary text-white',                 ring: 'ring-primary' }
  return { bg: 'bg-warning text-bg', ring: 'ring-warning' }
}

export default function MonthHeatmap({ daily, month, year }: Props) {
  const t       = useTranslations('statistics.client.monthHeatmap')
  const tClient = useTranslations('statistics.client')
  const dow = (tClient.raw('daysShort') as string[]) ?? ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  // Solo usamos la primera letra para el heatmap mensual (cuadrículas pequeñas)
  const dowChars = dow.map((d) => d.charAt(0))

  const cells = getMonthCells(month, year)
  const byDay = new Map<number, DayStats>()
  daily.forEach((d) => {
    if (!d.date) return
    const day = Number(d.date.split('-')[2])
    byDay.set(day, d)
  })
  const max = Math.max(...daily.map((d) => d.regular_minutes + d.overtime_minutes), 0)

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid grid-cols-7 gap-1 text-center">
        {dowChars.map((d, i) => (
          <div key={i} className="text-[10px] text-text-hint pb-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />
          const stat    = byDay.get(day)
          const total   = stat ? stat.regular_minutes + stat.overtime_minutes : 0
          const overtime = stat ? stat.overtime_minutes : 0
          const isOver  = overtime > 540
          const cls     = intensityClass(total, max)
          const title =
            total === 0 ? t('tooltipNoActivity', { day }) :
            overtime > 0 ? t('tooltipDayOvertime', { day, hours: minutesToHours(total), overtime: minutesToHours(overtime) }) :
            t('tooltipDay', { day, hours: minutesToHours(total) })
          return (
            <div
              key={i}
              className={`relative aspect-square rounded-md flex items-center justify-center text-[10px] ring-1 ${cls.bg} ${cls.ring}`}
              title={title}
            >
              <span className="tabular-nums">{day}</span>
              {isOver && (
                <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-warning" />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-text-hint">
        <span>{t('less')}</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-surface-variant/20 ring-1 ring-divider/20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/15 ring-1 ring-primary/20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/30 ring-1 ring-primary/30" />
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/55 ring-1 ring-primary/50" />
          <div className="w-2.5 h-2.5 rounded-sm bg-primary ring-1 ring-primary" />
        </div>
        <span>{t('more')}</span>
      </div>
    </div>
  )
}
