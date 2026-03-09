import React from 'react'
import { render } from '@react-email/components'
import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { ReminderEmail } from '@/emails/reminder-email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

function occasionLabel(type: string): string {
  if (type === 'birthday') return 'Birthday'
  if (type === 'anniversary') return 'Anniversary'
  // Capitalize first letter, leave the rest as-is
  return type.charAt(0).toUpperCase() + type.slice(1)
}

type ReminderWithUser = {
  id: string
  personName: string
  occasionType: string
  date: Date
  isRecurring: boolean
  reminderDaysBefore: number
  linkedWishlistId: string | null
  user: { email: string | null; name: string | null }
}

type DueReminder = ReminderWithUser & { daysUntil: number }

// Advance date to next occurrence on or after today (same month/day, next eligible year)
function nextOccurrence(date: Date, today: Date): Date {
  const next = new Date(date)
  next.setFullYear(today.getFullYear())
  // If this year's occurrence has already passed, move to next year
  if (next < today) {
    next.setFullYear(today.getFullYear() + 1)
  }
  return next
}

// Daily cron — runs every day at 9am UTC
export const sendOccasionReminders = inngest.createFunction(
  { id: 'send-occasion-reminders', name: 'Send Occasion Reminders' },
  { cron: '0 9 * * *' },
  async ({ step, logger }) => {
    const dueReminders = await step.run('get-upcoming-reminders', async (): Promise<DueReminder[]> => {
      const reminders: ReminderWithUser[] = await prisma.occasionReminder.findMany({
        include: { user: { select: { email: true, name: true } } },
      })

      const today = new Date()
      // Normalise today to midnight UTC for clean day arithmetic
      today.setUTCHours(0, 0, 0, 0)

      const due: DueReminder[] = []

      for (const reminder of reminders) {
        const rawDate = new Date(reminder.date)

        let nextDate: Date
        if (reminder.isRecurring) {
          nextDate = nextOccurrence(rawDate, today)
        } else {
          nextDate = rawDate
        }

        // Normalise to midnight UTC
        nextDate.setUTCHours(0, 0, 0, 0)

        const daysUntil = Math.ceil(
          (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysUntil === reminder.reminderDaysBefore) {
          due.push({ ...reminder, daysUntil })
        }
      }

      return due
    })

    logger.info(`Sending occasion reminders for ${dueReminders.length} upcoming occasion(s)`)

    let sent = 0

    for (const reminder of dueReminders) {
      await step.run(`send-reminder-${reminder.id}`, async () => {
        if (!reminder.user.email) return

        const label = occasionLabel(reminder.occasionType)
        const formattedDate = new Date(reminder.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          ...(reminder.isRecurring ? {} : { year: 'numeric' }),
        })

        const linkedWishlistUrl = reminder.linkedWishlistId
          ? `${APP_URL}/dashboard/wishlists/${reminder.linkedWishlistId}`
          : undefined

        const html = await render(
          React.createElement(ReminderEmail, {
            userName: reminder.user.name ?? 'there',
            personName: reminder.personName,
            occasionType: label,
            daysUntil: reminder.daysUntil,
            formattedDate,
            linkedWishlistUrl,
          })
        )

        await resend.emails.send({
          from: FROM_EMAIL,
          to: reminder.user.email,
          subject: `Reminder: ${reminder.personName}'s ${label} is in ${reminder.daysUntil} days`,
          html,
        })

        sent += 1
      })
    }

    return { sent }
  }
)
