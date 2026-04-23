import type { CompanyInfoResponse } from '@/app/types/admin/company-info-response'

const API_URL = process.env.API_URL ?? 'http://localhost:3000'

export async function getCompanyInfo(accessToken: string): Promise<CompanyInfoResponse> {
  const res = await fetch(`${API_URL}/admin/company-info`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('No se pudo cargar la información del dashboard')

  const json = await res.json()
  return json.data as CompanyInfoResponse
}
