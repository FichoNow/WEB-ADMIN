"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { createGroup } from "@/app/repositories/groups-repository"
import { translateFirstIssue } from "@/app/lib/translate-zod"
import { createGroupSchema } from "@/app/types/admin/schemas/group-schema"
import type { GroupActionState } from "@/app/types/admin/action-states/group-state"

export async function createGroupAction(
  departmentId: number,
  data: unknown,
): Promise<GroupActionState> {
  const t = await getTranslations("actions")
  const result = createGroupSchema.safeParse(data)
  if (!result.success) return { error: await translateFirstIssue(result.error) }

  try {
    const group = await createGroup({
      department_id: departmentId,
      name: result.data.name,
    })
    revalidatePath(`/dashboard/${departmentId}/employees`)
    return { success: t("groups.createdNamed", { name: group.name }) }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.groupCreate") }
  }
}
