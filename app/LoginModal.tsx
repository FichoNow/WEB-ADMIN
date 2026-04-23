'use client'

import { useActionState, useEffect } from 'react'
import { login } from './actions/auth'
import type { LoginState } from './types/auth/login-state'

interface Props {
  onClose: () => void
}

export default function LoginModal({ onClose }: Props) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  )
  // Cerrar con Escape
  useEffect(() => {
    // Bloquear scroll del fondo
    document.body.style.overflow = 'hidden'

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    
    return () => {
      // Restaurar scroll al cerrar
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-surface rounded-2xl border border-divider shadow-2xl px-8 py-10 flex flex-col gap-8">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-hint hover:text-text-secondary transition-colors text-lg leading-none"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Brand */}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-3xl font-light tracking-tight text-text-primary">
            Ficho<span className="text-primary">Now</span>
          </h2>
          <p className="text-xs font-light tracking-widest text-text-secondary uppercase">
            Panel de administración
          </p>
        </div>

        {/* Form */}
        <form action={action} noValidate className="flex flex-col gap-4">
          {state?.error && (
            <p className="text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-3">
              {state.error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-email" className="text-sm text-text-secondary">
              Email
            </label>
            <input
              id="modal-email"
              name="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
              className="w-full rounded-xl px-4 py-3 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-password" className="text-sm text-text-secondary">
              Contraseña
            </label>
            <input
              id="modal-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-xl px-4 py-3 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-xl py-3 text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
