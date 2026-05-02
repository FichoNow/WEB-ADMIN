'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createDepartmentAction } from '@/app/actions/superadmin/department/create-department'
import { departmentSchema, type DepartmentFormValues } from '@/app/types/superadmin/schemas/department-schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function CreateDepartmentForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: '' },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: DepartmentFormValues) => {
    const formData = new FormData()
    formData.set('name', values.name)

    startTransition(async () => {
      const result = await createDepartmentAction(undefined, formData)
      if (result && 'error' in result) {
        form.setError('root', { message: result.error })
        return
      }
      router.refresh()
      onClose()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {globalError && (
          <Alert variant="destructive">
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del departamento</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Tecnología" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creando...' : 'Crear departamento'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default function CreateDepartmentButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2 rounded-xl border-divider text-text-secondary hover:text-text-primary"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nuevo departamento
      </Button>

      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent className="sm:max-w-sm bg-surface border-divider">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-text-primary">
              Crear departamento
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary">
              El nuevo departamento quedará activo inmediatamente.
            </DialogDescription>
          </DialogHeader>
          <CreateDepartmentForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
