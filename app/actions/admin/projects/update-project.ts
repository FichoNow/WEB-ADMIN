"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"
import { updateProject } from "@/app/repositories/projects-repository"
import type { ProjectActionState } from "@/app/types/admin/action-states/project-state"

export async function updateProjectAction(
    departmentId: number,
    projectId: number,
    _prev: ProjectActionState,
    formData: FormData,
): Promise<ProjectActionState> {
    const t = await getTranslations("actions")
    const name = (formData.get("name") as string).trim()
    const groupIdRaw = formData.get("group_id") as string | null
    const isActiveRaw = formData.get("is_active") as string | null

    if(!name){
        return { error: t("projects.nameRequired") }
    }

    const group_id =
        groupIdRaw && groupIdRaw !== "none"
        ? Number(groupIdRaw)
        : null

    if(group_id !== null && (!Number.isInteger(group_id) || group_id <= 0)) {
        return { error: t("projects.invalidGroup") }
    }

    try{
        await updateProject(projectId, {
            group_id,
            name,
            is_active: isActiveRaw === "true",
        })

        revalidatePath(`/dashboard/${departmentId}/projects`)

        return { success: t("projects.updated") }
    }catch (err) {
        return {
            error: err instanceof Error ? err.message : t("errors.projectUpdate"),
        }
    }
}
