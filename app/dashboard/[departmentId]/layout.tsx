import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCompanyInfo } from '@/app/repositories/admin-repository'
import Sidebar from './Sidebar'

interface Props {
  children: React.ReactNode
  params: Promise<{ departmentId: string }>
}

export default async function DepartmentLayout({ children, params }: Props) {
  const { departmentId } = await params

  let departmentName = 'Departamento'
  let companyName = 'Empresa'
  let isSuperAdmin = false

  try {
    const [info, cookieStore] = await Promise.all([getCompanyInfo(), cookies()])
    const dept = info.departments.find(d => d.id === Number(departmentId))
    if (!dept) redirect('/dashboard')
    departmentName = dept.name
    companyName = info.company.name
    isSuperAdmin = cookieStore.get('userRole')?.value === 'SUPERADMIN'
  } catch {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar departmentId={departmentId} departmentName={departmentName} companyName={companyName} isSuperAdmin={isSuperAdmin} />
      <main className="flex-1 bg-bg pb-12">
        {children}
      </main>
    </div>
  )
}
