'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { ActionResult } from '@/types'

// ---------------------------------------------------------------------------
// Admin guard helper
// ---------------------------------------------------------------------------

async function requireAdmin() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { user: null, error: 'Unauthorized' as const }
  }

  return { user, error: null }
}

// ---------------------------------------------------------------------------
// approveCreator
// ---------------------------------------------------------------------------

export async function approveCreator(
  applicationId: string,
  note?: string
): Promise<ActionResult<void>> {
  const { error } = await requireAdmin()
  if (error) return { success: false, error }

  try {
    // Fetch the application to get userId
    const application = await prisma.creatorApplication.findUnique({
      where: { id: applicationId },
      select: { userId: true },
    })
    if (!application) return { success: false, error: 'Application not found' }

    await prisma.$transaction([
      prisma.creatorApplication.update({
        where: { id: applicationId },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewNote: note ?? null,
        },
      }),
      prisma.user.update({
        where: { id: application.userId },
        data: {
          isCreator: true,
          creatorVerifiedAt: new Date(),
        },
      }),
    ])

    revalidatePath('/dashboard/admin/creators')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to approve creator application.' }
  }
}

// ---------------------------------------------------------------------------
// rejectCreator
// ---------------------------------------------------------------------------

export async function rejectCreator(
  applicationId: string,
  note: string
): Promise<ActionResult<void>> {
  const { error } = await requireAdmin()
  if (error) return { success: false, error }

  try {
    await prisma.creatorApplication.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewNote: note,
      },
    })

    revalidatePath('/dashboard/admin/creators')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to reject creator application.' }
  }
}
