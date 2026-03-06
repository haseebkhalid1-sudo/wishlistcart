import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'

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

        const rows = priceChanges
          .map(
            (c) =>
              `<tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0ee;">${c.title}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0ee; text-align: right; text-decoration: line-through; color: #aaa;">$${c.oldPrice.toFixed(2)}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f0f0ee; text-align: right; color: #1a7a4a; font-weight: 600;">$${c.newPrice.toFixed(2)}</td>
              </tr>`
          )
          .join('')

        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `${priceChanges.length} price drop${priceChanges.length > 1 ? 's' : ''} on your wishlists this week`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
              <h2 style="font-size: 20px; margin-bottom: 8px;">Your weekly price digest</h2>
              <p style="color: #666; margin-bottom: 24px;">Here are the price changes on your wishlists this week.</p>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px; font-size: 12px; color: #aaa; text-transform: uppercase; border-bottom: 2px solid #e4e4e0;">Item</th>
                    <th style="text-align: right; padding-bottom: 8px; font-size: 12px; color: #aaa; text-transform: uppercase; border-bottom: 2px solid #e4e4e0;">Was</th>
                    <th style="text-align: right; padding-bottom: 8px; font-size: 12px; color: #aaa; text-transform: uppercase; border-bottom: 2px solid #e4e4e0;">Now</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'}/dashboard" style="display: inline-block; margin-top: 24px; background: #0F0F0F; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
                View your wishlists
              </a>
              <p style="margin-top: 24px; font-size: 12px; color: #aaa;">
                WishlistCart · <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'}/dashboard/settings" style="color: #aaa;">Manage notifications</a>
              </p>
            </div>
          `,
        })
      })
    }

    return { sent: userIds.length }
  }
)
