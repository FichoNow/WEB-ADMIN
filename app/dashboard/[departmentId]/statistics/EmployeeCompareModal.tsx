'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, GitCompare, Users, Loader2, Clock, Target, Zap, Coffee } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { UserStatsResponse } from '@/app/types/admin/api/stats-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import { getUserStatsAction } from '@/app/actions/admin/stats'
import { minutesToHours } from './stats-utils'

interface Props {
  open: boolean
  employees: EmployeeListItem[]
  departmentId: number
  month?: number
  year?: number
  onClose: () => void
}

interface Row {
  label: string
  icon: React.ReactNode
  a: string | number
  b: string | number
  winner: 'a' | 'b' | 'tie'
  hint?: string
}

function rowsFromStats(a: UserStatsResponse, b: UserStatsResponse): Row[] {
  const breakAdoption = (s: UserStatsResponse) => s.breaks.total_fichajes > 0
    ? Math.round((s.breaks.fichajes_with_break / s.breaks.total_fichajes) * 100)
    : 0
  const winnerHigher = (x: number, y: number): 'a' | 'b' | 'tie' => x === y ? 'tie' : x > y ? 'a' : 'b'
  const winnerLower  = (x: number, y: number): 'a' | 'b' | 'tie' => x === y ? 'tie' : x < y ? 'a' : 'b'

  return [
    {
      label: 'Horas trabajadas',
      icon:  <Clock className="w-3.5 h-3.5 text-primary" />,
      a:     minutesToHours(a.total_minutes),
      b:     minutesToHours(b.total_minutes),
      winner: winnerHigher(a.total_minutes, b.total_minutes),
    },
    {
      label: 'Puntualidad',
      icon:  <Target className="w-3.5 h-3.5 text-success" />,
      a:     `${a.punctuality_rate}%`,
      b:     `${b.punctuality_rate}%`,
      winner: winnerHigher(a.punctuality_rate, b.punctuality_rate),
    },
    {
      label: 'Horas extra (período)',
      icon:  <Zap className="w-3.5 h-3.5 text-warning" />,
      a:     minutesToHours(a.overtime_minutes),
      b:     minutesToHours(b.overtime_minutes),
      winner: winnerLower(a.overtime_minutes, b.overtime_minutes),
      hint:  'Menos extras = mejor distribución',
    },
    {
      label: 'Extras anuales (% límite 80h)',
      icon:  <Zap className="w-3.5 h-3.5 text-error" />,
      a:     a.overtime_yearly[0] ? `${a.overtime_yearly[0].pct_of_limit}%` : '0%',
      b:     b.overtime_yearly[0] ? `${b.overtime_yearly[0].pct_of_limit}%` : '0%',
      winner: winnerLower(
        a.overtime_yearly[0]?.pct_of_limit ?? 0,
        b.overtime_yearly[0]?.pct_of_limit ?? 0,
      ),
    },
    {
      label: 'Pausas registradas',
      icon:  <Coffee className="w-3.5 h-3.5 text-text-secondary" />,
      a:     `${breakAdoption(a)}%`,
      b:     `${breakAdoption(b)}%`,
      winner: winnerHigher(breakAdoption(a), breakAdoption(b)),
    },
    {
      label: 'Ausencias activas',
      icon:  <Users className="w-3.5 h-3.5 text-text-secondary" />,
      a:     a.active_absences,
      b:     b.active_absences,
      winner: winnerLower(a.active_absences, b.active_absences),
    },
  ]
}

export default function EmployeeCompareModal({ open, employees, departmentId, month, year, onClose }: Props) {
  const [userA, setUserA] = useState<number | null>(null)
  const [userB, setUserB] = useState<number | null>(null)
  const [statsA, setStatsA] = useState<UserStatsResponse | null>(null)
  const [statsB, setStatsB] = useState<UserStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setUserA(null); setUserB(null); setStatsA(null); setStatsB(null); setError(null)
    }
  }, [open])

  useEffect(() => {
    if (!userA || !userB) { setStatsA(null); setStatsB(null); return }
    setLoading(true); setError(null)
    Promise.all([
      getUserStatsAction(departmentId, userA, month, year),
      getUserStatsAction(departmentId, userB, month, year),
    ])
      .then(([a, b]) => { setStatsA(a); setStatsB(b) })
      .catch(() => setError('No se pudieron cargar los datos.'))
      .finally(() => setLoading(false))
  }, [userA, userB, departmentId, month, year])

  const empA = employees.find((e) => e.id === userA)
  const empB = employees.find((e) => e.id === userB)
  const rows = statsA && statsB ? rowsFromStats(statsA, statsB) : []

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent showCloseButton={false} className="bg-surface border-divider/50 rounded-[2.5rem] shadow-2xl max-w-3xl w-full p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-8 py-6 border-b border-divider/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <GitCompare className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">
                  Comparador de Rendimiento
                </DialogTitle>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-hint">Analítica de Empleados</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-surface-variant/50 text-text-hint hover:text-text-primary transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-hint">Empleado A</span>
              <Select value={userA ? String(userA) : ''} onValueChange={(v) => setUserA(Number(v))}>
                <SelectTrigger className="w-full h-11 bg-surface-variant/20 border-divider/50 text-text-primary rounded-xl">
                  <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent className="bg-surface/95 backdrop-blur-xl border-divider">
                  {employees.filter((e) => e.id !== userB).map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-hint">Empleado B</span>
              <Select value={userB ? String(userB) : ''} onValueChange={(v) => setUserB(Number(v))}>
                <SelectTrigger className="w-full h-11 bg-surface-variant/20 border-divider/50 text-text-primary rounded-xl">
                  <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent className="bg-surface/95 backdrop-blur-xl border-divider">
                  {employees.filter((e) => e.id !== userA).map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-text-hint">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
              <p className="text-xs font-black uppercase tracking-widest">Cargando…</p>
            </div>
          )}

          {error && (
            <div className="text-center text-error text-xs font-bold py-4">{error}</div>
          )}

          {!loading && !error && rows.length > 0 && empA && empB && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center px-4 py-3 rounded-2xl bg-surface-variant/20 border border-divider/30">
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary">{empA.name}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-hint">Empleado A</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-hint">vs</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-text-primary">{empB.name}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-hint">Empleado B</p>
                </div>
              </div>

              {rows.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center px-4 py-3 rounded-xl border border-divider/20 hover:border-divider/40 transition-colors">
                  <div className={`text-right text-sm font-bold tabular-nums ${r.winner === 'a' ? 'text-primary' : 'text-text-secondary'}`}>
                    {r.a}
                  </div>
                  <div className="flex flex-col items-center gap-0.5 min-w-[110px]">
                    <div className="flex items-center gap-1.5">
                      {r.icon}
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-hint">{r.label}</span>
                    </div>
                    {r.hint && <span className="text-[8px] text-text-hint italic">{r.hint}</span>}
                  </div>
                  <div className={`text-left text-sm font-bold tabular-nums ${r.winner === 'b' ? 'text-primary' : 'text-text-secondary'}`}>
                    {r.b}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {!loading && !userA || !userB ? (
            <div className="text-center text-text-hint text-[11px] font-black uppercase tracking-widest py-4 opacity-60">
              Selecciona dos empleados para comparar
            </div>
          ) : null}

          <div className="flex justify-end pt-2 border-t border-divider/20">
            <Button
              variant="ghost"
              className="h-10 px-6 rounded-xl text-text-hint hover:bg-surface-variant/30 text-[11px] font-black uppercase tracking-widest"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
