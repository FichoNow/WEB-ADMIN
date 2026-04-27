import { fetchWithAuth } from '@/app/lib/api'
import type { CompanyInfoResponse } from '@/app/types/admin/company-info-response'
import type { CreateEmployeeBody, UpdateEmployeeBody, EmployeeResponse, EmployeeListItem } from '@/app/types/admin/employee'

export async function getCompanyInfo(): Promise<CompanyInfoResponse> {
  const res = await fetchWithAuth('/admin/company-info')
  if (!res.ok) throw new Error('No se pudo cargar la información del dashboard')
  const json = await res.json()
  return json.data as CompanyInfoResponse
}

export async function getEmployees(departmentId: number): Promise<EmployeeListItem[]> {
  const res = await fetchWithAuth(`/admin/users?departmentId=${departmentId}`)
  if (!res.ok) throw new Error('No se pudo cargar la lista de empleados')
  const json = await res.json()
  return json.data as EmployeeListItem[]
}

export async function createEmployee(body: CreateEmployeeBody): Promise<EmployeeResponse> {
  const res = await fetchWithAuth('/admin/user', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al crear el empleado')
  }
  const json = await res.json()
  return json.data as EmployeeResponse
}

export async function updateEmployee(id: number, body: UpdateEmployeeBody): Promise<EmployeeResponse> {
  const res = await fetchWithAuth(`/admin/user/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al actualizar el empleado')
  }
  const json = await res.json()
  return json.data as EmployeeResponse
}
