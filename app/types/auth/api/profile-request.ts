/**
 * Body de la petición para actualizar el perfil del usuario autenticado.
 *
 * La usa:
 * PATCH /user/update
 */
export interface UpdateProfileRequest {
  name?: string
  email?: string
  password?: string
}
