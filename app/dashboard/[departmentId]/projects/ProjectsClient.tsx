'use client'

import { useState } from 'react'
import type { ProjectListItem } from "@/app/types/admin/api/project-response"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ProjectForm from "./ProjectForm"

function StatusBadge({ isActive }: { isActive: boolean }) {
    return isActive ? (
        <Badge className="text-[10px]">Activo</Badge>
    ): (
        <Badge variant="secondary" className="text-[10px]">Inactivo</Badge>
    )
}

function formatDate(date: string){
    return new Date(date).toLocaleDateString('es-ES')
}

function ProjectModal({
    title,
    onClose,
    children,
}: {
    title: string
    onClose: () => void
    children: React.ReactNode
}) {
    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-surface border-divider">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-text-primary">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Formulario de proyecto
                    </DialogDescription>
                </DialogHeader>

                {children}
            </DialogContent>
        </Dialog>
    )
}

export default function ProjectsClient({
    projects,
    departmentId,
}: {
    projects: ProjectListItem[]
    departmentId: number
}) {
    const [showCreate, setShowCreate] = useState(false)
    const [editProject, setEditProject] = useState<ProjectListItem | null>(null)

    return (
        <>
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                <p className="text-xs font-medium tracking-widest text-primary uppercase">
                    Proyectos
                </p>
                <h1 className="text-3xl font-light tracking-tight text-text-primary">
                    Gestión de proyectos
                </h1>
                <p className="text-sm text-text-secondary">
                    Crea y administra los proyectos activos del departamento.
                </p>
                </div>

                <Button onClick={() => setShowCreate(true)} className="rounded-xl">
                Nuevo proyecto
                </Button>
            </div>

            <div className="h-px bg-divider" />

            {projects.length === 0 ? (
                <p className="text-sm text-text-hint py-8 text-center">
                No hay proyectos en este departamento todavía.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                {projects.map((project) => (
                    <div
                    key={project.id}
                    className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface border border-divider hover:border-primary/30 transition-colors"
                    >
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text-primary">
                            {project.name}
                        </p>
                        <StatusBadge isActive={project.is_active} />
                        </div>

                        <p className="text-xs text-text-hint">
                        {project.group_id
                            ? `Grupo ID: ${project.group_id}`
                            : 'Proyecto general del departamento'}
                        </p>

                        <p className="text-xs text-text-secondary">
                        Creado el {formatDate(project.created_at)}
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setEditProject(project)}
                    >
                        Editar
                    </Button>
                    </div>
                ))}
                </div>
            )}

            {showCreate && (
                <ProjectModal
                title="Nuevo proyecto"
                onClose={() => setShowCreate(false)}
                >
                <ProjectForm
                    departmentId={departmentId}
                    onClose={() => setShowCreate(false)}
                />
                </ProjectModal>
            )}

            {editProject && (
                <ProjectModal
                title={`Editar · ${editProject.name}`}
                onClose={() => setEditProject(null)}
                >
                <ProjectForm
                    departmentId={departmentId}
                    project={editProject}
                    onClose={() => setEditProject(null)}
                />
                </ProjectModal>
            )}
        </>
  )
}