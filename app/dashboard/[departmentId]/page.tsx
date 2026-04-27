import Link from 'next/link'

const MODULES = [
  {
    key: 'employees',
    title: 'Empleados',
    description: 'Gestiona la plantilla, altas y bajas del equipo.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'projects',
    title: 'Proyectos',
    description: 'Administra proyectos y la imputación de horas.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'fichajes',
    title: 'Fichajes',
    description: 'Revisa y ajusta los registros de jornada.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'requests',
    title: 'Solicitudes',
    description: 'Aprueba vacaciones y ausencias del personal.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'horarios',
    title: 'Horarios',
    description: 'Configura horarios y turnos de trabajo.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z M4.22 4.22l15.56 15.56" />
      </svg>
    ),
  },
  {
    key: 'statistics',
    title: 'Estadísticas',
    description: 'Analiza datos y métricas de rendimiento del equipo.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

export default async function DepartmentPage({ params }: { params: Promise<{ departmentId: string }> }) {
  const departmentId = (await params).departmentId;

  return (
    <div className="px-10 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">Inicio</p>
        <h1 className="text-3xl font-light tracking-tight text-text-primary">Vista general</h1>
        <p className="text-sm text-text-secondary">Selecciona un módulo para gestionar tu departamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((mod) => (
          <Link key={mod.key} href={`/dashboard/${departmentId}/${mod.key}`}>
            <div className="group flex flex-col p-6 rounded-2xl bg-surface border border-divider hover:border-primary/40 hover:bg-surface-variant transition-all duration-200 cursor-pointer h-full">
              <div className="w-10 h-10 rounded-xl bg-bg border border-divider flex items-center justify-center text-text-secondary group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-200 mb-4">
                {mod.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">{mod.title}</h3>
              <p className="text-sm text-text-secondary">{mod.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
