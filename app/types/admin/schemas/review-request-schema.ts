import { z } from 'zod'

export const reviewRequestSchema = z.object({
  comment: z.string().trim().max(500, 'validation.max500').optional().or(z.literal('')),
})

export type ReviewRequestFormValues = z.infer<typeof reviewRequestSchema>
