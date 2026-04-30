'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { updateDepartmentAction } from '@/app/actions/superadmin/department'
import { departmentSchema, type DepartmentFormValues } from '@/app/types/superadmin/schemas/department-schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  params: Promise<{ departmentId: string }>
}

export default function DepartmentSettingsPage({ params }: Props) {
  const { departmentId } = use(params)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: '' },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: DepartmentFormValues) => {
    const formData = new FormData()
    formData.set('name', values.name)

    startTransition(async () => {
      const result = await updateDepartmentAction(Number(departmentId), undefined, formData)
      if (result && 'error' in result) {
        form.setError('root', { message: result.error })
        return
      }
      setSuccess(true)
      router.refresh()
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-8 py-12 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
          <Settings2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Ajustes del departamento</h1>
          <p className="text-sm text-text-secondary mt-0.5">Configura las opciones de este departamento</p>
        </div>
      </div>

      <Card className="bg-surface/60 border-divider/50 rounded-2xl">
        <CardHeader className="p-6 border-b border-divider/20">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-text-hint">Nombre</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            Cambia el nombre visible del departamento
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {success && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Nombre actualizado correctamente
            </div>
          )}
          {globalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nuevo nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Tecnología"
                        className="bg-surface border-divider/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className="px-8">
                  {isPending ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
