'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { nanoid } from 'nanoid'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { createRegistrySchema, updateRegistrySchema } from '@/lib/validators/registry'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'
import { slugify } from '@/lib/utils'
import { ensureUser } from '@/lib/auth/ensure-user'

// ---- Types ----

export type RegistryWithCount = Prisma.WishlistGetPayload<{
  include: {
    _count: { select: { items: true } }
    cashFund: true
  }
}>

export type RegistryWithItems = Prisma.WishlistGetPayload<{
  include: {
    items: { orderBy: [{ category: 'asc' }, { position: 'asc' }] }
    _count: { select: { items: true } }
    cashFund: true
  }
}>

// ---- Create ----

export async function createRegistry(
  formData: FormData
): Promise<ActionResult<{ id: string; slug: string; shareToken: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    await ensureUser(user)

    const raw = {
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      eventType: formData.get('eventType') || undefined,
      eventDate: formData.get('eventDate') || undefined,
      eventLocation: formData.get('eventLocation') || undefined,
      privacy: formData.get('privacy') || 'SHARED',
    }

    const parsed = createRegistrySchema.safeParse(raw)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    // Generate a unique slug scoped to the user
    const baseSlug = slugify(parsed.data.name)
    const existing = await prisma.wishlist.findMany({
      where: { userId: user.id, slug: { startsWith: baseSlug } },
      select: { slug: true },
    })
    const slug = existing.length === 0 ? baseSlug : `${baseSlug}-${existing.length + 1}`

    const shareToken = nanoid(12)

    const registry = await prisma.wishlist.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        type: 'REGISTRY',
        privacy: parsed.data.privacy,
        shareToken,
        eventType: parsed.data.eventType,
        eventDate: parsed.data.eventDate ?? null,
        eventLocation: parsed.data.eventLocation ?? null,
      },
      select: { id: true, slug: true, shareToken: true },
    })

    revalidatePath('/dashboard/registries')
    return {
      success: true,
      data: {
        id: registry.id,
        slug: registry.slug,
        shareToken: registry.shareToken!,
      },
    }
  } catch {
    return { success: false, error: 'Failed to create registry. Please try again.' }
  }
}

// ---- Update ----

export async function updateRegistry(
  registryId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const registry = await prisma.wishlist.findUnique({
    where: { id: registryId },
    select: { userId: true },
  })
  if (!registry || registry.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  const raw = {
    name: formData.get('name') || undefined,
    description: formData.get('description') || undefined,
    eventType: formData.get('eventType') || undefined,
    eventDate: formData.get('eventDate') || undefined,
    eventLocation: formData.get('eventLocation') || undefined,
    privacy: formData.get('privacy') || undefined,
  }

  const parsed = updateRegistrySchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  await prisma.wishlist.update({
    where: { id: registryId },
    data: {
      ...parsed.data,
      eventType: parsed.data.eventType ?? undefined,
      eventDate: parsed.data.eventDate ?? undefined,
      eventLocation: parsed.data.eventLocation ?? undefined,
    },
  })

  revalidatePath('/dashboard/registries')
  revalidatePath(`/dashboard/registries/${registryId}`)
  return { success: true, data: undefined }
}

// ---- Delete ----

export async function deleteRegistry(registryId: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const registry = await prisma.wishlist.findUnique({
    where: { id: registryId },
    select: { userId: true },
  })
  if (!registry || registry.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  await prisma.wishlist.delete({ where: { id: registryId } })

  revalidatePath('/dashboard/registries')
  redirect('/dashboard/registries')
}

// ---- Archive / Unarchive ----

export async function archiveRegistry(
  registryId: string,
  archive: boolean
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const registry = await prisma.wishlist.findUnique({
    where: { id: registryId },
    select: { userId: true },
  })
  if (!registry || registry.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  await prisma.wishlist.update({
    where: { id: registryId },
    data: { isArchived: archive },
  })

  revalidatePath('/dashboard/registries')
  return { success: true, data: undefined }
}

// ---- Queries ----

export async function getUserRegistries(): Promise<RegistryWithCount[]> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  await ensureUser(user)

  const registries = await prisma.wishlist.findMany({
    where: { userId: user.id, type: 'REGISTRY', isArchived: false },
    include: {
      _count: { select: { items: true } },
      cashFund: true,
    },
    orderBy: [{ eventDate: 'asc' }, { updatedAt: 'desc' }],
  })

  return registries as unknown as RegistryWithCount[]
}

export async function getRegistryById(registryId: string): Promise<RegistryWithItems | null> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const registry = await prisma.wishlist.findUnique({
    where: { id: registryId },
    include: {
      items: {
        orderBy: [{ category: 'asc' }, { position: 'asc' }],
      },
      _count: { select: { items: true } },
      cashFund: true,
    },
  })

  if (!registry || registry.userId !== user.id) return null
  return registry as unknown as RegistryWithItems
}
