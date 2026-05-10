import { z } from 'zod'

export const departmentSchema = z.object({
  name: z.string().min(1, 'validation.required').max(150, 'validation.max150'),
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>
