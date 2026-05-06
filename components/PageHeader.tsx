'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Menu } from 'lucide-react'
import { useSidebar } from '@/app/[locale]/dashboard/[departmentId]/SidebarContext'

interface Props {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: Props) {
  const { toggle } = useSidebar()
  const t = useTranslations('common')

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Title row */}
      <div className="flex items-start gap-3">
        <button
          onClick={toggle}
          className="lg:hidden shrink-0 mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-surface-variant hover:text-text-primary transition-colors border border-divider/50"
          aria-label={t('openMenu')}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-tight text-text-primary leading-tight">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-text-hint font-medium leading-relaxed mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Actions — full width row on mobile, inline on desktop */}
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions}
        </div>
      )}

      <div className="h-px bg-divider/60" />
    </div>
  )
}
