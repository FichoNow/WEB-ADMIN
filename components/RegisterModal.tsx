'use client'

import { useState, useTransition } from 'react'
import { register } from '@/app/actions/register'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Building2, User } from 'lucide-react'

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

  const field = (id: FieldKey, label: string, placeholder: string, type = 'text', colSpan = false) => (
    <div className={`flex flex-col gap-2${colSpan ? ' md:col-span-2' : ''}`}>
      <Label htmlFor={id} className={fieldErrors[id] ? 'text-destructive' : ''}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={values[id]}
        onChange={set(id)}
        className={fieldErrors[id] ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      {fieldErrors[id] && <p className="text-[0.8rem] text-destructive">{fieldErrors[id]}</p>}
    </div>
  )
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-2xl font-light tracking-tight">Crea tu empresa</DialogTitle>
          <DialogDescription className="text-xs font-light tracking-widest uppercase">
            Registro de empresa y administrador
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {success ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-medium text-center">¡Empresa creada con éxito!</h3>
              <p className="text-base text-muted-foreground text-center max-w-md">
                Ya puedes iniciar sesión con tus credenciales de administrador en el panel.
              </p>
              <Button onClick={onClose} className="mt-6 px-8">
                Ir a iniciar sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
              {globalError && (
                <Alert variant="destructive">
                  <AlertDescription>{globalError}</AlertDescription>
                </Alert>
              )}

              {/* Sección empresa */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b pb-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Datos de la empresa</h3>
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
                <div className="flex items-center gap-2 border-b pb-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Datos del administrador</h3>
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
                <Button type="submit" disabled={isPending} className="w-full py-6 text-base">
                  {isPending ? 'Creando empresa...' : 'Finalizar y crear empresa'}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Al crear la empresa, aceptas nuestros términos de servicio y política de privacidad.
                </p>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
