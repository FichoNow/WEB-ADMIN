import { z } from 'zod'

export const registerSchema = z
  .object({
    company_name:          z.string().min(1, 'Obligatorio').max(150, 'Máximo 150 caracteres'),
    company_cif_nif:       z.string().min(1, 'Obligatorio').max(20, 'Máximo 20 caracteres'),
    company_email:         z.string().min(1, 'Obligatorio').email('Email inválido'),
    company_address_line:  z.string().min(1, 'Obligatorio'),
    company_city:          z.string().min(1, 'Obligatorio'),
    company_postal_code:   z.string().min(1, 'Obligatorio').max(10, 'Máximo 10 caracteres'),
    user_name:             z.string().min(1, 'Obligatorio'),
    user_email:            z.string().min(1, 'Obligatorio').email('Email inválido'),
    user_password:         z.string().min(8, 'Mínimo 8 caracteres'),
    user_password_confirm: z.string().min(1, 'Obligatorio'),
  })
  .refine((v) => v.user_password === v.user_password_confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['user_password_confirm'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
