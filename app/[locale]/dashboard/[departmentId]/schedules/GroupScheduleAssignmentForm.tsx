'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { createGroupScheduleAssignmentAction } from '@/app/actions/admin/schedules/create-group-schedule-assignment'
import type { ScheduleTemplateItem } from '@/app/types/admin/api/schedule-response'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import type { ScheduleActionState } from '@/app/types/admin/action-states/schedule-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'

const PLACEHOLDER = '__placeholder__'

function Alert({ state }: { state: ScheduleActionState }) {
    if (!state) return null

    if ('error' in state) {
        return (
            <p className="text-sm text-error bg-error/10 border-error/30 rounded-xl px-4 py-3">
                {state.error}
            </p>
        )
    }

    if ('success' in state) {
        return (
            <p className="text-sm text-success bg-success/10 border-success/30 rounded-xl px-4 py-3">
                {state.success}
            </p>
        )
    }

    return null
}

export default function GroupScheduleAssignmentForm({
    departmentId,
    schedules,
    groups,
    onClose,
}: {
    departmentId: number
    schedules: ScheduleTemplateItem[]
    groups: GroupResponse[]
    onClose: () => void
}) {
    const t = useTranslations('schedules.assignForm')
    const router = useRouter()
    const action = createGroupScheduleAssignmentAction.bind(null, departmentId)

    const [state, dispatch, pending] = useActionState<ScheduleActionState, FormData>(
        action,
        undefined,
    )

    const [groupId, setGroupId] = useState<string>(PLACEHOLDER)
    const [templateId, setTemplateId] = useState<string>(PLACEHOLDER)

    const groupLabel = groupId === PLACEHOLDER
        ? t('selectGroup')
        : groups.find((g) => String(g.id) === groupId)?.name ?? t('unknownGroup')

    const templateLabel = templateId === PLACEHOLDER
        ? t('selectTemplate')
        : schedules.find((s) => String(s.id) === templateId)?.name ?? t('unknownTemplate')

    useEffect(() => {
        if (!state) return
        if ('success' in state) {
            toast.success(state.success)
            router.refresh()
            onClose()
        } else if ('error' in state) {
            toast.error(state.error)
        }
    }, [state, router, onClose])

    return (
        <form action={dispatch} className="flex flex-col gap-5">
            <Alert state={state} />

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">{t('group')}</label>
                <Select value={groupId} onValueChange={(v) => setGroupId(v ?? PLACEHOLDER)}>
                    <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                        <span className="truncate text-left">{groupLabel}</span>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-divider">
                        {groups.map((g) => (
                            <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input type="hidden" name="group_id" value={groupId === PLACEHOLDER ? '' : groupId} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">{t('template')}</label>
                <Select value={templateId} onValueChange={(v) => setTemplateId(v ?? PLACEHOLDER)}>
                    <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                        <span className="truncate text-left">{templateLabel}</span>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-divider">
                        {schedules.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input type="hidden" name="template_id" value={templateId === PLACEHOLDER ? '' : templateId} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-secondary">{t('startDate')}</label>
                    <Input name="start_date" type="date" required />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                        {t('endDate')} <span className="text-text-hint">{t('optional')}</span>
                    </label>
                    <Input name="end_date" type="date" />
                </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
                <Button type="submit" disabled={pending} className="w-full h-12 text-base font-bold rounded-xl">
                    {pending ? t('assigning') : t('submitGroup')}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={pending}
                    className="w-full border-divider/50 hover:bg-surface-variant text-text-hint hover:text-text-primary rounded-xl h-11"
                >
                    {t('cancel')}
                </Button>
            </div>
        </form>
    )
}
