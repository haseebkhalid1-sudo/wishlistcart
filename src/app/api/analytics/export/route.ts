import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { isPaidPlan } from '@/lib/plans'
import { getDashboardAnalytics } from '@/lib/queries/analytics'

export async function GET(): Promise<NextResponse> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { plan: true },
  })

  if (!dbUser || !isPaidPlan(dbUser.plan)) {
    return new NextResponse('Pro plan required', { status: 403 })
  }

  const analytics = await getDashboardAnalytics(user.id, 90)

  const rows: string[] = []
  rows.push('Type,Date,Detail,Count')

  // Views by day
  for (const v of analytics.viewsByDay) {
    if (v.count > 0) {
      rows.push(`Wishlist Views,${v.date},All wishlists,${v.count}`)
    }
  }

  // Top wishlists
  for (const w of analytics.topWishlists) {
    rows.push(`Top Wishlist,,${escapeCSV(w.name)} (/${w.slug}),${w.views}`)
  }

  // Affiliate clicks
  rows.push(`Affiliate Clicks Total,,All items,${analytics.totalClicks}`)
  rows.push(`Affiliate Conversions,,All items,${analytics.totalConversions}`)
  for (const item of analytics.topClickedItems) {
    rows.push(
      `Affiliate Click,,${escapeCSV(item.title)} (${escapeCSV(item.wishlistName)}),${item.clicks}`
    )
  }

  // Gift claims
  rows.push(`Items Total,,All wishlists,${analytics.totalItems}`)
  rows.push(`Items Claimed,,All wishlists,${analytics.totalClaimed}`)
  for (const item of analytics.mostClaimedItems) {
    const dateStr = item.claimedAt
      ? new Date(item.claimedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : ''
    rows.push(`Gift Claim,${dateStr},${escapeCSV(item.title)} (${escapeCSV(item.wishlistName)}),1`)
  }

  // Referrals
  if (analytics.referralCode) {
    rows.push(`Referral Code,,${analytics.referralCode},`)
    rows.push(`Referral Clicks,,${analytics.referralCode},${analytics.referralClicks}`)
    rows.push(`Referral Signups,,${analytics.referralCode},${analytics.referralSignups}`)
    rows.push(`Referral Paid Conversions,,${analytics.referralCode},${analytics.referralConversions}`)
  }

  const csv = rows.join('\n')
  const today = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="wishlistcart-analytics-${today}.csv"`,
    },
  })
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
