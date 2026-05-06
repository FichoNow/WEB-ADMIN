import type { EmployeeRole } from '@/app/types/admin/api/employee-response'

export interface BulkEmployeeRow {
  name: string
  email: string
  password: string
  role: EmployeeRole
}

export interface BulkCreateOptions {
  group_id: number | null
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
  group_id?: number | null
}
