'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { createGroupAction } from '@/app/actions/admin/groups/create-group'
import { deleteGroupAction } from '@/app/actions/admin/groups/delete-group'
import { updateGroupAction } from '@/app/actions/admin/groups/update-group'
import {
  createGroupSchema,
  editGroupSchema,
  type CreateGroupFormValues,
  type EditGroupFormValues,
} from '@/app/types/admin/schemas/group-schema'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import ConfirmDialog from '@/components/ConfirmDialog'
import { Trash2, Edit3, Plus, X, Check, Users } from 'lucide-react'

interface Props {
  departmentId: number
  groups: GroupResponse[]
}

export default function GroupsManager({ departmentId, groups }: Props) {
  const t = useTranslations('employees.groupsManager')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<GroupResponse | null>(null)

  const createForm = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '' },
  })
  const createGlobalError = createForm.formState.errors.root?.message

  const handleCreate = (values: CreateGroupFormValues) => {
    startTransition(async () => {
      const res = await createGroupAction(departmentId, values)
      if (res && 'error' in res) {
        createForm.setError('root', { message: res.error })
        toast.error(res.error)
        return
      }
      if (res && 'success' in res) toast.success(res.success)
      createForm.reset()
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(handleCreate)} className="flex flex-col gap-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-hint ml-1">{t('newGroupLabel')}</label>
          {createGlobalError && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{createGlobalError}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2">
            <FormField
              control={createForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={t('newGroupPh')}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="shrink-0 h-11 px-6 rounded-xl">
              {isPending ? '...' : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </Form>

      <div className="h-px bg-divider/50" />

      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-hint ml-1">{t('currentGroups', { count: groups.length })}</label>
        {groups.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center bg-surface-variant/20 rounded-[2rem] border border-dashed border-divider/50">
            <p className="text-sm text-text-hint">{t('empty')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
            {groups.map((g) => (
              <GroupRow
                key={g.id}
                group={g}
                departmentId={departmentId}
                isEditing={editingId === g.id}
                isPending={isPending}
                onStartEdit={() => setEditingId(g.id)}
                onCancelEdit={() => setEditingId(null)}
                onSaved={() => { setEditingId(null); router.refresh() }}
                onAskDelete={() => setConfirmDelete(g)}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteGroupDialog
        group={confirmDelete}
        departmentId={departmentId}
        onClose={() => setConfirmDelete(null)}
        onDeleted={() => { setConfirmDelete(null); router.refresh() }}
      />
    </div>
  )
}

// ── GroupRow: read + inline edit ────────────────────────────
interface GroupRowProps {
  group: GroupResponse
  departmentId: number
  isEditing: boolean
  isPending: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaved: () => void
  onAskDelete: () => void
}

function GroupRow({ group, departmentId, isEditing, isPending, onStartEdit, onCancelEdit, onSaved, onAskDelete }: GroupRowProps) {
  const [, startTransition] = useTransition()

  const editForm = useForm<EditGroupFormValues>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: { name: group.name },
  })

  const handleSave = (values: EditGroupFormValues) => {
    startTransition(async () => {
      const res = await updateGroupAction(departmentId, group.id, values)
      if (res && 'error' in res) {
        editForm.setError('name', { message: res.error })
        toast.error(res.error)
        return
      }
      if (res && 'success' in res) toast.success(res.success)
      onSaved()
    })
  }

  if (!isEditing) {
    return (
      <div className="group flex items-center gap-3 px-6 py-5 rounded-2xl bg-surface border border-divider hover:border-primary/40 hover:bg-surface-variant transition-all duration-200">
        <Users className="w-5 h-5 text-text-hint group-hover:text-primary transition-colors duration-200 shrink-0" />
        <span className="flex-1 text-base font-medium text-text-primary">{group.name}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg"
            onClick={() => { editForm.reset({ name: group.name }); onStartEdit() }}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-lg text-error hover:bg-error/10"
            onClick={onAskDelete}
            disabled={isPending}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Form {...editForm}>
      <form
        onSubmit={editForm.handleSubmit(handleSave)}
        className="flex items-start gap-3 px-6 py-5 rounded-2xl bg-surface border border-divider"
      >
        <FormField
          control={editForm.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input autoFocus disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={isPending} className="h-9 w-9 bg-success hover:bg-success/90 shrink-0">
          <Check className="w-4 h-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={onCancelEdit} disabled={isPending} className="h-9 w-9 shrink-0">
          <X className="w-4 h-4" />
        </Button>
      </form>
    </Form>
  )
}

// ── DeleteGroupDialog ──────────────────────────────────────
interface DeleteGroupDialogProps {
  group: GroupResponse | null
  departmentId: number
  onClose: () => void
  onDeleted: () => void
}

function DeleteGroupDialog({ group, departmentId, onClose, onDeleted }: DeleteGroupDialogProps) {
  const t = useTranslations('employees.groupsManager')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = () => {
    if (!group) return
    setError(null)
    startTransition(async () => {
      const res = await deleteGroupAction(departmentId, group.id)
      if (res && 'error' in res) {
        setError(res.error)
        toast.error(res.error)
        return
      }
      if (res && 'success' in res) toast.success(res.success)
      onDeleted()
    })
  }

  return (
    <ConfirmDialog
      open={!!group}
      title={t('confirmTitle')}
      description={
        group ? (
          <>
            {t('confirmDescPart1')} <span className="font-bold text-text-primary">"{group.name}"</span>{t('confirmDescPart2')}
          </>
        ) : ''
      }
      confirmLabel={t('confirmLabel')}
      pending={isPending}
      errorMessage={error}
      onConfirm={handleConfirm}
      onClose={() => { setError(null); onClose() }}
    />
  )
}
