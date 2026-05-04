'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createProjectAction } from "@/app/actions/admin/projects/create-project"
import { updateProjectAction } from "@/app/actions/admin/projects/update-project"
import type { ProjectListItem } from "@/app/types/admin/api/project-response"
import type { ProjectActionState } from "@/app/types/admin/action-states/project-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


function Alert({ state }: { state: ProjectActionState }) {
    if(!state) return null

    if("error" in state){
        return(
            <p className="text-sm text-error bg-error/10 border-error/30 rounded-xl px-4 py-3">
                {state.error}
            </p>
        )
    }

    if("success" in state){
        return(
            <p className="text-sm text-success bg-success/10 border-success/30 rounded-xl px-4 py-3">
                {state.success}
            </p>
        )
    }

    return null
}

export default function ProjectForm({
    departmentId,
    project,
    onClose,
}: {
    departmentId: number
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

    useEffect(() => {
        if(state && 'seccess' in state){
            router.refresh()
            onClose()
        }
    }, [state, router, onClose])

    return(
        <form action={dispatch} className="flex flex-col gap-4">
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

                <select
                    name="group_id"
                    defaultValue={project?.group_id ? String(project.group_id) : 'none'}
                    className="w-full rounded-xl px-4 py-3 text-sm bg-bg border border-input-stroke text-text-primary outline-none focus:border-primary transition-colors"
                >
                    <option value="none">Proyecto general del departamento</option>
                </select>

                <p className="text-xs text-text-hint">
                    Por ahora el proyecto se crea como general del departamento.
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">
                    Estado
                </label>

                <select
                    name="is_active"
                    defaultValue={project ? String(project.is_active) : 'true'}
                    className="w-full rounded-xl px-4 py-3 text-sm bg-bg border border-input-stroke text-text-primary outline-none focus:border-primary transition-colors"
                >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>

            <Button type="submit" disabled={pending} className="w-full" size="lg">
                {pending
                    ? 'Guardando...'
                    : isEditing
                        ? 'Guardar cambios'
                        : 'Crear proyecto'}
            </Button>
        </form>
    )
}