"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MessageSquare, CheckCircle2, XCircle, AlertCircle, Filter } from "lucide-react";
import type {
  AdminRequestListItem,
  AdminRequestStatus,
} from "@/app/types/admin/api/admin-request-response";
import type { EmployeeListItem } from "@/app/types/admin/api/employee-response";
import type { GroupResponse } from "@/app/types/admin/api/group-response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/PageHeader";
import ReviewForm from "./ReviewForm";

const typeLabels: Record<string, string> = {
  VACATION: "Vacaciones",
  PERMISSION: "Permiso",
  SICK_LEAVE: "Baja médica",
  MEDICAL_APPOINTMENT: "Cita médica",
  DAY_OFF: "Día libre",
};

const statusConfig: Record<string, { label: string, icon: any, color: string, bg: string }> = {
  PENDING: { label: "Pendiente", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
  APPROVED: { label: "Aprobada", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  REJECTED: { label: "Rechazada", icon: XCircle, color: "text-error", bg: "bg-error/10" },
  CANCELLED: { label: "Cancelada", icon: Clock, color: "text-text-hint", bg: "bg-surface-variant" },
};

type RequestFilter = "ALL" | AdminRequestStatus;

const filters: Array<{ value: RequestFilter; label: string }> = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "APPROVED", label: "Aprobadas" },
  { value: "REJECTED", label: "Rechazadas" },
];

const GROUP_ALL  = "__all__";
const GROUP_NONE = "__none__";

const GROUP_LABELS: Record<string, string> = {
  [GROUP_ALL]: "Todos los grupos",
  [GROUP_NONE]: "Sin grupo",
};

function StatusBadge({ status }: { status: AdminRequestStatus }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md gap-1.5 border-none ${config.bg} ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

function formatRange(request: AdminRequestListItem) {
  const fmt = (d: string) => new Date(d).toLocaleDateString("es-ES", { day: '2-digit', month: 'short' });
  const start = fmt(request.start_date);
  const end = fmt(request.end_date);
  return request.start_date === request.end_date ? start : `${start} - ${end}`;
}

interface Props {
  requests: AdminRequestListItem[];
  employees: EmployeeListItem[];
  groups: GroupResponse[];
  departmentId: number;
}

export default function RequestsClient({ requests, employees, groups, departmentId }: Props) {
  const [review, setReview] = useState<{
    request: AdminRequestListItem;
    mode: "approve" | "reject";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestFilter>("ALL");
  const [groupFilter, setGroupFilter] = useState<string>(GROUP_ALL);

  const groupByUserId = useMemo(() => {
    const m = new Map<number, number | null>();
    employees.forEach((e) => m.set(e.id, e.group_id ?? null));
    return m;
  }, [employees]);

  const groupNameById = useMemo(() => {
    const m = new Map<number, string>();
    groups.forEach((g) => m.set(g.id, g.name));
    return m;
  }, [groups]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (groupFilter !== GROUP_ALL) {
        const gid = groupByUserId.get(r.user_id) ?? null;
        if (groupFilter === GROUP_NONE) {
          if (gid != null) return false;
        } else {
          if (gid !== Number(groupFilter)) return false;
        }
      }
      return true;
    });
  }, [requests, statusFilter, groupFilter, groupByUserId]);

  const counts = useMemo(() => ({
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    APPROVED: requests.filter((r) => r.status === "APPROVED").length,
    REJECTED: requests.filter((r) => r.status === "REJECTED").length,
    CANCELLED: requests.filter((r) => r.status === "CANCELLED").length,
  }), [requests]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Solicitudes"
        description="Gestiona las peticiones de vacaciones y permisos. Las solicitudes pendientes requieren tu atención."
      />

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as RequestFilter)} className="w-full sm:w-fit min-w-0">
          <TabsList className="bg-surface border border-divider/50 p-1 rounded-xl w-full sm:w-auto grid grid-cols-2 sm:flex sm:h-11 h-auto gap-1 sm:gap-0">
            {filters.map((f) => (
              <TabsTrigger
                key={f.value}
                value={f.value}
                className="rounded-lg px-3 sm:px-5 py-2 sm:py-1.5 text-xs font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all min-w-0"
              >
                <span className="truncate">{f.label}</span>
                {counts[f.value] > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] shrink-0 ${statusFilter === f.value ? 'bg-primary/20' : 'bg-surface-variant'}`}>
                    {counts[f.value]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select value={groupFilter} onValueChange={(v) => setGroupFilter(v ?? GROUP_ALL)}>
            <SelectTrigger className="w-full sm:w-52 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium">
              <Filter className="w-3.5 h-3.5 mr-2 text-primary" />
              <span className="truncate">
                {GROUP_LABELS[groupFilter] ?? groupNameById.get(Number(groupFilter)) ?? groupFilter}
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-divider">
              <SelectItem value={GROUP_ALL} className="text-xs">Todos los grupos</SelectItem>
              <SelectItem value={GROUP_NONE} className="text-xs">Sin grupo</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.id} value={String(g.id)} className="text-xs">{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 px-4 bg-surface/30 border border-dashed border-divider rounded-[2.5rem]"
        >
          <div className="w-16 h-16 rounded-2xl bg-surface border border-divider flex items-center justify-center text-text-hint mb-4">
            <Calendar className="w-6 h-6 opacity-20" />
          </div>
          <p className="text-sm text-text-hint font-medium">
            No hay solicitudes que coincidan con los filtros actuales.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((request) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative flex flex-col gap-3 px-4 sm:px-6 py-4 sm:py-5 rounded-[2rem] bg-surface border transition-all duration-300 ${
                  request.status === 'PENDING'
                    ? 'border-amber-500/30 shadow-[0_8px_30px_rgb(245,158,11,0.05)]'
                    : 'border-divider/50 hover:border-primary/20 hover:bg-surface-variant/30'
                }`}
              >
                {/* Top row: date + info */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-surface-variant/50 border border-divider/50 shrink-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-hint">
                      {new Date(request.start_date).toLocaleDateString("es-ES", { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-text-primary leading-none">
                      {new Date(request.start_date).getDate()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <h4 className="text-base font-bold text-text-primary leading-none truncate">
                      {request.employee_name}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={request.status} />
                      <Badge variant="outline" className="text-[10px] font-bold border-divider/50 text-text-secondary">
                        {typeLabels[request.type] ?? request.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary font-medium flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-text-hint" />
                        {formatRange(request)}
                      </div>
                      {request.start_time && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-text-hint" />
                          {request.start_time} - {request.end_time}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {request.comment && (
                  <div className="flex items-start gap-1.5 bg-surface-variant/30 p-2 rounded-lg border border-divider/20">
                    <MessageSquare className="w-3 h-3 text-text-hint mt-0.5 shrink-0" />
                    <p className="text-[11px] text-text-secondary italic">"{request.comment}"</p>
                  </div>
                )}

                {/* Actions row */}
                {request.status === "PENDING" ? (
                  <div className="flex items-center gap-2 pt-1 border-t border-divider/30">
                    <Button
                      variant="ghost"
                      onClick={() => setReview({ request, mode: "reject" })}
                      className="flex-1 rounded-xl h-9 text-xs font-bold bg-error/10 text-error hover:bg-error hover:text-white transition-colors"
                    >
                      Rechazar
                    </Button>
                    <Button
                      onClick={() => setReview({ request, mode: "approve" })}
                      className="flex-1 rounded-xl h-9 text-xs font-bold"
                    >
                      Aprobar
                    </Button>
                  </div>
                ) : (
                  <div className="text-text-hint opacity-50 font-bold text-[10px] uppercase tracking-widest pt-1 border-t border-divider/30">
                    Completada
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
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
    </div>
  );
}

