'use server'

import React from 'react'
import { render } from '@react-email/components'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { RegistryInviteEmail } from '@/emails/registry-invite-email'
import type { ActionResult } from '@/types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_RECIPIENTS = 20

export async function sendRegistryInvite(
  registryId: string,
  emails: string[]
): Promise<ActionResult<{ sent: number }>> {
  // 1. Auth check
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    // 2. Ownership check + fetch registry details
    const [registry, owner] = await Promise.all([
      prisma.wishlist.findUnique({
        where: { id: registryId },
        select: {
          id: true,
          userId: true,
          name: true,
          shareToken: true,
          eventType: true,
          eventDate: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true },
      }),
    ])

    if (!registry || registry.userId !== user.id) {
      return { success: false, error: 'Registry not found' }
    }

    if (!registry.shareToken) {
      return { success: false, error: 'Registry does not have a share link' }
    }

    // 3. Validate and cap recipients
    const validEmails = emails
      .filter((e) => typeof e === 'string' && EMAIL_REGEX.test(e.trim()))
      .map((e) => e.trim().toLowerCase())
      .slice(0, MAX_RECIPIENTS)

    if (validEmails.length === 0) {
      return { success: false, error: 'No valid email addresses provided' }
    }

    // 4. Compute share URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'
    const shareUrl = `${appUrl}/registry/${registry.shareToken}`

    const ownerName = owner?.name ?? 'Someone'

    // 5. Build event details for template
    const formattedEventType = registry.eventType ? formatEventType(registry.eventType) : undefined
    const formattedEventDate = registry.eventDate
      ? new Date(registry.eventDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : undefined

    const html = await render(
      React.createElement(RegistryInviteEmail, {
        ownerName,
        registryName: registry.name,
        eventType: formattedEventType,
        eventDate: formattedEventDate,
        shareUrl,
      })
    )

    // 6. Send email (Resend accepts string[] for `to`)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: validEmails,
      subject: `You're invited: ${registry.name}`,
      html,
    })

    // 7. Return success
    return { success: true, data: { sent: validEmails.length } }
  } catch {
    return { success: false, error: 'Failed to send invitations' }
  }
}

// ---- Helpers ----

function formatEventType(eventType: string): string {
  const labels: Record<string, string> = {
    WEDDING: 'Wedding',
    BABY_SHOWER: 'Baby Shower',
    BIRTHDAY: 'Birthday',
    ANNIVERSARY: 'Anniversary',
    GRADUATION: 'Graduation',
    HOUSEWARMING: 'Housewarming',
    HOLIDAY: 'Holiday',
    OTHER: 'Event',
  }
  return labels[eventType] ?? eventType
}
