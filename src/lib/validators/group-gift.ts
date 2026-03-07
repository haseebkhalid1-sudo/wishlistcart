import { z } from 'zod'

export const createPoolSchema = z.object({
  goalAmount: z.coerce.number().positive().max(999999),
  deadline: z.coerce.date().optional().nullable(),
})

export const contributeSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  amount: z.coerce.number().positive().min(1).max(100000),
  message: z.string().max(500).trim().optional(),
  isAnonymous: z.boolean().default(false),
})

export type CreatePoolInput = z.infer<typeof createPoolSchema>
export type ContributeInput = z.infer<typeof contributeSchema>
