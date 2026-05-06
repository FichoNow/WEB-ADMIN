import type { UserRole } from '@/app/types/auth/api/login-response'

/**
 * Roles que puede tener un empleado dentro de un departamento.
 * Excluye SUPERADMIN porque ese rol es transversal a la empresa.
 */
export type EmployeeRole = Exclude<UserRole, 'SUPERADMIN'>

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
