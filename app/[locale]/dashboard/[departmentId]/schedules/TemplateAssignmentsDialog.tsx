'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { CalendarRange, Clock, User, Users, X } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'
import type {
    GroupScheduleAssignmentItem,
    ScheduleAssignmentsResponse,
    ScheduleTemplateItem,
    UserScheduleAssignmentItem,
} from '@/app/types/admin/api/schedule-response'
import type { AssignmentStatus, UnifiedAssignment } from '@/app/types/admin/api/schedule-assignment'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { deleteUserScheduleAssignmentAction } from '@/app/actions/admin/schedules/delete-user-schedule-assignment'
import { deleteGroupScheduleAssignmentAction } from '@/app/actions/admin/schedules/delete-group-schedule-assignment'

function getStatus(start: string, end: string | null, today: string): AssignmentStatus {
    if (start > today) return 'futura'
    if (end && end < today) return 'expirada'
    return 'activa'
}

function buildList(
    template: ScheduleTemplateItem,
    userAssignments: UserScheduleAssignmentItem[],
    groupAssignments: GroupScheduleAssignmentItem[],
    today: string,
): UnifiedAssignment[] {
    const fromUsers: UnifiedAssignment[] = userAssignments
        .filter((a) => a.template_id === template.id)
        .map((a) => ({
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

    const fromGroups: UnifiedAssignment[] = groupAssignments
        .filter((a) => a.template_id === template.id)
        .map((a) => ({
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

export default function TemplateAssignmentsDialog({
    template,
    assignments,
    departmentId,
    today,
    open,
    onClose,
}: {
    template: ScheduleTemplateItem | null
    assignments: ScheduleAssignmentsResponse
    departmentId: number
    today: string
    open: boolean
    onClose: () => void
}) {
    const t = useTranslations('schedules.templateAssignDialog')
    const tTab = useTranslations('schedules.assignmentsTab')
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [pendingDelete, setPendingDelete] = useState<UnifiedAssignment | null>(null)

    const formatRange = (start: string, end: string | null) => {
        if (!end) return tTab('fromDate', { date: start })
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
            activa: tTab('active'),
            futura: tTab('future'),
            expirada: tTab('expired'),
        }
        return (
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${styles[status]}`}>
                {labels[status]}
            </Badge>
        )
    }

    const list = useMemo(
        () =>
            template
                ? buildList(template, assignments.user_assignments, assignments.group_assignments, today)
                : [],
        [template, assignments, today],
    )

    const counts = useMemo(() => {
        const c = { active: 0, future: 0, expired: 0 }
        for (const a of list) {
            if (a.status === 'activa') c.active += 1
            else if (a.status === 'futura') c.future += 1
            else c.expired += 1
        }
        return c
    }, [list])

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

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-[640px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="px-8 py-6 border-b border-divider/50">
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-primary shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <DialogTitle className="text-xl font-bold text-text-primary truncate">
                                {t('titlePrefix')} · {template?.name ?? ''}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-text-secondary">
                                {list.length === 0 ? t('emptyDesc') : t('withDesc')}
                            </DialogDescription>
                        </div>
                    </div>
                    {list.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                            {counts.active > 0 && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-success/10 text-success border-success/20">
                                    {t('activeCount', { count: counts.active })}
                                </Badge>
                            )}
                            {counts.future > 0 && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                                    {t('futureCount', { count: counts.future })}
                                </Badge>
                            )}
                            {counts.expired > 0 && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-text-hint/10 text-text-hint border-divider">
                                    {t('expiredCount', { count: counts.expired })}
                                </Badge>
                            )}
                        </div>
                    )}
                </DialogHeader>

                <div className="max-h-[65vh] overflow-y-auto px-6 py-5 flex flex-col gap-2">
                    {list.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <CalendarRange className="w-10 h-10 text-text-hint opacity-30 mb-3" />
                            <p className="text-sm text-text-hint">{t('empty')}</p>
                        </div>
                    ) : (
                        list.map((a) => {
                            const Icon = a.scope === 'user' ? User : Users
                            return (
                                <div key={a.key} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-surface-variant/30 border border-divider/40 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-text-primary truncate">{a.targetName}</span>
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-text-hint">
                                                    {a.scope === 'user' ? tTab('user') : tTab('group')}
                                                </span>
                                                <StatusBadge status={a.status} />
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-text-hint flex-wrap">
                                                <span>{formatRange(a.startDate, a.endDate)}</span>
                                                {a.targetSecondary && (
                                                    <>
                                                        <span>·</span>
                                                        <span className="truncate">{a.targetSecondary}</span>
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
                                        aria-label={tTab('deleteAria')}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )
                        })
                    )}
                </div>
            </DialogContent>

            <ConfirmDialog
                open={pendingDelete !== null}
                title={tTab('confirmTitle')}
                description={
                    pendingDelete
                        ? (pendingDelete.scope === 'user'
                            ? tTab('confirmDescUser', { template: template?.name ?? '', target: pendingDelete.targetName })
                            : tTab('confirmDescGroup', { template: template?.name ?? '', target: pendingDelete.targetName }))
                        : ''
                }
                pending={pending}
                onConfirm={confirmDelete}
                onClose={() => !pending && setPendingDelete(null)}
            />
        </Dialog>
    )
}
