import { fetchWithAuth } from '@/app/lib/api'
import type { AdminRequestListItem } from '@/app/types/admin/api/admin-request-response'
import type { ReviewRequestBody } from '@/app/types/admin/api/review-request-body'
import type { ReviewRequestResponse } from '@/app/types/admin/api/review-request-response'

export async function getRequests(departmentId: number): Promise<AdminRequestListItem[]> {
  const res = await fetchWithAuth(`/admin/requests?departmentId=${departmentId}`)
  if (!res.ok) throw new Error('No se pudo cargar la lista de solicitudes')
  const json = await res.json()
  return json.data as AdminRequestListItem[]
}

export async function approveRequest(id: number, body: ReviewRequestBody): Promise<ReviewRequestResponse> {
  const res = await fetchWithAuth(`/admin/requests/${id}/approve`, { method: 'PATCH', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al aprobar la solicitud')
  }
  const json = await res.json()
  return json.data as ReviewRequestResponse
}

export async function rejectRequest(id: number, body: ReviewRequestBody): Promise<ReviewRequestResponse> {
  const res = await fetchWithAuth(`/admin/requests/${id}/reject`, { method: 'PATCH', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al rechazar la solicitud')
  }
  const json = await res.json()
  return json.data as ReviewRequestResponse
}
