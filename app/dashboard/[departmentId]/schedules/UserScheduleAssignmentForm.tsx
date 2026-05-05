'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createUserScheduleAssignmentAction } from '@/app/actions/admin/schedules/create-user-schedule-assignment'
import type { ScheduleTemplateItem } from '@/app/types/admin/api/schedule-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
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

export default function UserScheduleAssignmentForm({
    departmentId,
    schedules,
    employees,
    onClose,
}: {
    departmentId: number
    schedules: ScheduleTemplateItem[]
    employees: EmployeeListItem[]
    onClose: () => void
}) {
    const router = useRouter()
    const action = createUserScheduleAssignmentAction.bind(null, departmentId)

    const [state, dispatch, pending] = useActionState<ScheduleActionState, FormData>(
        action,
        undefined,
    )

    const [userId, setUserId] = useState<string>(PLACEHOLDER)
    const [templateId, setTemplateId] = useState<string>(PLACEHOLDER)

    const userLabel = userId === PLACEHOLDER
        ? 'Selecciona un usuario'
        : (() => {
              const e = employees.find((emp) => String(emp.id) === userId)
              return e ? `${e.name} · ${e.email}` : 'Usuario desconocido'
          })()

    const templateLabel = templateId === PLACEHOLDER
        ? 'Selecciona una plantilla'
        : schedules.find((s) => String(s.id) === templateId)?.name ?? 'Plantilla desconocida'

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
                <label className="text-xs font-medium text-text-secondary">
                    Usuario
                </label>
                <Select value={userId} onValueChange={(v) => setUserId(v ?? PLACEHOLDER)}>
                    <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                        <span className="truncate text-left">{userLabel}</span>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-divider">
                        {employees.map((e) => (
                            <SelectItem key={e.id} value={String(e.id)}>{e.name} · {e.email}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input type="hidden" name="user_id" value={userId === PLACEHOLDER ? '' : userId} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">
                    Plantilla de horario
                </label>
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
                    <label className="text-xs font-medium text-text-secondary">
                        Fecha de inicio
                    </label>
                    <Input name="start_date" type="date" required />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-text-secondary">
                        Fecha de fin <span className="text-text-hint">(opcional)</span>
                    </label>
                    <Input name="end_date" type="date" />
                </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
                <Button type="submit" disabled={pending} className="w-full h-12 text-base font-bold rounded-xl">
                    {pending ? 'Asignando...' : 'Asignar horario al usuario'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={pending}
                    className="w-full border-divider/50 hover:bg-surface-variant text-text-hint hover:text-text-primary rounded-xl h-11"
                >
                    Cancelar
                </Button>
            </div>
        </form>
    )
}
