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

import { Trash2, Edit3, Plus, X, Check, Users } from 'lucide-react'

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
      setError('El nombre del grupo es obligatorio')
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
      setError('El nombre no puede estar vacío')
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
    <div className="flex flex-col gap-6">
      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-hint ml-1">Nuevo grupo</label>
        <div className="flex gap-2">
          <Input
            placeholder="Ej. Marketing, IT, Ventas..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={isPending}
          />
          <Button onClick={handleCreate} disabled={isPending} className="shrink-0 h-11 px-6 rounded-xl">
            {isPending ? '...' : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="h-px bg-divider/50" />

      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-hint ml-1">Grupos actuales ({groups.length})</label>
        {groups.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center bg-surface-variant/20 rounded-[2rem] border border-dashed border-divider/50">
            <p className="text-sm text-text-hint">No hay grupos creados aún.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
            {groups.map((g) => (
              <div
                key={g.id}
                className="group flex items-center gap-3 px-6 py-5 rounded-2xl bg-surface border border-divider hover:border-primary/40 hover:bg-surface-variant transition-all duration-200"
              >
                {editingId === g.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      disabled={isPending}
                      autoFocus
                    />
                    <Button size="icon" onClick={() => handleSaveEdit(g.id)} disabled={isPending} className="h-9 w-9 bg-success hover:bg-success/90">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending} className="h-9 w-9">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Users className="w-5 h-5 text-text-hint group-hover:text-primary transition-colors duration-200 shrink-0" />
                    <span className="flex-1 text-base font-medium text-text-primary">{g.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => {
                          setEditingId(g.id)
                          setEditingName(g.name)
                          setError(null)
                        }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg text-error hover:bg-error/10"
                        onClick={() => {
                          setConfirmDelete(g)
                          setDeleteError(null)
                        }}
                        disabled={isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[400px] bg-surface border-divider rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-text-primary">
              Eliminar grupo
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary mt-2">
              {confirmDelete && (
                <>
                  ¿Seguro que quieres eliminar el grupo <span className="font-bold text-text-primary">"{confirmDelete.name}"</span>? Esta acción no se puede deshacer.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
              className="w-full h-11 rounded-xl"
            >
              {isPending ? 'Eliminando...' : 'Eliminar grupo'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete(null)}
              disabled={isPending}
              className="w-full h-11 rounded-xl"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
