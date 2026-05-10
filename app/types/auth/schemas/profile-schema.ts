import { z } from 'zod'

export const profileSchema = z
  .object({
    name: z.string().trim().min(1, 'validation.nameNotEmpty').max(100).optional().or(z.literal('')),
    email: z.string().trim().email('validation.invalidEmail').optional().or(z.literal('')),
    password: z.string().min(8, 'validation.min8').optional().or(z.literal('')),
    password_confirm: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => (data.name ?? '') !== '' || (data.email ?? '') !== '' || (data.password ?? '') !== '',
    { message: 'validation.atLeastOneField', path: ['name'] },
  )
  .refine(
    (data) => !data.password || data.password === data.password_confirm,
    { message: 'validation.passwordsMismatch', path: ['password_confirm'] },
  )

export type ProfileFormValues = z.infer<typeof profileSchema>
