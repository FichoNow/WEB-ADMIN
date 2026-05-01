import { redirect } from 'next/navigation'
import { getCompanyInfo } from '@/app/repositories/company-repository'
import PageHeader from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings2 } from 'lucide-react'
import DepartmentSettingsForm from './DepartmentSettingsForm'

interface Props {
  params: Promise<{ departmentId: string }>
}

export default async function DepartmentSettingsPage({ params }: Props) {
  const { departmentId } = await params
  const deptId = Number(departmentId)

  let departmentName = ''
  try {
    const info = await getCompanyInfo()
    const dept = info.departments.find(d => d.id === deptId)
    if (!dept) redirect('/dashboard')
    departmentName = dept.name
  } catch {
    redirect('/dashboard')
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 flex flex-col gap-10">
      <PageHeader
        title="Configuración"
        description="Administra los parámetros generales y la identidad de este departamento."
      />

      <div className="max-w-3xl mx-auto w-full">
        <Card className="bg-surface border border-divider/50 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="px-8 sm:px-10 py-8 border-b border-divider/50 bg-surface-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                <Settings2 className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-text-primary">Perfil del Departamento</CardTitle>
                <CardDescription className="text-sm text-text-secondary mt-1">Información pública y de identificación.</CardDescription>
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
