import { z } from 'zod'

export const referralCodeSchema = z.object({
  code: z.string().min(4).max(20).toUpperCase(),
})

export type ReferralCodeInput = z.infer<typeof referralCodeSchema>
