import { z } from 'zod'

export const creatorApplicationSchema = z.object({
  bio: z.string().min(50, 'Tell us more (min 50 chars)').max(1000).trim(),
  niche: z.string().min(1, 'Select a niche').max(50),
  audienceSize: z.enum(['under_1k', '1k_10k', '10k_100k', '100k_plus']),
  socialLinks: z.object({
    youtube: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    tiktok: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
  }),
})

export type CreatorApplicationInput = z.infer<typeof creatorApplicationSchema>
