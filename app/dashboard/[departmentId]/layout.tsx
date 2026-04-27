import { redirect } from 'next/navigation'
import { getCompanyInfo } from '@/app/repositories/admin-repository'
import Sidebar from './Sidebar'

interface Props {
  children: React.ReactNode
  params: Promise<{ departmentId: string }>
}

export default async function DepartmentLayout({ children, params }: Props) {
  const { departmentId } = await params

  let departmentName = 'Departamento'

  try {
    const info = await getCompanyInfo()
    const dept = info.departments.find(d => d.id === Number(departmentId))
    if (!dept) redirect('/dashboard')
    departmentName = dept.name
  } catch {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar departmentId={departmentId} departmentName={departmentName} />
      <main className="flex-1 bg-bg overflow-auto">
        {children}
      </main>
    </div>
  )
}
