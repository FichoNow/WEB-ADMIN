'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Folder, Clock, Users, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ProjectStatsResponse } from '@/app/types/admin/api/stats-response'
import { getProjectStatsAction } from '@/app/actions/admin/stats/get-project-stats'
import { minutesToHours, COLORS } from './stats-utils'

interface Props {
  projectName: string | null
  departmentId: number
  month?: number
  year?: number
  allTime?: boolean
  open: boolean
  onClose: () => void
}

export default function ProjectDetailDialog({ projectName, departmentId, month, year, allTime, open, onClose }: Props) {
  const [data, setData]       = useState<ProjectStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!open || !projectName) return
    setData(null)
    setError(null)
    setLoading(true)
    getProjectStatsAction(departmentId, projectName, month, year, allTime)
      .then(setData)
      .catch(() => setError('No se pudieron cargar los detalles del proyecto.'))
      .finally(() => setLoading(false))
  }, [open, projectName, departmentId, month, year, allTime])

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent showCloseButton={false} className="bg-surface border-divider/50 rounded-[2.5rem] shadow-2xl max-w-lg w-full p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b border-divider/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Folder className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">
                  {projectName}
                </DialogTitle>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-hint">Detalles del Proyecto</p>
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

        {/* Body */}
        <div className="p-8 flex flex-col gap-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-text-hint">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-black uppercase tracking-widest">Cargando datos...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-error/60">
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          {data && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-6"
              >
                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-5 rounded-2xl bg-primary/5 border border-primary/15">
                    <div className="flex items-center gap-2 text-text-hint">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Total horas</span>
                    </div>
                    <span className="text-3xl font-light text-text-primary tabular-nums">
                      {minutesToHours(data.total_minutes)}
                    </span>
                    <span className="text-[10px] text-text-hint font-bold">{data.period_label}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-5 rounded-2xl bg-success/5 border border-success/15">
                    <div className="flex items-center gap-2 text-text-hint">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Participantes</span>
                    </div>
                    <span className="text-3xl font-light text-text-primary tabular-nums">
                      {data.users.length}
                    </span>
                    <span className="text-[10px] text-text-hint font-bold">
                      {data.users.length === 1 ? 'empleado' : 'empleados'}
                    </span>
                  </div>
                </div>

                {/* User breakdown */}
                {data.users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-text-hint opacity-40">
                    <Users className="w-6 h-6" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Sin registros este período</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-hint mb-1">
                      Desglose por empleado
                    </p>
                    {data.users.map((user, i) => {
                      const pct = data.total_minutes > 0 ? (user.minutes / data.total_minutes) * 100 : 0
                      return (
                        <motion.div
                          key={user.user_id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex flex-col gap-1.5 p-4 rounded-2xl bg-surface-variant/20 border border-divider/20 hover:border-divider/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 border"
                                style={{
                                  backgroundColor: `${COLORS[i % COLORS.length]}20`,
                                  borderColor: `${COLORS[i % COLORS.length]}40`,
                                  color: COLORS[i % COLORS.length],
                                }}
                              >
                                {user.user_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-bold text-text-primary truncate">{user.user_name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-black text-text-primary">{minutesToHours(user.minutes)}</span>
                              <span className="text-[10px] font-bold text-text-hint bg-surface/60 px-2 py-0.5 rounded-full">
                                {Math.round(pct)}%
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-surface-variant/30 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, delay: 0.1 + i * 0.05 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
