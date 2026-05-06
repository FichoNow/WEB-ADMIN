import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getCompanyInfo } from '@/app/repositories/company-repository'
import DashboardLayout from './DashboardLayout'

interface Props {
  children: React.ReactNode
  params: Promise<{ departmentId: string; locale: string }>
}

export default async function DepartmentLayout({ children, params }: Props) {
  const { departmentId, locale } = await params
  const t = await getTranslations({ locale, namespace: 'department' })

  let departmentName = t('fallbackName')
  let companyName = t('fallbackCompany')
  let isSuperAdmin = false

  try {
    const [info, cookieStore] = await Promise.all([getCompanyInfo(), cookies()])
    const dept = info.departments.find(d => d.id === Number(departmentId))
    if (!dept) redirect(`/${locale}/dashboard`)
    departmentName = dept.name
    companyName = info.company.name
    isSuperAdmin = cookieStore.get('userRole')?.value === 'SUPERADMIN'
  } catch {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <DashboardLayout
      departmentId={departmentId}
      departmentName={departmentName}
      companyName={companyName}
      isSuperAdmin={isSuperAdmin}
    >
      {children}
    </DashboardLayout>
  )
}
