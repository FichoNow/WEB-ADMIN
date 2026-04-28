'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  {
    key: '',
    label: 'Inicio',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: 'employees',
    label: 'Empleados',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'projects',
    label: 'Proyectos',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'fichajes',
    label: 'Fichajes',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'requests',
    label: 'Solicitudes',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'horarios',
    label: 'Horarios',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z M4.22 4.22l15.56 15.56" />
      </svg>
    ),
  },
  {
    key: 'statistics',
    label: 'Estadísticas',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

interface Props {
  departmentId: string
  departmentName: string
  companyName: string
}

import { buttonVariants } from '@/components/ui/button'

export default function Sidebar({ departmentId, departmentName, companyName }: Props) {
  const pathname = usePathname()
  const base = `/dashboard/${departmentId}`

  return (
    <aside className="w-64 shrink-0 border-r border-divider bg-surface flex flex-col h-[calc(100vh-4rem)] sticky top-16 z-40 overflow-y-auto">
      {/* Department header */}
      <div className="px-5 py-6 border-b border-divider flex flex-col gap-4">
        <div>
          <p className="text-[10px] font-medium tracking-widest text-text-hint uppercase mb-1">Empresa</p>
          <p className="text-sm font-semibold text-text-primary truncate">{companyName}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium tracking-widest text-text-hint uppercase mb-1">Departamento</p>
          <p className="text-sm font-semibold text-text-secondary truncate">{departmentName}</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {SECTIONS.map(({ key, label, icon }) => {
          const href = key ? `${base}/${key}` : base
          const isActive = key
            ? pathname.startsWith(`${base}/${key}`)
            : pathname === base

          return (
            <Link
              key={key}
              href={href}
              className={buttonVariants({
                variant: isActive ? 'secondary' : 'ghost',
                className: `relative justify-start gap-3 w-full rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/15 text-primary hover:bg-primary/25' : 'text-text-secondary hover:bg-surface-variant hover:text-text-primary'}`
              })}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              {icon}
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
