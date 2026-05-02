"use server"

import { revalidatePath } from "next/cache"
import { updateGroup } from "@/app/repositories/groups-repository"
import { editGroupSchema } from "@/app/types/admin/schemas/group-schema"
import type { GroupActionState } from "@/app/types/admin/action-states/group-state"

export async function updateGroupAction(
  departmentId: number,
  groupId: number,
  data: unknown,
): Promise<GroupActionState> {
  const result = editGroupSchema.safeParse(data)
  if (!result.success) return { error: result.error.issues[0].message }

  try {
    const group = await updateGroup(groupId, { name: result.data.name })
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: `Grupo "${group.name}" actualizado` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al actualizar el grupo" }
  }
}
