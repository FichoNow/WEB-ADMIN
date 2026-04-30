'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createGroupAction,
  deleteGroupAction,
  updateGroupAction,
} from '@/app/actions/admin/groups'
import type { GroupResponse } from '@/app/types/admin/api/group-response'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  departmentId: number
  groups: GroupResponse[]
}

export default function GroupsManager({ departmentId, groups }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<GroupResponse | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleCreate = () => {
    setError(null)
    if (!newName.trim()) {
      setError('Nombre obligatorio')
      return
    }
    startTransition(async () => {
      const res = await createGroupAction(departmentId, { name: newName.trim() })
      if (res && 'error' in res) {
        setError(res.error)
        return
      }
      setNewName('')
      router.refresh()
    })
  }

  const handleSaveEdit = (id: number) => {
    setError(null)
    if (!editingName.trim()) {
      setError('Nombre obligatorio')
      return
    }
    startTransition(async () => {
      const res = await updateGroupAction(departmentId, id, { name: editingName.trim() })
      if (res && 'error' in res) {
        setError(res.error)
        return
      }
      setEditingId(null)
      router.refresh()
    })
  }

  const handleConfirmDelete = () => {
    if (!confirmDelete) return
    setDeleteError(null)
    const id = confirmDelete.id
    startTransition(async () => {
      const res = await deleteGroupAction(departmentId, id)
      if (res && 'error' in res) {
        setDeleteError(res.error)
        return
      }
      setConfirmDelete(null)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Nombre del nuevo grupo"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={isPending}
        />
        <Button onClick={handleCreate} disabled={isPending} className="shrink-0">
          {isPending ? 'Creando...' : 'Crear'}
        </Button>
      </div>

      <div className="h-px bg-divider" />

      {groups.length === 0 ? (
        <p className="text-sm text-text-hint text-center py-6">No hay grupos creados.</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          {groups.map((g) => (
            <div
              key={g.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-divider"
            >
              {editingId === g.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    disabled={isPending}
                    autoFocus
                  />
                  <Button size="sm" onClick={() => handleSaveEdit(g.id)} disabled={isPending}>
                    Guardar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-text-primary">{g.name}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(g.id)
                      setEditingName(g.name)
                      setError(null)
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setConfirmDelete(g)
                      setDeleteError(null)
                    }}
                    disabled={isPending}
                  >
                    <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[420px] bg-surface border-divider">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-text-primary">
              Eliminar grupo
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary">
              {confirmDelete && (
                <>
                  ¿Seguro que quieres eliminar el grupo{' '}
                  <span className="font-medium text-text-primary">"{confirmDelete.name}"</span>?
                  <br />
                  Esta acción no se puede deshacer.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <Alert variant="destructive">
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              {isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
