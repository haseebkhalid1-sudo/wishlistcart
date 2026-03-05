'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { nanoid } from 'nanoid'
import type { ActionResult } from '@/types'

export async function generateShareLink(
  wishlistId: string
): Promise<ActionResult<{ url: string; token: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { userId: true, slug: true, user: { select: { username: true } } },
  })
  if (!wishlist || wishlist.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  const shareToken = nanoid(12)
  await prisma.wishlist.update({
    where: { id: wishlistId },
    data: { shareToken, privacy: 'SHARED' },
  })

  revalidatePath(`/dashboard/wishlists/${wishlistId}`)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'
  const username = wishlist.user.username ?? user.id
  const url = `${baseUrl}/@${username}/${wishlist.slug}`

  return { success: true, data: { url, token: shareToken } }
}

export async function makePublic(wishlistId: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { userId: true },
  })
  if (!wishlist || wishlist.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  await prisma.wishlist.update({
    where: { id: wishlistId },
    data: { privacy: 'PUBLIC' },
  })

  revalidatePath(`/dashboard/wishlists/${wishlistId}`)
  return { success: true, data: undefined }
}
