"use server"

import { revalidatePath } from "next/cache"
import { deleteGroup } from "@/app/repositories/groups-repository"
import type { GroupActionState } from "@/app/types/admin/action-states/group-state"

export async function deleteGroupAction(
  departmentId: number,
  groupId: number,
): Promise<GroupActionState> {
  try {
    await deleteGroup(groupId)
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: "Grupo eliminado correctamente" }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al eliminar el grupo" }
  }
}
