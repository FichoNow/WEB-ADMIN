'use client'

import { useTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createBulkEmployeesAction } from '@/app/actions/admin/employees/create-employees'
import { createEmployeesSchema, type CreateEmployeesFormValues } from '@/app/types/admin/schemas/employee-schema'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, Users, Trash2, PlusCircle } from 'lucide-react'

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {globalError && (
          <Alert variant="destructive">
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        {fields.length > 1 && groups.length > 0 && (
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-surface-variant/30 border border-divider/50">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Acción masiva</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-hint">Asignar grupo a todos:</span>
              <div className="flex-1">
                <Select onValueChange={(v: string | null) => applyGroupToAll(v === NO_GROUP ? '' : (v ?? ''))}>
                  <SelectTrigger className="w-full bg-surface h-10 border-divider/50 rounded-xl">
                    <SelectValue placeholder="Elegir grupo..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-divider">
                    <SelectItem value={NO_GROUP}>Sin grupo</SelectItem>
                    {groups.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-10">
          {fields.map((field, i) => (
            <div key={field.id} className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-divider/50 pb-2">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Empleado #{i + 1}
                  </h3>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(i)}
                    className="h-8 w-8 text-error hover:bg-error/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FormField control={form.control} name={`rows.${i}.name`} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl><Input placeholder="Ej. Juan Pérez" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${i}.email`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="email@ejemplo.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${i}.password`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl><Input type="password" placeholder="Mín. 8 caracteres" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${i}.role`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol de acceso</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                          <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-divider">
                        <SelectItem value="USER">Usuario (Fichaje)</SelectItem>
                        <SelectItem value="ADMINISTRATOR">Administrador (Gestión)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${i}.group_id`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo asignado</FormLabel>
                    <Select
                      value={field.value === '' || field.value === undefined ? NO_GROUP : field.value}
                      onValueChange={(v) => field.onChange(v === NO_GROUP ? '' : v)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                          <SelectValue placeholder="Sin grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-divider">
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
          variant="outline"
          onClick={() => append({ name: '', email: '', password: '', role: 'USER', group_id: '' })}
          className="self-center gap-2 rounded-xl h-10 border-divider/50 hover:bg-surface-variant"
        >
          <PlusCircle className="w-4 h-4 text-primary" />
          Añadir otro empleado
        </Button>

        <div className="pt-6 border-t border-divider/50 flex flex-col gap-3">
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full h-12 text-base font-bold rounded-xl"
          >
            {isPending ? 'Procesando...' : fields.length === 1 ? 'Crear empleado' : `Crear ${fields.length} empleados`}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="border-divider/50 hover:bg-surface-variant text-text-hint hover:text-text-primary rounded-xl h-12">
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
