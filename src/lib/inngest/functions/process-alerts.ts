import React from 'react'
import { render } from '@react-email/components'
import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { PriceDropEmail } from '@/emails/price-drop-email'

export const processAlert = inngest.createFunction(
  { id: 'process-price-alert', name: 'Process Price Alert' },
  { event: 'app/price-alert.triggered' },
  async ({ event, step, logger }) => {
    const { alertId, itemId, userId, oldPrice, newPrice } = event.data as {
      alertId: string
      itemId: string
      userId: string
      oldPrice: number
      newPrice: number
    }

    // Get alert + item + user details
    const [alert, item, user] = await step.run('fetch-details', async () => {
      return Promise.all([
        prisma.priceAlert.findUnique({ where: { id: alertId }, select: { id: true, isActive: true } }),
        prisma.wishlistItem.findUnique({
          where: { id: itemId },
          select: { title: true, url: true, affiliateUrl: true, imageUrl: true, wishlistId: true },
        }),
        prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } }),
      ])
    })

    if (!alert?.isActive || !item || !user?.email) {
      logger.info('Alert is inactive or missing data, skipping')
      return
    }

    const dropAmount = oldPrice - newPrice
    const dropPct = Math.round((dropAmount / oldPrice) * 100)
    const buyUrl = item.affiliateUrl ?? item.url ?? '#'

    // Send email notification
    await step.run('send-email', async () => {
      const storeName = item.url ? new URL(item.url).hostname.replace(/^www\./, '') : 'Online store'

      const html = await render(
        React.createElement(PriceDropEmail, {
          userName: user.name ?? 'there',
          itemTitle: item.title,
          storeName,
          oldPrice,
          newPrice,
          currency: 'USD',
          itemUrl: buyUrl,
          imageUrl: item.imageUrl ?? undefined,
        })
      )

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: `Price dropped ${dropPct}% on "${item.title}"`,
        html,
      })
    })

    // Create in-app notification
    await step.run('create-notification', async () => {
      await prisma.notification.create({
        data: {
          userId,
          type: 'price_drop',
          title: `Price dropped ${dropPct}% on "${item.title}"`,
          body: `Now $${newPrice.toFixed(2)} — was $${oldPrice.toFixed(2)}`,
          data: { url: `/dashboard/wishlists/${item.wishlistId}`, itemId },
        },
      })
    })

    // Mark alert as triggered (deactivate to prevent spam)
    await step.run('deactivate-alert', async () => {
      await prisma.priceAlert.update({
        where: { id: alertId },
        data: { isActive: false, lastTriggered: new Date() },
      })
    })

    logger.info(`Alert ${alertId} processed — sent email to ${user.email}`)
  }
)
