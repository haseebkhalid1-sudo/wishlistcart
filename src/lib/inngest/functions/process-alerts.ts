import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { resend, FROM_EMAIL } from '@/lib/email/client'

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
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: `Price dropped ${dropPct}% on "${item.title}"`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h2 style="font-size: 20px; margin-bottom: 8px;">Price Alert Triggered</h2>
            <p style="color: #666;">The price on an item you're tracking just dropped.</p>
            <div style="border: 1px solid #e4e4e0; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="font-weight: 600; margin: 0 0 8px;">${item.title}</p>
              <p style="margin: 0; color: #888;">
                <span style="text-decoration: line-through;">$${oldPrice.toFixed(2)}</span>
                &nbsp;→&nbsp;
                <span style="color: #1a7a4a; font-weight: 700; font-size: 18px;">$${newPrice.toFixed(2)}</span>
                &nbsp;<span style="color: #1a7a4a;">(${dropPct}% off)</span>
              </p>
            </div>
            <a href="${buyUrl}" style="display: inline-block; background: #0F0F0F; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
              Buy now
            </a>
            <p style="margin-top: 24px; font-size: 12px; color: #aaa;">
              You received this because you set a price alert on WishlistCart.
            </p>
          </div>
        `,
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
