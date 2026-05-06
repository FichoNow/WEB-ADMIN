'use client'

import { useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderKanban, Plus, MoreVertical, Hash, Calendar } from 'lucide-react'
import type { ProjectListItem } from "@/app/types/admin/api/project-response"
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import PageHeader from '@/components/PageHeader'
import ProjectForm from "./ProjectForm"

const LOCALE_MAP: Record<string, string> = { es: 'es-ES', cat: 'ca-ES', en: 'en-GB' }

function StatusBadge({ isActive, activeLabel, inactiveLabel }: { isActive: boolean; activeLabel: string; inactiveLabel: string }) {
    return (
        <Badge
            variant={isActive ? 'default' : 'secondary'}
            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-variant text-text-secondary border-divider'
            }`}
        >
            {isActive ? activeLabel : inactiveLabel}
        </Badge>
    )
}

export default function ProjectsClient({
    projects,
    groups,
    departmentId,
}: {
    projects: ProjectListItem[]
    groups: GroupResponse[]
    departmentId: number
}) {
    const t = useTranslations('projects.client')
    const locale = useLocale()
    const dateLocale = LOCALE_MAP[locale] ?? 'es-ES'
    const formatDate = (date: string) => new Date(date).toLocaleDateString(dateLocale)

    const [showCreate, setShowCreate] = useState(false)
    const [editProject, setEditProject] = useState<ProjectListItem | null>(null)

    const groupNameById = useMemo(() => {
        const m = new Map<number, string>()
        groups.forEach((g) => m.set(g.id, g.name))
        return m
    }, [groups])

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title={t('title')}
                description={t('description')}
                actions={
                    <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-2xl h-10 text-xs sm:text-sm">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('newProject')} </span>{t('newProjectShort')}
                    </Button>
                }
            />

            {projects.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 px-4 bg-surface/30 border border-dashed border-divider rounded-[2.5rem]"
                >
                    <div className="w-20 h-20 rounded-3xl bg-surface border border-divider flex items-center justify-center text-text-hint mb-6 shadow-sm">
                        <FolderKanban className="w-8 h-8 opacity-20" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-2">{t('emptyTitle')}</h3>
                    <p className="text-sm text-text-hint text-center max-w-xs mb-8 leading-relaxed">{t('emptyDesc')}</p>
                    <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-2xl h-11">
                        <Plus className="w-4 h-4" />
                        {t('createFirst')}
                    </Button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {projects.map((project) => {
                            const groupName = project.group_id != null ? groupNameById.get(project.group_id) : null
                            return (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative flex items-center justify-between px-6 py-5 rounded-[2rem] bg-surface border border-divider/50 hover:border-primary/30 hover:bg-surface-variant/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-none">
                                                    {project.name}
                                                </h4>
                                                <StatusBadge isActive={project.is_active} activeLabel={t('active')} inactiveLabel={t('inactive')} />
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-surface/50 border-divider/50 text-text-secondary">
                                                    <Hash className="w-2.5 h-2.5 mr-1 opacity-50" />
                                                    {groupName ?? t('general')}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-text-hint">
                                                <Calendar className="w-3 h-3" />
                                                {t('createdOn')} {formatDate(project.created_at)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditProject(project)}
                                            className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}

            <Dialog open={showCreate} onOpenChange={(open) => !open && setShowCreate(false)}>
                <DialogContent className="sm:max-w-[600px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-8 py-6 border-b border-divider/50">
                        <div className="flex items-center gap-3">
                            <FolderKanban className="w-6 h-6 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <DialogTitle className="text-xl font-bold text-text-primary">{t('newDialogTitle')}</DialogTitle>
                                <DialogDescription className="text-xs text-text-secondary">{t('newDialogDesc')}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
                        <ProjectForm
                            departmentId={departmentId}
                            groups={groups}
                            onClose={() => setShowCreate(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
                <DialogContent className="sm:max-w-[600px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-8 py-6 border-b border-divider/50">
                        <div className="flex items-center gap-3">
                            <FolderKanban className="w-6 h-6 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <DialogTitle className="text-xl font-bold text-text-primary">{t('editDialogTitle')}</DialogTitle>
                                <DialogDescription className="text-xs text-text-secondary">
                                    {editProject ? t('editDialogDesc', { name: editProject.name }) : t('editDialogDescGeneric')}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
                        {editProject && (
                            <ProjectForm
                                departmentId={departmentId}
                                groups={groups}
                                project={editProject}
                                onClose={() => setEditProject(null)}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
