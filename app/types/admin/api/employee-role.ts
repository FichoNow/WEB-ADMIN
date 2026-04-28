import type { UserRole } from '@/app/types/auth/api/login-response'

export type EmployeeRole = Exclude<UserRole, 'SUPERADMIN'>
