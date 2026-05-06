import { fetchWithAuth } from '@/app/lib/api'
import type { CompanyInfoResponse } from '@/app/types/admin/api/company-info-response'
import type { CompanyDetailsResponse } from '@/app/types/superadmin/api/company-response'
import type {
  SuperadminUser,
  UpdateSuperadminResponse,
} from '@/app/types/superadmin/api/superadmin-response'
import type { UpdateSuperadminRequest } from '@/app/types/superadmin/api/superadmin-request'

export async function getCompanyInfo(): Promise<CompanyInfoResponse> {
  const res = await fetchWithAuth('/admin/company-info')
  if (!res.ok) throw new Error('No se pudo cargar la información del dashboard')
  const json = await res.json()
  return json.data as CompanyInfoResponse
}

export async function getCompanyDetails(): Promise<CompanyDetailsResponse> {
  const res = await fetchWithAuth('/superadmin/company')
  if (!res.ok) throw new Error('No se pudo cargar la información de la empresa')
  const json = await res.json()
  return json.data as CompanyDetailsResponse
}

export async function getSuperadmins(): Promise<SuperadminUser[]> {
  const res = await fetchWithAuth('/superadmin/superadmins')
  if (!res.ok) throw new Error('No se pudieron cargar los administradores')
  const json = await res.json()
  return json.data as SuperadminUser[]
}

export async function updateSuperadminRequest(
  id: number,
  body: UpdateSuperadminRequest,
): Promise<UpdateSuperadminResponse> {
  const res = await fetchWithAuth(`/superadmin/superadmin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const code = json?.error?.code
    if (code === 'EMAIL_ALREADY_EXISTS') throw new Error('Ya existe un usuario con ese email.')
    throw new Error(json?.error?.message ?? 'No se pudo actualizar el administrador')
  }
  const json = await res.json()
  return json.data
}

export async function deleteSuperadminRequest(id: number): Promise<void> {
  const res = await fetchWithAuth(`/superadmin/superadmin/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    const code = json?.error?.code
    if (code === 'OWNER_PROTECTED') throw new Error('No se puede eliminar al owner de la empresa')
    if (code === 'SELF_DELETE_NOT_ALLOWED') throw new Error('No puedes eliminarte a ti mismo')
    throw new Error(json?.error?.message ?? 'No se pudo eliminar el administrador')
  }
}
