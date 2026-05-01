import { fetchWithAuth } from '@/app/lib/api'
import type { CreateGroupBody, UpdateGroupBody } from '@/app/types/admin/api/group-request'
import type { GroupResponse } from '@/app/types/admin/api/group-response'

export async function listGroups(departmentId: number): Promise<GroupResponse[]> {
  const res = await fetchWithAuth(`/admin/groups?departmentId=${departmentId}`)
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'No se pudieron cargar los grupos')
  }
  const json = await res.json()
  return json.data as GroupResponse[]
}

export async function createGroup(body: CreateGroupBody): Promise<GroupResponse> {
  const res = await fetchWithAuth('/admin/group', { method: 'POST', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al crear el grupo')
  }
  const json = await res.json()
  return json.data as GroupResponse
}

export async function updateGroup(id: number, body: UpdateGroupBody): Promise<GroupResponse> {
  const res = await fetchWithAuth(`/admin/group/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al actualizar el grupo')
  }
  const json = await res.json()
  return json.data as GroupResponse
}

export async function deleteGroup(id: number): Promise<void> {
  const res = await fetchWithAuth(`/admin/group/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new Error(json?.error?.message ?? 'Error al eliminar el grupo')
  }
}
