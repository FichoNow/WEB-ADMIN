import { z } from 'zod'

export const reviewRequestSchema = z.object({
  comment: z.string().trim().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
})

export type ReviewRequestFormValues = z.infer<typeof reviewRequestSchema>
