'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types'
import { z } from 'zod'

const FREE_SESSION_LIMIT = 3

// Get current month's session count and limit for the user
export async function getConciergeUsage(): Promise<ActionResult<{
  used: number
  limit: number
  plan: string
}>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { plan: true },
    })

    const plan = dbUser?.plan ?? 'FREE'

    if (plan !== 'FREE') {
      return { success: true, data: { used: 0, limit: Infinity, plan } }
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const used = await prisma.conciergeSession.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    })

    return { success: true, data: { used, limit: FREE_SESSION_LIMIT, plan } }
  } catch {
    return { success: false, error: 'Failed to load usage' }
  }
}

// Get last 5 concierge sessions for history panel
export async function getConciergeHistory(): Promise<ActionResult<{
  sessions: Array<{ id: string; title: string; messages: unknown; createdAt: Date; updatedAt: Date }>
}>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const sessions = await prisma.conciergeSession.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, messages: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    })

    return { success: true, data: { sessions: sessions as Array<{ id: string; title: string; messages: unknown; createdAt: Date; updatedAt: Date }> } }
  } catch {
    return { success: false, error: 'Failed to load sessions' }
  }
}

// Save a product recommendation to a wishlist
const saveSchema = z.object({
  wishlistId: z.string().uuid(),
  title: z.string().min(1).max(500).trim(),
  price: z.number().positive().optional().nullable(),
  currency: z.string().length(3).optional().default('USD'),
  url: z.string().url().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
})

export async function saveRecommendationToWishlist(
  input: z.infer<typeof saveSchema>
): Promise<ActionResult<{ id: string; title: string }>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const validated = saveSchema.safeParse(input)
    if (!validated.success) return { success: false, error: 'Invalid input' }

    const { wishlistId, title, price, currency, url, notes } = validated.data

    // Ownership check
    const wishlist = await prisma.wishlist.findFirst({
      where: { id: wishlistId, userId: user.id },
      select: { id: true },
    })
    if (!wishlist) return { success: false, error: 'Wishlist not found' }

    const item = await prisma.wishlistItem.create({
      data: {
        wishlistId,
        userId: user.id,
        title,
        price: price ?? null,
        currency,
        url: url ?? null,
        notes: notes ?? null,
        priority: 3,
        quantity: 1,
      },
      select: { id: true, title: true },
    })

    revalidatePath('/dashboard/wishlists')
    return { success: true, data: item as unknown as { id: string; title: string } }
  } catch {
    return { success: false, error: 'Failed to save item' }
  }
}

// Delete a concierge session
export async function deleteConciergeSession(sessionId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const session = await prisma.conciergeSession.findFirst({
      where: { id: sessionId, userId: user.id },
      select: { id: true },
    })
    if (!session) return { success: false, error: 'Session not found' }

    await prisma.conciergeSession.delete({ where: { id: sessionId } })
    revalidatePath('/dashboard/gift-concierge')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to delete session' }
  }
}
