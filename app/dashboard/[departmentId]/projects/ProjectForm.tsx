'use client'

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createProjectAction } from "@/app/actions/admin/projects/create-project"
import { updateProjectAction } from "@/app/actions/admin/projects/update-project"
import type { ProjectListItem } from "@/app/types/admin/api/project-response"
import type { GroupResponse } from "@/app/types/admin/api/group-response"
import type { ProjectActionState } from "@/app/types/admin/action-states/project-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

const NO_GROUP = '__none__'

const STATUS_LABELS: Record<string, string> = {
    'true': 'Activo',
    'false': 'Inactivo',
}

function Alert({ state }: { state: ProjectActionState }) {
    if (!state) return null

    if ("error" in state) {
        return (
            <p className="text-sm text-error bg-error/10 border-error/30 rounded-xl px-4 py-3">
                {state.error}
            </p>
        )
    }

    if ("success" in state) {
        return (
            <p className="text-sm text-success bg-success/10 border-success/30 rounded-xl px-4 py-3">
                {state.success}
            </p>
        )
    }

    return null
}

export default function ProjectForm({
    departmentId,
    groups,
    project,
    onClose,
}: {
    departmentId: number
    groups: GroupResponse[]
    project?: ProjectListItem
    onClose: () => void
}) {
    const router = useRouter()
    const isEditing = Boolean(project)

    const action = project
        ? updateProjectAction.bind(null, departmentId, project.id)
        : createProjectAction.bind(null, departmentId)

    const [state, dispatch, pending] = useActionState<ProjectActionState, FormData>(
        action,
        undefined,
    )

    const [groupId, setGroupId] = useState<string>(
        project?.group_id ? String(project.group_id) : NO_GROUP
    )
    const [isActive, setIsActive] = useState<string>(
        project ? String(project.is_active) : 'true'
    )

    useEffect(() => {
        if (!state) return
        if ('success' in state) {
            toast.success(state.success)
            router.refresh()
            onClose()
        } else if ('error' in state) {
            toast.error(state.error)
        }
    }, [state, router, onClose])

    const groupLabel = groupId === NO_GROUP
        ? 'Proyecto general del departamento'
        : (groups.find((g) => String(g.id) === groupId)?.name ?? 'Grupo desconocido')

    const statusLabel = STATUS_LABELS[isActive] ?? isActive

    return (
        <form action={dispatch} className="flex flex-col gap-5">
            <Alert state={state} />

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">
                    Nombre del proyecto
                </label>
                <Input
                    name="name"
                    type="text"
                    defaultValue={project?.name ?? ''}
                    placeholder="Ej: Portal interno"
                    required
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">
                    Grupo
                </label>
                <Select value={groupId} onValueChange={(v) => setGroupId(v ?? NO_GROUP)}>
                    <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                        <span className="truncate text-left">{groupLabel}</span>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-divider">
                        <SelectItem value={NO_GROUP}>Proyecto general del departamento</SelectItem>
                        {groups.map((g) => (
                            <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input type="hidden" name="group_id" value={groupId === NO_GROUP ? 'none' : groupId} />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">
                    Estado
                </label>
                <Select value={isActive} onValueChange={(v) => setIsActive(v ?? 'true')}>
                    <SelectTrigger className="w-full bg-surface/50 h-11 border-divider/50 rounded-xl">
                        <span className={`truncate text-left ${isActive === 'true' ? 'text-success' : 'text-error'}`}>
                            {statusLabel}
                        </span>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-divider">
                        <SelectItem value="true" className="text-success">Activo</SelectItem>
                        <SelectItem value="false" className="text-error">Inactivo</SelectItem>
                    </SelectContent>
                </Select>
                <input type="hidden" name="is_active" value={isActive} />
            </div>

            <div className="pt-2 flex flex-col gap-3">
                <Button type="submit" disabled={pending} className="w-full h-12 text-base font-bold rounded-xl">
                    {pending
                        ? 'Guardando...'
                        : isEditing
                            ? 'Guardar cambios'
                            : 'Crear proyecto'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={pending}
                    className="w-full border-divider/50 hover:bg-surface-variant text-text-hint hover:text-text-primary rounded-xl h-11"
                >
                    Cancelar
                </Button>
            </div>
        </form>
    )
}
