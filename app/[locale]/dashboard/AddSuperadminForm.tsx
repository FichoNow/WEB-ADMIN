'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { addSuperadminAction } from '@/app/actions/superadmin/superadmin/add-superadmin'
import { addSuperadminSchema, type AddSuperadminFormValues } from '@/app/types/superadmin/schemas/superadmin-schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, CheckCircle2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function AddSuperadminForm({ open, onClose }: Props) {
  const t = useTranslations('dashboard.addAdminForm')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const form = useForm<AddSuperadminFormValues>({
    resolver: zodResolver(addSuperadminSchema),
    defaultValues: { name: '', email: '', password: '' },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: AddSuperadminFormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => formData.set(k, v))
    startTransition(async () => {
      const result = await addSuperadminAction({}, formData)
      if (result?.error) {
        form.setError('root', { message: result.error })
        toast.error(result.error)
        return
      }
      if (result && 'success' in result && result.success) toast.success(result.success)
      setSuccess(true)
      router.refresh()
      setTimeout(() => { form.reset(); setSuccess(false); onClose() }, 1500)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setSuccess(false); onClose() } }}>
      <DialogContent className="bg-surface border-divider max-w-[calc(100vw-2rem)] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> {t('title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">{t('desc')}</DialogDescription>
        </DialogHeader>
        {success && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {t('successCreated')}
          </div>
        )}
        {globalError && (
          <Alert variant="destructive"><AlertDescription>{globalError}</AlertDescription></Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>{t('nameLabel')}</FormLabel>
                <FormControl><Input placeholder={t('namePh')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>{t('emailLabel')}</FormLabel>
                <FormControl><Input placeholder={t('emailPh')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>{t('passwordLabel')}</FormLabel>
                <FormControl><Input type="password" placeholder={t('passwordPh')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>{t('cancel')}</Button>
              <Button type="submit" disabled={isPending}>{isPending ? t('creating') : t('create')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
