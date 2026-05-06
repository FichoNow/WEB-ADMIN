import { redirect } from "next/navigation"
import { getProjects } from "@/app/repositories/projects-repository"
import { listGroups } from "@/app/repositories/groups-repository"
import ProjectsClient from "./ProjectsClient"

interface Props {
  params: Promise<{ departmentId: string; locale: string }>
}

export default async function ProjectsPage({ params }: Props) {
  const { departmentId, locale } = await params
  const deptId = Number(departmentId)

  let projects
  let groups

  try {
    [projects, groups] = await Promise.all([
      getProjects(deptId),
      listGroups(deptId),
    ])
  } catch {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-6">
      <ProjectsClient projects={projects} groups={groups} departmentId={deptId} />
    </div>
  )
}