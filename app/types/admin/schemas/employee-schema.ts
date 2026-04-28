import { z } from 'zod'

export const employeeRowSchema = z.object({
  name:     z.string().min(1, 'Obligatorio'),
  email:    z.string().min(1, 'Obligatorio').email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  role:     z.enum(['USER', 'ADMINISTRATOR']),
})

export const createEmployeesSchema = z.object({
  rows: z.array(employeeRowSchema).min(1),
})

export const editEmployeeSchema = z.object({
  name:      z.string().min(1, 'Obligatorio'),
  email:     z.string().min(1, 'Obligatorio').email('Email inválido'),
  password:  z.string().optional(),
  role:      z.enum(['USER', 'ADMINISTRATOR']),
  is_active: z.enum(['true', 'false']),
}).refine((d) => !d.password || d.password.length >= 8, {
  message: 'Mínimo 8 caracteres',
  path: ['password'],
})

export type EmployeeRowValues         = z.infer<typeof employeeRowSchema>
export type CreateEmployeesFormValues = z.infer<typeof createEmployeesSchema>
export type EditEmployeeFormValues    = z.infer<typeof editEmployeeSchema>
