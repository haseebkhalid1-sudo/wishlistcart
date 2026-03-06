'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { createItemSchema, updateItemSchema } from '@/lib/validators/item'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'
import { ensureUser } from '@/lib/auth/ensure-user'

export type WishlistItemFull = Prisma.WishlistItemGetPayload<Record<string, never>>

// ---- Create ----

export async function createItem(
  wishlistId: string,
  formData: FormData
): Promise<ActionResult<WishlistItemFull>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  await ensureUser(user)

  // Verify ownership
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { userId: true },
  })
  if (!wishlist || wishlist.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  const raw = {
    title: formData.get('title'),
    url: formData.get('url') || undefined,
    price: formData.get('price') ? Number(formData.get('price')) : undefined,
    currency: formData.get('currency') || 'USD',
    imageUrl: formData.get('imageUrl') || undefined,
    storeName: formData.get('storeName') || undefined,
    notes: formData.get('notes') || undefined,
    priority: formData.get('priority') ? Number(formData.get('priority')) : 3,
    category: formData.get('category') || undefined,
    tags: [],
  }

  const parsed = createItemSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  // Get current max position
  const maxPos = await prisma.wishlistItem.aggregate({
    where: { wishlistId },
    _max: { position: true },
  })

  const item = await prisma.wishlistItem.create({
    data: {
      wishlistId,
      userId: user.id,
      title: parsed.data.title,
      url: parsed.data.url ?? null,
      price: parsed.data.price ?? null,
      currency: parsed.data.currency,
      imageUrl: parsed.data.imageUrl ?? null,
      storeName: parsed.data.storeName ?? null,
      notes: parsed.data.notes ?? null,
      priority: parsed.data.priority,
      category: parsed.data.category ?? null,
      tags: parsed.data.tags,
      position: (maxPos._max.position ?? 0) + 1,
    },
  })

  revalidatePath(`/dashboard/wishlists/${wishlistId}`)
  return { success: true, data: item }
}

// ---- Update ----

export async function updateItem(
  itemId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    select: { userId: true, wishlistId: true },
  })
  if (!item || item.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  const raw = {
    title: formData.get('title') || undefined,
    url: formData.get('url') || undefined,
    price: formData.get('price') ? Number(formData.get('price')) : undefined,
    currency: formData.get('currency') || undefined,
    imageUrl: formData.get('imageUrl') || undefined,
    storeName: formData.get('storeName') || undefined,
    notes: formData.get('notes') || undefined,
    priority: formData.get('priority') ? Number(formData.get('priority')) : undefined,
    category: formData.get('category') || undefined,
  }

  const parsed = updateItemSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  await prisma.wishlistItem.update({
    where: { id: itemId },
    data: {
      ...parsed.data,
      price: parsed.data.price ?? undefined,
      url: parsed.data.url ?? undefined,
    },
  })

  revalidatePath(`/dashboard/wishlists/${item.wishlistId}`)
  return { success: true, data: undefined }
}

// ---- Delete ----

export async function deleteItem(itemId: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    select: { userId: true, wishlistId: true },
  })
  if (!item || item.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  await prisma.wishlistItem.delete({ where: { id: itemId } })
  revalidatePath(`/dashboard/wishlists/${item.wishlistId}`)
  return { success: true, data: undefined }
}

// ---- Reorder ----

export async function reorderItems(
  wishlistId: string,
  orderedIds: string[]
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

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.wishlistItem.update({
        where: { id },
        data: { position: index },
      })
    )
  )

  revalidatePath(`/dashboard/wishlists/${wishlistId}`)
  return { success: true, data: undefined }
}
