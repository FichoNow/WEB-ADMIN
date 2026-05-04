"use server"

import { revalidatePath } from "next/cache"
import { updateProject } from "@/app/repositories/projects-repository"
import type { ProjectActionState } from "@/app/types/admin/action-states/project-state"

/**
 * Server Action para editar un proyecto desde el panel admin.
 * 
 * Recibe los datos del formulario, valida lo básico y llama al repository, que a su vez llama a la API.
 */
export async function updateProjectAction(
    departmentId: number,
    projectId: number,
    _prev: ProjectActionState,
    formData: FormData,
): Promise<ProjectActionState> {
    const name = (formData.get("name") as string).trim()
    const groupIdRaw = formData.get("group_id") as string | null
    const isActiveRaw = formData.get("is_active") as string | null

    if(!name){
        return { error: "El nombre del proyecto es obligatorio" }
    }

    const group_id =
        groupIdRaw && groupIdRaw !== "none"
        ? Number(groupIdRaw)
        : null

    if(group_id !== null && (!Number.isInteger(group_id) || group_id <= 0)) {
        return { error: "El grupo seleccionado no es válido" }
    }

    try{
        await updateProject(projectId, {
            group_id,
            name,
            is_active: isActiveRaw === "true",
        })

        revalidatePath(`/dashboard/${departmentId}/projects`)

        return { success: "Proyecto actualizado correctamente" }
    }catch (err) {
        return {
            error: err instanceof Error ? err.message : "Error al actualizar el proyecto",
        }
    }
}