import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'

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

        const wishlistSection = reminder.linkedWishlistId
          ? `<p style="margin: 16px 0 0;">
              <a href="${APP_URL}/dashboard/wishlists/${reminder.linkedWishlistId}"
                 style="color: #0F0F0F; font-weight: 500; text-decoration: underline;">
                View their wishlist →
              </a>
            </p>`
          : ''

        await resend.emails.send({
          from: FROM_EMAIL,
          to: reminder.user.email,
          subject: `Reminder: ${reminder.personName}'s ${label} is in ${reminder.daysUntil} days`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0F0F0F;">
              <h2 style="font-size: 20px; margin-bottom: 8px;">Upcoming occasion reminder</h2>
              <p style="color: #666; margin-bottom: 24px;">
                Here's a heads-up about an occasion coming up soon.
              </p>

              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0ee; font-size: 13px; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; width: 120px;">Who</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0ee; font-weight: 500;">${reminder.personName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0ee; font-size: 13px; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em;">Occasion</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0ee; font-weight: 500;">${label}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0ee; font-size: 13px; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em;">Date</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0ee; font-weight: 500;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-size: 13px; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em;">Coming up</td>
                    <td style="padding: 10px 0; font-weight: 500;">${reminder.daysUntil} day${reminder.daysUntil === 1 ? '' : 's'} away</td>
                  </tr>
                </tbody>
              </table>

              ${wishlistSection}

              <a href="${APP_URL}/dashboard/reminders"
                 style="display: inline-block; margin-top: 24px; background: #0F0F0F; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
                Manage reminders
              </a>

              <p style="margin-top: 24px; font-size: 12px; color: #aaa;">
                WishlistCart &middot;
                <a href="${APP_URL}/dashboard/reminders" style="color: #aaa;">Manage reminders</a>
              </p>
            </div>
          `,
        })

        sent += 1
      })
    }

    return { sent }
  }
)
