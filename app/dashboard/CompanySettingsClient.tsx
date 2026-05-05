'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Building2, UserPlus, Pencil, Shield, Trash2, Crown } from 'lucide-react'
import EditCompanyForm from './EditCompanyForm'
import AddSuperadminForm from './AddSuperadminForm'
import EditSuperadminForm from './EditSuperadminForm'
import ConfirmDialog from '@/components/ConfirmDialog'
import { deleteSuperadminAction } from '@/app/actions/superadmin/superadmin/delete-superadmin'

interface SuperadminUser { id: number; name: string; email: string; is_active: boolean }
interface CompanyDetails {
  id: number; name: string; cif_nif: string; email: string
  address_line: string; city: string; postal_code: string
  owner_id: number | null
}

interface Props {
  company: CompanyDetails
  superadmins: SuperadminUser[]
}

export default function CompanySettingsClient({ company, superadmins }: Props) {
  const router = useRouter()
  const [editCompanyOpen, setEditCompanyOpen] = useState(false)
  const [addSuperadminOpen, setAddSuperadminOpen] = useState(false)
  const [editingSuperadmin, setEditingSuperadmin] = useState<SuperadminUser | null>(null)
  const [deletingSuperadmin, setDeletingSuperadmin] = useState<SuperadminUser | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleConfirmDelete = () => {
    if (!deletingSuperadmin) return
    setDeleteError(null)
    const target = deletingSuperadmin
    startTransition(async () => {
      const result = await deleteSuperadminAction(target.id)
      if (result && 'error' in result) {
        setDeleteError(result.error)
        toast.error(result.error)
        return
      }
      if (result && 'success' in result) toast.success(result.success)
      setDeletingSuperadmin(null)
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium tracking-widest text-text-hint uppercase">Empresa</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditCompanyOpen(true)}
            className="gap-1.5 text-xs text-text-secondary hover:text-text-primary rounded-xl h-8"
          >
            <Pencil className="w-3.5 h-3.5" /> Editar
          </Button>
        </div>

        {/* Company info card */}
        <div className="rounded-2xl bg-surface border border-divider p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-text-primary">{company.name}</p>
              {company.cif_nif && <p className="text-xs text-text-hint">{company.cif_nif}</p>}
            </div>
          </div>
          {(company.email || company.address_line || company.city) && (
            <div className="grid grid-cols-1 gap-1.5 pt-2 border-t border-divider/50">
              {company.email && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-hint w-16">Email</span>
                  {company.email}
                </div>
              )}
              {company.address_line && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-hint w-16">Dirección</span>
                  {company.address_line}{company.city ? `, ${company.city}` : ''}{company.postal_code ? ` ${company.postal_code}` : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Superadmins */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-widest text-text-hint uppercase">Administradores</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAddSuperadminOpen(true)}
              className="gap-1.5 text-xs text-text-secondary hover:text-text-primary rounded-xl h-8"
            >
              <UserPlus className="w-3.5 h-3.5" /> Añadir
            </Button>
          </div>
          {superadmins.map((u) => {
            const isOwner = company.owner_id === u.id
            return (
              <div key={u.id} className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-divider">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{u.name}</p>
                  <p className="text-xs text-text-hint truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isOwner ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-warning" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-warning">Owner</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Super</span>
                    </>
                  )}
                </div>
                {!isOwner && (
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingSuperadmin(u)}
                      className="h-8 w-8 rounded-lg"
                      aria-label="Editar administrador"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => { setDeleteError(null); setDeletingSuperadmin(u) }}
                      className="h-8 w-8 rounded-lg text-error hover:bg-error/10"
                      aria-label="Eliminar administrador"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <EditCompanyForm company={company} open={editCompanyOpen} onClose={() => setEditCompanyOpen(false)} />
      <AddSuperadminForm open={addSuperadminOpen} onClose={() => setAddSuperadminOpen(false)} />
      <EditSuperadminForm
        superadmin={editingSuperadmin}
        open={editingSuperadmin !== null}
        onClose={() => setEditingSuperadmin(null)}
      />
      <ConfirmDialog
        open={deletingSuperadmin !== null}
        title="Eliminar administrador"
        description={
          deletingSuperadmin ? (
            <>
              Vas a eliminar al administrador <span className="font-bold text-text-primary">"{deletingSuperadmin.name}"</span>. Esta acción no se puede deshacer.
            </>
          ) : ''
        }
        confirmLabel="Eliminar"
        pending={isPending}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
        onClose={() => { setDeleteError(null); setDeletingSuperadmin(null) }}
      />
    </>
  )
}
