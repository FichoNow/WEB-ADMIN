/**
 * Estado que devuelven las Server Actions de proyectos.
 *
 * Puede devolver:
 * - success: cuando la operación sale bien.
 * - error: cuando algo falla.
 * - undefined: estado inicial, antes de ejecutar ninguna acción.
 */
export type ProjectActionState =
    | { success: string }
    | { error: string }
    | undefined
