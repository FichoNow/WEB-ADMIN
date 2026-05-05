'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createGroupScheduleAssignmentAction } from '@/app/actions/admin/schedules/create-group-schedule-assignment'
import type { ScheduleTemplateItem } from '@/app/types/admin/api/schedule-response'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import type { ScheduleActionState } from '@/app/types/admin/action-states/schedule-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Alert({ state }: { state: ScheduleActionState }) {
  if (!state) return null

  if ('error' in state) {
    return (
      <p className="text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-3">
        {state.error}
      </p>
    )
  }

  if ('success' in state) {
    return (
      <p className="text-sm text-success bg-success/10 border border-success/30 rounded-xl px-4 py-3">
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
  const router = useRouter()
  const action = createGroupScheduleAssignmentAction.bind(null, departmentId)

  const [state, dispatch, pending] = useActionState<ScheduleActionState, FormData>(
    action,
    undefined,
  )

  useEffect(() => {
    if (state && 'success' in state) {
      router.refresh()
      onClose()
    }
  }, [state, router, onClose])

  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <Alert state={state} />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Grupo
        </label>
        <select
          name="group_id"
          defaultValue=""
          className="w-full rounded-xl px-4 py-3 text-sm bg-bg border border-input-stroke text-text-primary outline-none focus:border-primary transition-colors"
          required
        >
          <option value="" disabled>
            Selecciona un grupo
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Plantilla de horario
        </label>
        <select
          name="template_id"
          defaultValue=""
          className="w-full rounded-xl px-4 py-3 text-sm bg-bg border border-input-stroke text-text-primary outline-none focus:border-primary transition-colors"
          required
        >
          <option value="" disabled>
            Selecciona una plantilla
          </option>
          {schedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {schedule.name}
            </option>
          ))}
        </select>
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
            Fecha de fin
            <span className="text-text-hint"> (opcional)</span>
          </label>
          <Input name="end_date" type="date" />
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? 'Asignando...' : 'Asignar horario al grupo'}
      </Button>
    </form>
  )
}