'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { updateSuperadminAction } from '@/app/actions/superadmin/superadmin/update-superadmin'
import { editSuperadminSchema, type EditSuperadminFormValues } from '@/app/types/superadmin/schemas/superadmin-schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import type { SuperadminUser } from '@/app/types/superadmin/api/superadmin-response'

interface Props {
  superadmin: SuperadminUser | null
  open: boolean
  onClose: () => void
}

export default function EditSuperadminForm({ superadmin, open, onClose }: Props) {
  const t = useTranslations('dashboard.editAdminForm')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<EditSuperadminFormValues>({
    resolver: zodResolver(editSuperadminSchema),
    defaultValues: { name: '', email: '' },
  })
  const globalError = form.formState.errors.root?.message

  useEffect(() => {
    if (superadmin) {
      form.reset({ name: superadmin.name, email: superadmin.email })
    }
  }, [superadmin, form])

  const onSubmit = (values: EditSuperadminFormValues) => {
    if (!superadmin) return
    startTransition(async () => {
      const result = await updateSuperadminAction(superadmin.id, values)
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

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !isPending) onClose() }}>
      <DialogContent className="bg-surface border-divider max-w-[calc(100vw-2rem)] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" /> {t('title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">{t('desc')}</DialogDescription>
        </DialogHeader>
        {globalError && (
          <Alert variant="destructive"><AlertDescription>{globalError}</AlertDescription></Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('nameLabel')}</FormLabel>
                <FormControl><Input placeholder={t('namePh')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('emailLabel')}</FormLabel>
                <FormControl><Input type="email" placeholder={t('emailPh')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>{t('cancel')}</Button>
              <Button type="submit" disabled={isPending}>{isPending ? t('saving') : t('save')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
