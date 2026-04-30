'use client'

import { useTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createBulkEmployeesAction } from '@/app/actions/admin/employees'
import { createEmployeesSchema, type CreateEmployeesFormValues } from '@/app/types/admin/schemas/employee-schema'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  departmentId: number
  groups: GroupResponse[]
  onClose: () => void
}

const NO_GROUP = '__none__'

export default function CreateEmployeeForm({ departmentId, groups, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<CreateEmployeesFormValues>({
    resolver: zodResolver(createEmployeesSchema),
    defaultValues: {
      rows: [{ name: '', email: '', password: '', role: 'USER', group_id: '' }],
    },
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

  const applyGroupToAll = (groupId: string) => {
    fields.forEach((_, i) => form.setValue(`rows.${i}.group_id`, groupId))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {globalError && (
          <Alert variant="destructive">
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        {fields.length > 1 && groups.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg border border-divider">
            <span className="text-xs text-text-hint shrink-0">Aplicar grupo a todos:</span>
            <div className="flex-1">
              <Select onValueChange={(v: string | null) => applyGroupToAll(v === NO_GROUP ? '' : (v ?? ''))}>
                <SelectTrigger className="w-full bg-surface" size="sm">
                  <SelectValue placeholder="Elegir grupo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_GROUP}>Sin grupo</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
          {fields.map((field, i) => (
            <div key={field.id} className="flex flex-col gap-2 p-3 bg-bg rounded-xl border border-divider">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-hint">Empleado #{i + 1}</span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(i)}
                    className="text-error"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
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
                <FormField control={form.control} name={`rows.${i}.role`} render={({ field }) => (
                  <FormItem>
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
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${i}.group_id`} render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-xs text-text-hint">Grupo</FormLabel>
                    <Select
                      value={field.value === '' || field.value === undefined ? NO_GROUP : field.value}
                      onValueChange={(v) => field.onChange(v === NO_GROUP ? '' : v)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-surface">
                          <SelectValue placeholder="Sin grupo">
                            {!field.value || field.value === ''
                              ? 'Sin grupo'
                              : (groups.find((g) => String(g.id) === field.value)?.name ?? 'Sin grupo')}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NO_GROUP}>Sin grupo</SelectItem>
                        {groups.map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => append({ name: '', email: '', password: '', role: 'USER', group_id: '' })}
          className="self-start gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir otro
        </Button>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creando...' : fields.length === 1 ? 'Crear empleado' : `Crear ${fields.length} empleados`}
          </Button>
        </div>
      </form>
    </Form>
  )
}
