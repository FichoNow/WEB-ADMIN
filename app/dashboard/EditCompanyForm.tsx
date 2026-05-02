'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { updateCompanyAction } from '@/app/actions/superadmin/company/update-company'
import { updateCompanySchema, type UpdateCompanyFormValues } from '@/app/types/superadmin/schemas/company-schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Building2, CheckCircle2 } from 'lucide-react'

interface CompanyDetails {
  id: number
  name: string
  cif_nif: string
  email: string
  address_line: string
  city: string
  postal_code: string
}

interface Props {
  company: CompanyDetails
  open: boolean
  onClose: () => void
}

export default function EditCompanyForm({ company, open, onClose }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const form = useForm<UpdateCompanyFormValues>({
    resolver: zodResolver(updateCompanySchema),
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

  const onSubmit = (values: UpdateCompanyFormValues) => {
    const formData = new FormData()
    Object.entries(values).forEach(([k, v]) => { if (v) formData.set(k, v) })
    startTransition(async () => {
      const result = await updateCompanyAction({}, formData)
      if (result?.error) {
        form.setError('root', { message: result.error })
        return
      }
      setSuccess(true)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setSuccess(false); onClose() } }}>
      <DialogContent className="bg-surface border-divider max-w-[calc(100vw-2rem)] sm:max-w-lg">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <FormLabel>Nombre de la empresa</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="cif_nif" render={({ field }) => (
                <FormItem>
                  <FormLabel>CIF / NIF</FormLabel>
                  <FormControl><Input placeholder="B12345678" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="empresa@mail.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address_line" render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl><Input placeholder="Calle Ejemplo 1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="postal_code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Código postal</FormLabel>
                  <FormControl><Input placeholder="08001" {...field} /></FormControl>
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
