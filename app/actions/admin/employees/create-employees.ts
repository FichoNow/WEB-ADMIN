"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { createEmployee, createEmployees } from "@/app/repositories/employees-repository"
import { translateFirstIssue } from "@/app/lib/translate-zod"
import { createEmployeesSchema } from "@/app/types/admin/schemas/employee-schema"
import type { EmployeeActionState } from "@/app/types/admin/action-states/employee-state"
import type { CreateEmployeeBody } from "@/app/types/admin/api/employee-request"

function parseGroupId(raw: string | undefined): number | null {
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

export async function createBulkEmployeesAction(
  departmentId: number,
  rows: unknown[],
): Promise<EmployeeActionState> {
  const t = await getTranslations("actions")
  const result = createEmployeesSchema.safeParse({ rows })

  if (!result.success) {
    return { error: await translateFirstIssue(result.error) }
  }

  const body: CreateEmployeeBody[] = result.data.rows.map((row) => ({
    department_id: departmentId,
    group_id:  parseGroupId(row.group_id),
    name:      row.name.trim(),
    email:     row.email.trim().toLowerCase(),
    password:  row.password,
    role:      row.role,
    is_active: true,
  }))

  try {
    if (body.length === 1) {
      await createEmployee(body[0])
    } else {
      await createEmployees(body)
    }
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return {
      success: t("employees.createdSummary", { n: body.length }),
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.employeesCreate") }
  }
}
