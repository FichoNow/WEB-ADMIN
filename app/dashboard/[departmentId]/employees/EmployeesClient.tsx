'use client'

import { useTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createBulkEmployeesAction, updateEmployeeAction } from '@/app/actions/admin/employees'
import {
  createEmployeesSchema, editEmployeeSchema,
  type CreateEmployeesFormValues, type EditEmployeeFormValues,
} from '@/app/types/admin/schemas/employee-schema'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant={role === 'ADMINISTRATOR' ? 'default' : 'secondary'} className="text-[10px]">
      {role === 'ADMINISTRATOR' ? 'Admin' : 'Usuario'}
    </Badge>
  )
}

function CreateModal({ departmentId, onClose }: { departmentId: number; onClose: () => void }) {
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
                          <SelectValue placeholder="Rol" />
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

function EditModal({ employee, departmentId, onClose }: { employee: EmployeeListItem; departmentId: number; onClose: () => void }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name:      employee.name,
      email:     employee.email,
      password:  '',
      role:      employee.role,
      is_active: String(employee.is_active) as 'true' | 'false',
    },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: EditEmployeeFormValues) => {
    startTransition(async () => {
      const result = await updateEmployeeAction(departmentId, employee.id, values)
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

        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Nombre</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña <span className="text-text-hint">(opcional)</span></FormLabel>
              <FormControl><Input type="password" placeholder="Mín. 8 caracteres" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full bg-surface">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="ADMINISTRATOR">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="is_active" render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full bg-surface">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>
    </Form>
  )
}

export default function EmployeesClient({ employees, departmentId }: { employees: EmployeeListItem[]; departmentId: number }) {
  const [showCreate, setShowCreate] = useState(false)
  const [editEmployee, setEditEmployee] = useState<EmployeeListItem | null>(null)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest text-primary uppercase">Empleados</p>
          <h1 className="text-3xl font-light tracking-tight text-text-primary">Gestión de empleados</h1>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-xl">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo empleado
        </Button>
      </div>

      <div className="h-px bg-divider" />

      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface/30 border border-dashed border-divider rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-surface border border-divider flex items-center justify-center text-text-hint mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">Sin empleados</h3>
          <p className="text-sm text-text-hint text-center max-w-sm mb-6">
            Aún no hay ningún empleado registrado en este departamento. Añade el primero para empezar a gestionar los fichajes.
          </p>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Añadir primer empleado
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface border border-divider hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center text-sm font-medium text-text-secondary shrink-0">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                    {emp.name}
                    <RoleBadge role={emp.role} />
                    {!emp.is_active && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-error/20 text-error">Inactivo</span>
                    )}
                  </p>
                  <p className="text-xs text-text-hint">{emp.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditEmployee(emp)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Dialog open={true} onOpenChange={(open) => !open && setShowCreate(false)}>
          <DialogContent className="sm:max-w-[600px] bg-surface border-divider">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-text-primary">Nuevo empleado</DialogTitle>
              <DialogDescription className="hidden">Crear empleados</DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
              <CreateModal departmentId={departmentId} onClose={() => setShowCreate(false)} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editEmployee && (
        <Dialog open={true} onOpenChange={(open) => !open && setEditEmployee(null)}>
          <DialogContent className="sm:max-w-[600px] bg-surface border-divider">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-text-primary">Editar · {editEmployee.name}</DialogTitle>
              <DialogDescription className="hidden">Editar empleado</DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
              <EditModal employee={editEmployee} departmentId={departmentId} onClose={() => setEditEmployee(null)} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
