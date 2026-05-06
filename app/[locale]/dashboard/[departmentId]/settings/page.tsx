import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getCompanyInfo } from '@/app/repositories/company-repository'
import PageHeader from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings2 } from 'lucide-react'
import DepartmentSettingsForm from './DepartmentSettingsForm'

interface Props {
  params: Promise<{ departmentId: string; locale: string }>
}

export default async function DepartmentSettingsPage({ params }: Props) {
  const { departmentId, locale } = await params
  const deptId = Number(departmentId)
  const t = await getTranslations({ locale, namespace: 'departmentSettings' })

  let departmentName = ''
  try {
    const info = await getCompanyInfo()
    const dept = info.departments.find(d => d.id === deptId)
    if (!dept) redirect(`/${locale}/dashboard`)
    departmentName = dept.name
  } catch {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-10">
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <div className="max-w-3xl mx-auto w-full">
        <Card className="bg-surface border border-divider/50 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="px-8 sm:px-10 py-8 border-b border-divider/50 bg-surface-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                <Settings2 className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-text-primary">{t('cardTitle')}</CardTitle>
                <CardDescription className="text-sm text-text-secondary mt-1">{t('cardDescription')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 sm:px-10 py-10">
            <DepartmentSettingsForm departmentId={deptId} initialName={departmentName} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
