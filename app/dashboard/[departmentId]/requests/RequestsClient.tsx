"use client";

import { useState } from "react";
import type {
  AdminRequestListItem,
  AdminRequestStatus,
} from "@/app/types/admin/api/admin-request-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReviewForm from "./ReviewForm";

const typeLabels: Record<string, string> = {
  VACATION: "Vacaciones",
  PERMISSION: "Permiso",
  SICK_LEAVE: "Baja médica",
  MEDICAL_APPOINTMENT: "Cita médica",
  DAY_OFF: "Día libre",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
};

type RequestFilter = "ALL" | AdminRequestStatus;

const filters: Array<{ value: RequestFilter; label: string }> = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "APPROVED", label: "Aprobadas" },
  { value: "REJECTED", label: "Rechazadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

function StatusBadge({ status }: { status: AdminRequestStatus }) {
  if (status === "APPROVED")
    return <Badge className="text-[10px]">Aprobada</Badge>;
  if (status === "REJECTED")
    return (
      <Badge variant="destructive" className="text-[10px]">
        Rechazada
      </Badge>
    );
  if (status === "CANCELLED")
    return (
      <Badge variant="secondary" className="text-[10px]">
        Cancelada
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-[10px]">
      Pendiente
    </Badge>
  );
}

function formatRange(request: AdminRequestListItem) {
  const fmt = (d: string) => new Date(d).toLocaleDateString("es-ES");
  const start = fmt(request.start_date);
  const end = fmt(request.end_date);
  return request.start_date === request.end_date ? start : `${start} - ${end}`;
}

interface Props {
  requests: AdminRequestListItem[];
  departmentId: number;
}

export default function RequestsClient({ requests, departmentId }: Props) {
  const [review, setReview] = useState<{
    request: AdminRequestListItem;
    mode: "approve" | "reject";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestFilter>("ALL");

  const filtered =
    statusFilter === "ALL"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const counts: Record<RequestFilter, number> = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    APPROVED: requests.filter((r) => r.status === "APPROVED").length,
    REJECTED: requests.filter((r) => r.status === "REJECTED").length,
    CANCELLED: requests.filter((r) => r.status === "CANCELLED").length,
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Solicitudes
        </p>
        <h1 className="text-3xl font-light tracking-tight text-text-primary">
          Solicitudes de ausencia
        </h1>
        <p className="text-sm text-text-secondary">
          Revisa y gestiona las peticiones de vacaciones, permisos y bajas del
          departamento.
        </p>
      </div>

      <div className="h-px bg-divider" />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? "default" : "ghost"}
            onClick={() => setStatusFilter(f.value)}
            className="rounded-xl"
          >
            {f.label}
            <span className="ml-2 text-xs opacity-70">{counts[f.value]}</span>
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-text-hint py-8 text-center">
          {requests.length === 0
            ? "No hay solicitudes en este departamento todavía."
            : "No hay solicitudes con este filtro."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((request) => (
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
                  {typeLabels[request.type] ?? request.type} ·{" "}
                  {formatRange(request)}
                  {request.start_time &&
                    request.end_time &&
                    ` · ${request.start_time} - ${request.end_time}`}
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

              {request.status === "PENDING" ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setReview({ request, mode: "reject" })}
                  >
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => setReview({ request, mode: "approve" })}
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

      {review && (
        <ReviewForm
          mode={review.mode}
          request={review.request}
          typeName={typeLabels[review.request.type] ?? review.request.type}
          departmentId={departmentId}
          onClose={() => setReview(null)}
        />
      )}
    </>
  )
}
