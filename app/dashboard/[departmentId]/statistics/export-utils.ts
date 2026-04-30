import type {
  RankingResponse, UserProjectHoursResponse, ProjectsOverviewResponse,
} from '@/app/types/admin/api/stats-response'

function escapeCsv(v: unknown): string {
  const s = String(v ?? '')
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function rowsToCsv(rows: (string | number)[][]): string {
  return rows.map((r) => r.map(escapeCsv).join(';')).join('\n')
}

function minutesToHm(m: number): string {
  const h = Math.floor(m / 60)
  const r = m % 60
  return `${h}h ${r}m`
}

function downloadCsv(filename: string, content: string) {
  const bom  = '﻿'
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportStatsCsv(
  ranking: RankingResponse,
  userProjects: UserProjectHoursResponse,
  periodLabel: string,
) {
  // Map user_id → { total_minutes, overtime_minutes }
  const userTotals = new Map<number, { total: number; overtime: number; name: string }>()
  ranking.employees.forEach((e) => {
    userTotals.set(e.id, {
      total:    e.total_minutes,
      overtime: e.overtime_minutes,
      name:     e.name,
    })
  })

  // Group projects by user
  const byUser = new Map<number, { name: string; projects: { project: string; minutes: number }[] }>()
  userProjects.rows.forEach((r) => {
    if (!byUser.has(r.user_id)) byUser.set(r.user_id, { name: r.user_name, projects: [] })
    byUser.get(r.user_id)!.projects.push({ project: r.project_name, minutes: r.minutes })
  })

  // Include users from ranking with no project entries
  ranking.employees.forEach((e) => {
    if (!byUser.has(e.id)) byUser.set(e.id, { name: e.name, projects: [] })
  })

  const rows: (string | number)[][] = [
    ['Usuario', 'Horas mes', 'Horas extras', 'Proyecto', 'Horas en proyecto'],
  ]

  Array.from(byUser.entries())
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .forEach(([userId, data]) => {
      const totals = userTotals.get(userId)
      const totalStr    = totals ? minutesToHm(totals.total)    : '0h 0m'
      const overtimeStr = totals ? minutesToHm(totals.overtime) : '0h 0m'

      if (data.projects.length === 0) {
        rows.push([data.name, totalStr, overtimeStr, '—', '0h 0m'])
        return
      }
      data.projects
        .sort((a, b) => b.minutes - a.minutes)
        .forEach((p, i) => {
          rows.push([
            i === 0 ? data.name   : '',
            i === 0 ? totalStr    : '',
            i === 0 ? overtimeStr : '',
            p.project,
            minutesToHm(p.minutes),
          ])
        })
    })

  const filename = `horas-${periodLabel.replace(/\s+/g, '-').toLowerCase()}.csv`
  downloadCsv(filename, rowsToCsv(rows))
}

export function exportProjectsCsv(overview: ProjectsOverviewResponse) {
  const rows: (string | number)[][] = [
    ['Proyecto', 'Horas', 'Participantes'],
  ]
  overview.projects.forEach((p) => {
    rows.push([p.project_name, minutesToHm(p.minutes), p.user_count])
  })
  downloadCsv('proyectos-historico.csv', rowsToCsv(rows))
}
