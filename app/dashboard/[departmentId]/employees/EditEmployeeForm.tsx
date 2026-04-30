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
import { User, Settings, Trash2, ShieldCheck, Mail, Lock } from 'lucide-react'
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {globalError && (
          <Alert variant="destructive">
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        {/* Perfil Section */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-divider/50 pb-2">
            <User className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Información de Perfil
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Nombre completo</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 opacity-50" /> Email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Acceso Section */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-divider/50 pb-2">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Acceso y Permisos
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 opacity-50" /> Nueva contraseña</FormLabel>
                <FormControl><Input type="password" placeholder="Solo si deseas cambiarla" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Rol en la empresa</FormLabel>
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
            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem>
                <FormLabel>Estado de la cuenta</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-divider">
                    <SelectItem value="true" className="text-success">Cuenta Activa</SelectItem>
                    <SelectItem value="false" className="text-error">Cuenta Inactiva</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="group_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo de trabajo</FormLabel>
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

        {/* Footer Actions */}
        <div className="pt-6 border-t border-divider/50 flex flex-col gap-3">
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full h-12 text-base font-bold rounded-xl"
          >
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="flex-1 border-divider/50 hover:bg-surface-variant text-text-hint hover:text-text-primary rounded-xl h-11">
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteError(null)
                setConfirmDelete(true)
              }}
              disabled={isPending}
              className="rounded-xl border-error/50 text-error hover:bg-error/10 hover:border-error h-11 px-6"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        <Dialog open={confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(false)}>
          <DialogContent className="sm:max-w-[420px] bg-surface border-divider rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-text-primary">
                ¿Eliminar empleado?
              </DialogTitle>
              <DialogDescription className="text-sm text-text-secondary mt-2">
                Estás a punto de eliminar a <span className="font-bold text-text-primary">"{employee.name}"</span>. Esta acción borrará permanentemente sus fichajes, solicitudes y configuración.
              </DialogDescription>
            </DialogHeader>
            {deleteError && (
              <Alert variant="destructive">
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="w-full h-11 rounded-xl"
              >
                {isPending ? 'Eliminando...' : 'Sí, eliminar permanentemente'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmDelete(false)}
                disabled={isPending}
                className="w-full h-11 border-divider/50 hover:bg-surface-variant text-text-hint hover:text-text-primary rounded-xl"
              >
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}
