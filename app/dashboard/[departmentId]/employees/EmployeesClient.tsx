'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Plus, Filter, MoreVertical, Mail, Hash } from 'lucide-react'
import type { EmployeeListItem } from '@/app/types/admin/api/employee-response'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import PageHeader from '@/components/PageHeader'
import CreateEmployeeForm from './CreateEmployeeForm'
import EditEmployeeForm from './EditEmployeeForm'
import GroupsManager from './GroupsManager'

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge 
      variant={role === 'ADMINISTRATOR' ? 'default' : 'secondary'} 
      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
        role === 'ADMINISTRATOR' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-variant text-text-secondary border-divider'
      }`}
    >
      {role === 'ADMINISTRATOR' ? 'Admin' : 'Usuario'}
    </Badge>
  )
}

interface Props {
  employees: EmployeeListItem[]
  groups: GroupResponse[]
  departmentId: number
}

const FILTER_ALL = '__all__'
const FILTER_NONE = '__none__'

const GROUP_LABELS: Record<string, string> = {
  [FILTER_ALL]: 'Todos los grupos',
  [FILTER_NONE]: 'Sin grupo',
}

export default function EmployeesClient({ employees, groups, departmentId }: Props) {
  const [showCreate, setShowCreate] = useState(false)
  const [showGroups, setShowGroups] = useState(false)
  const [editEmployee, setEditEmployee] = useState<EmployeeListItem | null>(null)
  const [groupFilter, setGroupFilter] = useState<string>(FILTER_ALL)
  const [search, setSearch] = useState('')

  const groupNameById = useMemo(() => {
    const m = new Map<number, string>()
    groups.forEach((g) => m.set(g.id, g.name))
    return m
  }, [groups])

  const filtered = useMemo(() => {
    let result = employees
    
    // Group filter
    if (groupFilter !== FILTER_ALL) {
      if (groupFilter === FILTER_NONE) {
        result = result.filter((e) => e.group_id == null)
      } else {
        const id = Number(groupFilter)
        result = result.filter((e) => e.group_id === id)
      }
    }

    // Search filter
    if (search.trim()) {
      const s = search.toLowerCase()
      result = result.filter((e) => 
        e.name.toLowerCase().includes(s) || 
        e.email.toLowerCase().includes(s)
      )
    }

    return result
  }, [employees, groupFilter, search])

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Plantilla"
        description="Gestiona los empleados del departamento, sus grupos y roles de acceso."
        actions={
          <>
            <Button variant="outline" onClick={() => setShowGroups(true)} className="gap-2 rounded-2xl h-10 border-divider/50 hover:bg-surface-variant text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Gestionar </span>Grupos
            </Button>
            <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-2xl h-10 text-xs sm:text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo </span>Empleado
            </Button>
          </>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-hint" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium placeholder:text-text-hint"
          />
        </div>

        <Select value={groupFilter} onValueChange={(v) => setGroupFilter(v ?? FILTER_ALL)}>
          <SelectTrigger className="w-full sm:w-52 h-11 bg-surface border-divider/50 rounded-xl text-xs font-medium">
            <Filter className="w-3.5 h-3.5 mr-2 text-primary" />
            <span className="truncate">
              {GROUP_LABELS[groupFilter] ?? groupNameById.get(Number(groupFilter)) ?? groupFilter}
            </span>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-divider">
            <SelectItem value={FILTER_ALL} className="text-xs">Todos los grupos</SelectItem>
            <SelectItem value={FILTER_NONE} className="text-xs">Sin grupo</SelectItem>
            {groups.map((g) => (
              <SelectItem key={g.id} value={String(g.id)} className="text-xs">{g.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-primary">{filtered.length}</span>
          <span className="text-xs text-text-hint">empleados encontrados</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 bg-surface/30 border border-dashed border-divider rounded-[2.5rem]"
        >
          <div className="w-20 h-20 rounded-3xl bg-surface border border-divider flex items-center justify-center text-text-hint mb-6 shadow-sm">
            <Users className="w-8 h-8 opacity-20" />
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            {employees.length === 0 ? 'No hay empleados aún' : 'Sin resultados'}
          </h3>
          <p className="text-sm text-text-hint text-center max-w-xs mb-8 leading-relaxed">
            {employees.length === 0
              ? 'Añade a tu primer colaborador para empezar a gestionar el departamento.'
              : 'No hemos encontrado a nadie que coincida con tu búsqueda actual.'}
          </p>
          {employees.length === 0 && (
            <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-2xl h-11">
              <Plus className="w-4 h-4" />
              Añadir primer empleado
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((emp) => {
              const groupName = emp.group_id != null ? groupNameById.get(emp.group_id) : null
              return (
                <motion.div
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex items-center justify-between px-6 py-5 rounded-[2rem] bg-surface border border-divider/50 hover:border-primary/30 hover:bg-surface-variant/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    {/* Avatar with gradient */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-lg border border-primary/10 shadow-inner group-hover:scale-105 transition-transform">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      {!emp.is_active && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-error border-4 border-surface" />
                      )}
                      {emp.is_active && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-4 border-surface shadow-sm" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-none">
                          {emp.name}
                        </h4>
                        <RoleBadge role={emp.role} />
                        {groupName && (
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-surface/50 border-divider/50 text-text-secondary">
                            <Hash className="w-2.5 h-2.5 mr-1 opacity-50" />
                            {groupName}
                          </Badge>
                        )}
                        {!emp.is_active && (
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-error/10 text-error border border-error/20">Inactivo</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-text-hint">
                          <Mail className="w-3 h-3" />
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditEmployee(emp)}
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

      {/* Dialogs remain similar but with consistent styling */}
      <Dialog open={showCreate} onOpenChange={(open) => !open && setShowCreate(false)}>
        <DialogContent className="sm:max-w-[700px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-8 py-6 border-b border-divider/50">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">Gestión de Plantilla</DialogTitle>
                <DialogDescription className="text-xs text-text-secondary">Añade uno o varios colaboradores al departamento.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
            <CreateEmployeeForm departmentId={departmentId} groups={groups} onClose={() => setShowCreate(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editEmployee} onOpenChange={(open) => !open && setEditEmployee(null)}>
        <DialogContent className="sm:max-w-[600px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-8 py-6 border-b border-divider/50">
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">Editar Perfil</DialogTitle>
                <DialogDescription className="text-xs text-text-secondary">Modifica los datos de acceso y perfil del empleado.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
            {editEmployee && (
              <EditEmployeeForm
                employee={editEmployee}
                departmentId={departmentId}
                groups={groups}
                onClose={() => setEditEmployee(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showGroups} onOpenChange={(open) => !open && setShowGroups(false)}>
        <DialogContent className="sm:max-w-[500px] bg-surface border-divider rounded-[2.5rem] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-8 py-6 border-b border-divider/50">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <DialogTitle className="text-xl font-bold text-text-primary">Grupos de Trabajo</DialogTitle>
                <DialogDescription className="text-xs text-text-secondary">Organiza y segmenta tu plantilla por equipos.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto px-10 py-8">
            <GroupsManager departmentId={departmentId} groups={groups} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

