/**
 * Detalles completos de la empresa propietaria.
 *
 * La usa:
 * GET /superadmin/company
 */
export interface CompanyDetailsResponse {
  id: number
  name: string
  cif_nif: string
  email: string
  address_line: string
  city: string
  postal_code: string
  owner_id: number | null
}
