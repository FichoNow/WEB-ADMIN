"use server"

import { revalidatePath } from "next/cache"
import { createGroup, deleteGroup, updateGroup } from "@/app/repositories/groups-repository"
import { createGroupSchema, editGroupSchema } from "@/app/types/admin/schemas/group-schema"
import type { GroupActionState } from "@/app/types/admin/states/group-state"

export async function createGroupAction(
  departmentId: number,
  data: unknown,
): Promise<GroupActionState> {
  const result = createGroupSchema.safeParse(data)
  if (!result.success) return { error: result.error.issues[0].message }

  try {
    const group = await createGroup({
      department_id: departmentId,
      name: result.data.name,
    })
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: `Grupo "${group.name}" creado correctamente` }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al crear el grupo" }
  }
}

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
