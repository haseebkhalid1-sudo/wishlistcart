import { z } from 'zod'

export const createReminderSchema = z.object({
  personName: z.string().min(1, 'Name is required').max(100).trim(),
  occasionType: z.enum(['birthday', 'anniversary', 'custom']),
  date: z.coerce.date({ error: 'Valid date required' }),
  isRecurring: z.boolean().default(true),
  reminderDaysBefore: z.coerce.number().int().min(1).max(365).default(14),
  linkedWishlistId: z.string().uuid().optional().nullable(),
  customLabel: z.string().max(50).trim().optional(),
})

export const updateReminderSchema = createReminderSchema.partial()

export type CreateReminderInput = z.infer<typeof createReminderSchema>
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>
