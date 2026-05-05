import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

export const scheduleDaySchema = z
  .object({
    weekday:        z.number().int().min(1).max(7),
    is_working_day: z.boolean(),
    start_time:     z.string().regex(timeRegex, 'Hora inválida').optional().or(z.literal('')),
    end_time:       z.string().regex(timeRegex, 'Hora inválida').optional().or(z.literal('')),
    break_minutes:  z.number().int().min(0, 'Descanso inválido'),
  })
  .refine(
    (d) => !d.is_working_day || (!!d.start_time && !!d.end_time),
    { message: 'Los días laborables deben tener hora de inicio y fin', path: ['start_time'] },
  )

export const createScheduleSchema = z.object({
  name:        z.string().trim().min(1, 'El nombre es obligatorio').max(120, 'Máximo 120 caracteres'),
  description: z.string().trim().max(255, 'Máximo 255 caracteres').optional(),
  is_active:   z.enum(['true', 'false']),
  days:        z.array(scheduleDaySchema).length(7, 'Deben definirse los 7 días'),
})

export const createGroupScheduleAssignmentSchema = z
  .object({
    group_id:    z.string().regex(/^\d+$/, 'Selecciona un grupo válido'),
    template_id: z.string().regex(/^\d+$/, 'Selecciona una plantilla válida'),
    start_date:  z.string().min(1, 'La fecha de inicio es obligatoria'),
    end_date:    z.string().optional(),
  })
  .refine(
    (d) => !d.end_date || d.end_date >= d.start_date,
    { message: 'La fecha de fin no puede ser anterior a la de inicio', path: ['end_date'] },
  )

export const createUserScheduleAssignmentSchema = z
  .object({
    user_id:     z.string().regex(/^\d+$/, 'Selecciona un usuario válido'),
    template_id: z.string().regex(/^\d+$/, 'Selecciona una plantilla válida'),
    start_date:  z.string().min(1, 'La fecha de inicio es obligatoria'),
    end_date:    z.string().optional(),
  })
  .refine(
    (d) => !d.end_date || d.end_date >= d.start_date,
    { message: 'La fecha de fin no puede ser anterior a la de inicio', path: ['end_date'] },
  )

export type CreateScheduleFormValues               = z.infer<typeof createScheduleSchema>
export type CreateGroupScheduleAssignmentValues    = z.infer<typeof createGroupScheduleAssignmentSchema>
export type CreateUserScheduleAssignmentValues     = z.infer<typeof createUserScheduleAssignmentSchema>
