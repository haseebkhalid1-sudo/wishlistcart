import { prisma } from '@/lib/prisma/client'

export type AnalyticsPeriod = 7 | 30 | 90

export type DashboardAnalytics = {
  // views
  totalViews: number
  viewsByDay: Array<{ date: string; count: number }>
  topWishlists: Array<{ id: string; name: string; slug: string; views: number; claimRate: number }>
  // affiliate clicks
  totalClicks: number
  totalConversions: number
  conversionRate: number
  topClickedItems: Array<{
    itemId: string
    title: string
    wishlistName: string
    clicks: number
    converted: number
  }>
  // gift claims
  totalItems: number
  totalClaimed: number
  overallClaimRate: number
  mostClaimedItems: Array<{
    id: string
    title: string
    wishlistName: string
    claimedAt: Date | null
  }>
  // referrals
  referralCode: string | null
  referralClicks: number
  referralSignups: number
  referralConversions: number
}

function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export async function getDashboardAnalytics(
  userId: string,
  days: AnalyticsPeriod
): Promise<DashboardAnalytics> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // Get user's wishlists
  const wishlists = await prisma.wishlist.findMany({
    where: { userId, isArchived: false },
    select: { id: true, name: true, slug: true },
  })
  const wishlistIds = wishlists.map((w) => w.id)

  // ---- Views ----
  const rawViews =
    wishlistIds.length > 0
      ? await prisma.wishlistView.findMany({
          where: { wishlistId: { in: wishlistIds }, viewedAt: { gte: since } },
          select: { viewedAt: true, wishlistId: true },
          orderBy: { viewedAt: 'asc' },
        })
      : []

  const totalViews = rawViews.length

  // Build viewsByDay — pre-fill all days in range
  const dayMap = new Map<string, number>()
  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000)
    dayMap.set(formatDay(d), 0)
  }
  for (const v of rawViews) {
    const key = formatDay(new Date(v.viewedAt))
    if (dayMap.has(key)) {
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1)
    }
  }
  const viewsByDay = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }))

  // Views per wishlist
  const viewsPerWishlist = new Map<string, number>()
  for (const v of rawViews) {
    viewsPerWishlist.set(v.wishlistId, (viewsPerWishlist.get(v.wishlistId) ?? 0) + 1)
  }

  // ---- Items + claim rate ----
  const allItems =
    wishlistIds.length > 0
      ? ((await (prisma.wishlistItem as unknown as {
          findMany: (args: unknown) => Promise<
            Array<{
              id: string
              title: string
              wishlistId: string
              isPurchased: boolean
              purchasedAt: Date | null
            }>
          >
        }).findMany({
          where: { wishlistId: { in: wishlistIds } },
          select: { id: true, title: true, wishlistId: true, isPurchased: true, purchasedAt: true },
        })) as Array<{
          id: string
          title: string
          wishlistId: string
          isPurchased: boolean
          purchasedAt: Date | null
        }>)
      : []

  const totalItems = allItems.length
  const totalClaimed = allItems.filter((i) => i.isPurchased).length
  const overallClaimRate = totalItems > 0 ? (totalClaimed / totalItems) * 100 : 0

  // topWishlists — sorted by views, with claim rate
  const itemsByWishlist = new Map<string, { total: number; claimed: number }>()
  for (const item of allItems) {
    const entry = itemsByWishlist.get(item.wishlistId) ?? { total: 0, claimed: 0 }
    entry.total += 1
    if (item.isPurchased) entry.claimed += 1
    itemsByWishlist.set(item.wishlistId, entry)
  }

  const topWishlists = wishlists
    .map((w) => {
      const stats = itemsByWishlist.get(w.id) ?? { total: 0, claimed: 0 }
      const claimRate = stats.total > 0 ? (stats.claimed / stats.total) * 100 : 0
      return { id: w.id, name: w.name, slug: w.slug, views: viewsPerWishlist.get(w.id) ?? 0, claimRate }
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  // mostClaimedItems
  const mostClaimedItems = allItems
    .filter((i) => i.isPurchased)
    .slice(0, 10)
    .map((i) => {
      const wishlist = wishlists.find((w) => w.id === i.wishlistId)
      return {
        id: i.id,
        title: i.title,
        wishlistName: wishlist?.name ?? 'Unknown',
        claimedAt: i.purchasedAt,
      }
    })

  // ---- Affiliate clicks ----
  type RawClick = {
    id: string
    itemId: string
    converted: boolean
    clickedAt: Date
    item: { title: string; wishlist: { name: string } }
  }

  const rawClicks =
    wishlistIds.length > 0
      ? ((await (prisma.affiliateClick as unknown as {
          findMany: (args: unknown) => Promise<RawClick[]>
        }).findMany({
          where: {
            item: { wishlist: { userId } },
            clickedAt: { gte: since },
          },
          select: {
            id: true,
            itemId: true,
            converted: true,
            clickedAt: true,
            item: { select: { title: true, wishlist: { select: { name: true } } } },
          },
        })) as RawClick[])
      : []

  const totalClicks = rawClicks.length
  const totalConversions = rawClicks.filter((c) => c.converted).length
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

  // topClickedItems — aggregate by itemId
  const clicksByItem = new Map<string, { title: string; wishlistName: string; clicks: number; converted: number }>()
  for (const c of rawClicks) {
    const entry = clicksByItem.get(c.itemId) ?? {
      title: c.item.title,
      wishlistName: c.item.wishlist.name,
      clicks: 0,
      converted: 0,
    }
    entry.clicks += 1
    if (c.converted) entry.converted += 1
    clicksByItem.set(c.itemId, entry)
  }

  const topClickedItems = Array.from(clicksByItem.entries())
    .map(([itemId, data]) => ({ itemId, ...data }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)

  // ---- Referrals ----
  const referralCode = await prisma.referralCode.findUnique({
    where: { userId },
    select: { code: true, clicks: true, signups: true },
  })

  let referralConversions = 0
  if (referralCode) {
    // Count referred users who became paid — query via ReferralCode.referred relation
    type RCWithReferred = { referred: Array<{ id: string }> }
    const rc = (await (prisma.referralCode as unknown as {
      findUnique: (args: unknown) => Promise<RCWithReferred | null>
    }).findUnique({
      where: { userId },
      select: {
        referred: {
          where: { plan: { not: 'FREE' } },
          select: { id: true },
        },
      },
    })) as RCWithReferred | null
    referralConversions = rc?.referred.length ?? 0
  }

  return {
    totalViews,
    viewsByDay,
    topWishlists,
    totalClicks,
    totalConversions,
    conversionRate,
    topClickedItems,
    totalItems,
    totalClaimed,
    overallClaimRate,
    mostClaimedItems,
    referralCode: referralCode?.code ?? null,
    referralClicks: referralCode?.clicks ?? 0,
    referralSignups: referralCode?.signups ?? 0,
    referralConversions,
  }
}
