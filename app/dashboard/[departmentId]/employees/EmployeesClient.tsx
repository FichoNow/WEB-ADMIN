'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBulkEmployeesAction, updateEmployeeAction } from '@/app/actions/admin/employees'
import type { EmployeeListItem, EmployeeActionState, EmployeeRole } from '@/app/types/admin/employee'
import type { BulkEmployeeRow } from '@/app/actions/admin/employees'

// Estilos reutilizables
const input = "w-full rounded-xl px-4 py-3 text-sm bg-bg border border-input-stroke text-text-primary placeholder:text-text-hint outline-none focus:border-primary transition-colors"
const label = "text-xs font-medium text-text-secondary"

// Muestra un mensaje de error o éxito
function Alert({ state }: { state: EmployeeActionState }) {
  if (!state) return null
  if ('error' in state)
    return <p className="text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-3">{state.error}</p>
  if ('success' in state)
    return <p className="text-sm text-success bg-success/10 border border-success/30 rounded-xl px-4 py-3">{state.success}</p>
  return null
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === 'ADMINISTRATOR'
  return (
    <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-[10px]">
      {isAdmin ? 'Admin' : 'Usuario'}
    </Badge>
  )
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Contenedor de modal genérico usando Shadcn
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-surface border-divider">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary">{title}</DialogTitle>
          <DialogDescription className="hidden">Modal for {title}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto px-1 py-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Modal para crear empleados (empieza con 1 fila, se pueden añadir más)
function CreateModal({ departmentId, onClose }: { departmentId: number; onClose: () => void }) {
  const router = useRouter()
  const newRow = (): BulkEmployeeRow => ({ name: '', email: '', password: '', role: 'USER' })
  const [rows, setRows] = useState<BulkEmployeeRow[]>([newRow()])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateRow(index: number, field: keyof BulkEmployeeRow, value: string) {
    const updated = [...rows]
    updated[index] = { ...updated[index], [field]: value }
    setRows(updated)
  }

  function addRow() {
    setRows([...rows, newRow()])
  }

  function removeRow(index: number) {
    setRows(rows.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const result = await createBulkEmployeesAction(departmentId, rows)
    setLoading(false)
    if (result && 'error' in result) {
      setError(result.error)
    } else {
      router.refresh()
      onClose()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-error bg-error/10 border border-error/30 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-bg rounded-xl border border-divider">
            <Input value={row.name} onChange={e => updateRow(i, 'name', e.target.value)} placeholder="Nombre" />
            <Input value={row.email} onChange={e => updateRow(i, 'email', e.target.value)} type="email" placeholder="Email" />
            <Input value={row.password} onChange={e => updateRow(i, 'password', e.target.value)} type="password" placeholder="Contraseña" />
            <div className="flex gap-2">
              <Select value={row.role} onValueChange={value => updateRow(i, 'role', value as EmployeeRole)}>
                <SelectTrigger className="flex-1 w-full bg-surface">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="ADMINISTRATOR">Admin</SelectItem>
                </SelectContent>
              </Select>
              {rows.length > 1 && (
                <Button variant="destructive" size="icon" onClick={() => removeRow(i)} className="shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button variant="ghost" onClick={addRow} className="self-start gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Añadir otro
      </Button>

      <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
        {loading ? 'Creando...' : rows.length === 1 ? 'Crear empleado' : `Crear ${rows.length} empleados`}
      </Button>
    </div>
  )
}

// Modal para editar un empleado (los campos vienen pre-rellenos)
function EditModal({ employee, departmentId, onClose }: { employee: EmployeeListItem; departmentId: number; onClose: () => void }) {
  const router = useRouter()
  const action = updateEmployeeAction.bind(null, departmentId, employee.id)
  const [state, dispatch, pending] = useActionState<EmployeeActionState, FormData>(action, undefined)

  useEffect(() => {
    if (state && 'success' in state) {
      router.refresh()
      onClose()
    }
  }, [state, router, onClose])

  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <Alert state={state} />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className={label}>Nombre</label>
          <Input name="name" type="text" defaultValue={employee.name} />
        </div>
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className={label}>Email</label>
          <Input name="email" type="email" defaultValue={employee.email} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Nueva contraseña <span className="text-text-hint">(opcional)</span></label>
          <Input name="password" type="password" placeholder="Mín. 8 caracteres" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Rol</label>
          <Select name="role" defaultValue={employee.role}>
            <SelectTrigger className="w-full bg-surface">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Usuario</SelectItem>
              <SelectItem value="ADMINISTRATOR">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Estado</label>
          <Select name="is_active" defaultValue={String(employee.is_active)}>
            <SelectTrigger className="w-full bg-surface">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Activo</SelectItem>
              <SelectItem value="false">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </form>
  )
}

// Página principal de empleados
export default function EmployeesClient({ employees, departmentId }: { employees: EmployeeListItem[]; departmentId: number }) {
  const [showCreate, setShowCreate] = useState(false)
  const [editEmployee, setEditEmployee] = useState<EmployeeListItem | null>(null)

  return (
    <>
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest text-primary uppercase">Empleados</p>
          <h1 className="text-3xl font-light tracking-tight text-text-primary">Gestión de empleados</h1>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2 rounded-xl">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo empleado
        </Button>
      </div>

      <div className="h-px bg-divider" />

      {/* Lista de empleados */}
      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface/30 border border-dashed border-divider rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-surface border border-divider flex items-center justify-center text-text-hint mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">Sin empleados</h3>
          <p className="text-sm text-text-hint text-center max-w-sm mb-6">Aún no hay ningún empleado registrado en este departamento. Añade el primero para empezar a gestionar los fichajes.</p>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Añadir primer empleado
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {employees.map(emp => (
            <div key={emp.id}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface border border-divider hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                {/* Avatar con inicial */}
                <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center text-sm font-medium text-text-secondary shrink-0">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                    {emp.name}
                    <RoleBadge role={emp.role} />
                    {!emp.is_active && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-error/20 text-error">Inactivo</span>
                    )}
                  </p>
                  <p className="text-xs text-text-hint">{emp.email}</p>
                </div>
              </div>
              {/* Botón editar */}
              <Button variant="ghost" size="icon" onClick={() => setEditEmployee(emp)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear */}
      {showCreate && (
        <Modal title="Nuevo empleado" onClose={() => setShowCreate(false)}>
          <CreateModal departmentId={departmentId} onClose={() => setShowCreate(false)} />
        </Modal>
      )}

      {/* Modal editar */}
      {editEmployee && (
        <Modal title={`Editar · ${editEmployee.name}`} onClose={() => setEditEmployee(null)}>
          <EditModal employee={editEmployee} departmentId={departmentId} onClose={() => setEditEmployee(null)} />
        </Modal>
      )}
    </>
  )
}
