'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { addSuperadminAction } from '@/app/actions/superadmin/superadmin/add-superadmin'
import { addSuperadminSchema, type AddSuperadminFormValues } from '@/app/types/superadmin/schemas/superadmin-schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, CheckCircle2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddSuperadminForm({ open, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const form = useForm<AddSuperadminFormValues>({
    resolver: zodResolver(addSuperadminSchema),
    defaultValues: { name: '', email: '', password: '' },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: AddSuperadminFormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => formData.set(k, v))
    startTransition(async () => {
      const result = await addSuperadminAction({}, formData)
      if (result?.error) {
        form.setError('root', { message: result.error })
        return
      }
      setSuccess(true)
      router.refresh()
      setTimeout(() => { form.reset(); setSuccess(false); onClose() }, 1500)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setSuccess(false); onClose() } }}>
      <DialogContent className="bg-surface border-divider max-w-[calc(100vw-2rem)] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Añadir superadmin
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            El nuevo superadmin tendrá acceso total a la empresa y sus departamentos.
          </DialogDescription>
        </DialogHeader>
        {success && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Administrador creado. Deberá cambiar su contraseña al iniciar sesión.
          </div>
        )}
        {globalError && (
          <Alert variant="destructive"><AlertDescription>{globalError}</AlertDescription></Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nombre</FormLabel>
                <FormControl><Input placeholder="Nombre completo" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel>
                <FormControl><Input placeholder="admin@empresa.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Contraseña temporal</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Creando...' : 'Crear administrador'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
