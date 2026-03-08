import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

export type AnalyticsWishlist = {
  id: string
  name: string
  slug: string
}

export type AnalyticsView = {
  viewedAt: Date
  wishlistId: string
}

export type AnalyticsClick = {
  clickedAt: Date
  retailer: string
  converted: boolean
  commissionAmount: Prisma.Decimal | null
}

export type AnalyticsEarning = Prisma.CreatorEarningGetPayload<Record<string, never>>

export type CreatorAnalyticsResult = {
  wishlists: AnalyticsWishlist[]
  views: AnalyticsView[]
  clicks: AnalyticsClick[]
  earnings: AnalyticsEarning[]
  totalEarnings: { _sum: { amount: Prisma.Decimal | null } }
  since: Date
}

export async function getCreatorAnalytics(
  userId: string,
  days = 30
): Promise<CreatorAnalyticsResult> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // Get all public wishlists for this creator
  const wishlists = await prisma.wishlist.findMany({
    where: { userId, privacy: 'PUBLIC', isArchived: false },
    select: { id: true, name: true, slug: true },
  })
  const wishlistIds = wishlists.map((w) => w.id)

  // Views over time (grouped by day)
  const views =
    wishlistIds.length > 0
      ? await prisma.wishlistView.findMany({
          where: { wishlistId: { in: wishlistIds }, viewedAt: { gte: since } },
          select: { viewedAt: true, wishlistId: true },
          orderBy: { viewedAt: 'asc' },
        })
      : []

  // Affiliate clicks from user's wishlists (via items)
  const clicks = (await prisma.affiliateClick.findMany({
    where: {
      item: { wishlist: { userId } },
      clickedAt: { gte: since },
    },
    select: {
      clickedAt: true,
      retailer: true,
      converted: true,
      commissionAmount: true,
    },
    orderBy: { clickedAt: 'asc' },
  })) as unknown as AnalyticsClick[]

  // Recent earnings
  const earnings = (await prisma.creatorEarning.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })) as unknown as AnalyticsEarning[]

  // Total earnings aggregate
  const totalEarnings = (await prisma.creatorEarning.aggregate({
    where: { userId, status: { in: ['PENDING', 'PROCESSING', 'PAID'] } },
    _sum: { amount: true },
  })) as unknown as { _sum: { amount: Prisma.Decimal | null } }

  return { wishlists, views, clicks, earnings, totalEarnings, since }
}
