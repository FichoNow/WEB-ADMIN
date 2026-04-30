import type { EmployeeRole } from '@/app/types/admin/api/employee-role'

export interface EmployeeListItem {
  id: number
  name: string
  email: string
  role: EmployeeRole
  is_active: boolean
  must_change_password: boolean
  group_id: number | null
}

export interface EmployeeResponse {
  id: number
  company_id: number
  department_id: number
  group_id: number | null
  email: string
  name: string
  role: EmployeeRole
  is_active: boolean
  must_change_password: boolean
}
