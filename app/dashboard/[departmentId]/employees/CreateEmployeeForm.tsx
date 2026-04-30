'use client'

import { useTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createBulkEmployeesAction } from '@/app/actions/admin/employees'
import { createEmployeesSchema, type CreateEmployeesFormValues } from '@/app/types/admin/schemas/employee-schema'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  departmentId: number
  onClose: () => void
}

export default function CreateEmployeeForm({ departmentId, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<CreateEmployeesFormValues>({
    resolver: zodResolver(createEmployeesSchema),
    defaultValues: { rows: [{ name: '', email: '', password: '', role: 'USER' }] },
  })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'rows' })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: CreateEmployeesFormValues) => {
    startTransition(async () => {
      const result = await createBulkEmployeesAction(departmentId, values.rows)
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

        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
          {fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-2 gap-2 p-3 bg-bg rounded-xl border border-divider">
              <FormField control={form.control} name={`rows.${i}.name`} render={({ field }) => (
                <FormItem>
                  <FormControl><Input placeholder="Nombre" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name={`rows.${i}.email`} render={({ field }) => (
                <FormItem>
                  <FormControl><Input type="email" placeholder="Email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name={`rows.${i}.password`} render={({ field }) => (
                <FormItem>
                  <FormControl><Input type="password" placeholder="Contraseña" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-2">
                <FormField control={form.control} name={`rows.${i}.role`} render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-surface">
                          <SelectValue placeholder="Rol">
                            {field.value === 'ADMINISTRATOR' ? 'Admin' : field.value === 'USER' ? 'Usuario' : field.value}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">Usuario</SelectItem>
                        <SelectItem value="ADMINISTRATOR">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                {fields.length > 1 && (
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(i)} className="shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => append({ name: '', email: '', password: '', role: 'USER' })}
          className="self-start gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir otro
        </Button>

        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? 'Creando...' : fields.length === 1 ? 'Crear empleado' : `Crear ${fields.length} empleados`}
        </Button>
      </form>
    </Form>
  )
}
