import { redirect } from "next/navigation"
import { getProjects } from "@/app/repositories/projects-repository"
import ProjectsClient from "./ProjectsClient"

interface Props {
  params: Promise<{ departmentId: string }>
}

/**
 * Página de gestión de proyectos del departamento.
 * 
 * Se ejecuta en servidor:
 * - Lee el departmentId de la URL.
 * - Pide los proyectos a la API.
 * - Pasa los datos al componente cliente.
 */
export default async function ProjectsPage({ params }: Props) {
  const { departmentId } = await params
  const deptId = Number(departmentId)

  let projects

  try{
    projects = await getProjects(deptId)
  }catch (err){
    redirect("/dashboard")
  }

  return(
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-6">
      <ProjectsClient projects={projects} departmentId={deptId} />
    </div>
  )
}