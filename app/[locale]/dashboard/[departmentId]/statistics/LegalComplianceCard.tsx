'use client'

import { useTranslations } from 'next-intl'
import { Coffee, ShieldAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { BreaksStats, OvertimeYearlyEntry } from '@/app/types/admin/api/stats-response'
import { minutesToHours } from './stats-utils'

interface Props {
  breaks: BreaksStats
  overtimeYearly: OvertimeYearlyEntry[]
}

function gaugeColor(pct: number): { bar: string; text: string } {
  if (pct >= 100) return { bar: 'bg-error',   text: 'text-error' }
  if (pct >= 75)  return { bar: 'bg-warning', text: 'text-warning' }
  if (pct >= 50)  return { bar: 'bg-primary', text: 'text-primary' }
  return { bar: 'bg-success', text: 'text-success' }
}

export default function LegalComplianceCard({ breaks, overtimeYearly }: Props) {
  const t = useTranslations('statistics.client.legal')
  const breakAdoption = breaks.total_fichajes > 0
    ? Math.round((breaks.fichajes_with_break / breaks.total_fichajes) * 100)
    : 0

  const top = overtimeYearly.slice(0, 5)

  return (
    <Card className="bg-surface border border-divider rounded-2xl ring-0">
      <CardContent className="p-6 flex flex-col gap-5">
        {/* Pausas */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Coffee className="w-4 h-4 text-text-hint" />
            <h3 className="text-sm font-medium text-text-primary">{t('breaks')}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-surface-variant/30 border border-divider">
              <span className="text-xs text-text-hint">{t('totalBreaks')}</span>
              <span className="text-xl font-light text-text-primary tabular-nums">{minutesToHours(breaks.total_break_minutes)}</span>
            </div>
            <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-surface-variant/30 border border-divider">
              <span className="text-xs text-text-hint">{t('avgPerShift')}</span>
              <span className="text-xl font-light text-text-primary tabular-nums">{breaks.avg_break_minutes}m</span>
            </div>
            <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-surface-variant/30 border border-divider">
              <span className="text-xs text-text-hint">{t('adoption')}</span>
              <span className={`text-xl font-light tabular-nums ${
                breakAdoption < 50 ? 'text-error' : breakAdoption < 75 ? 'text-warning' : 'text-success'
              }`}>
                {breakAdoption}%
              </span>
              <span className="text-xs text-text-hint">{t('adoptionSub', { a: breaks.fichajes_with_break, b: breaks.total_fichajes })}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-divider" />

        {/* Horas extras anuales */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-text-hint" />
            <h3 className="text-sm font-medium text-text-primary">{t('yearlyOvertime')}</h3>
            <span className="text-xs text-text-hint">{t('yearlyLimit')}</span>
          </div>
          {top.length === 0 ? (
            <p className="text-sm text-text-hint text-center py-4">{t('noOvertimeThisYear')}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {top.map((o) => {
                const c = gaugeColor(o.pct_of_limit)
                const w = Math.min(o.pct_of_limit, 110)
                return (
                  <div key={o.user_id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-text-primary truncate">{o.user_name}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-text-hint tabular-nums">{minutesToHours(o.overtime_minutes)}</span>
                        <span className={`text-xs tabular-nums font-medium ${c.text}`}>{o.pct_of_limit}%</span>
                      </div>
                    </div>
                    <div className="relative h-1.5 bg-surface-variant/30 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${c.bar} transition-all`}
                        style={{ width: `${w}%` }}
                      />
                      <div className="absolute inset-y-0 left-[100%] w-px bg-error/40 -translate-x-px" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
