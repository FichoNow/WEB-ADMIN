'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Plus, Filter, MoreVertical, Mail, Hash, Clock, Shield, Upload, type LucideIcon } from 'lucide-react'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import type { ScheduleAssignmentsResponse } from '@/app/types/admin/api/schedule-response'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import PageHeader from '@/components/PageHeader'
import CreateEmployeeForm from './CreateEmployeeForm'
import EditEmployeeForm from './EditEmployeeForm'
import GroupsManager from './GroupsManager'
import ImportEmployeesForm from './ImportEmployeesForm'
import { computeEffectiveSchedule, todayIso } from './schedule-utils'

interface Props {
  employees: EmployeeListItem[]
  groups: GroupResponse[]
  assignments: ScheduleAssignmentsResponse
  departmentId: number
}

interface MetaChipProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
  tooltip?: string
  tone?: 'default' | 'primary' | 'muted'
}

function MetaChip({ icon: Icon, label, value, hint, tooltip, tone = 'default' }: MetaChipProps) {
  const valueColor =
    tone === 'primary'
      ? 'text-primary'
      : tone === 'muted'
      ? 'text-text-hint'
      : 'text-text-primary'
  const iconColor = tone === 'primary' ? 'text-primary' : 'text-text-hint'

  return (
    <div className="flex items-center gap-2 min-w-0" title={tooltip}>
      <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-surface-variant/50 ${iconColor}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-[9px] uppercase tracking-wider font-bold text-text-hint">{label}</span>
        <span className={`text-xs font-semibold truncate ${valueColor}`}>
          {value}
          {hint && <span className="ml-1 opacity-60 font-medium normal-case">{hint}</span>}
        </span>
      </div>
    </div>
  )
}

const FILTER_ALL = '__all__'
const FILTER_NONE = '__none__'

export default function EmployeesClient({ employees, groups, assignments, departmentId }: Props) {
  const t = useTranslations('employees.client')
  const GROUP_LABELS: Record<string, string> = {
    [FILTER_ALL]: t('allGroups'),
    [FILTER_NONE]: t('noGroup'),
  }
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showGroups, setShowGroups] = useState(false)
  const [editEmployee, setEditEmployee] = useState<EmployeeListItem | null>(null)
  const [groupFilter, setGroupFilter] = useState<string>(FILTER_ALL)
  const [search, setSearch] = useState('')
  const today = useMemo(() => todayIso(), [])

  const groupNameById = useMemo(() => {
    const m = new Map<number, string>()
    groups.forEach((g) => m.set(g.id, g.name))
    return m
  }, [groups])

  const filtered = useMemo(() => {
    let result = employees

    // Group filter
    if (groupFilter !== FILTER_ALL) {
      if (groupFilter === FILTER_NONE) {
        result = result.filter((e) => e.group_id == null)
      } else {
        const id = Number(groupFilter)
        result = result.filter((e) => e.group_id === id)
      }
    }

    // Search filter
    if (search.trim()) {
      const s = search.toLowerCase()
      result = result.filter((e) =>
        e.name.toLowerCase().includes(s) ||
        e.email.toLowerCase().includes(s)
      )
    }

    return result
  }, [employees, groupFilter, search])

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <>
            <Button variant="outline" onClick={() => setShowGroups(true)} className="gap-2 rounded-2xl h-10 border-divider/50 hover:bg-surface-variant text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{t('manageGroups')} </span>{t('groupsShort')}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowImport(true)}
              className="gap-2 rounded-2xl h-10 border-divider/50 hover:bg-surface-variant text-xs sm:text-sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{t('import')} </span>{t('importShort')}
            </Button>
            <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-2xl h-10 text-xs sm:text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('newEmployee')} </span>{t('newEmployeeShort')}
            </Button>
          </>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-hint" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium placeholder:text-text-hint"
          />
        </div>

        <Select value={groupFilter} onValueChange={(v) => setGroupFilter(v ?? FILTER_ALL)}>
          <SelectTrigger className="w-full sm:w-52 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium">
            <Filter className="w-3.5 h-3.5 mr-2 text-primary" />
            <span className="truncate">
              {GROUP_LABELS[groupFilter] ?? groupNameById.get(Number(groupFilter)) ?? groupFilter}
            </span>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-divider">
            <SelectItem value={FILTER_ALL} className="text-xs">{t('allGroups')}</SelectItem>
            <SelectItem value={FILTER_NONE} className="text-xs">{t('noGroup')}</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g.id} value={String(g.id)} className="text-xs">{g.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-primary">{filtered.length}</span>
          <span className="text-xs text-text-hint">{t('found')}</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 bg-surface/30 border border-dashed border-divider rounded-[2.5rem]"
        >
          <div className="w-20 h-20 rounded-3xl bg-surface border border-divider flex items-center justify-center text-text-hint mb-6 shadow-sm">
            <Users className="w-8 h-8 opacity-20" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {employees.length === 0 ? t('emptyTitle') : t('noResultsTitle')}
          </h3>
          <p className="text-sm text-text-hint text-center max-w-xs mb-8 leading-relaxed">
            {employees.length === 0 ? t('emptyDesc') : t('noResultsDesc')}
          </p>
          {employees.length === 0 && (
            <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-2xl h-11">
              <Plus className="w-4 h-4" />
              {t('addFirst')}
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((emp) => {
              const groupName = emp.group_id != null ? groupNameById.get(emp.group_id) : null
              const schedule = computeEffectiveSchedule(
                emp,
                assignments.user_assignments,
                assignments.group_assignments,
                today,
              )
              const isAdmin = emp.role === 'ADMINISTRATOR'
              const scheduleTooltip =
                schedule.source === 'user'
                  ? `${t('tipUserSchedule')}${schedule.endDate ? ` · ${schedule.startDate} → ${schedule.endDate}` : ` · ${t('tipFromDate')} ${schedule.startDate}`}`
                  : schedule.source === 'group'
                  ? `${t('tipFromGroup')} ${schedule.groupName}${schedule.endDate ? ` · ${schedule.startDate} → ${schedule.endDate}` : ` · ${t('tipFromDate')} ${schedule.startDate}`}`
                  : t('tipNoSchedule')
              return (
                <motion.div
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex flex-col gap-4 px-6 py-5 rounded-[2rem] bg-surface border border-divider/50 hover:border-primary/30 hover:bg-surface-variant/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-5 min-w-0">
                      {/* Avatar with gradient */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg border border-primary/10 shadow-inner group-hover:scale-105 transition-transform">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        {!emp.is_active && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-error border-4 border-surface" />
                        )}
                        {emp.is_active && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-4 border-surface shadow-sm" />
                        )}
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-none">
                            {emp.name}
                          </h4>
                          {!emp.is_active && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-error/10 text-error border border-error/20">{t('inactive')}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-hint">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditEmployee(emp)}
                      className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Meta row: rol / grupo / horario, claramente etiquetados */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-divider/40">
                    <MetaChip
                      icon={Shield}
                      label={t('metaRole')}
                      value={isAdmin ? t('roleAdmin') : t('roleUser')}
                      tone={isAdmin ? 'primary' : 'default'}
                    />
                    <MetaChip
                      icon={Hash}
                      label={t('metaGroup')}
                      value={groupName ?? t('noGroup')}
                      tone={groupName ? 'default' : 'muted'}
                    />
                    <MetaChip
                      icon={Clock}
                      label={t('metaSchedule')}
                      value={schedule.source === 'none' ? t('noSchedule') : schedule.templateName}
                      hint={schedule.source === 'group' ? t('groupSuffix') : undefined}
                      tooltip={scheduleTooltip}
                      tone={
                        schedule.source === 'none'
                          ? 'muted'
                          : schedule.source === 'user'
                          ? 'primary'
                          : 'default'
                      }
                    />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Dialogs remain similar but with consistent styling */}
      <Dialog open={showImport} onOpenChange={(open) => !open && setShowImport(false)}>
        <DialogContent className="sm:max-w-[900px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-8 py-6 border-b border-divider/50">
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">
                  {t('importDialogTitle')}
                </DialogTitle>
                <DialogDescription className="text-xs text-text-secondary">
                  {t('importDialogDesc')}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
            <ImportEmployeesForm
              departmentId={departmentId}
              groups={groups}
              existingEmails={employees.map((e) => e.email.toLowerCase())}
              onClose={() => setShowImport(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreate} onOpenChange={(open) => !open && setShowCreate(false)}>
        <DialogContent className="sm:max-w-[700px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-8 py-6 border-b border-divider/50">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">{t('createDialogTitle')}</DialogTitle>
                <DialogDescription className="text-xs text-text-secondary">{t('createDialogDesc')}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
            <CreateEmployeeForm departmentId={departmentId} groups={groups} onClose={() => setShowCreate(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editEmployee} onOpenChange={(open) => !open && setEditEmployee(null)}>
        <DialogContent className="sm:max-w-[600px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-8 py-6 border-b border-divider/50">
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">{t('editDialogTitle')}</DialogTitle>
                <DialogDescription className="text-xs text-text-secondary">{t('editDialogDesc')}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
            {editEmployee && (
              <EditEmployeeForm
                employee={editEmployee}
                departmentId={departmentId}
                groups={groups}
                onClose={() => setEditEmployee(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showGroups} onOpenChange={(open) => !open && setShowGroups(false)}>
        <DialogContent className="sm:max-w-[500px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-8 py-6 border-b border-divider/50">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">{t('groupsDialogTitle')}</DialogTitle>
                <DialogDescription className="text-xs text-text-secondary">{t('groupsDialogDesc')}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
            <GroupsManager departmentId={departmentId} groups={groups} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
