import type { AdminRequestStatus } from '@/app/types/admin/api/admin-request-response'

/**
 * Body de la petición para aprobar/rechazar una solicitud.
 *
 * La usa:
 * POST /admin/requests/:id/approve
 * POST /admin/requests/:id/reject
 */
export interface ReviewRequestBody {
  review_comment?: string | null
}

/**
 * Respuesta tras aprobar o rechazar una solicitud.
 */
export interface ReviewRequestResponse {
  id: number
  status: AdminRequestStatus
  reviewed_by: number
  reviewed_at: string
  review_comment: string | null
}
