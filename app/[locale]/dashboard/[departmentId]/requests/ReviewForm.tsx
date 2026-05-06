'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { approveRequestAction } from '@/app/actions/admin/requests/approve-request'
import { rejectRequestAction } from '@/app/actions/admin/requests/reject-request'
import { reviewRequestSchema, type ReviewRequestFormValues } from '@/app/types/admin/schemas/review-request-schema'
import type { AdminRequestListItem } from '@/app/types/admin/api/admin-request-response'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, MessageSquare } from 'lucide-react'

interface Props {
  mode: 'approve' | 'reject'
  request: AdminRequestListItem
  typeName: string
  departmentId: number
  onClose: () => void
}

export default function ReviewForm({ mode, request, typeName, departmentId, onClose }: Props) {
  const t = useTranslations('requests.review')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isApprove = mode === 'approve'

  const form = useForm<ReviewRequestFormValues>({
    resolver: zodResolver(reviewRequestSchema),
    defaultValues: { comment: '' },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: ReviewRequestFormValues) => {
    startTransition(async () => {
      const action = isApprove ? approveRequestAction : rejectRequestAction
      const result = await action(departmentId, request.id, values.comment)

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
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-surface border-divider rounded-[2rem] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-8 py-6 border-b border-divider/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isApprove ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
              {isApprove ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-xl font-bold text-text-primary">
                {isApprove ? t('approveTitle') : t('rejectTitle')}
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary">
                {request.employee_name} · {typeName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 py-8 flex flex-col gap-6">
            {globalError && (
              <Alert variant="destructive">
                <AlertDescription>{globalError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-divider/50 pb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('section')}</h3>
              </div>

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">{t('commentLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={isApprove ? t('approvePh') : t('rejectPh')}
                        className="h-12 rounded-xl bg-surface/50 border-divider/50"
                      />
                    </FormControl>
                    <p className="text-[10px] text-text-hint font-medium">{t('visibleHint')}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                variant={isApprove ? 'default' : 'destructive'}
                disabled={isPending}
                className="w-full h-12 text-base font-bold rounded-xl"
              >
                {isPending ? t('processing') : isApprove ? t('confirmApprove') : t('confirmReject')}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="w-full h-11 rounded-xl text-text-hint hover:text-text-primary">
                {t('close')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
