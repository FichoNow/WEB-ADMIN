"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { deleteProject } from "@/app/repositories/projects-repository"
import type { ProjectActionState } from "@/app/types/admin/action-states/project-state"

export async function deleteProjectAction(
  departmentId: number,
  projectId: number,
): Promise<ProjectActionState> {
  const t = await getTranslations("actions")
  try {
    await deleteProject(projectId)
    revalidatePath(`/dashboard/${departmentId}/projects`)
    return { success: t("projects.deleted") }
  } catch (err) {
    return { error: err instanceof Error ? err.message : t("errors.projectDelete") }
  }
}
