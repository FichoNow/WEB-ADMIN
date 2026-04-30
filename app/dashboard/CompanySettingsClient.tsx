'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { updateCompanyAction, addSuperadminAction } from '@/app/actions/superadmin/company'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, UserPlus, Pencil, CheckCircle2, Shield } from 'lucide-react'

interface SuperadminUser { id: number; name: string; email: string; is_active: boolean }
interface CompanyDetails {
  id: number; name: string; cif_nif: string; email: string
  address_line: string; city: string; postal_code: string
}

// ── Edit company modal ──────────────────────────────────────────
const companyFormSchema = z.object({
  name:         z.string().min(1, 'Requerido').max(150).optional().or(z.literal('')),
  cif_nif:      z.string().max(20).optional().or(z.literal('')),
  email:        z.string().email('Email inválido').optional().or(z.literal('')),
  address_line: z.string().max(200).optional().or(z.literal('')),
  city:         z.string().max(100).optional().or(z.literal('')),
  postal_code:  z.string().max(10).optional().or(z.literal('')),
})
type CompanyFormValues = z.infer<typeof companyFormSchema>

function EditCompanyModal({ company, open, onClose }: { company: CompanyDetails; open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name:         company.name,
      cif_nif:      company.cif_nif,
      email:        company.email,
      address_line: company.address_line,
      city:         company.city,
      postal_code:  company.postal_code,
    },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: CompanyFormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => { if (v) formData.set(k, v) })
    startTransition(async () => {
      const result = await updateCompanyAction(undefined, formData)
      if (result?.error) { form.setError('root', { message: result.error }); return }
      setSuccess(true)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setSuccess(false); onClose() } }}>
      <DialogContent className="bg-surface border-divider sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Editar empresa
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            Actualiza los datos de tu empresa. Deja en blanco los campos que no quieras modificar.
          </DialogDescription>
        </DialogHeader>
        {success && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Datos actualizados correctamente
          </div>
        )}
        {globalError && (
          <Alert variant="destructive"><AlertDescription>{globalError}</AlertDescription></Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nombre de la empresa</FormLabel>
                  <FormControl><Input className="bg-surface/60 border-divider/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cif_nif" render={({ field }) => (
                <FormItem>
                  <FormLabel>CIF / NIF</FormLabel>
                  <FormControl><Input className="bg-surface/60 border-divider/50" placeholder="B12345678" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input className="bg-surface/60 border-divider/50" placeholder="empresa@mail.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address_line" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl><Input className="bg-surface/60 border-divider/50" placeholder="Calle Ejemplo 1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl><Input className="bg-surface/60 border-divider/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="postal_code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Código postal</FormLabel>
                  <FormControl><Input className="bg-surface/60 border-divider/50" placeholder="08001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Guardando...' : 'Guardar'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// ── Add superadmin modal ────────────────────────────────────────
const superadminSchema = z.object({
  name:     z.string().min(1, 'Requerido').max(150),
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type SuperadminFormValues = z.infer<typeof superadminSchema>

function AddSuperadminModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const form = useForm<SuperadminFormValues>({
    resolver: zodResolver(superadminSchema),
    defaultValues: { name: '', email: '', password: '' },
  })
  const globalError = form.formState.errors.root?.message

  const onSubmit = (values: SuperadminFormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => formData.set(k, v))
    startTransition(async () => {
      const result = await addSuperadminAction(undefined, formData)
      if (result?.error) { form.setError('root', { message: result.error }); return }
      setSuccess(true)
      router.refresh()
      setTimeout(() => { form.reset(); setSuccess(false); onClose() }, 1500)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setSuccess(false); onClose() } }}>
      <DialogContent className="bg-surface border-divider sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Añadir superadmin
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            El nuevo superadmin tendrá acceso total a la empresa y sus departamentos.
          </DialogDescription>
        </DialogHeader>
        {success && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Administrador creado. Deberá cambiar su contraseña al iniciar sesión.
          </div>
        )}
        {globalError && (
          <Alert variant="destructive"><AlertDescription>{globalError}</AlertDescription></Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nombre</FormLabel>
                <FormControl><Input className="bg-surface/60 border-divider/50" placeholder="Nombre completo" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel>
                <FormControl><Input className="bg-surface/60 border-divider/50" placeholder="admin@empresa.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Contraseña temporal</FormLabel>
                <FormControl><Input type="password" className="bg-surface/60 border-divider/50" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Creando...' : 'Crear administrador'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// ── Main export ─────────────────────────────────────────────────
interface Props {
  company: CompanyDetails
  superadmins: SuperadminUser[]
}

export default function CompanySettingsClient({ company, superadmins }: Props) {
  const [editCompanyOpen, setEditCompanyOpen] = useState(false)
  const [addSuperadminOpen, setAddSuperadminOpen] = useState(false)

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
          {superadmins.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-divider">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs shrink-0">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{u.name}</p>
                <p className="text-xs text-text-hint truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Super</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditCompanyModal company={company} open={editCompanyOpen} onClose={() => setEditCompanyOpen(false)} />
      <AddSuperadminModal open={addSuperadminOpen} onClose={() => setAddSuperadminOpen(false)} />
    </>
  )
}
