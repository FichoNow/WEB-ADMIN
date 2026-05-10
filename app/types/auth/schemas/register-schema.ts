import { z } from 'zod'

export const registerSchema = z
  .object({
    company_name:          z.string().min(1, 'validation.required').max(150, 'validation.max150'),
    company_cif_nif:       z.string().min(1, 'validation.required').max(20, 'validation.max20'),
    company_email:         z.string().min(1, 'validation.required').email('validation.invalidEmail'),
    company_address_line:  z.string().min(1, 'validation.required'),
    company_city:          z.string().min(1, 'validation.required'),
    company_postal_code:   z.string().min(1, 'validation.required').max(10, 'validation.max10'),
    user_name:             z.string().min(1, 'validation.required'),
    user_email:            z.string().min(1, 'validation.required').email('validation.invalidEmail'),
    user_password:         z.string().min(8, 'validation.min8'),
    user_password_confirm: z.string().min(1, 'validation.required'),
  })
  .refine((v) => v.user_password === v.user_password_confirm, {
    message: 'validation.passwordsMismatch',
    path: ['user_password_confirm'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
