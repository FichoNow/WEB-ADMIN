"use server"

import { revalidatePath } from "next/cache"
import { fetchWithAuth } from "@/app/lib/api"
import { createEmployeesSchema } from "@/app/types/admin/schemas/employee-schema"
import type { EmployeeActionState } from "@/app/types/admin/action-states/employee-state"

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

  const isSingle = body.length === 1
  const endpoint = isSingle ? "/admin/user" : "/admin/users"
  const payload = isSingle ? body[0] : body

  try {
    const res = await fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.error?.message ?? "Error al crear los empleados")
    }
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return {
      success: isSingle
        ? "Empleado creado correctamente"
        : `${body.length} empleados creados correctamente`,
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al crear los empleados" }
  }
}
