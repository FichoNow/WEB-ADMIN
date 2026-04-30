import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCompanyInfo } from '@/app/repositories/admin-repository'
import type { CompanyInfoDepartment } from '@/app/types/admin/api/company-info-response'
import CreateDepartmentButton from './CreateDepartmentButton'

function DepartmentCard({ department }: { department: CompanyInfoDepartment }) {
  return (
    <Link href={`/dashboard/${department.id}`}>
      <div className="group flex flex-row items-center justify-between px-6 py-5 rounded-2xl bg-surface border border-divider hover:border-primary/40 hover:bg-surface-variant transition-all duration-200 cursor-pointer">
        <span className="text-base font-medium text-text-primary">{department.name}</span>
        <svg
          className="w-5 h-5 text-text-hint group-hover:text-primary transition-colors duration-200 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  )
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('userRole')?.value
  const isSuperAdmin = role === 'SUPERADMIN'

  let overview

  try {
    overview = await getCompanyInfo()
  } catch {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-16 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-light tracking-tight text-text-primary">
            {overview.company.name}
          </h1>
          <p className="text-base text-text-secondary">
            {isSuperAdmin
              ? `${overview.departments.length} departamentos`
              : overview.departments[0]?.name}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-divider" />

        {/* Departments */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-widest text-text-hint uppercase">
              Departamentos
            </p>
            {isSuperAdmin && <CreateDepartmentButton />}
          </div>
          <div className="flex flex-col gap-2">
            {overview.departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
