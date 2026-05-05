'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createScheduleAction } from '@/app/actions/admin/schedules/create-schedule'
import type { ScheduleActionState } from '@/app/types/admin/action-states/schedule-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const weekdayLabels: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
}

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

export default function ScheduleForm({
  departmentId,
  onClose,
}: {
  departmentId: number
  onClose: () => void
}) {
  const router = useRouter()
  const action = createScheduleAction.bind(null, departmentId)

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
    <form action={dispatch} className="flex flex-col gap-5">
      <Alert state={state} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Nombre de la plantilla
          </label>
          <Input
            name="name"
            type="text"
            placeholder="Ej: Horario intensivo verano"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Estado
          </label>
          <select
            name="is_active"
            defaultValue="true"
            className="w-full rounded-xl px-4 py-3 text-sm bg-bg border border-input-stroke text-text-primary outline-none focus:border-primary transition-colors"
          >
            <option value="true">Activa</option>
            <option value="false">Inactiva</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-medium text-text-secondary">
            Descripción
          </label>
          <Input
            name="description"
            type="text"
            placeholder="Ej: Lunes a viernes de 08:00 a 15:00"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Días de la semana
          </p>
          <p className="text-xs text-text-hint">
            Marca los días laborables y define hora de inicio, fin y descanso.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }, (_, index) => {
            const weekday = index + 1

            return (
              <div
                key={weekday}
                className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr_1fr] gap-3 items-center rounded-xl border border-divider bg-bg px-4 py-3"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                  <input
                    type="checkbox"
                    name={`day_${weekday}_is_working_day`}
                    defaultChecked={weekday <= 5}
                    className="h-4 w-4"
                  />
                  {weekdayLabels[weekday]}
                </label>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-text-hint">
                    Inicio
                  </label>
                  <Input
                    name={`day_${weekday}_start_time`}
                    type="time"
                    defaultValue={weekday <= 5 ? '09:00' : ''}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-text-hint">
                    Fin
                  </label>
                  <Input
                    name={`day_${weekday}_end_time`}
                    type="time"
                    defaultValue={weekday <= 5 ? '18:00' : ''}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest text-text-hint">
                    Descanso min.
                  </label>
                  <Input
                    name={`day_${weekday}_break_minutes`}
                    type="number"
                    min={0}
                    defaultValue={weekday <= 5 ? 60 : 0}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? 'Creando...' : 'Crear plantilla'}
      </Button>
    </form>
  )
}