'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '@/app/types/auth/schemas/login-schema'
import { login } from '@/app/actions/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Lock, Mail, LogIn } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function LoginForm({ onClose }: Props) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: LoginFormValues) => {
    const formData = new FormData()
    formData.set('email', values.email)
    formData.set('password', values.password)

    startTransition(async () => {
      const result = await login(undefined, formData)
      if (result?.error) {
        form.setError('root', { message: result.error })
      }
    })
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[440px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 sm:px-10 pt-8 pb-6 border-b border-divider/50">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <DialogTitle className="text-2xl font-bold tracking-tight text-text-primary">
                ¡Bienvenido!
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary">
                Inicia sesión para gestionar tu empresa.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="px-6 sm:px-10 pt-6 pb-8 flex flex-col gap-8">
            {globalError && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{globalError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Mail className="w-4 h-4 opacity-50" /> Email corporativo</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tucorreo@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Lock className="w-4 h-4 opacity-50" /> Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2 flex flex-col gap-4">
              <Button 
                type="submit" 
                disabled={isPending} 
                className="w-full h-12 text-base font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? 'Validando credenciales...' : 'Entrar en el panel'}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} className="text-xs text-text-hint hover:text-text-primary">
                ¿Has olvidado tu contraseña?
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
