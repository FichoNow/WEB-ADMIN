'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { ScheduleTemplateItem } from '@/app/types/admin/api/schedule-response'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import ScheduleForm from './ScheduleForm'
import GroupScheduleAssignmentForm from './GroupScheduleAssignmentForm'
import UserScheduleAssignmentForm from './UserScheduleAssignmentForm'

const weekdayLabels: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
}

function formatWeeklyMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (rest === 0) return `${hours} h/semana`

  return `${hours} h ${rest} min/semana`
}

function ScheduleModal({
  title,
  description,
  onClose,
  children,
}: {
  title: string
  description: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-surface border-divider">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ScheduleCard({ schedule }: { schedule: ScheduleTemplateItem }) {
  const workingDays = schedule.days.filter((day) => day.is_working_day)

  return (
    <div className="flex flex-col gap-4 px-5 py-4 rounded-2xl bg-surface border border-divider hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-primary">
              {schedule.name}
            </p>

            {schedule.is_active ? (
              <Badge className="text-[10px]">Activa</Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">Inactiva</Badge>
            )}
          </div>

          {schedule.description && (
            <p className="text-xs text-text-secondary">
              {schedule.description}
            </p>
          )}

          <p className="text-xs text-text-hint">
            {formatWeeklyMinutes(schedule.weekly_minutes)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
        {schedule.days.map((day) => (
          <div
            key={day.id}
            className="rounded-xl border border-divider bg-bg px-3 py-2"
          >
            <p className="text-xs font-medium text-text-primary">
              {weekdayLabels[day.weekday] ?? `Día ${day.weekday}`}
            </p>

            {day.is_working_day ? (
              <p className="text-xs text-text-secondary mt-1">
                {day.start_time} - {day.end_time}
                {day.break_minutes > 0
                  ? ` · descanso ${day.break_minutes} min`
                  : ''}
              </p>
            ) : (
              <p className="text-xs text-text-hint mt-1">
                No laborable
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-text-hint">
        Días laborables: {workingDays.length}
      </p>
    </div>
  )
}

export default function SchedulesClient({
  schedules,
  groups,
  employees,
  departmentId,
}: {
  schedules: ScheduleTemplateItem[]
  groups: GroupResponse[]
  employees: EmployeeListItem[]
  departmentId: number
}) {
  const [showCreateSchedule, setShowCreateSchedule] = useState(false)
  const [showAssignGroup, setShowAssignGroup] = useState(false)
  const [showAssignUser, setShowAssignUser] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            Horarios
          </p>
          <h1 className="text-3xl font-light tracking-tight text-text-primary">
            Gestión de horarios
          </h1>
          <p className="text-sm text-text-secondary">
            Configura plantillas de horario y asígnalas a grupos o empleados.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant="ghost"
            onClick={() => setShowAssignGroup(true)}
            className="rounded-xl"
          >
            Asignar a grupo
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowAssignUser(true)}
            className="rounded-xl"
          >
            Asignar a usuario
          </Button>

          <Button
            onClick={() => setShowCreateSchedule(true)}
            className="rounded-xl"
          >
            Nueva plantilla
          </Button>
        </div>
      </div>

      <div className="h-px bg-divider" />

      {schedules.length === 0 ? (
        <p className="text-sm text-text-hint py-8 text-center">
          No hay plantillas de horario en este departamento todavía.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}

      {showCreateSchedule && (
        <ScheduleModal
          title="Nueva plantilla de horario"
          description="Define los días laborables, horas y descansos de la plantilla."
          onClose={() => setShowCreateSchedule(false)}
        >
          <ScheduleForm
            departmentId={departmentId}
            onClose={() => setShowCreateSchedule(false)}
          />
        </ScheduleModal>
      )}

      {showAssignGroup && (
        <ScheduleModal
          title="Asignar horario a grupo"
          description="Aplica una plantilla de horario a un grupo durante un rango de fechas."
          onClose={() => setShowAssignGroup(false)}
        >
          <GroupScheduleAssignmentForm
            departmentId={departmentId}
            schedules={schedules}
            groups={groups}
            onClose={() => setShowAssignGroup(false)}
          />
        </ScheduleModal>
      )}

      {showAssignUser && (
        <ScheduleModal
          title="Asignar horario a usuario"
          description="Aplica una plantilla de horario a un empleado concreto."
          onClose={() => setShowAssignUser(false)}
        >
          <UserScheduleAssignmentForm
            departmentId={departmentId}
            schedules={schedules}
            employees={employees}
            onClose={() => setShowAssignUser(false)}
          />
        </ScheduleModal>
      )}
    </>
  )
}