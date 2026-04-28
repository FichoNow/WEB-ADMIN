import type { AdminRequestStatus } from '@/app/types/admin/api/admin-request-response'

export interface ReviewRequestResponse {
  id: number
  status: AdminRequestStatus
  reviewed_by: number
  reviewed_at: string
  review_comment: string | null
}
