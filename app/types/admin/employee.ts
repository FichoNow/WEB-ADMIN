import type { UserRole } from '@/app/types/auth/login-response'

export type EmployeeRole = Exclude<UserRole, 'SUPERADMIN'>

export interface EmployeeListItem {
  id: number
  name: string
  email: string
  role: EmployeeRole
  is_active: boolean
  must_change_password: boolean
}

export interface CreateEmployeeBody {
  department_id: number
  group_id: number | null
  email: string
  name: string
  role: EmployeeRole
  password: string
  is_active: boolean
}

export interface UpdateEmployeeBody {
  name?: string
  email?: string
  role?: EmployeeRole
  is_active?: boolean
  password?: string
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

export type EmployeeActionState =
  | { error: string }
  | { success: string }
  | undefined
