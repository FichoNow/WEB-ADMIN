'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { updateDepartmentAction } from '@/app/actions/superadmin/department/update-department'
import { departmentSchema, type DepartmentFormValues } from '@/app/types/superadmin/schemas/department-schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2 } from 'lucide-react'

interface Props {
  departmentId: number
  initialName: string
}

export default function DepartmentSettingsForm({ departmentId, initialName }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: initialName },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: DepartmentFormValues) => {
    setSuccess(false)
    const formData = new FormData()
    formData.set('name', values.name)

    startTransition(async () => {
      const result = await updateDepartmentAction(departmentId, undefined, formData)
      if (result && 'error' in result) {
        form.setError('root', { message: result.error })
        return
      }
      setSuccess(true)
      router.refresh()
    })
  }

  return (
    <>
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 mb-8 rounded-2xl bg-success/10 border border-success/20 text-success text-sm font-bold shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          Los cambios se han guardado correctamente
        </motion.div>
      )}
      {globalError && (
        <Alert variant="destructive" className="mb-8 rounded-2xl shadow-sm">
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-divider/50 pb-3">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-hint">Datos Generales</h3>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-text-secondary ml-1">Nombre del departamento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Recursos Humanos"
                      className="h-14 bg-surface-variant/30 border-divider/50 rounded-2xl px-5 text-base focus-visible:bg-surface focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-inner"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-[11px] text-text-hint mt-2 ml-1">Este nombre será visible para todos los empleados del departamento.</p>
                </FormItem>
              )}
            />
          </div>

          <div className="pt-8 border-t border-divider/50 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full sm:w-auto px-10 text-sm font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? 'Procesando cambios...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
