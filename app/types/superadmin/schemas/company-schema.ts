import { z } from 'zod'

export const updateCompanySchema = z.object({
  name:         z.string().min(1, 'Obligatorio').max(150).optional().or(z.literal('')),
  cif_nif:      z.string().min(1, 'Obligatorio').max(20).optional().or(z.literal('')),
  email:        z.string().email('Email inválido').optional().or(z.literal('')),
  address_line: z.string().min(1, 'Obligatorio').max(200).optional().or(z.literal('')),
  city:         z.string().min(1, 'Obligatorio').max(100).optional().or(z.literal('')),
  postal_code:  z.string().min(1, 'Obligatorio').max(10).optional().or(z.literal('')),
})

export type UpdateCompanyFormValues = z.infer<typeof updateCompanySchema>
