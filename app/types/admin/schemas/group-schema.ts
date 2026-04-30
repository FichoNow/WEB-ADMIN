import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().trim().min(1, 'Obligatorio'),
})

export const editGroupSchema = z.object({
  name: z.string().trim().min(1, 'Obligatorio'),
})

export type CreateGroupFormValues = z.infer<typeof createGroupSchema>
export type EditGroupFormValues   = z.infer<typeof editGroupSchema>
