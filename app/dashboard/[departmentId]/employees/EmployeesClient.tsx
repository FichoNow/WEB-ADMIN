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

// Badge de rol del empleado
function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === 'ADMINISTRATOR'
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-text-secondary'}`}>
      {isAdmin ? 'Admin' : 'Usuario'}
    </span>
  )
}

// Contenedor de modal genérico
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const cerrar = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', cerrar)
    return () => window.removeEventListener('keydown', cerrar)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-surface rounded-2xl border border-divider shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-divider">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-hint hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 flex flex-col gap-4">{children}</div>
      </div>
    </div>
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
            <input value={row.name} onChange={e => updateRow(i, 'name', e.target.value)} placeholder="Nombre" className={input} />
            <input value={row.email} onChange={e => updateRow(i, 'email', e.target.value)} type="email" placeholder="Email" className={input} />
            <input value={row.password} onChange={e => updateRow(i, 'password', e.target.value)} type="password" placeholder="Contraseña" className={input} />
            <div className="flex gap-2">
              <select value={row.role} onChange={e => updateRow(i, 'role', e.target.value as EmployeeRole)} className={`${input} flex-1`}>
                <option value="USER">Usuario</option>
                <option value="ADMINISTRATOR">Admin</option>
              </select>
              {rows.length > 1 && (
                <button onClick={() => removeRow(i)} className="px-2 text-error hover:text-error/80 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={addRow} className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 self-start transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Añadir otro
      </button>

      <button onClick={handleSubmit} disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark disabled:opacity-50 transition-colors">
        {loading ? 'Creando...' : rows.length === 1 ? 'Crear empleado' : `Crear ${rows.length} empleados`}
      </button>
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
          <input name="name" type="text" defaultValue={employee.name} className={input} />
        </div>
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className={label}>Email</label>
          <input name="email" type="email" defaultValue={employee.email} className={input} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Nueva contraseña <span className="text-text-hint">(opcional)</span></label>
          <input name="password" type="password" placeholder="Mín. 8 caracteres" className={input} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Rol</label>
          <select name="role" defaultValue={employee.role} className={input}>
            <option value="USER">Usuario</option>
            <option value="ADMINISTRATOR">Administrador</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label}>Estado</label>
          <select name="is_active" defaultValue={String(employee.is_active)} className={input}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>
      <button type="submit" disabled={pending}
        className="w-full py-3 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark disabled:opacity-50 transition-colors">
        {pending ? 'Guardando...' : 'Guardar cambios'}
      </button>
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
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo empleado
        </button>
      </div>

      <div className="h-px bg-divider" />

      {/* Lista de empleados */}
      {employees.length === 0 ? (
        <p className="text-sm text-text-hint py-8 text-center">No hay empleados en este departamento todavía.</p>
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
              <button onClick={() => setEditEmployee(emp)}
                className="p-2 rounded-lg text-text-hint hover:text-primary hover:bg-primary/10 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
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
