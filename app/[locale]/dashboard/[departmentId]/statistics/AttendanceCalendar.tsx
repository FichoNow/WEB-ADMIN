'use client'

import { useTranslations, useLocale } from 'next-intl'
import type { DayStats } from '@/app/types/admin/api/stats-response'
import { minutesToHours } from './stats-utils'

interface MonthProps {
  daily: DayStats[]
  month: number
  year: number
  isWeekly?: false
}

interface WeekProps {
  daily: DayStats[]
  isWeekly: true
}

type Props = MonthProps | WeekProps

function getMonthCells(month: number, year: number) {
  const first = new Date(year, month - 1, 1)
  const days = new Date(year, month, 0).getDate()
  const startDow = (first.getDay() + 6) % 7
  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/** Devuelve el lunes de la semana actual. */
function getMondayOfThisWeek(): Date {
  const d = new Date()
  const dow = (d.getDay() + 6) % 7 // 0 = lunes
  d.setDate(d.getDate() - dow)
  d.setHours(0, 0, 0, 0)
  return d
}

type Status = 'attended' | 'absent' | 'weekend' | 'future'

function classes(status: Status) {
  switch (status) {
    case 'attended': return 'bg-success/80 text-white border-success'
    case 'absent':   return 'bg-error/70 text-white border-error'
    case 'weekend':  return 'bg-surface-variant/60 text-text-hint border-divider'
    case 'future':   return 'bg-surface-variant/20 text-text-hint/60 border-divider/40'
  }
}

const LOCALE_MAP: Record<string, string> = { es: 'es', cat: 'ca', en: 'en' }

export default function AttendanceCalendar(props: Props) {
  const t       = useTranslations('statistics.client.calendar')
  const tClient = useTranslations('statistics.client')
  const locale  = useLocale()
  const intlLocale = LOCALE_MAP[locale] ?? 'es'
  const dow = (tClient.raw('daysShort') as string[]) ?? ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let attended = 0
  let absent = 0
  let edited = 0

  type Cell = { key: string; day: number; date: Date; stat: DayStats | undefined } | { key: string; empty: true }

  let cells: Cell[]
  let isCurrentPeriod = false

  if (props.isWeekly) {
    const monday = getMondayOfThisWeek()
    isCurrentPeriod = true
    const byWeekday = new Map<number, DayStats>()
    props.daily.forEach((d) => byWeekday.set(d.weekday, d))

    cells = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      return {
        key: `w-${i}`,
        day: date.getDate(),
        date,
        stat: byWeekday.get(i),
      }
    })
  } else {
    const { month, year, daily } = props
    isCurrentPeriod = today.getFullYear() === year && today.getMonth() + 1 === month
    const byDay = new Map<number, DayStats>()
    daily.forEach((d) => {
      if (!d.date) return
      byDay.set(Number(d.date.split('-')[2]), d)
    })

    cells = getMonthCells(month, year).map((day, i) =>
      day === null
        ? { key: `e-${i}`, empty: true }
        : { key: `m-${day}`, day, date: new Date(year, month - 1, day), stat: byDay.get(day) }
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-7 gap-2 text-center">
        {dow.map((d) => (
          <div key={d} className="text-xs font-medium text-text-hint pb-1">{d}</div>
        ))}
        {cells.map((cell) => {
          if ('empty' in cell) return <div key={cell.key} />

          const { day, date, stat } = cell
          const dowIdx = (date.getDay() + 6) % 7
          const isWeekend = dowIdx >= 5
          const cellDate = new Date(date); cellDate.setHours(0, 0, 0, 0)
          const isFuture = cellDate > today
          const isToday = cellDate.getTime() === today.getTime()

          const total = stat ? stat.regular_minutes + stat.overtime_minutes : 0
          const overtime = stat ? stat.overtime_minutes : 0
          const editedCount = stat?.edited_count ?? 0
          if (editedCount > 0) edited += editedCount

          let status: Status
          if (total > 0) {
            status = 'attended'
            attended++
          } else if (isWeekend) {
            status = 'weekend'
          } else if (isFuture) {
            status = 'future'
          } else {
            status = 'absent'
            absent++
          }

          const tooltipText =
            status === 'attended' && overtime > 0 ? t('tooltipAttendedOvertime', { hours: minutesToHours(total), overtime: minutesToHours(overtime) }) :
            status === 'attended' ? t('tooltipAttended', { hours: minutesToHours(total) }) :
            status === 'absent'   ? t('tooltipAbsent') :
            status === 'weekend'  ? t('tooltipWeekend') :
                                    t('tooltipFuture')

          return (
            <div key={cell.key} className="relative group">
              <div
                className={`
                  relative min-h-[56px] rounded-lg flex flex-col items-center justify-center
                  text-sm font-medium border-2 transition-all
                  ${classes(status)}
                  ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}
                  group-hover:scale-105 group-hover:shadow-lg cursor-default
                `}
              >
                <span className="tabular-nums">{day}</span>
                {editedCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-warning ring-1 ring-surface" />
                )}
              </div>

              {/* Tooltip */}
              <div className="
                absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-150
                bg-text-primary text-bg text-xs font-medium
                px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap
              ">
                <div className="font-semibold">
                  {t('dateOf', { day, month: date.toLocaleDateString(intlLocale, { month: 'long' }) })}
                </div>
                <div className="text-[11px] opacity-90">{tooltipText}</div>
                {editedCount > 0 && (
                  <div className="text-[11px] text-warning">{t('tooltipEdited', { count: editedCount })}</div>
                )}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-text-primary" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary flex-wrap pt-2 border-t border-divider/50">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-success/80 border border-success" />
          {t('attended')} <span className="tabular-nums text-text-primary font-medium">({attended})</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-error/70 border border-error" />
          {t('absent')} <span className="tabular-nums text-text-primary font-medium">({absent})</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-surface-variant/60 border border-divider" />
          {t('weekend')}
        </span>
        {edited > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            {t('edited')} <span className="tabular-nums text-text-primary font-medium">({edited})</span>
          </span>
        )}
        {isCurrentPeriod && (
          <span className="flex items-center gap-1.5 ml-auto">
            <span className="w-3 h-3 rounded-sm bg-surface-variant/20 border border-divider/40" />
            {t('future')}
          </span>
        )}
      </div>
    </div>
  )
}
