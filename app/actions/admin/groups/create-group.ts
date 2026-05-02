"use server"

import { revalidatePath } from "next/cache"
import { createGroup } from "@/app/repositories/groups-repository"
import { createGroupSchema } from "@/app/types/admin/schemas/group-schema"
import type { GroupActionState } from "@/app/types/admin/action-states/group-state"

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
