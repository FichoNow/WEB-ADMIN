/**
 * Body de la petición para actualizar un superadministrador.
 *
 * La usa:
 * PATCH /superadmin/superadmin/:id
 */
export interface UpdateSuperadminRequest {
  name?: string
  email?: string
}
