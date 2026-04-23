export interface OverviewDepartment {
  id: number
  name: string
}

export interface OverviewResponse {
  company: {
    id: number
    name: string
  }
  departments: OverviewDepartment[]
}
