import { z } from 'zod'

export const addSuperadminSchema = z.object({
  name:     z.string().min(1, 'Obligatorio').max(150),
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export type AddSuperadminFormValues = z.infer<typeof addSuperadminSchema>
