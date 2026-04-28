export type AdminRequestType =
  | "VACATION"
  | "PERMISSION"
  | "SICK_LEAVE"
  | "MEDICAL_APPOINTMENT"
  | "DAY_OFF";

export type AdminRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface AdminRequestListItem {
  id: number;
  user_id: number;
  employee_name: string;
  employee_email: string;
  department_id: number;
  type: AdminRequestType;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  status: AdminRequestStatus;
  comment: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  review_comment: string | null;
  created_at: string;
}

export interface ReviewRequestBody {
  review_comment?: string | null;
}

export interface ReviewRequestResponse {
  id: number;
  status: AdminRequestStatus;
  reviewed_by: number;
  reviewed_at: string;
  review_comment: string | null;
}