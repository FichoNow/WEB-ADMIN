import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Obligatorio').email('Email inválido'),
  password: z.string().min(1, 'Obligatorio'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
