'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { creatorApplicationSchema, type CreatorApplicationInput } from '@/lib/validators/creator'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorApplicationRow = Prisma.CreatorApplicationGetPayload<{
  select: {
    id: true
    userId: true
    status: true
    bio: true
    niche: true
    audienceSize: true
    socialLinks: true
    reviewNote: true
    reviewedAt: true
    createdAt: true
    updatedAt: true
  }
}>

export type CreatorStatusResult = {
  isCreator: boolean
  stripeConnectId: string | null
  application: CreatorApplicationRow | null
}

// ---------------------------------------------------------------------------
// applyForCreator
// ---------------------------------------------------------------------------

export async function applyForCreator(
  input: CreatorApplicationInput
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const parsed = creatorApplicationSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Check for existing application
  const existing = await prisma.creatorApplication.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })
  if (existing) {
    return { success: false, error: 'You already have an application on file.' }
  }

  const { bio, niche, audienceSize, socialLinks } = parsed.data

  try {
    const application = await prisma.creatorApplication.create({
      data: {
        userId: user.id,
        bio,
        niche,
        audienceSize,
        socialLinks: socialLinks as Prisma.InputJsonValue,
      },
      select: { id: true },
    })

    revalidatePath('/dashboard/creator')
    return { success: true, data: { id: application.id } }
  } catch {
    return { success: false, error: 'Failed to submit application. Please try again.' }
  }
}

// ---------------------------------------------------------------------------
// getMyCreatorApplication
// ---------------------------------------------------------------------------

export async function getMyCreatorApplication(): Promise<
  ActionResult<CreatorApplicationRow | null>
> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const application = await prisma.creatorApplication.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      userId: true,
      status: true,
      bio: true,
      niche: true,
      audienceSize: true,
      socialLinks: true,
      reviewNote: true,
      reviewedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return { success: true, data: application as unknown as CreatorApplicationRow | null }
}

// ---------------------------------------------------------------------------
// getCreatorStatus
// ---------------------------------------------------------------------------

export async function getCreatorStatus(): Promise<CreatorStatusResult> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { isCreator: false, stripeConnectId: null, application: null }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      isCreator: true,
      stripeConnectId: true,
      creatorApplication: {
        select: {
          id: true,
          userId: true,
          status: true,
          bio: true,
          niche: true,
          audienceSize: true,
          socialLinks: true,
          reviewNote: true,
          reviewedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })

  if (!dbUser) return { isCreator: false, stripeConnectId: null, application: null }

  return {
    isCreator: dbUser.isCreator,
    stripeConnectId: dbUser.stripeConnectId,
    application: dbUser.creatorApplication as unknown as CreatorApplicationRow | null,
  }
}

// ---------------------------------------------------------------------------
// withdrawApplication
// ---------------------------------------------------------------------------

export async function withdrawApplication(): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const existing = await prisma.creatorApplication.findUnique({
    where: { userId: user.id },
    select: { id: true, status: true },
  })

  if (!existing) {
    return { success: false, error: 'No application found.' }
  }

  if (existing.status !== 'PENDING') {
    return { success: false, error: 'Only pending applications can be withdrawn.' }
  }

  try {
    await prisma.creatorApplication.delete({ where: { userId: user.id } })
    revalidatePath('/dashboard/creator')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to withdraw application. Please try again.' }
  }
}
