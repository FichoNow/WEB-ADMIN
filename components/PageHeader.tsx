import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-6 min-h-[72px]">
        <div className="flex flex-col gap-1.5 flex-1">
          <h1 className="text-3xl font-light tracking-tight text-text-primary leading-none">{title}</h1>
          {description && (
            <p className="text-sm text-text-hint max-w-2xl font-medium leading-relaxed">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0 pt-1">
            {actions}
          </div>
        )}
      </div>
      <div className="h-px bg-divider/60" />
    </div>
  )
}
