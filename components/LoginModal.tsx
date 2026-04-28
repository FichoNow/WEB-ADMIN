'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import type { LoginState } from '@/app/types/auth/login-state'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Props {
  onClose: () => void
}

export default function LoginModal({ onClose }: Props) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  )

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight">
            Iniciar sesión
          </DialogTitle>
          <DialogDescription className="text-text-secondary text-sm">
            Accede a tu panel de administración.
          </DialogDescription>
        </DialogHeader>

        <form action={action} noValidate className="flex flex-col gap-4 mt-4">
          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="modal-email">Email</Label>
            <Input
              id="modal-email"
              name="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="modal-password">Contraseña</Label>
            <Input
              id="modal-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
