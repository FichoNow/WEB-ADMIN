import { fetchWithAuth } from '@/app/lib/api'
import type { CompanyInfoResponse } from '@/app/types/admin/api/company-info-response'

export async function getCompanyInfo(): Promise<CompanyInfoResponse> {
  const res = await fetchWithAuth('/admin/company-info')
  if (!res.ok) throw new Error('No se pudo cargar la información del dashboard')
  const json = await res.json()
  return json.data as CompanyInfoResponse
}

export async function getCompanyDetails() {
  const res = await fetchWithAuth('/superadmin/company')
  if (!res.ok) throw new Error('No se pudo cargar la información de la empresa')
  const json = await res.json()
  return json.data as {
    id: number; name: string; cif_nif: string; email: string
    address_line: string; city: string; postal_code: string
  }
}

export async function getSuperadmins() {
  const res = await fetchWithAuth('/superadmin/superadmins')
  if (!res.ok) throw new Error('No se pudieron cargar los administradores')
  const json = await res.json()
  return json.data as { id: number; name: string; email: string; is_active: boolean }[]
}
