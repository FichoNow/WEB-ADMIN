'use client'

import { useState, useTransition, useEffect } from 'react'
import { register } from './actions/register'

interface Props {
  onClose: () => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL = {
  company_name: '',
  company_cif_nif: '',
  company_email: '',
  company_address_line: '',
  company_city: '',
  company_postal_code: '',
  user_name: '',
  user_email: '',
  user_password: '',
  user_password_confirm: '',
}

type FieldKey = keyof typeof INITIAL

function validate(v: typeof INITIAL): Partial<Record<FieldKey, string>> {
  const e: Partial<Record<FieldKey, string>> = {}
  if (!v.company_name.trim())                     e.company_name         = 'Obligatorio'
  else if (v.company_name.length > 150)           e.company_name         = 'Máximo 150 caracteres'
  if (!v.company_cif_nif.trim())                  e.company_cif_nif      = 'Obligatorio'
  else if (v.company_cif_nif.length > 20)         e.company_cif_nif      = 'Máximo 20 caracteres'
  if (!v.company_email.trim())                    e.company_email        = 'Obligatorio'
  else if (!EMAIL_RE.test(v.company_email))       e.company_email        = 'Email inválido'
  if (!v.company_address_line.trim())             e.company_address_line = 'Obligatorio'
  if (!v.company_city.trim())                     e.company_city         = 'Obligatorio'
  if (!v.company_postal_code.trim())              e.company_postal_code  = 'Obligatorio'
  else if (v.company_postal_code.length > 10)     e.company_postal_code  = 'Máximo 10 caracteres'
  if (!v.user_name.trim())                        e.user_name            = 'Obligatorio'
  if (!v.user_email.trim())                       e.user_email           = 'Obligatorio'
  else if (!EMAIL_RE.test(v.user_email))          e.user_email           = 'Email inválido'
  if (!v.user_password)                                   e.user_password         = 'Obligatorio'
  else if (v.user_password.length < 8)                   e.user_password         = 'Mínimo 8 caracteres'
  if (!v.user_password_confirm)                          e.user_password_confirm = 'Obligatorio'
  else if (v.user_password_confirm !== v.user_password)  e.user_password_confirm = 'Las contraseñas no coinciden'
  return e
}

export default function RegisterModal({ onClose }: Props) {
  const [values, setValues] = useState(INITIAL)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [onClose])

  const set = (key: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(v => ({ ...v, [key]: e.target.value }))
    if (fieldErrors[key]) setFieldErrors(fe => ({ ...fe, [key]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate(values)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setGlobalError(null)

    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => formData.set(k, v))

    startTransition(async () => {
      const result = await register(undefined, formData)
      if (!result) return
      if ('success' in result) {
        setSuccess(true)
      } else if ('fieldError' in result) {
        setFieldErrors({ [result.fieldError.field]: result.fieldError.message })
      } else if ('error' in result) {
        setGlobalError(result.error)
      }
    })
  }

  const inputCls = (key: FieldKey) =>
    `w-full rounded-xl px-4 py-3.5 text-sm bg-bg border text-text-primary placeholder:text-text-hint outline-none transition-colors focus:ring-1 ${
      fieldErrors[key]
        ? 'border-error focus:border-error focus:ring-error/30'
        : 'border-input-stroke focus:border-primary focus:ring-primary/30'
    }`

  const field = (id: FieldKey, label: string, placeholder: string, type = 'text', colSpan = false) => (
    <div className={`flex flex-col gap-1.5${colSpan ? ' md:col-span-2' : ''}`}>
      <label htmlFor={id} className="text-sm font-medium text-text-secondary">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={values[id]}
        onChange={set(id)}
        className={inputCls(id)}
      />
      {fieldErrors[id] && <p className="text-xs text-error">{fieldErrors[id]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-surface rounded-2xl border border-divider shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-divider shrink-0 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-light tracking-tight text-text-primary">Crea tu empresa</h2>
            <p className="text-xs font-light tracking-widest text-text-secondary uppercase mt-1">
              Registro de empresa y administrador
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-hint hover:text-text-primary transition-colors p-2 rounded-full hover:bg-surface-variant"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {success ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
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
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
              {globalError && (
                <div className="flex items-center gap-3 text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-4">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{globalError}</p>
                </div>
              )}

              {/* Sección empresa */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 border-b border-divider pb-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Datos de la empresa</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {field('company_name',         'Nombre de la empresa', 'Mi Empresa S.L.',      'text',     true)}
                  {field('company_cif_nif',      'CIF / NIF',            'B12345678')}
                  {field('company_email',        'Email de la empresa',  'empresa@ejemplo.com',  'email')}
                  {field('company_address_line', 'Dirección',            'Calle Ejemplo, 123',   'text',     true)}
                  {field('company_city',         'Ciudad',               'Barcelona')}
                  {field('company_postal_code',  'Código postal',        '08001')}
                </div>
              </div>

              {/* Sección administrador */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3 border-b border-divider pb-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Datos del administrador</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {field('user_name',     'Nombre completo', 'Juan García',        'text',     true)}
                  {field('user_email',            'Email',                    'admin@ejemplo.com', 'email')}
                  {field('user_password',        'Contraseña',               'Mín. 8 caracteres', 'password')}
                  {field('user_password_confirm','Confirmar contraseña',      'Repite tu contraseña', 'password')}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2 pb-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl py-4 text-base font-medium bg-primary text-on-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creando empresa...
                    </>
                  ) : 'Finalizar y crear empresa'}
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
