"use server"

import { revalidatePath } from "next/cache"
import { updateEmployee } from "@/app/repositories/admin-repository"
import { fetchWithAuth } from "@/app/lib/api"
import type { EmployeeActionState, EmployeeRole } from "@/app/types/admin/employee"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Estructura de cada fila del formulario de crear empleados
export interface BulkEmployeeRow {
  name: string
  email: string
  password: string
  role: EmployeeRole
}

// Crear uno o varios empleados de golpe
export async function createBulkEmployeesAction(
  departmentId: number,
  rows: BulkEmployeeRow[],
): Promise<EmployeeActionState> {
  if (rows.length === 0) return { error: "Añade al menos un empleado" }

  for (const row of rows) {
    if (!row.name.trim())          return { error: "Falta el nombre en uno de los empleados" }
    if (!EMAIL_RE.test(row.email)) return { error: `El email "${row.email}" no es válido` }
    if (row.password.length < 8)   return { error: `La contraseña de "${row.name}" debe tener al menos 8 caracteres` }
  }

  const body = rows.map(row => ({
    department_id: departmentId,
    group_id: null,
    name: row.name.trim(),
    email: row.email.trim().toLowerCase(),
    password: row.password,
    role: row.role,
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
    return { success: `${rows.length === 1 ? "Empleado creado" : `${rows.length} empleados creados`} correctamente` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al crear los empleados" }
  }
}

// Editar un empleado (solo los campos que se envíen cambian)
export async function updateEmployeeAction(
  departmentId: number,
  employeeId: number,
  _prev: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const name      = (formData.get("name") as string).trim()
  const email     = (formData.get("email") as string).trim().toLowerCase()
  const password  = formData.get("password") as string
  const role      = formData.get("role") as EmployeeRole | ""
  const isActive  = formData.get("is_active") as string

  if (email && !EMAIL_RE.test(email))  return { error: "El email no es válido" }
  if (password && password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres" }

  // Solo incluimos los campos que el usuario ha rellenado
  const changes: Record<string, unknown> = {}
  if (name)     changes.name      = name
  if (email)    changes.email     = email
  if (password) changes.password  = password
  if (role)     changes.role      = role
  if (isActive) changes.is_active = isActive === "true"

  if (Object.keys(changes).length === 0) return { error: "Rellena al menos un campo para actualizar" }

  try {
    const employee = await updateEmployee(employeeId, changes)
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: `"${employee.name}" actualizado correctamente` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al actualizar el empleado" }
  }
}
