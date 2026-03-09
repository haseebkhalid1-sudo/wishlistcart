'use server'

import React from 'react'
import { render } from '@react-email/components'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { RsvpNotificationEmail } from '@/emails/rsvp-notification-email'
import type { ActionResult } from '@/types'

// ---- Types ----

interface RsvpData {
  name: string
  email: string
  attending: 'YES' | 'NO' | 'MAYBE'
  guestCount?: number
  message?: string
}

// ---- Helpers ----

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---- Action ----

export async function submitRsvp(
  shareToken: string,
  data: RsvpData
): Promise<ActionResult<void>> {
  try {
    // 1. Validate inputs
    const name = data.name?.trim() ?? ''
    const email = data.email?.trim() ?? ''

    if (!name || name.length < 1 || name.length > 100) {
      return { success: false, error: 'Name is required (max 100 characters).' }
    }
    if (!email || !EMAIL_RE.test(email)) {
      return { success: false, error: 'A valid email address is required.' }
    }
    if (!['YES', 'NO', 'MAYBE'].includes(data.attending)) {
      return { success: false, error: 'Please select a valid attending option.' }
    }
    if (data.guestCount !== undefined) {
      const gc = Number(data.guestCount)
      if (!Number.isInteger(gc) || gc < 1 || gc > 10) {
        return { success: false, error: 'Guest count must be between 1 and 10.' }
      }
    }

    // 2. Look up registry by shareToken
    const registry = await prisma.wishlist.findUnique({
      where: { shareToken },
      select: { id: true, name: true, userId: true, eventDate: true, shareToken: true },
    })

    if (!registry) {
      return { success: false, error: 'Registry not found.' }
    }

    // 3. Get owner's email
    const owner = await prisma.user.findUnique({
      where: { id: registry.userId },
      select: { email: true, name: true },
    })

    if (!owner?.email) {
      return { success: false, error: 'Failed to send RSVP. Please try again.' }
    }

    // 4. Send email to registry owner
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'
    const registryUrl = `${APP_URL}/registry/${registry.shareToken ?? ''}`

    const formattedEventDate = registry.eventDate
      ? new Date(registry.eventDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : undefined

    const showGuestCount =
      (data.attending === 'YES' || data.attending === 'MAYBE') && data.guestCount != null
        ? data.guestCount
        : undefined

    const html = await render(
      React.createElement(RsvpNotificationEmail, {
        ownerName: owner.name ?? 'there',
        registryName: registry.name,
        guestName: name,
        guestEmail: email,
        attending: data.attending,
        guestCount: showGuestCount,
        eventDate: formattedEventDate,
        message: data.message ?? undefined,
        registryUrl,
      })
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: owner.email,
      subject: `RSVP from ${name} — ${registry.name}`,
      html,
    })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to send RSVP. Please try again.' }
  }
}
