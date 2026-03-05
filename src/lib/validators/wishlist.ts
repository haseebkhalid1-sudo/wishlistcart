import { z } from 'zod'

export const createWishlistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  description: z.string().max(500).trim().optional(),
  privacy: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).default('PRIVATE'),
  eventType: z
    .enum([
      'WEDDING',
      'BABY_SHOWER',
      'BIRTHDAY',
      'HOLIDAY',
      'HOUSEWARMING',
      'GRADUATION',
      'ANNIVERSARY',
      'BACK_TO_SCHOOL',
      'CUSTOM',
    ])
    .optional()
    .nullable(),
  eventDate: z.coerce.date().optional().nullable(),
})

export const updateWishlistSchema = createWishlistSchema.partial()

export type CreateWishlistInput = z.infer<typeof createWishlistSchema>
export type UpdateWishlistInput = z.infer<typeof updateWishlistSchema>
