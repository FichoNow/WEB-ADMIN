export interface RegisterCompanyData {
  name: string
  cif_nif: string
  email: string
  address_line: string
  city: string
  postal_code: string
}

export interface RegisterUserData {
  name: string
  email: string
  password: string
}

export interface RegisterRequest {
  company: RegisterCompanyData
  user: RegisterUserData
}
