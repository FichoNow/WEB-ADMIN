"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { updateGroup } from "@/app/repositories/groups-repository"
import { translateFirstIssue } from "@/app/lib/translate-zod"
import { editGroupSchema } from "@/app/types/admin/schemas/group-schema"
import type { GroupActionState } from "@/app/types/admin/action-states/group-state"

export async function updateGroupAction(
  departmentId: number,
  groupId: number,
  data: unknown,
): Promise<GroupActionState> {
  const t = await getTranslations("actions")
  const result = editGroupSchema.safeParse(data)
  if (!result.success) return { error: await translateFirstIssue(result.error) }

  try {
    const group = await updateGroup(groupId, { name: result.data.name })
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: t("groups.updatedNamed", { name: group.name }) }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.groupUpdate") }
  }
}
