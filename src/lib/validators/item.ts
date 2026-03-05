import { z } from 'zod'

export const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500).trim(),
  url: z.string().url('Must be a valid URL').optional().nullable(),
  price: z.number().positive().max(999999).optional().nullable(),
  currency: z.string().length(3).default('USD'),
  imageUrl: z.string().url().optional().nullable(),
  storeName: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).trim().optional().nullable(),
  priority: z.number().int().min(1).max(5).default(3),
  category: z.string().max(50).optional().nullable(),
  tags: z.array(z.string().max(30)).max(10).default([]),
})

export const updateItemSchema = createItemSchema.partial()

export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
