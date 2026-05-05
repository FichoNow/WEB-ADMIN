/**
 * Estado que devuelven las Server Actions de horarios.
 *
 * Puede devolver:
 * - success: cuando la operación sale bien.
 * - error: cuando algo falla.
 * - undefined: estado inicial.
 */
export type ScheduleActionState =
  | { success: string }
  | { error: string }
  | undefined