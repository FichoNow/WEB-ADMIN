import Link from 'next/link'

interface Props {
  searchParams: Promise<{ reason?: string }>
}

const REASON_MESSAGES: Record<string, { title: string; description: string }> = {
  'session-expired': {
    title: 'Sesión caducada',
    description: 'Tu sesión ha expirado. Inicia sesión de nuevo para continuar.',
  },
  'refresh-failed': {
    title: 'No se pudo renovar la sesión',
    description: 'La API rechazó la renovación de credenciales. Inicia sesión de nuevo.',
  },
  'cookie': {
    title: 'Sesión incompleta',
    description: 'No se pudieron actualizar las credenciales. Inicia sesión de nuevo.',
  },
}

const DEFAULT_MESSAGE = {
  title: 'Algo ha ido mal',
  description: 'Ha ocurrido un error inesperado. Inténtalo de nuevo o vuelve al inicio.',
}

export default async function ErrorPage({ searchParams }: Props) {
  const { reason } = await searchParams
  const message = (reason && REASON_MESSAGES[reason]) ?? DEFAULT_MESSAGE

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div className="text-center flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-text-primary">{message.title}</h1>
        <p className="text-sm text-text-secondary max-w-sm">{message.description}</p>
      </div>

      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
