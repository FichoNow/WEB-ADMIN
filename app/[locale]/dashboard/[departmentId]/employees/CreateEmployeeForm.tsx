'use client'

import { useState, useTransition } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { createBulkEmployeesAction } from '@/app/actions/admin/employees/create-employees'
import { createEmployeesSchema, type CreateEmployeesFormValues } from '@/app/types/admin/schemas/employee-schema'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
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

function BulkGroupSelect({ groups, onApply, chooseLabel, noGroupLabel }: { groups: GroupResponse[]; onApply: (id: string) => void; chooseLabel: string; noGroupLabel: string }) {
  const [value, setValue] = useState<string | null>(null)
  const label = value == null
    ? chooseLabel
    : value === NO_GROUP
      ? noGroupLabel
      : (groups.find((g) => String(g.id) === value)?.name ?? chooseLabel)
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(v: string | null) => {
        setValue(v)
        onApply(v === NO_GROUP ? '' : (v ?? ''))
      }}
    >
      <SelectTrigger className="w-full bg-surface h-10 border-divider/50 rounded-xl">
        <span className="truncate text-left">{label}</span>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-divider">
        <SelectItem value={NO_GROUP}>{noGroupLabel}</SelectItem>
        {groups.map((g) => (
          <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function CreateEmployeeForm({ departmentId, groups, onClose }: Props) {
  const t = useTranslations('employees.createForm')
  const ROLE_LABELS: Record<string, string> = {
    USER: t('roleUser'),
    ADMINISTRATOR: t('roleAdmin'),
  }
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
        toast.error(result.error)
        return
      }
      if (result && 'success' in result) toast.success(result.success)
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
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('bulkAction')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-hint">{t('assignGroupAll')}</span>
              <div className="flex-1">
                <BulkGroupSelect groups={groups} onApply={applyGroupToAll} chooseLabel={t('chooseGroup')} noGroupLabel={t('noGroup')} />
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
                    {t('employee')} #{i + 1}
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
                    <FormLabel>{t('fullName')}</FormLabel>
                    <FormControl><Input placeholder={t('fullNamePh')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${i}.email`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl><Input type="email" placeholder={t('emailPh')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${i}.password`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl><Input type="password" placeholder={t('passwordPh')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${i}.role`} render={({ field }) => (
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
                <FormField control={form.control} name={`rows.${i}.group_id`} render={({ field }) => {
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
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: '', email: '', password: '', role: 'USER', group_id: '' })}
          className="self-center gap-2 rounded-xl h-10 border-divider/50 hover:bg-surface-variant"
        >
          <PlusCircle className="w-4 h-4 text-primary" />
          {t('addAnother')}
        </Button>

        <div className="pt-6 border-t border-divider/50 flex flex-col gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-base font-bold rounded-xl"
          >
            {isPending ? t('processing') : fields.length === 1 ? t('createOne') : t('createMany', { count: fields.length })}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="border-divider/50 hover:bg-surface-variant text-text-hint hover:text-text-primary rounded-xl h-12">
            {t('cancel')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
