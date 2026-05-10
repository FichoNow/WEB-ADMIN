import type {
  OverviewResponse, RankingResponse, BreaksResponse,
  OvertimeYearlyResponse, ProjectsPeriodResponse, ActiveNowResponse,
  UserStatsResponse,
} from '@/app/types/admin/api/stats-response'

const LEGAL_OVERTIME_LIMIT_MINUTES = 80 * 60

// next-intl's t() devuelve un string aceptando un objeto de variables.
// Solo necesitamos esa firma básica.
type TranslateFn = (key: string, values?: Record<string, string | number>) => string

export interface InsightsInput {
  overview:        OverviewResponse
  ranking:         RankingResponse
  breaks:          BreaksResponse
  overtimeYearly:  OvertimeYearlyResponse
  projectHours:    ProjectsPeriodResponse
  activeNow:       ActiveNowResponse
}

export function generateInsights(input: InsightsInput, t: TranslateFn): string[] {
  const { overview, ranking, breaks, overtimeYearly, projectHours, activeNow } = input
  const out: string[] = []

  if (!overview || !ranking || !breaks || !overtimeYearly || !projectHours || !activeNow) {
    return []
  }

  const entries = overtimeYearly.entries || []
  const overLimit = entries.filter((o) => o.overtime_minutes >= LEGAL_OVERTIME_LIMIT_MINUTES)
  const nearLimit = entries.filter((o) => o.pct_of_limit >= 75 && o.pct_of_limit < 100)
  if (overLimit.length > 0) {
    const n = overLimit.length
    out.push(t('overLimit', {
      n,
      empWord:  n > 1 ? t('empPlural') : t('empSingular'),
      haveWord: n > 1 ? t('havePlural') : t('haveSingular'),
    }))
  } else if (nearLimit.length > 0) {
    const n = nearLimit.length
    out.push(t('nearLimit', {
      n,
      empWord: n > 1 ? t('empPlural') : t('empSingular'),
    }))
  }

  const burnoutSuspects = ranking.employees.filter((r) => {
    const total = r.total_minutes
    const ot    = r.overtime_minutes
    return total > 0 && ot / total > 0.2
  })
  if (burnoutSuspects.length > 0) {
    const names   = burnoutSuspects.slice(0, 3).map((b) => b.name).join(', ')
    const andMore = burnoutSuspects.length > 3 ? t('andMore', { n: burnoutSuspects.length - 3 }) : ''
    out.push(t('burnoutRisk', { names, andMore }))
  }

  if (overview.punctuality_rate < 85) {
    out.push(t('lowPunctuality', { pct: overview.punctuality_rate }))
  } else if (overview.punctuality_rate >= 95) {
    out.push(t('highPunctuality', { pct: overview.punctuality_rate }))
  }

  const breakAdoption = breaks.total_fichajes > 0
    ? (breaks.fichajes_with_break / breaks.total_fichajes) * 100
    : 0
  if (breaks.total_fichajes > 5 && breakAdoption < 50) {
    out.push(t('lowBreakAdoption', { pct: Math.round(breakAdoption) }))
  }

  if (overview.total_minutes_prev > 0) {
    const change = ((overview.total_minutes - overview.total_minutes_prev) / overview.total_minutes_prev) * 100
    if (Math.abs(change) >= 15) {
      out.push(t('volumeChange', {
        direction: change > 0 ? t('volumeUp') : t('volumeDown'),
        pct: Math.abs(Math.round(change)),
      }))
    }
  }

  if (ranking.employees.length > 0 && ranking.employees[0].total_minutes > 0) {
    out.push(t('topDedication', {
      name: ranking.employees[0].name,
      hours: Math.floor(ranking.employees[0].total_minutes / 60),
    }))
  }

  if (activeNow.active.length > 0) {
    const n = activeNow.active.length
    out.push(t('activeNow', {
      n,
      empWord:     n > 1 ? t('empPlural') : t('empSingular'),
      clockedWord: n > 1 ? t('clockedPlural') : t('clockedSingular'),
    }))
  }

  if (projectHours.projects.length > 0) {
    out.push(t('topProject', {
      name: projectHours.projects[0].project_name,
      hours: Math.floor(projectHours.projects[0].minutes / 60),
    }))
  }

  return out
}

export function generateUserInsights(stats: UserStatsResponse, t: TranslateFn): string[] {
  const out: string[] = []

  if (stats.total_minutes === 0) {
    out.push(t('userNoFichajes'))
  }

  if (stats.overtime_yearly.length > 0) {
    const yearOT = stats.overtime_yearly[0]
    if (yearOT.pct_of_limit >= 100) {
      out.push(t('userYearLimitExceeded', { hours: Math.floor(yearOT.overtime_minutes / 60) }))
    } else if (yearOT.pct_of_limit >= 75) {
      out.push(t('userYearNearLimit', {
        hours: Math.floor(yearOT.overtime_minutes / 60),
        pct: yearOT.pct_of_limit,
      }))
    }
  }

  if (stats.punctuality_rate < 85) {
    out.push(t('userLowPunctuality', { pct: stats.punctuality_rate }))
  }
  if (stats.overtime_minutes > 120) {
    out.push(t('userOvertimePeriod', { hours: Math.floor(stats.overtime_minutes / 60) }))
  }

  const breakAdoption = stats.breaks.total_fichajes > 0
    ? (stats.breaks.fichajes_with_break / stats.breaks.total_fichajes) * 100
    : 0
  if (stats.breaks.total_fichajes > 3 && breakAdoption < 50) {
    out.push(t('userLowBreakAdoption', { pct: Math.round(breakAdoption) }))
  }

  if (stats.project_hours.length > 0) {
    out.push(t('userTopProject', { name: stats.project_hours[0].project_name }))
  }

  return out
}
