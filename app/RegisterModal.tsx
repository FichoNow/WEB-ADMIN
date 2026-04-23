'use client'

import { useActionState, useEffect } from 'react'
import { register } from './actions/register'
import type { RegisterState } from './types/auth/register-state'

interface Props {
  onClose: () => void
}

export default function RegisterModal({ onClose }: Props) {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    register,
    undefined,
  )
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel (Centered Modal) */}
      <div className="relative z-10 w-full max-w-2xl bg-surface rounded-2xl border border-divider shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-divider bg-surface/50 backdrop-blur-md shrink-0 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-light tracking-tight text-text-primary">
              Crea tu empresa
            </h2>
            <p className="text-xs font-light tracking-widest text-text-secondary uppercase mt-1">
              Registro de empresa y administrador
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-hint hover:text-text-primary transition-colors p-2 rounded-full hover:bg-surface-variant bg-surface-variant/50"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col">
          {state && 'success' in state ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl text-text-primary font-medium text-center">¡Empresa creada con éxito!</h3>
              <p className="text-base text-text-secondary text-center max-w-md">
                Ya puedes iniciar sesión con tus credenciales de administrador en el panel.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-3 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark transition-colors"
              >
                Ir a iniciar sesión
              </button>
            </div>
          ) : (
            <form action={action} noValidate className="flex flex-col gap-8 flex-1">
              {state && 'error' in state && (
                <div className="flex items-center gap-3 text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-4">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p>{state.error}</p>
                </div>
              )}

              {/* Sección empresa */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-divider pb-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Datos de la empresa
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="company_name" className="text-sm font-medium text-text-secondary">
                      Nombre de la empresa
                    </label>
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      placeholder="Mi Empresa S.L."
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="company_cif_nif" className="text-sm font-medium text-text-secondary">
                      CIF / NIF
                    </label>
                    <input
                      id="company_cif_nif"
                      name="company_cif_nif"
                      type="text"
                      placeholder="B12345678"
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company_email" className="text-sm font-medium text-text-secondary">
                      Email de la empresa
                    </label>
                    <input
                      id="company_email"
                      name="company_email"
                      type="email"
                      placeholder="empresa@ejemplo.com"
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="company_address_line" className="text-sm font-medium text-text-secondary">
                      Dirección
                    </label>
                    <input
                      id="company_address_line"
                      name="company_address_line"
                      type="text"
                      placeholder="Calle Ejemplo, 123"
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="company_city" className="text-sm font-medium text-text-secondary">
                      Ciudad
                    </label>
                    <input
                      id="company_city"
                      name="company_city"
                      type="text"
                      placeholder="Barcelona"
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="company_postal_code" className="text-sm font-medium text-text-secondary">
                      Código postal
                    </label>
                    <input
                      id="company_postal_code"
                      name="company_postal_code"
                      type="text"
                      placeholder="08001"
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Sección administrador */}
              <div className="flex flex-col gap-6 mt-4">
                <div className="flex items-center gap-3 border-b border-divider pb-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Datos del administrador
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="user_name" className="text-sm font-medium text-text-secondary">
                      Nombre completo
                    </label>
                    <input
                      id="user_name"
                      name="user_name"
                      type="text"
                      placeholder="Juan García"
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="user_email" className="text-sm font-medium text-text-secondary">
                      Email
                    </label>
                    <input
                      id="user_email"
                      name="user_email"
                      type="email"
                      placeholder="admin@ejemplo.com"
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="user_password" className="text-sm font-medium text-text-secondary">
                      Contraseña
                    </label>
                    <input
                      id="user_password"
                      name="user_password"
                      type="password"
                      placeholder="Mín. 8 caracteres"
                      required
                      className="w-full rounded-xl px-4 py-3.5 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Footer / Submit */}
              <div className="mt-auto pt-8 pb-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-xl py-4 text-base font-medium bg-primary text-on-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {pending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando empresa...
                    </>
                  ) : (
                    'Finalizar y crear empresa'
                  )}
                </button>
                <p className="text-center text-xs text-text-hint mt-4">
                  Al crear la empresa, aceptas nuestros términos de servicio y política de privacidad.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
