/**
 * Proyecto tal como lo recibe la web cuando lista proyectos de un departamento.
 *
 * Lo usa:
 * GET /admin/projects?departmentId=...
 */
export interface ProjectListItem {
    id: number
    department_id: number
    group_id: number
    name: string
    is_active: boolean
    created_at: string
}

/**
 * Respuesta de la API al crear o editar un proyecto.
 *
 * Lo usan:
 * POST /admin/project
 * PATCH /admin/project/:id
 */
export interface ProjectResponse {
    id: number
    department_id: number
    group_id: number
    name: string
    is_active: boolean
}