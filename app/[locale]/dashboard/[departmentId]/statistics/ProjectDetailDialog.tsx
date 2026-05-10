'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { X, Folder, Clock, Users, Loader2, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
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

type Filter = 'all' | 'week' | string  // 'all' = histórico, 'week' = esta semana, o "MM-YYYY"

export default function ProjectDetailDialog({ projectName, departmentId, month, year, allTime, open, onClose }: Props) {
  const t       = useTranslations('statistics.client.projectDetail')
  const tClient = useTranslations('statistics.client')
  const months  = (tClient.raw('months') as string[]) ?? []

  const [data, setData]       = useState<ProjectStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [filter, setFilter]   = useState<Filter>(() => {
    if (allTime) return 'all'
    if (month && year) return `${month}-${year}`
    return 'all'
  })

  // Reset al abrir, respetando los props iniciales
  useEffect(() => {
    if (!open) return
    if (allTime) setFilter('all')
    else if (month && year) setFilter(`${month}-${year}`)
    else setFilter('all')
  }, [open, allTime, month, year])

  useEffect(() => {
    if (!open || !projectName) return
    setData(null)
    setError(null)
    setLoading(true)

    let m: number | undefined
    let y: number | undefined
    let isAll = false
    if (filter === 'all') {
      isAll = true
    } else if (filter !== 'week') {
      [m, y] = filter.split('-').map(Number)
    }

    getProjectStatsAction(departmentId, projectName, m, y, isAll)
      .then(setData)
      .catch(() => setError(t('loadError')))
      .finally(() => setLoading(false))
  }, [open, projectName, departmentId, filter, t])

  // Construye opciones: histórico + año actual hasta el mes presente
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const monthOptions = months.slice(0, currentMonth).map((label, i) => ({
    value: `${i + 1}-${currentYear}`,
    label: `${label} ${currentYear}`,
  }))

  const filterLabel =
    filter === 'all'  ? t('all') :
    filter === 'week' ? t('thisWeek') :
    monthOptions.find((o) => o.value === filter)?.label ?? t('all')

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent showCloseButton={false} className="bg-surface border-divider/50 rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[85vh] p-0 overflow-hidden flex flex-col">
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
                <p className="text-[10px] font-black uppercase tracking-widest text-text-hint">{t('title')}</p>
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

        {/* Filtro de período */}
        <div className="px-8 py-4 border-b border-divider/30 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-text-hint shrink-0" />
          <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <SelectTrigger className="h-9 bg-surface-variant/20 border-divider/50 rounded-xl text-xs font-medium">
              <span className="truncate text-left">{filterLabel}</span>
            </SelectTrigger>
            <SelectContent className="bg-surface/95 backdrop-blur-xl border-divider">
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="week">{t('thisWeek')}</SelectItem>
              {monthOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-text-hint">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-black uppercase tracking-widest">{t('loading')}</p>
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
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('kpiTotalHours')}</span>
                    </div>
                    <span className="text-3xl font-light text-text-primary tabular-nums">
                      {minutesToHours(data.total_minutes)}
                    </span>
                    <span className="text-[10px] text-text-hint font-bold">{filterLabel}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-5 rounded-2xl bg-success/5 border border-success/15">
                    <div className="flex items-center gap-2 text-text-hint">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('kpiParticipants')}</span>
                    </div>
                    <span className="text-3xl font-light text-text-primary tabular-nums">
                      {data.users.length}
                    </span>
                    <span className="text-[10px] text-text-hint font-bold">
                      {data.users.length === 1 ? t('employee') : t('employees')}
                    </span>
                  </div>
                </div>

                {/* User breakdown */}
                {data.users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-text-hint opacity-40">
                    <Users className="w-6 h-6" />
                    <p className="text-[10px] font-black uppercase tracking-widest">{t('noRecords')}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-hint mb-1">
                      {t('breakdown')}
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
