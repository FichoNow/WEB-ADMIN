/**
 * Estado de una asignación de horario respecto a la fecha actual.
 *
 * - `futura`: empieza después de hoy.
 * - `activa`: hoy está dentro del rango.
 * - `expirada`: terminó antes de hoy.
 */
export type AssignmentStatus = 'futura' | 'activa' | 'expirada'

/**
 * Asignación unificada (usuario o grupo) usada por la UI para listar
 * asignaciones sin diferenciar el alcance.
 */
export interface UnifiedAssignment {
  key: string
  id: number
  scope: 'user' | 'group'
  targetName: string
  targetSecondary?: string | null
  templateId: number
  templateName: string
  startDate: string
  endDate: string | null
  status: AssignmentStatus
}
