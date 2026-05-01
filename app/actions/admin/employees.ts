"use server"

import { revalidatePath } from "next/cache"
import { deleteEmployee, updateEmployee } from "@/app/repositories/employees-repository"
import { fetchWithAuth } from "@/app/lib/api"
import { createEmployeesSchema, editEmployeeSchema } from "@/app/types/admin/schemas/employee-schema"
import type { EmployeeActionState } from "@/app/types/admin/states/employee-state"

function parseGroupId(raw: string | undefined): number | null {
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

export async function createBulkEmployeesAction(
  departmentId: number,
  rows: unknown[],
): Promise<EmployeeActionState> {
  const result = createEmployeesSchema.safeParse({ rows })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const body = result.data.rows.map((row) => ({
    department_id: departmentId,
    group_id: parseGroupId(row.group_id),
    name:     row.name.trim(),
    email:    row.email.trim().toLowerCase(),
    password: row.password,
    role:     row.role,
    is_active: true,
  }))

  try {
    const res = await fetchWithAuth("/admin/users", {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.error?.message ?? "Error al crear los empleados")
    }
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return {
      success: rows.length === 1
        ? "Empleado creado correctamente"
        : `${rows.length} empleados creados correctamente`,
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al crear los empleados" }
  }
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

export async function deleteEmployeeAction(
  departmentId: number,
  employeeId: number,
): Promise<EmployeeActionState> {
  try {
    await deleteEmployee(employeeId)
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: "Empleado eliminado correctamente" }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al eliminar el empleado" }
  }
}
