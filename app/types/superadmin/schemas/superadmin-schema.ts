import { z } from 'zod'

export const addSuperadminSchema = z.object({
  name:     z.string().min(1, 'validation.required').max(150),
  email:    z.string().email('validation.invalidEmail'),
  password: z.string().min(6, 'validation.min6'),
})

export type AddSuperadminFormValues = z.infer<typeof addSuperadminSchema>

export const editSuperadminSchema = z.object({
  name:  z.string().trim().min(1, 'validation.required').max(150).optional().or(z.literal('')),
  email: z.string().trim().email('validation.invalidEmail').optional().or(z.literal('')),
})

export type EditSuperadminFormValues = z.infer<typeof editSuperadminSchema>
