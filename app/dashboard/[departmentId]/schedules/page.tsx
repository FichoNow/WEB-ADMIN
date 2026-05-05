import { redirect } from "next/navigation"
import { getSchedules, getScheduleAssignments } from "@/app/repositories/schedules-repository"
import { listGroups } from "@/app/repositories/groups-repository"
import { getEmployees } from "@/app/repositories/employees-repository"
import SchedulesClient from "./SchedulesClient"

interface Props {
  params: Promise<{ departmentId: string }>
}

/**
 * Página de gestión de horarios del departamento.
 *
 * Carga en servidor:
 * - plantillas de horario del departamento
 * - asignaciones existentes (a usuario y a grupo)
 * - grupos del departamento
 * - empleados del departamento
 *
 * Luego pasa esos datos al componente cliente.
 */
export default async function HorariosPage({ params }: Props) {
  const { departmentId } = await params
  const deptId = Number(departmentId)

  let schedules
  let assignments
  let groups
  let employees

  try {
    schedules = await getSchedules(deptId)
    assignments = await getScheduleAssignments(deptId)
    groups = await listGroups(deptId)
    employees = await getEmployees(deptId)
  } catch {
    redirect("/dashboard")
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-6">
      <SchedulesClient
        schedules={schedules}
        assignments={assignments}
        groups={groups}
        employees={employees}
        departmentId={deptId}
      />
    </div>
  )
}
