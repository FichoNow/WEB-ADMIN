import { redirect } from "next/navigation"
import { getRequests, getEmployees, listGroups } from "@/app/repositories/admin-repository"
import type { AdminRequestListItem } from "@/app/types/admin/api/admin-request-response"
import type { EmployeeListItem } from "@/app/types/admin/api/employee-response"
import type { GroupResponse } from "@/app/types/admin/api/group-response"
import RequestsClient from "./RequestsClient"

interface Props {
  params: Promise<{ departmentId: string }>
}

export default async function RequestsPage({ params }: Props) {
  const { departmentId } = await params
  const deptId = Number(departmentId)

  let requests: AdminRequestListItem[]
  let employees: EmployeeListItem[]
  let groups: GroupResponse[]

  try {
    [requests, employees, groups] = await Promise.all([
      getRequests(deptId),
      getEmployees(deptId),
      listGroups(deptId),
    ])
  } catch {
    redirect("/dashboard")
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-6">
      <RequestsClient
        requests={requests}
        employees={employees}
        groups={groups}
        departmentId={deptId}
      />
    </div>
  )
}