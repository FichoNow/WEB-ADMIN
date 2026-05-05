'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { X } from 'lucide-react'

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
    key: 'requests',
    label: 'Solicitudes',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'schedules',
    label: 'Horarios',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  isSuperAdmin: boolean
  open: boolean
  onClose: () => void
}

export default function Sidebar({ departmentId, departmentName, companyName, isSuperAdmin, open, onClose }: Props) {
  const pathname = usePathname()
  const base = `/dashboard/${departmentId}`
  const prevPath = useRef(pathname)

  // Close drawer on route change (skip first render)
  useEffect(() => {
    if (prevPath.current !== pathname) {
      onClose()
      prevPath.current = pathname
    }
  }, [pathname])

  const navContent = (
    <>
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {SECTIONS.map(({ key, label, icon }) => {
          const href = key ? `${base}/${key}` : base
          const isActive = key ? pathname.startsWith(`${base}/${key}`) : pathname === base
          return (
            <Link
              key={key}
              href={href}
              className={buttonVariants({
                variant: 'ghost',
                className: `group relative justify-start gap-3 w-full rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary hover:bg-surface-variant hover:text-text-primary'
                }`
              })}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-line"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>
                {icon}
              </span>
              <span className="relative z-10">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="h-px bg-divider/50 mx-5" />

      <div className="px-5 py-6 flex flex-col gap-5 mt-auto">
        {isSuperAdmin && (
          <div className="flex flex-col gap-1 -mt-2">
            <p className="px-1 pb-2 text-[10px] font-bold tracking-widest text-text-hint uppercase opacity-50">Configuración</p>
            {(() => {
              const href = `${base}/settings`
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  href={href}
                  className={buttonVariants({
                    variant: 'ghost',
                    className: `group relative justify-start gap-3 w-full rounded-xl transition-all duration-300 px-3 ${
                      isActive
                        ? 'text-primary font-semibold'
                        : 'text-text-secondary hover:bg-surface-variant hover:text-text-primary'
                    }`
                  })}
                >
                  {isActive && (
                    <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-primary/10 rounded-xl" initial={false} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  {isActive && (
                    <motion.div layoutId="sidebar-active-line" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" initial={false} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="relative z-10">Ajustes</span>
                </Link>
              )
            })()}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-surface-variant/40 border border-divider/50 space-y-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-text-hint uppercase mb-1 opacity-60">Empresa</p>
            <p className="text-sm font-bold text-text-primary truncate">{companyName}</p>
          </div>
          <div className="h-px bg-divider/30" />
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-text-hint uppercase mb-1 opacity-60">Departamento</p>
            <p className="text-sm font-semibold text-text-secondary truncate">{departmentName}</p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors px-1 flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Cambiar departamento
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-divider bg-surface flex-col h-[calc(100vh-4rem)] sticky top-16 z-40 overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-divider flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-divider/50">
                <span className="text-sm font-bold text-text-primary">Menú</span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-text-hint hover:bg-surface-variant transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col">
                {navContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
