import type { ReactNode } from 'react'

interface Props {
  children?: ReactNode
  fullWidth?: boolean
}

export default function Navbar({ children, fullWidth = false }: Props) {
  return (
    <nav className="border-b border-divider bg-bg/95 backdrop-blur-sm sticky top-0 z-50 px-6">
      <div className={`w-full ${fullWidth ? 'max-w-none' : 'max-w-7xl mx-auto'} h-16 flex items-center justify-between`}>
        <span className="text-lg font-semibold tracking-tight text-text-primary">
          Ficho<span className="text-primary">Now</span>
        </span>
        {children}
      </div>
    </nav>
  )
}
