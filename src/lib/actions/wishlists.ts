'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { createWishlistSchema, updateWishlistSchema } from '@/lib/validators/wishlist'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'
import { slugify } from '@/lib/utils'
import { ensureUser } from '@/lib/auth/ensure-user'
import { canCreateWishlist, FREE_WISHLIST_LIMIT } from '@/lib/plans'

export type WishlistWithCount = Prisma.WishlistGetPayload<{
  include: {
    _count: { select: { items: true } }
  }
}>

export type WishlistWithItems = Prisma.WishlistGetPayload<{
  include: {
    items: true
    _count: { select: { items: true } }
  }
}>

// ---- Create ----

export async function createWishlist(
  formData: FormData
): Promise<ActionResult<{ id: string; slug: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    // Ensure user row exists in our DB (Supabase Auth → Prisma Postgres sync)
    await ensureUser(user)

    // Enforce free-tier wishlist limit
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { plan: true },
    })
    const wishlistCount = await prisma.wishlist.count({
      where: { userId: user.id, isArchived: false },
    })
    if (!canCreateWishlist((dbUser?.plan ?? 'FREE') as 'FREE' | 'PRO', wishlistCount)) {
      return {
        success: false,
        error: `Free plan is limited to ${FREE_WISHLIST_LIMIT} wishlists. Upgrade to Pro for unlimited.`,
      }
    }

    const raw = {
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      privacy: formData.get('privacy') || 'PRIVATE',
      eventType: (formData.get('eventType') === 'NONE' ? undefined : formData.get('eventType')) || undefined,
      eventDate: formData.get('eventDate') || undefined,
    }

    const parsed = createWishlistSchema.safeParse(raw)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    // Generate a unique slug
    const baseSlug = slugify(parsed.data.name)
    const existing = await prisma.wishlist.findMany({
      where: { userId: user.id, slug: { startsWith: baseSlug } },
      select: { slug: true },
    })
    const slug = existing.length === 0 ? baseSlug : `${baseSlug}-${existing.length + 1}`

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        privacy: parsed.data.privacy,
        eventType: parsed.data.eventType ?? null,
        eventDate: parsed.data.eventDate ?? null,
      },
      select: { id: true, slug: true },
    })

    revalidatePath('/dashboard/wishlists')
    return { success: true, data: wishlist }
  } catch {
    return { success: false, error: 'Failed to create wishlist. Please try again.' }
  }
}

// ---- Update ----

export async function updateWishlist(
  wishlistId: string,
  formData: FormData
): Promise<ActionResult<void>> {
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

  const raw = {
    name: formData.get('name') || undefined,
    description: formData.get('description') || undefined,
    privacy: formData.get('privacy') || undefined,
    eventType: formData.get('eventType') || undefined,
    eventDate: formData.get('eventDate') || undefined,
  }

  const parsed = updateWishlistSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  await prisma.wishlist.update({
    where: { id: wishlistId },
    data: {
      ...parsed.data,
      eventType: parsed.data.eventType ?? undefined,
      eventDate: parsed.data.eventDate ?? undefined,
    },
  })

  revalidatePath('/dashboard/wishlists')
  revalidatePath(`/dashboard/wishlists/${wishlistId}`)
  return { success: true, data: undefined }
}

// ---- Delete ----

export async function deleteWishlist(wishlistId: string): Promise<ActionResult<void>> {
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

  await prisma.wishlist.delete({ where: { id: wishlistId } })

  revalidatePath('/dashboard/wishlists')
  redirect('/dashboard/wishlists')
}

// ---- Archive / Unarchive ----

export async function toggleArchiveWishlist(
  wishlistId: string,
  archive: boolean
): Promise<ActionResult<void>> {
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
    data: { isArchived: archive },
  })

  revalidatePath('/dashboard/wishlists')
  return { success: true, data: undefined }
}

// ---- Queries ----

export async function getUserWishlists(): Promise<WishlistWithCount[]> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  // Ensure user row exists in our DB
  await ensureUser(user)

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: user.id, isArchived: false },
    include: { _count: { select: { items: true } } },
    orderBy: [{ position: 'asc' }, { updatedAt: 'desc' }],
  })
  return wishlists as unknown as WishlistWithCount[]
}

export async function getWishlistById(wishlistId: string): Promise<WishlistWithItems | null> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    include: {
      items: {
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      },
      _count: { select: { items: true } },
    },
  })

  if (!wishlist || wishlist.userId !== user.id) return null
  return wishlist as unknown as WishlistWithItems
}
