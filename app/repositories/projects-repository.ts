import { fetchWithAuth } from "@/app/lib/api";
import type { 
    CreateProjectBody,
    UpdateProjectBody,
} from "@/app/types/admin/api/project-request";
import type {
    ProjectListItem,
    ProjectResponse,
} from "@/app/types/admin/api/project-response";

/**
 * Obtiene los proyectos de un departamento.
 * 
 * Llama a:
 * GET /admin/projects?departmentId=...
 */
export async function getProjects(departmentId: number): Promise<ProjectListItem[]> {
    const res = await fetchWithAuth(`/admin/projects?departmentId=${departmentId}`)

    if(!res.ok){
        const json = await res.json().catch(() => null)

        throw new Error(
            json?.error?.message ?? `No se pudo cargar la lista de proyectos. Status: ${res.status}`
        )
    }

    const json = await res.json()
    return json.data as ProjectListItem[]
}

/**
 * Crea un proyecto nuevo.
 * 
 * Llama a:
 * POST /admin/project
*/
export async function createProject(body: CreateProjectBody): Promise<ProjectResponse> {
    const res = await fetchWithAuth('/admin/project', {
        method: 'POST',
        body: JSON.stringify(body),
    })

    if(!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error?.message ?? 'Error al crear el proyecto')
    }

    const json = await res.json()
    return json.data as ProjectResponse
}

/**
 * Edita un proyecto existente.
 *
 * Llama a:
 * PATCH /admin/project/:id
 */
export async function updateProject(
    id: number,
    body: UpdateProjectBody,
): Promise<ProjectResponse> {
    const res = await fetchWithAuth(`/admin/project/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    })

    if(!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error?.message ?? 'Error al actualizar el proyecto')
    }

    const json = await res.json()
    return json.data as ProjectResponse
}

/**
 * Elimina un proyecto por su ID.
 *
 * Llama a:
 * DELETE /admin/project/:id
 */
export async function deleteProject(id: number): Promise<void> {
    const res = await fetchWithAuth(`/admin/project/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error?.message ?? 'Error al eliminar el proyecto')
    }
}
