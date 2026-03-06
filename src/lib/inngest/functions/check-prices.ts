import { inngest } from '@/lib/inngest/client'
import { prisma } from '@/lib/prisma/client'
import { scrapeProduct } from '@/lib/scraper'

// Runs every 6 hours — checks all items with active price alerts
export const checkPrices = inngest.createFunction(
  { id: 'check-prices', name: 'Check Item Prices' },
  { cron: '0 */6 * * *' },
  async ({ step, logger }) => {
    const items = await step.run('get-items-to-check', async () => {
      return prisma.wishlistItem.findMany({
        where: {
          url: { not: null },
          wishlist: { isArchived: false },
          priceAlerts: { some: { isActive: true } },
        },
        select: {
          id: true,
          url: true,
          price: true,
          wishlistId: true,
          priceAlerts: {
            where: { isActive: true },
            select: { id: true, alertType: true, targetPrice: true, percentageDrop: true, userId: true },
          },
        },
      })
    })

    logger.info(`Checking prices for ${items.length} items`)

    for (const item of items) {
      await step.run(`check-${item.id}`, async () => {
        try {
          const scraped = await scrapeProduct(item.url!)
          if (scraped.price == null) return

          const newPrice = scraped.price
          const oldPrice = item.price ? Number(item.price) : null

          // Record price history
          await prisma.priceHistory.create({
            data: { itemId: item.id, price: newPrice },
          })

          // Update current price on item
          await prisma.wishlistItem.update({
            where: { id: item.id },
            data: { price: newPrice },
          })

          // Check each alert
          if (oldPrice != null) {
            for (const alert of item.priceAlerts) {
              if (shouldTriggerAlert({ type: alert.alertType, targetPrice: alert.targetPrice, percentageDrop: alert.percentageDrop }, oldPrice, newPrice)) {
                await inngest.send({
                  name: 'app/price-alert.triggered',
                  data: {
                    alertId: alert.id,
                    itemId: item.id,
                    userId: alert.userId,
                    oldPrice,
                    newPrice,
                  },
                })
              }
            }
          }
        } catch (err) {
          logger.warn(`Failed to check price for item ${item.id}: ${err}`)
        }
      })
    }

    return { checked: items.length }
  }
)

interface AlertConfig {
  type: string
  targetPrice: unknown
  percentageDrop: unknown
}

export function shouldTriggerAlert(
  alert: AlertConfig,
  oldPrice: number,
  newPrice: number
): boolean {
  if (newPrice >= oldPrice) return false // price didn't drop

  if (alert.type === 'ANY_DROP') return true

  if (alert.type === 'TARGET_PRICE' && alert.targetPrice != null) {
    return newPrice <= Number(alert.targetPrice)
  }

  if (alert.type === 'PERCENTAGE_DROP' && alert.percentageDrop != null) {
    const dropPct = ((oldPrice - newPrice) / oldPrice) * 100
    return dropPct >= Number(alert.percentageDrop)
  }

  return false
}
