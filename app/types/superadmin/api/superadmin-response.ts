/**
 * Superadministrador devuelto por la API.
 *
 * La usa:
 * GET /superadmin/superadmins
 */
export interface SuperadminUser {
  id: number
  name: string
  email: string
  is_active: boolean
}

/**
 * Respuesta al actualizar un superadministrador.
 *
 * La usa:
 * PATCH /superadmin/superadmin/:id
 */
export interface UpdateSuperadminResponse {
  id: number
  name: string
  email: string
}
