'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
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

    // 5. Build event details block (only if eventType or eventDate is set)
    let eventDetailsHtml = ''
    if (registry.eventType || registry.eventDate) {
      const parts: string[] = []
      if (registry.eventType) {
        const label = formatEventType(registry.eventType)
        parts.push(`<span style="color: #555;">${label}</span>`)
      }
      if (registry.eventDate) {
        const formatted = new Date(registry.eventDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        parts.push(`<span style="color: #555;">${formatted}</span>`)
      }
      eventDetailsHtml = `
        <p style="margin: 4px 0 0; font-size: 14px; color: #888;">
          ${parts.join(' &middot; ')}
        </p>`
    }

    const html = `
<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
  <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 12px;">You're invited to ${escapeHtml(registry.name)}</h2>
  <p style="color: #555; margin: 0 0 20px;">${escapeHtml(ownerName)} has invited you to view their gift registry.</p>

  <div style="border: 1px solid #e4e4e0; border-radius: 12px; padding: 20px; margin: 0 0 24px;">
    <p style="font-weight: 600; margin: 0 0 4px; font-size: 16px;">${escapeHtml(registry.name)}</p>
    ${eventDetailsHtml}
  </div>

  <a
    href="${shareUrl}"
    style="display: inline-block; background: #0f0f0f; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;"
  >
    View Registry
  </a>

  <p style="color: #aaa; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
    You received this because ${escapeHtml(ownerName)} invited you via WishlistCart.
  </p>
</div>
    `.trim()

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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

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
