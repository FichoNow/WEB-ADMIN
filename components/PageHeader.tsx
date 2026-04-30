import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: Props) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-light tracking-tight text-text-primary">{title}</h1>
          {description && (
            <p className="text-sm text-text-hint max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="h-px bg-divider" />
    </>
  )
}
