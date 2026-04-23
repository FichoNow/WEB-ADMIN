import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getOverview } from '@/app/repositories/admin-repository'
import type { OverviewDepartment } from '@/app/types/admin/overview-response'

function DepartmentCard({ department }: { department: OverviewDepartment }) {
  return (
    <div className="group flex items-center justify-between px-6 py-5 rounded-2xl bg-surface border border-divider hover:border-primary/40 hover:bg-surface-variant transition-all duration-200 cursor-pointer">
      <span className="text-sm font-medium text-text-primary">{department.name}</span>
      <svg
        className="w-4 h-4 text-text-hint group-hover:text-primary transition-colors duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  )
}

export default async function OverviewPanel() {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  if (!token) redirect('/')

  let overview

  try {
    overview = await getOverview(token)
  } catch {
    redirect('/')
  }

  const isSuperAdmin = overview.departments.length > 1

  return (
    <div className="min-h-screen bg-bg px-6 py-16 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            {isSuperAdmin ? 'Superadmin' : 'Administrador'}
          </p>
          <h1 className="text-4xl font-light tracking-tight text-text-primary">
            {overview.company.name}
          </h1>
          <p className="text-sm text-text-secondary">
            {isSuperAdmin
              ? `${overview.departments.length} departamentos`
              : overview.departments[0]?.name}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-divider" />

        {/* Departments */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium tracking-widest text-text-hint uppercase">
            Departamentos
          </p>
          <div className={`grid gap-3 ${isSuperAdmin ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {overview.departments.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
