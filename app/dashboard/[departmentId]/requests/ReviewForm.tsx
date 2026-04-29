'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { approveRequestAction, rejectRequestAction } from '@/app/actions/admin/requests'
import type { AdminRequestListItem } from '@/app/types/admin/api/admin-request-response'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  mode: 'approve' | 'reject'
  request: AdminRequestListItem
  typeName: string
  departmentId: number
  onClose: () => void
}

export default function ReviewForm({ mode, request, typeName, departmentId, onClose }: Props) {
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const isApprove = mode === 'approve'

  function handleSubmit() {
    startTransition(async () => {
      const result = isApprove
        ? await approveRequestAction(departmentId, request.id, comment)
        : await rejectRequestAction(departmentId, request.id, comment)

      if (result && 'error' in result) {
        setError(result.error)
        return
      }

      router.refresh()
      onClose()
    })
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-surface border-divider">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary">
            {isApprove ? 'Aprobar solicitud' : 'Rechazar solicitud'}
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            {request.employee_name} · {typeName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Comentario de revisión</label>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isApprove ? 'Ej: Aprobado' : 'Ej: No hay cobertura ese día'}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button variant={isApprove ? 'default' : 'destructive'} onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Guardando...' : isApprove ? 'Aprobar' : 'Rechazar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
