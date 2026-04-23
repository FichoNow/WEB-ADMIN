import type { OverviewResponse } from '@/app/types/admin/overview-response'

const API_URL = process.env.API_URL ?? 'http://localhost:3000'

export async function getOverview(accessToken: string): Promise<OverviewResponse> {
  const res = await fetch(`${API_URL}/admin/overview`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('No se pudo cargar la información del dashboard')

  const json = await res.json()
  return json.data as OverviewResponse
}
