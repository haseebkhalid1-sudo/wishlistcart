'use server'

import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
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

function attendingLabel(attending: 'YES' | 'NO' | 'MAYBE'): string {
  switch (attending) {
    case 'YES':
      return 'Yes, will attend'
    case 'NO':
      return "Sorry, can't make it"
    case 'MAYBE':
      return 'Maybe'
  }
}

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
      select: { id: true, name: true, userId: true, eventDate: true },
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
    const guestLine =
      (data.attending === 'YES' || data.attending === 'MAYBE') && data.guestCount != null
        ? `<tr>
            <td style="padding: 6px 0; color: #888; font-size: 14px; width: 130px;">Guests</td>
            <td style="padding: 6px 0; font-size: 14px;">${data.guestCount}</td>
           </tr>`
        : ''

    const messageLine = data.message
      ? `<tr>
          <td style="padding: 6px 0; color: #888; font-size: 14px; vertical-align: top; width: 130px;">Message</td>
          <td style="padding: 6px 0; font-size: 14px; font-style: italic;">&ldquo;${data.message}&rdquo;</td>
         </tr>`
      : ''

    const eventDateLine = registry.eventDate
      ? `<tr>
          <td style="padding: 6px 0; color: #888; font-size: 14px; width: 130px;">Event date</td>
          <td style="padding: 6px 0; font-size: 14px;">
            ${new Date(registry.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </td>
         </tr>`
      : ''

    await resend.emails.send({
      from: FROM_EMAIL,
      to: owner.email,
      subject: `RSVP from ${name} — ${registry.name}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0F0F0F;">
          <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 4px;">New RSVP received</h2>
          <p style="color: #666; font-size: 14px; margin: 0 0 24px;">
            Someone has responded to your registry <strong>${registry.name}</strong>.
          </p>

          <div style="border: 1px solid #e4e4e0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 6px 0; color: #888; font-size: 14px; width: 130px;">From</td>
                  <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888; font-size: 14px; width: 130px;">Email</td>
                  <td style="padding: 6px 0; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #0F0F0F;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888; font-size: 14px; width: 130px;">Attending</td>
                  <td style="padding: 6px 0; font-size: 14px; font-weight: 600;">${attendingLabel(data.attending)}</td>
                </tr>
                ${guestLine}
                ${eventDateLine}
                ${messageLine}
              </tbody>
            </table>
          </div>

          <p style="font-size: 12px; color: #aaa; margin: 0;">
            You received this because someone RSVPd on your WishlistCart registry.
          </p>
        </div>
      `,
    })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to send RSVP. Please try again.' }
  }
}
