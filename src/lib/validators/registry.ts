import { z } from 'zod'

const EVENT_TYPES = [
  'WEDDING',
  'BABY_SHOWER',
  'BIRTHDAY',
  'HOLIDAY',
  'HOUSEWARMING',
  'GRADUATION',
  'ANNIVERSARY',
  'BACK_TO_SCHOOL',
  'CUSTOM',
] as const

export const createRegistrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  description: z.string().max(500).trim().optional(),
  eventType: z.enum(EVENT_TYPES, { error: 'Event type is required' }),
  eventDate: z.coerce.date().optional().nullable(),
  eventLocation: z.string().max(200).trim().optional().nullable(),
  privacy: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).default('SHARED'),
})

// updateRegistrySchema: all fields partial, but eventType is still validated if provided
export const updateRegistrySchema = createRegistrySchema.partial()

export type CreateRegistryInput = z.infer<typeof createRegistrySchema>
export type UpdateRegistryInput = z.infer<typeof updateRegistrySchema>
