'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { updateProfileAction } from '@/app/actions/auth/update-profile'
import { profileSchema, type ProfileFormValues } from '@/app/types/auth/schemas/profile-schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, Lock, ShieldCheck } from 'lucide-react'

export default function ProfileForm() {
  const t = useTranslations('profile.form')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '', password: '', password_confirm: '' },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      const result = await updateProfileAction(values)
      if (result && 'error' in result) {
        form.setError('root', { message: result.error })
        toast.error(result.error)
        return
      }
      if (result && 'success' in result) toast.success(result.success)
      form.reset({ name: '', email: '', password: '', password_confirm: '' })
      router.refresh()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {globalError && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-divider/50 pb-2">
            <User className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('personal')}</h3>
          </div>

          <p className="text-xs text-text-hint -mt-2">{t('blankHint')}</p>

          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 opacity-50" /> {t('name')}</FormLabel>
              <FormControl><Input placeholder={t('namePh')} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 opacity-50" /> {t('email')}</FormLabel>
              <FormControl><Input type="email" placeholder={t('emailPh')} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-divider/50 pb-2">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('passwordSection')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 opacity-50" /> {t('newPassword')}</FormLabel>
                <FormControl><Input type="password" placeholder={t('newPasswordPh')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password_confirm" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 opacity-50" /> {t('confirm')}</FormLabel>
                <FormControl><Input type="password" placeholder={t('confirmPh')} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        <div className="pt-6 border-t border-divider/50 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full sm:w-auto px-10 text-sm font-bold rounded-xl"
          >
            {isPending ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
