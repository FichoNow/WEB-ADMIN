'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { createScheduleAction } from '@/app/actions/admin/schedules/create-schedule'
import { updateScheduleAction } from '@/app/actions/admin/schedules/update-schedule'
import type { ScheduleActionState } from '@/app/types/admin/action-states/schedule-state'
import type { ScheduleTemplateItem } from '@/app/types/admin/api/schedule-response'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'

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

interface DayDefaults {
    isWorkingDay: boolean
    startTime: string
    endTime: string
    breakMinutes: number
}

function buildDayDefaults(template: ScheduleTemplateItem | null, weekday: number): DayDefaults {
    if (template) {
        const day = template.days.find((d) => d.weekday === weekday)
        if (day) {
            return {
                isWorkingDay: day.is_working_day,
                startTime: day.start_time ? day.start_time.slice(0, 5) : '',
                endTime: day.end_time ? day.end_time.slice(0, 5) : '',
                breakMinutes: day.break_minutes,
            }
        }
    }

    const defaultWorking = weekday <= 5
    return {
        isWorkingDay: defaultWorking,
        startTime: defaultWorking ? '09:00' : '',
        endTime: defaultWorking ? '18:00' : '',
        breakMinutes: defaultWorking ? 60 : 0,
    }
}

export default function ScheduleForm({
    departmentId,
    template,
    onClose,
}: {
    departmentId: number
    template?: ScheduleTemplateItem | null
    onClose: () => void
}) {
    const t = useTranslations('schedules.form')
    const STATUS_LABELS: Record<string, string> = {
        'true': t('active'),
        'false': t('inactive'),
    }
    const router = useRouter()
    const isEdit = !!template

    const action = isEdit
        ? updateScheduleAction.bind(null, departmentId, template!.id)
        : createScheduleAction.bind(null, departmentId)

    const [state, dispatch, pending] = useActionState<ScheduleActionState, FormData>(
        action,
        undefined,
    )

    const [isActive, setIsActive] = useState<string>(
        template ? (template.is_active ? 'true' : 'false') : 'true',
    )
    const statusLabel = STATUS_LABELS[isActive] ?? isActive

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-secondary">{t('name')}</label>
                    <Input
                        name="name"
                        type="text"
                        placeholder={t('namePh')}
                        defaultValue={template?.name ?? ''}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-secondary">{t('status')}</label>
                    <Select value={isActive} onValueChange={(v) => setIsActive(v ?? 'true')}>
                        <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                            <span className={`truncate text-left ${isActive === 'true' ? 'text-success' : 'text-error'}`}>
                                {statusLabel}
                            </span>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-divider">
                            <SelectItem value="true" className="text-success">{t('active')}</SelectItem>
                            <SelectItem value="false" className="text-error">{t('inactive')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <input type="hidden" name="is_active" value={isActive} />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-text-secondary">{t('description')}</label>
                    <Input
                        name="description"
                        type="text"
                        placeholder={t('descriptionPh')}
                        defaultValue={template?.description ?? ''}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div>
                    <p className="text-sm font-bold text-text-primary">{t('daysTitle')}</p>
                    <p className="text-xs text-text-hint">{t('daysHint')}</p>
                </div>

                <div className="flex flex-col gap-2">
                    {Array.from({ length: 7 }, (_, index) => {
                        const weekday = index + 1
                        const defaults = buildDayDefaults(template ?? null, weekday)

                        return (
                            <div
                                key={weekday}
                                className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr_1fr] gap-3 items-center rounded-2xl border border-divider bg-surface-variant/40 px-4 py-3 shadow-sm hover:bg-surface-variant/60 transition-colors"
                            >
                                <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                    <input
                                        type="checkbox"
                                        name={`day_${weekday}_is_working_day`}
                                        defaultChecked={defaults.isWorkingDay}
                                        className="h-4 w-4 accent-primary"
                                    />
                                    {t(`weekdays.${weekday}` as any)}
                                </label>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase tracking-widest text-text-hint">{t('start')}</label>
                                    <Input
                                        name={`day_${weekday}_start_time`}
                                        type="time"
                                        defaultValue={defaults.startTime}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase tracking-widest text-text-hint">{t('end')}</label>
                                    <Input
                                        name={`day_${weekday}_end_time`}
                                        type="time"
                                        defaultValue={defaults.endTime}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase tracking-widest text-text-hint">{t('breakMin')}</label>
                                    <Input
                                        name={`day_${weekday}_break_minutes`}
                                        type="number"
                                        min={0}
                                        defaultValue={defaults.breakMinutes}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
                <Button type="submit" disabled={pending} className="w-full h-12 text-base font-bold rounded-xl">
                    {pending ? (isEdit ? t('saving') : t('creating')) : (isEdit ? t('save') : t('create'))}
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
