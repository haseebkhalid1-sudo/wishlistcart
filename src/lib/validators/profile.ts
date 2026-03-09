import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name required').max(100).trim(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be 30 characters or fewer')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
    .toLowerCase(),
  bio: z.string().max(300, 'Bio must be 300 characters or fewer').trim().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
