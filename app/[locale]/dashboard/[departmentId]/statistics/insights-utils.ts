import type {
  OverviewResponse, RankingResponse, BreaksResponse,
  OvertimeYearlyResponse, ProjectsPeriodResponse, ActiveNowResponse,
  UserStatsResponse,
} from '@/app/types/admin/api/stats-response'

const LEGAL_OVERTIME_LIMIT_MINUTES = 80 * 60

export interface InsightsInput {
  overview:        OverviewResponse
  ranking:         RankingResponse
  breaks:          BreaksResponse
  overtimeYearly:  OvertimeYearlyResponse
  projectHours:    ProjectsPeriodResponse
  activeNow:       ActiveNowResponse
}

export function generateInsights(input: InsightsInput): string[] {
  const { overview, ranking, breaks, overtimeYearly, projectHours, activeNow } = input
  const out: string[] = []

  if (!overview || !ranking || !breaks || !overtimeYearly || !projectHours || !activeNow) {
    return []
  }

  const entries = overtimeYearly.entries || []
  const overLimit = entries.filter((o) => o.overtime_minutes >= LEGAL_OVERTIME_LIMIT_MINUTES)
  const nearLimit = entries.filter((o) => o.pct_of_limit >= 75 && o.pct_of_limit < 100)
  if (overLimit.length > 0) {
    out.push(`⚠ ${overLimit.length} empleado${overLimit.length > 1 ? 's' : ''} ha${overLimit.length > 1 ? 'n' : ''} superado el límite legal de 80h extras/año (RD 8/2019).`)
  } else if (nearLimit.length > 0) {
    out.push(`${nearLimit.length} empleado${nearLimit.length > 1 ? 's' : ''} cerca del límite legal anual (≥75% de 80h).`)
  }

  const burnoutSuspects = ranking.employees.filter((r) => {
    const total = r.total_minutes
    const ot    = r.overtime_minutes
    return total > 0 && ot / total > 0.2
  })
  if (burnoutSuspects.length > 0) {
    out.push(`Riesgo sobrecarga: ${burnoutSuspects.slice(0, 3).map((b) => b.name).join(', ')}${burnoutSuspects.length > 3 ? ` y ${burnoutSuspects.length - 3} más` : ''} con >20% de su jornada en extras.`)
  }

  if (overview.punctuality_rate < 85) {
    out.push(`Puntualidad (${overview.punctuality_rate}%) por debajo del objetivo. Revisar horarios de entrada.`)
  } else if (overview.punctuality_rate >= 95) {
    out.push(`Excelente puntualidad media: ${overview.punctuality_rate}%.`)
  }

  const breakAdoption = breaks.total_fichajes > 0
    ? (breaks.fichajes_with_break / breaks.total_fichajes) * 100
    : 0
  if (breaks.total_fichajes > 5 && breakAdoption < 50) {
    out.push(`Solo el ${Math.round(breakAdoption)}% de jornadas registran pausas. Posible incumplimiento del derecho a descanso.`)
  }

  if (overview.total_minutes_prev > 0) {
    const change = ((overview.total_minutes - overview.total_minutes_prev) / overview.total_minutes_prev) * 100
    if (Math.abs(change) >= 15) {
      out.push(`Volumen de horas ${change > 0 ? 'subió' : 'bajó'} ${Math.abs(Math.round(change))}% respecto al período anterior.`)
    }
  }

  if (ranking.employees.length > 0 && ranking.employees[0].total_minutes > 0) {
    out.push(`Mayor dedicación: ${ranking.employees[0].name} con ${Math.floor(ranking.employees[0].total_minutes / 60)}h en el período.`)
  }

  if (activeNow.active.length > 0) {
    out.push(`${activeNow.active.length} empleado${activeNow.active.length > 1 ? 's' : ''} fichado${activeNow.active.length > 1 ? 's' : ''} en este momento.`)
  }

  if (projectHours.projects.length > 0) {
    out.push(`Proyecto con más horas: "${projectHours.projects[0].project_name}" (${Math.floor(projectHours.projects[0].minutes / 60)}h).`)
  }

  return out
}

export function generateUserInsights(stats: UserStatsResponse): string[] {
  const out: string[] = []

  if (stats.total_minutes === 0) {
    out.push('Sin fichajes registrados en este período.')
  }

  if (stats.overtime_yearly.length > 0) {
    const yearOT = stats.overtime_yearly[0]
    if (yearOT.pct_of_limit >= 100) {
      out.push(`⚠ Superado el límite legal de 80h extras/año (${Math.floor(yearOT.overtime_minutes / 60)}h acumuladas).`)
    } else if (yearOT.pct_of_limit >= 75) {
      out.push(`Acumula ${Math.floor(yearOT.overtime_minutes / 60)}h extras este año (${yearOT.pct_of_limit}% del límite legal).`)
    }
  }

  if (stats.punctuality_rate < 85) out.push(`Puntualidad (${stats.punctuality_rate}%) por debajo del objetivo.`)
  if (stats.overtime_minutes > 120) out.push(`${Math.floor(stats.overtime_minutes / 60)}h de horas extra en el período.`)

  const breakAdoption = stats.breaks.total_fichajes > 0
    ? (stats.breaks.fichajes_with_break / stats.breaks.total_fichajes) * 100
    : 0
  if (stats.breaks.total_fichajes > 3 && breakAdoption < 50) {
    out.push(`Solo el ${Math.round(breakAdoption)}% de jornadas con pausa registrada.`)
  }

  if (stats.project_hours.length > 0) out.push(`Más horas dedicadas a "${stats.project_hours[0].project_name}".`)

  return out
}
