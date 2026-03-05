'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { ActionResult } from '@/types'
import { z } from 'zod'

const claimSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  message: z.string().max(500).trim().optional(),
  isAnonymous: z.boolean().default(false),
})

export async function claimItem(
  itemId: string,
  input: z.infer<typeof claimSchema>
): Promise<ActionResult<void>> {
  const parsed = claimSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  // Verify the item is on a publicly accessible wishlist
  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    include: { wishlist: { select: { privacy: true, userId: true, slug: true, user: { select: { username: true } } } } },
  })

  if (!item) return { success: false, error: 'Item not found' }
  if (item.wishlist.privacy === 'PRIVATE') return { success: false, error: 'This wishlist is private' }
  if (item.isPurchased) return { success: false, error: 'This item has already been claimed' }

  // Optionally link to authenticated user
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  await prisma.wishlistItem.update({
    where: { id: itemId },
    data: {
      isPurchased: true,
      purchasedBy: user?.id ?? null,
      purchasedAt: new Date(),
      giftMessage: parsed.data.message ?? null,
      isAnonymous: parsed.data.isAnonymous,
    },
  })

  const username = item.wishlist.user.username ?? item.wishlist.userId
  revalidatePath(`/@${username}/${item.wishlist.slug}`)
  return { success: true, data: undefined }
}

export async function unclaimItem(itemId: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    select: { purchasedBy: true, wishlistId: true, wishlist: { select: { slug: true, user: { select: { username: true } } } } },
  })

  if (!item) return { success: false, error: 'Not found' }
  if (item.purchasedBy !== user.id) return { success: false, error: 'You did not claim this item' }

  await prisma.wishlistItem.update({
    where: { id: itemId },
    data: { isPurchased: false, purchasedBy: null, purchasedAt: null, giftMessage: null },
  })

  const username = item.wishlist.user.username ?? user.id
  revalidatePath(`/@${username}/${item.wishlist.slug}`)
  revalidatePath(`/dashboard/wishlists/${item.wishlistId}`)
  return { success: true, data: undefined }
}
