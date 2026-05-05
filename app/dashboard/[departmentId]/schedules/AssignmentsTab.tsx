'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarRange, Filter, Search, User, Users, X } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'
import type {
    GroupScheduleAssignmentItem,
    ScheduleAssignmentsResponse,
    ScheduleTemplateItem,
    UserScheduleAssignmentItem,
} from '@/app/types/admin/api/schedule-response'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { deleteUserScheduleAssignmentAction } from '@/app/actions/admin/schedules/delete-user-schedule-assignment'
import { deleteGroupScheduleAssignmentAction } from '@/app/actions/admin/schedules/delete-group-schedule-assignment'

type AssignmentStatus = 'futura' | 'activa' | 'expirada'
type ScopeFilter = 'all' | 'user' | 'group'
type StatusFilter = 'all' | AssignmentStatus

const FILTER_ALL_TEMPLATES = '__all__'
const FILTER_ALL_SCOPES = 'all'
const FILTER_ALL_STATUS = 'all'

interface UnifiedAssignment {
    key: string
    id: number
    scope: 'user' | 'group'
    targetName: string
    targetSecondary?: string | null
    templateId: number
    templateName: string
    startDate: string
    endDate: string | null
    status: AssignmentStatus
}

function getStatus(start: string, end: string | null, today: string): AssignmentStatus {
    if (start > today) return 'futura'
    if (end && end < today) return 'expirada'
    return 'activa'
}

function formatRange(start: string, end: string | null) {
    if (!end) return `Desde ${start}`
    if (start === end) return start
    return `${start} → ${end}`
}

function StatusBadge({ status }: { status: AssignmentStatus }) {
    const styles: Record<AssignmentStatus, string> = {
        activa: 'bg-success/10 text-success border-success/20',
        futura: 'bg-primary/10 text-primary border-primary/20',
        expirada: 'bg-text-hint/10 text-text-hint border-divider',
    }
    const labels: Record<AssignmentStatus, string> = {
        activa: 'Activa',
        futura: 'Futura',
        expirada: 'Expirada',
    }
    return (
        <Badge
            variant="outline"
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${styles[status]}`}
        >
            {labels[status]}
        </Badge>
    )
}

function buildUnified(
    user: UserScheduleAssignmentItem[],
    group: GroupScheduleAssignmentItem[],
    today: string,
): UnifiedAssignment[] {
    const fromUsers: UnifiedAssignment[] = user.map((a) => ({
        key: `u-${a.id}`,
        id: a.id,
        scope: 'user',
        targetName: a.user_name,
        targetSecondary: a.user_email,
        templateId: a.template_id,
        templateName: a.template_name,
        startDate: a.start_date,
        endDate: a.end_date,
        status: getStatus(a.start_date, a.end_date, today),
    }))

    const fromGroups: UnifiedAssignment[] = group.map((a) => ({
        key: `g-${a.id}`,
        id: a.id,
        scope: 'group',
        targetName: a.group_name,
        targetSecondary: null,
        templateId: a.template_id,
        templateName: a.template_name,
        startDate: a.start_date,
        endDate: a.end_date,
        status: getStatus(a.start_date, a.end_date, today),
    }))

    return [...fromGroups, ...fromUsers].sort((a, b) => {
        const order: Record<AssignmentStatus, number> = { activa: 0, futura: 1, expirada: 2 }
        if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
        return b.startDate.localeCompare(a.startDate)
    })
}

export default function AssignmentsTab({
    schedules,
    assignments,
    departmentId,
    today,
    initialTemplateId,
}: {
    schedules: ScheduleTemplateItem[]
    assignments: ScheduleAssignmentsResponse
    departmentId: number
    today: string
    initialTemplateId?: string
}) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [pendingDelete, setPendingDelete] = useState<UnifiedAssignment | null>(null)

    const [templateFilter, setTemplateFilter] = useState<string>(initialTemplateId ?? FILTER_ALL_TEMPLATES)
    const [scopeFilter, setScopeFilter] = useState<ScopeFilter>(FILTER_ALL_SCOPES)
    const [statusFilter, setStatusFilter] = useState<StatusFilter>(FILTER_ALL_STATUS)
    const [search, setSearch] = useState('')

    const allUnified = useMemo(
        () => buildUnified(assignments.user_assignments, assignments.group_assignments, today),
        [assignments, today],
    )

    const filtered = useMemo(() => {
        let result = allUnified

        if (templateFilter !== FILTER_ALL_TEMPLATES) {
            const id = Number(templateFilter)
            result = result.filter((a) => a.templateId === id)
        }
        if (scopeFilter !== 'all') {
            result = result.filter((a) => a.scope === scopeFilter)
        }
        if (statusFilter !== 'all') {
            result = result.filter((a) => a.status === statusFilter)
        }
        if (search.trim()) {
            const s = search.toLowerCase()
            result = result.filter(
                (a) =>
                    a.targetName.toLowerCase().includes(s) ||
                    a.templateName.toLowerCase().includes(s) ||
                    (a.targetSecondary?.toLowerCase().includes(s) ?? false),
            )
        }

        return result
    }, [allUnified, templateFilter, scopeFilter, statusFilter, search])

    const confirmDelete = () => {
        if (!pendingDelete) return
        const target = pendingDelete
        startTransition(async () => {
            const res = target.scope === 'user'
                ? await deleteUserScheduleAssignmentAction(departmentId, target.id)
                : await deleteGroupScheduleAssignmentAction(departmentId, target.id)
            if (res && 'error' in res) {
                toast.error(res.error)
            } else if (res && 'success' in res) {
                toast.success(res.success)
            }
            setPendingDelete(null)
            router.refresh()
        })
    }

    const templateLabel =
        templateFilter === FILTER_ALL_TEMPLATES
            ? 'Todas las plantillas'
            : schedules.find((s) => String(s.id) === templateFilter)?.name ?? 'Plantilla desconocida'

    const scopeLabel =
        scopeFilter === 'all' ? 'Todos los tipos' : scopeFilter === 'user' ? 'Solo usuarios' : 'Solo grupos'

    const statusLabel: Record<StatusFilter, string> = {
        all: 'Todos los estados',
        activa: 'Activas',
        futura: 'Futuras',
        expirada: 'Expiradas',
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Filters bar */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-hint" />
                        <Input
                            placeholder="Buscar por usuario, grupo o plantilla..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-11 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium placeholder:text-text-hint"
                        />
                    </div>

                    <Select
                        value={templateFilter}
                        onValueChange={(v) => setTemplateFilter(v ?? FILTER_ALL_TEMPLATES)}
                    >
                        <SelectTrigger className="w-full sm:w-56 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium">
                            <Filter className="w-3.5 h-3.5 mr-2 text-primary" />
                            <span className="truncate">{templateLabel}</span>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-divider">
                            <SelectItem value={FILTER_ALL_TEMPLATES} className="text-xs">
                                Todas las plantillas
                            </SelectItem>
                            {schedules.map((s) => (
                                <SelectItem key={s.id} value={String(s.id)} className="text-xs">
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={scopeFilter} onValueChange={(v) => setScopeFilter((v as ScopeFilter) ?? 'all')}>
                        <SelectTrigger className="w-full sm:w-48 h-10 bg-surface border-divider/50 rounded-xl text-xs font-medium">
                            <span className="truncate">{scopeLabel}</span>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-divider">
                            <SelectItem value="all" className="text-xs">Todos los tipos</SelectItem>
                            <SelectItem value="user" className="text-xs">Solo usuarios</SelectItem>
                            <SelectItem value="group" className="text-xs">Solo grupos</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={statusFilter}
                        onValueChange={(v) => setStatusFilter((v as StatusFilter) ?? 'all')}
                    >
                        <SelectTrigger className="w-full sm:w-48 h-10 bg-surface border-divider/50 rounded-xl text-xs font-medium">
                            <span className="truncate">{statusLabel[statusFilter]}</span>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-divider">
                            <SelectItem value="all" className="text-xs">Todos los estados</SelectItem>
                            <SelectItem value="activa" className="text-xs">Activas</SelectItem>
                            <SelectItem value="futura" className="text-xs">Futuras</SelectItem>
                            <SelectItem value="expirada" className="text-xs">Expiradas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">{filtered.length}</span>
                    <span className="text-xs text-text-hint">asignaciones encontradas</span>
                </div>
            </div>

            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 px-4 bg-surface/30 border border-dashed border-divider rounded-[2.5rem]"
                >
                    <div className="w-16 h-16 rounded-2xl bg-surface border border-divider flex items-center justify-center text-text-hint mb-4 shadow-sm">
                        <CalendarRange className="w-7 h-7 opacity-30" />
                    </div>
                    <h3 className="text-base font-bold text-text-primary mb-1">
                        {allUnified.length === 0 ? 'Sin asignaciones todavía' : 'Sin resultados'}
                    </h3>
                    <p className="text-xs text-text-hint text-center max-w-xs leading-relaxed">
                        {allUnified.length === 0
                            ? 'Asigna una plantilla a un usuario o a un grupo desde la pestaña Plantillas.'
                            : 'Ajusta los filtros para encontrar la asignación que buscas.'}
                    </p>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-2">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((a) => {
                            const Icon = a.scope === 'user' ? User : Users
                            return (
                                <motion.div
                                    key={a.key}
                                    layout
                                    initial={{ opacity: 0, scale: 0.99 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.99 }}
                                    transition={{ duration: 0.15 }}
                                    className="group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-surface border border-divider/50 hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-text-primary truncate">
                                                    {a.targetName}
                                                </span>
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-text-hint">
                                                    {a.scope === 'user' ? 'Usuario' : 'Grupo'}
                                                </span>
                                                <StatusBadge status={a.status} />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-text-secondary flex-wrap">
                                                <span className="font-medium">{a.templateName}</span>
                                                <span className="text-text-hint">·</span>
                                                <span className="text-text-hint">
                                                    {formatRange(a.startDate, a.endDate)}
                                                </span>
                                                {a.targetSecondary && (
                                                    <>
                                                        <span className="text-text-hint">·</span>
                                                        <span className="text-text-hint truncate">{a.targetSecondary}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={pending}
                                        onClick={() => setPendingDelete(a)}
                                        className="rounded-xl hover:bg-error/10 hover:text-error shrink-0"
                                        aria-label="Eliminar asignación"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                title="Eliminar asignación"
                description={
                    pendingDelete
                        ? `Vas a quitar "${pendingDelete.templateName}" de ${
                              pendingDelete.scope === 'user' ? 'el usuario' : 'el grupo'
                          } "${pendingDelete.targetName}". Esta acción no se puede deshacer.`
                        : ''
                }
                pending={pending}
                onConfirm={confirmDelete}
                onClose={() => !pending && setPendingDelete(null)}
            />
        </div>
    )
}
