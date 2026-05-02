"use server"

import { revalidatePath } from "next/cache"
import { deleteEmployee } from "@/app/repositories/employees-repository"
import type { EmployeeActionState } from "@/app/types/admin/action-states/employee-state"

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
