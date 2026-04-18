export type UserRole = 'USER' | 'ADMINISTRATOR'

export interface LoginUserData {
  name: string
  role: UserRole
  email: string
  companyName: string
  must_change_password: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userData: LoginUserData
}
