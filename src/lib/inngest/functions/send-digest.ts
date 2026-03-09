import React from 'react'
import { render } from '@react-email/components'
import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { WeeklyDigestEmail } from '@/emails/weekly-digest-email'

// Weekly digest — sent every Monday at 9am
export const sendWeeklyDigest = inngest.createFunction(
  { id: 'send-weekly-digest', name: 'Send Weekly Price Digest' },
  { cron: '0 9 * * 1' },
  async ({ step, logger }) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Get IDs of users with price changes this week
    const userIds = await step.run('get-user-ids', async () => {
      const users = await prisma.user.findMany({
        where: {
          wishlists: {
            some: {
              items: {
                some: {
                  priceHistory: { some: { checkedAt: { gte: oneWeekAgo } } },
                },
              },
            },
          },
        },
        select: { id: true },
      })
      return users.map((u) => u.id)
    })

    logger.info(`Sending weekly digest to ${userIds.length} users`)

    for (const userId of userIds) {
      await step.run(`send-digest-${userId}`, async () => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, name: true },
        })
        if (!user?.email) return

        // Get items with price drops in the past week
        type ItemWithHistory = {
          title: string
          price: unknown
          currency: string
          affiliateUrl: string | null
          url: string | null
          priceHistory: { price: unknown }[]
        }
        const items: ItemWithHistory[] = await (prisma.wishlistItem as unknown as {
          findMany: (args: unknown) => Promise<ItemWithHistory[]>
        }).findMany({
          where: {
            userId,
            priceHistory: { some: { checkedAt: { gte: oneWeekAgo } } },
          },
          select: {
            title: true,
            price: true,
            currency: true,
            affiliateUrl: true,
            url: true,
            priceHistory: {
              where: { checkedAt: { gte: oneWeekAgo } },
              orderBy: { checkedAt: 'asc' },
              take: 1,
              select: { price: true },
            },
          },
        })

        const priceChanges = items
          .filter((i) => i.priceHistory.length > 0 && i.price != null)
          .map((i) => ({
            title: i.title,
            oldPrice: Number(i.priceHistory[0]?.price),
            newPrice: Number(i.price),
            url: i.affiliateUrl ?? i.url ?? '#',
            currency: i.currency,
          }))
          .filter((i) => i.newPrice < i.oldPrice)

        if (priceChanges.length === 0) return

        const html = await render(
          React.createElement(WeeklyDigestEmail, {
            userName: user.name ?? 'there',
            alerts: priceChanges.map((c) => ({
              itemTitle: c.title,
              oldPrice: c.oldPrice,
              newPrice: c.newPrice,
              currency: c.currency,
              itemUrl: c.url,
            })),
          })
        )

        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `${priceChanges.length} price drop${priceChanges.length > 1 ? 's' : ''} on your wishlists this week`,
          html,
        })
      })
    }

    return { sent: userIds.length }
  }
)
