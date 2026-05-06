'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { deleteEmployeeAction } from '@/app/actions/admin/employees/delete-employee'
import { updateEmployeeAction } from '@/app/actions/admin/employees/update-employee'
import { editEmployeeSchema, type EditEmployeeFormValues } from '@/app/types/admin/schemas/employee-schema'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Trash2, ShieldCheck, Mail, Lock } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Props {
  employee: EmployeeListItem
  departmentId: number
  groups: GroupResponse[]
  onClose: () => void
}

const NO_GROUP = '__none__'

export default function EditEmployeeForm({ employee, departmentId, groups, onClose }: Props) {
  const t = useTranslations('employees.editForm')
  const ROLE_LABELS: Record<string, string> = {
    USER: t('roleUser'),
    ADMINISTRATOR: t('roleAdmin'),
  }
  const STATUS_LABELS: Record<string, string> = {
    'true': t('statusActive'),
    'false': t('statusInactive'),
  }
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
        toast.error(result.error)
        return
      }
      if (result && 'success' in result) toast.success(result.success)
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
        toast.error(result.error)
        return
      }
      if (result && 'success' in result) toast.success(result.success)
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

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-divider/50 pb-2">
            <User className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('profileSection')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('fullName')}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 opacity-50" /> {t('email')}</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-divider/50 pb-2">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('accessSection')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 opacity-50" /> {t('newPassword')}</FormLabel>
                <FormControl><Input type="password" placeholder={t('newPasswordPh')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('role')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                      <span className="truncate text-left">{ROLE_LABELS[field.value] ?? t('rolePh')}</span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-divider">
                    <SelectItem value="USER">{t('roleUser')}</SelectItem>
                    <SelectItem value="ADMINISTRATOR">{t('roleAdmin')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('status')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                      <span className={`truncate text-left ${field.value === 'true' ? 'text-success' : 'text-error'}`}>
                        {STATUS_LABELS[field.value] ?? t('statusPh')}
                      </span>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-divider">
                    <SelectItem value="true" className="text-success">{t('statusActive')}</SelectItem>
                    <SelectItem value="false" className="text-error">{t('statusInactive')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="group_id" render={({ field }) => {
              const currentValue = field.value === '' || field.value === undefined ? NO_GROUP : field.value
              const groupLabel = currentValue === NO_GROUP
                ? t('noGroup')
                : (groups.find((g) => String(g.id) === currentValue)?.name ?? t('noGroup'))
              return (
                <FormItem>
                  <FormLabel>{t('group')}</FormLabel>
                  <Select
                    value={currentValue}
                    onValueChange={(v) => field.onChange(v === NO_GROUP ? '' : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                        <span className="truncate text-left">{groupLabel}</span>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-divider">
                      <SelectItem value={NO_GROUP}>{t('noGroup')}</SelectItem>
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )
            }} />
          </div>
        </div>

        <div className="pt-6 border-t border-divider/50 flex flex-col gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-base font-bold rounded-xl"
          >
            {isPending ? t('saving') : t('save')}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="flex-1 border-divider/50 hover:bg-surface-variant text-text-hint hover:text-text-primary rounded-xl h-11">
              {t('cancel')}
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
              {t('delete')}
            </Button>
          </div>
        </div>

        <ConfirmDialog
          open={confirmDelete}
          title={t('confirmTitle')}
          description={
            <>
              {t('confirmDescPart1')} <span className="font-bold text-text-primary">"{employee.name}"</span>{t('confirmDescPart2')}
            </>
          }
          confirmLabel={t('confirmLabel')}
          pending={isPending}
          errorMessage={deleteError}
          onConfirm={handleConfirmDelete}
          onClose={() => { setDeleteError(null); setConfirmDelete(false) }}
        />
      </form>
    </Form>
  )
}
