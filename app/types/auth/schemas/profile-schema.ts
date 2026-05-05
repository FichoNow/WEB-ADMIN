import { z } from 'zod'

export const profileSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre no puede estar vacío').max(100).optional().or(z.literal('')),
    email: z.string().trim().email('Email no válido').optional().or(z.literal('')),
    password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
    password_confirm: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => (data.name ?? '') !== '' || (data.email ?? '') !== '' || (data.password ?? '') !== '',
    { message: 'Indica al menos un campo para actualizar', path: ['name'] },
  )
  .refine(
    (data) => !data.password || data.password === data.password_confirm,
    { message: 'Las contraseñas no coinciden', path: ['password_confirm'] },
  )

export type ProfileFormValues = z.infer<typeof profileSchema>
