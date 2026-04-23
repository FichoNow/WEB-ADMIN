export interface CompanyInfoDepartment {
  id: number
  name: string
}

export interface CompanyInfoResponse {
  company: {
    id: number
    name: string
  }
  departments: CompanyInfoDepartment[]
}
