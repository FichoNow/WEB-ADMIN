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
import PageHeader from '@/components/PageHeader'
import { motion } from 'framer-motion'

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
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Configuración"
        description="Administra los parámetros generales y la identidad de este departamento."
      />

      <div className="max-w-3xl">
        <Card className="bg-surface border border-divider/50 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="px-8 sm:px-10 py-8 border-b border-divider/50 bg-surface-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                <Settings2 className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-text-primary">Perfil del Departamento</CardTitle>
                <CardDescription className="text-sm text-text-secondary mt-1">Información pública y de identificación.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 sm:px-10 py-10">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
