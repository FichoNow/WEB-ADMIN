"use server"

import { revalidatePath } from "next/cache"
import { deleteProject } from "@/app/repositories/projects-repository"
import type { ProjectActionState } from "@/app/types/admin/action-states/project-state"

export async function deleteProjectAction(
  departmentId: number,
  projectId: number,
): Promise<ProjectActionState> {
  try {
    await deleteProject(projectId)
    revalidatePath(`/dashboard/${departmentId}/projects`)
    return { success: "Proyecto eliminado correctamente" }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Error al eliminar el proyecto" }
  }
}
