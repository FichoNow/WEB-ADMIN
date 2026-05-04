/**
 * Datos que la web envía a la API para crear un proyecto nuevo.
 *
 * Coincide con el body esperado por:
 * POST /admin/project
 */
export interface CreateProjectBody {
    department_id: number
    group_id: number | null
    name: string
    is_active: boolean
}

/**
 * Datos que la web puede enviar a la API para editar un proyecto.
 *
 * Coincide con el body esperado por:
 * PATCH /admin/project/:id
 *
 * Todos los campos son opcionales porque se puede editar solo una parte.
 */
export interface UpdateProjectBody {
    group_id?: number | null
    name?: string
    is_active?: boolean
}