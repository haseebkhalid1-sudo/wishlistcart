'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { z } from 'zod'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'
import { canSetPriceAlert } from '@/lib/plans'

export type PriceAlertWithItem = Prisma.PriceAlertGetPayload<{
  include: {
    item: {
      select: {
        id: true
        title: true
        price: true
        currency: true
        imageUrl: true
        storeName: true
        wishlistId: true
      }
    }
  }
}>

const createAlertSchema = z.object({
  itemId: z.string().uuid(),
  type: z.enum(['ANY_DROP', 'TARGET_PRICE', 'PERCENTAGE_DROP']),
  targetPrice: z.number().positive().optional(),
  percentageDrop: z.number().min(1).max(99).int().optional(),
})

// ---- Create ----

export async function createPriceAlert(
  data: unknown
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Check Pro plan
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { plan: true },
  })
  if (!canSetPriceAlert((dbUser?.plan ?? 'FREE') as 'FREE' | 'PRO' | 'CORPORATE')) {
    return { success: false, error: 'Price alerts are a Pro feature. Upgrade to set alerts.' }
  }

  const parsed = createAlertSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Invalid alert configuration' }
  }

  // Verify item belongs to user's wishlist
  const item = await prisma.wishlistItem.findUnique({
    where: { id: parsed.data.itemId },
    select: { wishlist: { select: { userId: true, id: true } } },
  })
  if (!item || item.wishlist.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  // Deactivate existing alert for same item (one active per item)
  await prisma.priceAlert.updateMany({
    where: { itemId: parsed.data.itemId, userId: user.id, isActive: true },
    data: { isActive: false },
  })

  const alert = await prisma.priceAlert.create({
    data: {
      userId: user.id,
      itemId: parsed.data.itemId,
      alertType: parsed.data.type as 'ANY_DROP' | 'TARGET_PRICE' | 'PERCENTAGE_DROP',
      targetPrice: parsed.data.targetPrice ?? null,
      percentageDrop: parsed.data.percentageDrop ?? null,
      isActive: true,
    },
    select: { id: true },
  })

  revalidatePath(`/dashboard/wishlists/${item.wishlist.id}`)
  revalidatePath('/dashboard/price-alerts')
  return { success: true, data: alert }
}

// ---- Delete ----

export async function deletePriceAlert(alertId: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const alert = await prisma.priceAlert.findUnique({
    where: { id: alertId },
    select: { userId: true, item: { select: { wishlistId: true } } },
  })
  if (!alert || alert.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  await prisma.priceAlert.delete({ where: { id: alertId } })
  revalidatePath('/dashboard/price-alerts')
  revalidatePath(`/dashboard/wishlists/${alert.item.wishlistId}`)
  return { success: true, data: undefined }
}

// ---- Queries ----

export async function getUserPriceAlerts(): Promise<PriceAlertWithItem[]> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  return prisma.priceAlert.findMany({
    where: { userId: user.id, isActive: true },
    include: {
      item: {
        select: { id: true, title: true, price: true, currency: true, imageUrl: true, storeName: true, wishlistId: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  }) as unknown as PriceAlertWithItem[]
}

export async function getItemPriceHistory(itemId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Verify ownership
  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    select: { wishlist: { select: { userId: true } } },
  })
  if (!item || item.wishlist.userId !== user.id) return []

  return prisma.priceHistory.findMany({
    where: { itemId },
    orderBy: { checkedAt: 'asc' },
    select: { price: true, checkedAt: true },
    take: 90,
  })
}
