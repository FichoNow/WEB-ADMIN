import { z } from 'zod'

const groupIdField = z
  .union([z.literal(''), z.string().regex(/^\d+$/, 'validation.invalidGroup')])
  .optional()

export const employeeRowSchema = z.object({
  name:     z.string().min(1, 'validation.required'),
  email:    z.string().min(1, 'validation.required').email('validation.invalidEmail'),
  password: z.string().min(8, 'validation.min8'),
  role:     z.enum(['USER', 'ADMINISTRATOR']),
  group_id: groupIdField,
})

export const createEmployeesSchema = z.object({
  rows: z.array(employeeRowSchema).min(1),
})

export const editEmployeeSchema = z.object({
  name:      z.string().min(1, 'validation.required'),
  email:     z.string().min(1, 'validation.required').email('validation.invalidEmail'),
  password:  z.string().optional(),
  role:      z.enum(['USER', 'ADMINISTRATOR']),
  is_active: z.enum(['true', 'false']),
  group_id:  groupIdField,
}).refine((d) => !d.password || d.password.length >= 8, {
  message: 'validation.min8',
  path: ['password'],
})

export type EmployeeRowValues         = z.infer<typeof employeeRowSchema>
export type CreateEmployeesFormValues = z.infer<typeof createEmployeesSchema>
export type EditEmployeeFormValues    = z.infer<typeof editEmployeeSchema>
