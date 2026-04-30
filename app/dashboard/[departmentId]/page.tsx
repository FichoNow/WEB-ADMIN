'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Users, Folder, Calendar, Clock, BarChart3, ChevronRight } from 'lucide-react'

const MODULES = [
  {
    key: 'employees',
    title: 'Empleados',
    description: 'Gestiona la plantilla, altas y bajas del equipo.',
    icon: <Users className="w-5 h-5" />,
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-blue-500',
  },
  {
    key: 'projects',
    title: 'Proyectos',
    description: 'Administra proyectos y la imputación de horas.',
    icon: <Folder className="w-5 h-5" />,
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    key: 'requests',
    title: 'Solicitudes',
    description: 'Aprueba vacaciones y ausencias del personal.',
    icon: <Calendar className="w-5 h-5" />,
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-500',
  },
  {
    key: 'horarios',
    title: 'Horarios',
    description: 'Configura horarios y turnos de trabajo.',
    icon: <Clock className="w-5 h-5" />,
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
  {
    key: 'statistics',
    title: 'Estadísticas',
    description: 'Analiza datos y métricas de rendimiento del equipo.',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-rose-500/20 to-red-500/20',
    iconColor: 'text-rose-500',
  },
]

import { use } from 'react'

export default function DepartmentPage({ params }: { params: Promise<{ departmentId: string }> }) {
  const { departmentId } = use(params);

  return (
    <div className="px-10 py-12 flex flex-col gap-12 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <header className="relative flex flex-col gap-2">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-light tracking-tight text-text-primary"
        >
          ¡Bienvenido de nuevo!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary max-w-lg font-medium"
        >
          Selecciona un módulo para gestionar tu departamento y mantente al día con el rendimiento de tu equipo.
        </motion.p>

        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -z-10" />
      </header>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((mod, i) => (
          <motion.div
            key={mod.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * (i + 1) }}
          >
            <Link href={`/dashboard/${departmentId}/${mod.key}`} className="block h-full">
              <div className="relative flex flex-col p-8 rounded-[2rem] bg-surface border border-divider/50 hover:border-primary/20 hover:bg-surface-variant/40 transition-all duration-300 cursor-pointer h-full hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] overflow-hidden group">
                
                {/* Left side highlight border */}
                <div className={`absolute left-0 top-0 bottom-0 w-0 group-hover:w-1.5 transition-all duration-300 ${mod.iconColor.replace('text-', 'bg-')} shadow-[0_0_20px_rgba(0,0,0,0.1)]`} />

                <div className="flex items-center gap-4 mb-4">
                  <div className={`transition-all duration-300 group-hover:scale-125 ${mod.iconColor}`}>
                    {mod.icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed opacity-80 font-medium">
                  {mod.description}
                </p>

                <div className="mt-auto pt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                  Acceder
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

