"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { deleteGroup } from "@/app/repositories/groups-repository"
import type { GroupActionState } from "@/app/types/admin/action-states/group-state"

export async function deleteGroupAction(
  departmentId: number,
  groupId: number,
): Promise<GroupActionState> {
  const t = await getTranslations("actions")
  try {
    await deleteGroup(groupId)
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: t("groups.deleted") }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.groupDelete") }
  }
}
