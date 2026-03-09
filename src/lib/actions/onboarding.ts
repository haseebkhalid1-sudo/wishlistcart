'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { slugify } from '@/lib/utils'
import { ensureUser } from '@/lib/auth/ensure-user'
import type { ActionResult } from '@/types'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers, and underscores')
    .toLowerCase(),
})

const createWishlistOnboardingSchema = z.object({
  name: z.string().min(1, 'Wishlist name is required').max(100).trim(),
  privacy: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']),
})

// ---------------------------------------------------------------------------
// updateProfileFromOnboarding
// ---------------------------------------------------------------------------

export async function updateProfileFromOnboarding(data: {
  name: string
  username: string
}): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const parsed = updateProfileSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, username } = parsed.data

  // Check username uniqueness
  const existing = await prisma.user.findFirst({
    where: { username, id: { not: user.id } },
    select: { id: true },
  })
  if (existing) {
    return {
      success: false,
      error: 'Username already taken',
      fieldErrors: { username: ['That username is already taken'] },
    }
  }

  try {
    // Ensure user row exists
    await ensureUser(user)

    // Update Prisma DB
    await prisma.user.update({
      where: { id: user.id },
      data: { name, username },
    })

    // Sync name to Supabase auth metadata
    await supabase.auth.updateUser({ data: { name } })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to update profile. Please try again.' }
  }
}

// ---------------------------------------------------------------------------
// createWishlistFromOnboarding
// ---------------------------------------------------------------------------

export async function createWishlistFromOnboarding(data: {
  name: string
  privacy: 'PRIVATE' | 'SHARED' | 'PUBLIC'
}): Promise<ActionResult<{ id: string; slug: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const parsed = createWishlistOnboardingSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await ensureUser(user)

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
        privacy: parsed.data.privacy,
      },
      select: { id: true, slug: true },
    })

    revalidatePath('/dashboard/wishlists')
    return { success: true, data: wishlist as unknown as { id: string; slug: string } }
  } catch {
    return { success: false, error: 'Failed to create wishlist. Please try again.' }
  }
}

// ---------------------------------------------------------------------------
// completeOnboarding
// ---------------------------------------------------------------------------

export async function completeOnboarding(): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingDone: true },
    })

    revalidatePath('/onboarding')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to complete onboarding. Please try again.' }
  }
}
