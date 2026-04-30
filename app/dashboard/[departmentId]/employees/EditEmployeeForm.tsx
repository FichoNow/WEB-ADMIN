'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { deleteEmployeeAction, updateEmployeeAction } from '@/app/actions/admin/employees'
import { editEmployeeSchema, type EditEmployeeFormValues } from '@/app/types/admin/schemas/employee-schema'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  employee: EmployeeListItem
  departmentId: number
  groups: GroupResponse[]
  onClose: () => void
}

const NO_GROUP = '__none__'

export default function EditEmployeeForm({ employee, departmentId, groups, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const form = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      name:      employee.name,
      email:     employee.email,
      password:  '',
      role:      employee.role,
      is_active: String(employee.is_active) as 'true' | 'false',
      group_id:  employee.group_id ? String(employee.group_id) : '',
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

  const handleConfirmDelete = () => {
    setDeleteError(null)
    startTransition(async () => {
      const result = await deleteEmployeeAction(departmentId, employee.id)
      if (result && 'error' in result) {
        setDeleteError(result.error)
        return
      }
      setConfirmDelete(false)
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
                    <SelectValue placeholder="Rol">
                      {field.value === 'ADMINISTRATOR' ? 'Administrador' : field.value === 'USER' ? 'Usuario' : field.value}
                    </SelectValue>
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
                    <SelectValue placeholder="Estado">
                      {field.value === 'true' ? 'Activo' : field.value === 'false' ? 'Inactivo' : field.value}
                    </SelectValue>
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
          <FormField control={form.control} name="group_id" render={({ field }) => (
            <FormItem>
              <FormLabel>Grupo</FormLabel>
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

        <div className="flex items-center justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              setDeleteError(null)
              setConfirmDelete(true)
            }}
            disabled={isPending}
          >
            Eliminar
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </div>

        <Dialog open={confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(false)}>
          <DialogContent className="sm:max-w-[420px] bg-surface border-divider">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-text-primary">
                Eliminar empleado
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary">
                ¿Seguro que quieres eliminar a{' '}
                <span className="font-medium text-text-primary">"{employee.name}"</span>?
                <br />
                Se borrarán también todos sus fichajes, solicitudes y horarios. Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            {deleteError && (
              <Alert variant="destructive">
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmDelete(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isPending}
              >
                {isPending ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}
