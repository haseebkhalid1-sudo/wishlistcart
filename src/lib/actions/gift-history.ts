'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

export type GiftHistoryItem = Prisma.WishlistItemGetPayload<{
  include: {
    wishlist: {
      select: {
        name: true
        shareToken: true
        user: { select: { name: true; username: true } }
      }
    }
  }
}>

export async function getGiftHistory(): Promise<GiftHistoryItem[]> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const items = await prisma.wishlistItem.findMany({
    where: { purchasedBy: user.id },
    include: {
      wishlist: {
        select: {
          name: true,
          shareToken: true,
          user: { select: { name: true, username: true } },
        },
      },
    },
    orderBy: { purchasedAt: 'desc' },
  })

  return items as unknown as GiftHistoryItem[]
}
