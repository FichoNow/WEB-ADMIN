/**
 * Respuesta al actualizar el perfil del usuario autenticado.
 *
 * La usa:
 * PATCH /user/update
 */
export interface UpdateProfileResponse {
  name: string
  email: string
}
