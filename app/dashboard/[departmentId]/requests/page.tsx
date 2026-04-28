import { redirect } from "next/navigation"
import { getRequests } from "@/app/repositories/admin-repository"
import type { AdminRequestListItem } from "@/app/types/admin/api/admin-request-response"
import RequestsClient from "./RequestsClient"

interface Props {
  params: Promise<{ departmentId: string }>
}

export default async function RequestsPage({ params }: Props) {
  const { departmentId } = await params
  const deptId = Number(departmentId)

  let requests: AdminRequestListItem[]

  try {
    requests = await getRequests(deptId)
  } catch {
    redirect("/dashboard")
  }

  return (
    <div className="px-10 py-12 flex flex-col gap-6">
      <RequestsClient requests={requests} departmentId={deptId} />
    </div>
  )
}