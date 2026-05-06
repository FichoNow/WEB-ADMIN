'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Plus, Calendar, Users, User, CalendarRange, Eye, Pencil } from 'lucide-react'
import type {
    ScheduleAssignmentsResponse,
    ScheduleTemplateItem,
} from '@/app/types/admin/api/schedule-response'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/PageHeader'
import ScheduleForm from './ScheduleForm'
import GroupScheduleAssignmentForm from './GroupScheduleAssignmentForm'
import UserScheduleAssignmentForm from './UserScheduleAssignmentForm'
import AssignmentsTab from './AssignmentsTab'
import TemplateAssignmentsDialog from './TemplateAssignmentsDialog'

const TAB_TEMPLATES = 'templates'
const TAB_ASSIGNMENTS = 'assignments'

function todayIso() {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

function formatTime(time: string | null) {
    if (!time) return ''
    return time.slice(0, 5)
}

interface TemplateUsage {
    total: number
    active: number
    future: number
}

function buildUsageMap(
    assignments: ScheduleAssignmentsResponse,
    today: string,
): Map<number, TemplateUsage> {
    const map = new Map<number, TemplateUsage>()

    const bump = (templateId: number, kind: 'active' | 'future' | 'expired') => {
        const cur = map.get(templateId) ?? { total: 0, active: 0, future: 0 }
        cur.total += 1
        if (kind === 'active') cur.active += 1
        else if (kind === 'future') cur.future += 1
        map.set(templateId, cur)
    }

    const classify = (start: string, end: string | null) => {
        if (start > today) return 'future' as const
        if (end && end < today) return 'expired' as const
        return 'active' as const
    }

    for (const a of assignments.user_assignments) bump(a.template_id, classify(a.start_date, a.end_date))
    for (const a of assignments.group_assignments) bump(a.template_id, classify(a.start_date, a.end_date))

    return map
}

export default function SchedulesClient({
    schedules,
    assignments,
    groups,
    employees,
    departmentId,
}: {
    schedules: ScheduleTemplateItem[]
    assignments: ScheduleAssignmentsResponse
    groups: GroupResponse[]
    employees: EmployeeListItem[]
    departmentId: number
}) {
    const t = useTranslations('schedules.client')
    const [showCreate, setShowCreate] = useState(false)
    const [showAssignGroup, setShowAssignGroup] = useState(false)
    const [showAssignUser, setShowAssignUser] = useState(false)
    const [tab, setTab] = useState<string>(TAB_TEMPLATES)
    const [detailTemplate, setDetailTemplate] = useState<ScheduleTemplateItem | null>(null)
    const [editTemplate, setEditTemplate] = useState<ScheduleTemplateItem | null>(null)

    const today = todayIso()
    const usage = useMemo(() => buildUsageMap(assignments, today), [assignments, today])

    const totalAssignments =
        assignments.user_assignments.length + assignments.group_assignments.length

    function StatusBadge({ isActive }: { isActive: boolean }) {
        return (
            <Badge
                variant={isActive ? 'default' : 'secondary'}
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                    isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-variant text-text-secondary border-divider'
                }`}
            >
                {isActive ? t('active') : t('inactive')}
            </Badge>
        )
    }

    function formatWeeklyMinutes(minutes: number) {
        const hours = Math.floor(minutes / 60)
        const rest = minutes % 60
        if (rest === 0) return t('weeklyHours', { hours })
        return t('weeklyHoursMin', { hours, min: rest })
    }

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={t('title')}
                description={t('description')}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setShowAssignGroup(true)} disabled={schedules.length === 0 || groups.length === 0} className="gap-2 rounded-2xl h-10 border-divider/50 hover:bg-surface-variant text-xs sm:text-sm">
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('assignTo')} </span>{t('groupShort')}
                        </Button>
                        <Button variant="outline" onClick={() => setShowAssignUser(true)} disabled={schedules.length === 0 || employees.length === 0} className="gap-2 rounded-2xl h-10 border-divider/50 hover:bg-surface-variant text-xs sm:text-sm">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('assignTo')} </span>{t('userShort')}
                        </Button>
                        <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-2xl h-10 text-xs sm:text-sm">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('newTemplate')} </span>{t('newTemplateShort')}
                        </Button>
                    </>
                }
            />

            <Tabs value={tab} onValueChange={setTab} className="flex flex-col gap-6">
                <TabsList className="self-start">
                    <TabsTrigger value={TAB_TEMPLATES} className="gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {t('tabTemplates')}
                        <span className="ml-1 px-1.5 py-0.5 rounded-md bg-surface-variant text-[10px] font-bold">
                            {schedules.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value={TAB_ASSIGNMENTS} className="gap-2">
                        <CalendarRange className="w-3.5 h-3.5" />
                        {t('tabAssignments')}
                        <span className="ml-1 px-1.5 py-0.5 rounded-md bg-surface-variant text-[10px] font-bold">
                            {totalAssignments}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={TAB_TEMPLATES} className="mt-0">
                    {schedules.length === 0 ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 px-4 bg-surface/30 border border-dashed border-divider rounded-[2.5rem]">
                            <div className="w-20 h-20 rounded-3xl bg-surface border border-divider flex items-center justify-center text-text-hint mb-6 shadow-sm">
                                <Clock className="w-8 h-8 opacity-20" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">{t('noTemplates')}</h3>
                            <p className="text-sm text-text-hint text-center max-w-xs mb-8 leading-relaxed">{t('noTemplatesDesc')}</p>
                            <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-2xl h-11">
                                <Plus className="w-4 h-4" />
                                {t('createFirst')}
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <AnimatePresence mode="popLayout">
                                {schedules.map((schedule) => {
                                    const workingDays = schedule.days.filter((d) => d.is_working_day)
                                    const u = usage.get(schedule.id) ?? { total: 0, active: 0, future: 0 }
                                    return (
                                        <motion.div key={schedule.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="group relative flex flex-col gap-4 px-6 py-5 rounded-[2rem] bg-surface border border-divider/50 hover:border-primary/30 hover:bg-surface-variant/30 transition-all duration-300">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-none">{schedule.name}</h4>
                                                    <StatusBadge isActive={schedule.is_active} />
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditTemplate(schedule)} className="ml-auto h-7 rounded-lg text-[11px] gap-1 hover:bg-primary/10 hover:text-primary">
                                                        <Pencil className="w-3 h-3" />
                                                        {t('edit')}
                                                    </Button>
                                                </div>
                                                {schedule.description && (
                                                    <p className="text-xs text-text-secondary">{schedule.description}</p>
                                                )}
                                                <div className="flex items-center gap-3 text-xs text-text-hint">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        {formatWeeklyMinutes(schedule.weekly_minutes)}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {t('workingDaysCount', { count: workingDays.length })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-7 gap-1.5">
                                                {schedule.days.slice().sort((a, b) => a.weekday - b.weekday).map((day) => (
                                                    <div key={day.id} className={`flex flex-col items-center gap-0.5 rounded-xl px-1.5 py-2 border shadow-sm ${day.is_working_day ? 'bg-primary/10 border-primary/30 text-text-primary' : 'bg-surface-variant/40 border-divider text-text-hint'}`}>
                                                        <span className="text-[10px] uppercase tracking-wider font-bold">
                                                            {t(`weekdays.${day.weekday}` as any)}
                                                        </span>
                                                        {day.is_working_day ? (
                                                            <span className="text-[10px] text-text-secondary leading-tight text-center">
                                                                {formatTime(day.start_time)}<br />{formatTime(day.end_time)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] opacity-50">—</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t border-divider/50 pt-3 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary">
                                                        <CalendarRange className="w-3 h-3" />
                                                        {u.total === 0 ? t('noAssignments') : t('assignmentsCount', { count: u.total })}
                                                    </span>
                                                    {u.active > 0 && (
                                                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0 bg-success/10 text-success border-success/20">
                                                            {t('activeCount', { count: u.active })}
                                                        </Badge>
                                                    )}
                                                    {u.future > 0 && (
                                                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                                                            {t('futureCount', { count: u.future })}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {u.total > 0 && (
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setDetailTemplate(schedule)} className="h-7 rounded-lg text-[11px] gap-1 hover:bg-primary/10 hover:text-primary">
                                                        <Eye className="w-3 h-3" />
                                                        {t('viewWho')}
                                                    </Button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value={TAB_ASSIGNMENTS} className="mt-0">
                    <AssignmentsTab schedules={schedules} assignments={assignments} departmentId={departmentId} today={today} />
                </TabsContent>
            </Tabs>

            <Dialog open={showCreate} onOpenChange={(open) => !open && setShowCreate(false)}>
                <DialogContent className="sm:max-w-[700px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-8 py-6 border-b border-divider/50">
                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <DialogTitle className="text-xl font-bold text-text-primary">{t('newDialogTitle')}</DialogTitle>
                                <DialogDescription className="text-xs text-text-secondary">{t('newDialogDesc')}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
                        <ScheduleForm departmentId={departmentId} onClose={() => setShowCreate(false)} />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={editTemplate !== null} onOpenChange={(open) => !open && setEditTemplate(null)}>
                <DialogContent className="sm:max-w-[700px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-8 py-6 border-b border-divider/50">
                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <DialogTitle className="text-xl font-bold text-text-primary">{t('editDialogTitle')}</DialogTitle>
                                <DialogDescription className="text-xs text-text-secondary">{t('editDialogDesc')}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
                        {editTemplate && (
                            <ScheduleForm key={editTemplate.id} departmentId={departmentId} template={editTemplate} onClose={() => setEditTemplate(null)} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showAssignGroup} onOpenChange={(open) => !open && setShowAssignGroup(false)}>
                <DialogContent className="sm:max-w-[600px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-8 py-6 border-b border-divider/50">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <DialogTitle className="text-xl font-bold text-text-primary">{t('assignGroupDialogTitle')}</DialogTitle>
                                <DialogDescription className="text-xs text-text-secondary">{t('assignGroupDialogDesc')}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
                        <GroupScheduleAssignmentForm departmentId={departmentId} schedules={schedules} groups={groups} onClose={() => setShowAssignGroup(false)} />
                    </div>
                </DialogContent>
            </Dialog>

            <TemplateAssignmentsDialog template={detailTemplate} assignments={assignments} departmentId={departmentId} today={today} open={detailTemplate !== null} onClose={() => setDetailTemplate(null)} />

            <Dialog open={showAssignUser} onOpenChange={(open) => !open && setShowAssignUser(false)}>
                <DialogContent className="sm:max-w-[600px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
                    <DialogHeader className="px-8 py-6 border-b border-divider/50">
                        <div className="flex items-center gap-3">
                            <User className="w-6 h-6 text-primary shrink-0" />
                            <div className="flex flex-col">
                                <DialogTitle className="text-xl font-bold text-text-primary">{t('assignUserDialogTitle')}</DialogTitle>
                                <DialogDescription className="text-xs text-text-secondary">{t('assignUserDialogDesc')}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
                        <UserScheduleAssignmentForm departmentId={departmentId} schedules={schedules} employees={employees} onClose={() => setShowAssignUser(false)} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
