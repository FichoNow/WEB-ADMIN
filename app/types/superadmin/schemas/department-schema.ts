import { z } from 'zod'

export const departmentSchema = z.object({
  name: z.string().min(1, 'Obligatorio').max(150, 'Máximo 150 caracteres'),
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>
