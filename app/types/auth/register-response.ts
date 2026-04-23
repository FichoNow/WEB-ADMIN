import type { UserRole } from './login-response'

export interface RegisterResponseCompany {
  id: number
  name: string
  cif_nif: string
  email: string
  address_line: string
  city: string
  postal_code: string
}

export interface RegisterResponseUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface RegisterResponse {
  company: RegisterResponseCompany
  user: RegisterResponseUser
}
