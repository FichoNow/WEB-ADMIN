'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  approveRequestAction,
  rejectRequestAction,
} from '@/app/actions/admin/requests'
import type {
  AdminRequestListItem,
  AdminRequestStatus,
} from '@/app/types/admin/request'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const typeLabels: Record<string, string> = {
  VACATION: 'Vacaciones',
  PERMISSION: 'Permiso',
  SICK_LEAVE: 'Baja médica',
  MEDICAL_APPOINTMENT: 'Cita médica',
  DAY_OFF: 'Día libre',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  CANCELLED: 'Cancelada',
}

type RequestFilter = 'ALL' | AdminRequestStatus

const filters: Array<{ value: RequestFilter; label: string }> = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'APPROVED', label: 'Aprobadas' },
  { value: 'REJECTED', label: 'Rechazadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
]

function StatusBadge({ status }: { status: string }) {
  if (status === 'APPROVED') {
    return <Badge className="text-[10px]">Aprobada</Badge>
  }

  if (status === 'REJECTED') {
    return <Badge variant="destructive" className="text-[10px]">Rechazada</Badge>
  }

  if (status === 'CANCELLED') {
    return <Badge variant="secondary" className="text-[10px]">Cancelada</Badge>
  }

  return <Badge variant="secondary" className="text-[10px]">Pendiente</Badge>
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES')
}

function formatRange(request: AdminRequestListItem) {
  const start = formatDate(request.start_date)
  const end = formatDate(request.end_date)

  if (request.start_date === request.end_date) {
    return start
  }

  return `${start} - ${end}`
}

function ReviewModal({
  mode,
  request,
  departmentId,
  onClose,
}: {
  mode: 'approve' | 'reject'
  request: AdminRequestListItem
  departmentId: number
  onClose: () => void
}) {
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError('')

    const result =
      mode === 'approve'
        ? await approveRequestAction(departmentId, request.id, comment)
        : await rejectRequestAction(departmentId, request.id, comment)

    setLoading(false)

    if (result && 'error' in result) {
      setError(result.error)
      return
    }

    router.refresh()
    onClose()
  }

  const isApprove = mode === 'approve'

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-surface border-divider">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary">
            {isApprove ? 'Aprobar solicitud' : 'Rechazar solicitud'}
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            {request.employee_name} · {typeLabels[request.type] ?? request.type}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-text-secondary">
              Comentario de revisión
            </label>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isApprove ? 'Ej: Aprobado' : 'Ej: No hay cobertura ese día'}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant={isApprove ? 'default' : 'destructive'}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? 'Guardando...'
                : isApprove
                  ? 'Aprobar'
                  : 'Rechazar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function RequestsClient({
  requests,
  departmentId,
}: {
  requests: AdminRequestListItem[]
  departmentId: number
}) {
  const [selectedRequest, setSelectedRequest] = useState<AdminRequestListItem | null>(null)
  const [mode, setMode] = useState<'approve' | 'reject' | null>(null)

  const [statusFilter, setStatusFilter] = useState<RequestFilter>('ALL')

  const filteredRequests =
    statusFilter === 'ALL'
      ? requests
      : requests.filter((request) => request.status === statusFilter)

  const counts: Record<RequestFilter, number> = {
    ALL: requests.length,
    PENDING: requests.filter((request) => request.status === 'PENDING').length,
    APPROVED: requests.filter((request) => request.status === 'APPROVED').length,
    REJECTED: requests.filter((request) => request.status === 'REJECTED').length,
    CANCELLED: requests.filter((request) => request.status === 'CANCELLED').length,
  }

  function openReviewModal(request: AdminRequestListItem, selectedMode: 'approve' | 'reject') {
    setSelectedRequest(request)
    setMode(selectedMode)
  }

  function closeReviewModal() {
    setSelectedRequest(null)
    setMode(null)
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">Solicitudes</p>
        <h1 className="text-3xl font-light tracking-tight text-text-primary">Solicitudes de ausencia</h1>
        <p className="text-sm text-text-secondary">
          Revisa y gestiona las peticiones de vacaciones, permisos y bajas del departamento.
        </p>
      </div>

      <div className="h-px bg-divider" />

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={statusFilter === filter.value ? 'default' : 'ghost'}
            onClick={() => setStatusFilter(filter.value)}
            className="rounded-xl"
          >
            {filter.label}
            <span className="ml-2 text-xs opacity-70">
              {counts[filter.value]}
            </span>
          </Button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-sm text-text-hint py-8 text-center">
          {requests.length === 0
            ? 'No hay solicitudes en este departamento todavía.'
            : 'No hay solicitudes con este filtro.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface border border-divider hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    {request.employee_name}
                  </p>
                  <StatusBadge status={request.status} />
                </div>

                <p className="text-xs text-text-hint">
                  {request.employee_email}
                </p>

                <p className="text-sm text-text-secondary">
                  {typeLabels[request.type] ?? request.type} · {formatRange(request)}
                  {request.start_time && request.end_time
                    ? ` · ${request.start_time} - ${request.end_time}`
                    : ''}
                </p>

                {request.comment && (
                  <p className="text-xs text-text-secondary">
                    Comentario: {request.comment}
                  </p>
                )}

                {request.review_comment && (
                  <p className="text-xs text-text-hint">
                    Revisión: {request.review_comment}
                  </p>
                )}
              </div>

              {request.status === 'PENDING' ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => openReviewModal(request, 'reject')}
                  >
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => openReviewModal(request, 'approve')}
                  >
                    Aprobar
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-text-hint">
                  {statusLabels[request.status] ?? request.status}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedRequest && mode && (
        <ReviewModal
          mode={mode}
          request={selectedRequest}
          departmentId={departmentId}
          onClose={closeReviewModal}
        />
      )}
    </>
  )
}