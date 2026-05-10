"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { deleteEmployee } from "@/app/repositories/employees-repository"
import type { EmployeeActionState } from "@/app/types/admin/action-states/employee-state"

export async function deleteEmployeeAction(
  departmentId: number,
  employeeId: number,
): Promise<EmployeeActionState> {
  const t = await getTranslations("actions")
  try {
    await deleteEmployee(employeeId)
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: t("employees.deleted") }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.employeeDelete") }
  }
}
