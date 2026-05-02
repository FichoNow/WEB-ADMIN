"use server"

import { revalidatePath } from "next/cache"
import { updateEmployee } from "@/app/repositories/employees-repository"
import { editEmployeeSchema } from "@/app/types/admin/schemas/employee-schema"
import type { EmployeeActionState } from "@/app/types/admin/action-states/employee-state"

function parseGroupId(raw: string | undefined): number | null {
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

export async function updateEmployeeAction(
  departmentId: number,
  employeeId: number,
  data: unknown,
): Promise<EmployeeActionState> {
  const result = editEmployeeSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const { name, email, password, role, is_active, group_id } = result.data

  const changes: Record<string, unknown> = {
    name,
    email:     email.trim().toLowerCase(),
    role,
    is_active: is_active === "true",
    group_id:  parseGroupId(group_id),
  }

  if (password) changes.password = password

  try {
    const employee = await updateEmployee(employeeId, changes)
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: `"${employee.name}" actualizado correctamente` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al actualizar el empleado" }
  }
}
