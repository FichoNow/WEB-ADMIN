import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

export const scheduleDaySchema = z
  .object({
    weekday:        z.number().int().min(1).max(7),
    is_working_day: z.boolean(),
    start_time:     z.string().regex(timeRegex, 'validation.invalidTime').optional().or(z.literal('')),
    end_time:       z.string().regex(timeRegex, 'validation.invalidTime').optional().or(z.literal('')),
    break_minutes:  z.number().int().min(0, 'validation.invalidBreak'),
  })
  .refine(
    (d) => !d.is_working_day || (!!d.start_time && !!d.end_time),
    { message: 'validation.workdayTimesRequired', path: ['start_time'] },
  )

export const createScheduleSchema = z.object({
  name:        z.string().trim().min(1, 'validation.nameRequired').max(120, 'validation.max120'),
  description: z.string().trim().max(255, 'validation.max255').optional(),
  is_active:   z.enum(['true', 'false']),
  days:        z.array(scheduleDaySchema).length(7, 'validation.scheduleAllDays'),
})

export const createGroupScheduleAssignmentSchema = z
  .object({
    group_id:    z.string().regex(/^\d+$/, 'validation.selectValidGroup'),
    template_id: z.string().regex(/^\d+$/, 'validation.selectValidTemplate'),
    start_date:  z.string().min(1, 'validation.startDateRequired'),
    end_date:    z.string().optional(),
  })
  .refine(
    (d) => !d.end_date || d.end_date >= d.start_date,
    { message: 'validation.endBeforeStart', path: ['end_date'] },
  )

export const createUserScheduleAssignmentSchema = z
  .object({
    user_id:     z.string().regex(/^\d+$/, 'validation.selectValidUser'),
    template_id: z.string().regex(/^\d+$/, 'validation.selectValidTemplate'),
    start_date:  z.string().min(1, 'validation.startDateRequired'),
    end_date:    z.string().optional(),
  })
  .refine(
    (d) => !d.end_date || d.end_date >= d.start_date,
    { message: 'validation.endBeforeStart', path: ['end_date'] },
  )

export type CreateScheduleFormValues               = z.infer<typeof createScheduleSchema>
export type CreateGroupScheduleAssignmentValues    = z.infer<typeof createGroupScheduleAssignmentSchema>
export type CreateUserScheduleAssignmentValues     = z.infer<typeof createUserScheduleAssignmentSchema>
