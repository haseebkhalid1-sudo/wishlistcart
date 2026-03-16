import React from 'react'
import { render } from '@react-email/components'
import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { AnalyticsDigestEmail } from '@/emails/analytics-digest-email'
import { getDashboardAnalytics } from '@/lib/queries/analytics'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

// Weekly analytics digest — sent every Monday at 9am UTC (Pro users only)
export const sendWeeklyAnalyticsDigest = inngest.createFunction(
  { id: 'send-weekly-analytics-digest', name: 'Send Weekly Analytics Digest' },
  { cron: '0 9 * * 1' },
  async ({ step, logger }) => {
    // Fetch all Pro/Corporate users
    const proUsers = await step.run('get-pro-users', async () => {
      const users = await prisma.user.findMany({
        where: { plan: { in: ['PRO', 'CORPORATE'] } },
        select: { id: true, email: true, name: true },
      })
      return users
    })

    logger.info(`Sending weekly analytics digest to ${proUsers.length} Pro users`)

    let sent = 0

    for (const user of proUsers) {
      // Fire-and-forget per user — don't fail all if one fails
      await step.run(`send-analytics-${user.id}`, async () => {
        if (!user.email) return

        try {
          const analytics = await getDashboardAnalytics(user.id, 7)

          // Skip if no activity
          if (analytics.totalViews === 0 && analytics.totalClicks === 0) return

          const topWishlist = analytics.topWishlists[0]?.name ?? ''
          const period = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })

          const html = await render(
            React.createElement(AnalyticsDigestEmail, {
              userName: user.name ?? 'there',
              period,
              totalViews: analytics.totalViews,
              totalClicks: analytics.totalClicks,
              claimedItems: analytics.totalClaimed,
              topWishlist,
              unsubscribeUrl: `${APP_URL}/dashboard/settings/notifications`,
            })
          )

          await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: 'Your WishlistCart Weekly Analytics',
            html,
          })

          sent += 1
        } catch {
          // Swallow per-user errors so others still get their email
        }
      })
    }

    return { sent, total: proUsers.length }
  }
)
