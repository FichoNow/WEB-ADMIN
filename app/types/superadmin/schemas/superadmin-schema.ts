import { z } from 'zod'

export const addSuperadminSchema = z.object({
  name:     z.string().min(1, 'Obligatorio').max(150),
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export type AddSuperadminFormValues = z.infer<typeof addSuperadminSchema>

export const editSuperadminSchema = z.object({
  name:  z.string().trim().min(1, 'Obligatorio').max(150).optional().or(z.literal('')),
  email: z.string().trim().email('Email inválido').optional().or(z.literal('')),
})

export type EditSuperadminFormValues = z.infer<typeof editSuperadminSchema>
