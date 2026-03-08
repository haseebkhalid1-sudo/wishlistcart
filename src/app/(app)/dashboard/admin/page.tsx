import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Users, List, ShoppingCart, MousePointer, DollarSign, Star } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { StatCard } from '@/components/creator/stat-card'
import { AnalyticsChart, type ChartDataPoint } from '@/components/creator/analytics-chart'

export const metadata: Metadata = {
  title: 'Admin — WishlistCart',
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

function buildUserGrowthChart(
  users: { createdAt: Date }[],
  since: Date,
  days: number
): ChartDataPoint[] {
  const map = new Map<string, { views: number; clicks: number }>()

  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000)
    const key = formatDate(d)
    map.set(key, { views: 0, clicks: 0 })
  }

  for (const u of users) {
    const key = formatDate(new Date(u.createdAt))
    const entry = map.get(key)
    if (entry) entry.views += 1
  }

  return Array.from(map.entries()).map(([date, counts]) => ({ date, ...counts }))
}

export default async function AdminPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [userCount, wishlistCount, itemCount, clickCount, revenueAgg, creatorAppCount, newUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.wishlist.count({ where: { isArchived: false } }),
      prisma.wishlistItem.count(),
      prisma.affiliateClick.count(),
      prisma.affiliateClick.aggregate({ _sum: { commissionAmount: true } }) as unknown as Promise<{
        _sum: { commissionAmount: string | null }
      }>,
      prisma.creatorApplication.count({ where: { status: 'PENDING' } }),
      prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

  const revenueTotal = Number(revenueAgg._sum.commissionAmount ?? 0)
  const chartData = buildUserGrowthChart(newUsers, thirtyDaysAgo, 30)

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform metrics and health at a glance.
        </p>
      </div>

      {/* Stat cards — 3 col grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Users"
          value={userCount.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Active Wishlists"
          value={wishlistCount.toLocaleString()}
          icon={<List className="h-4 w-4" />}
        />
        <StatCard
          label="Total Items"
          value={itemCount.toLocaleString()}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatCard
          label="Affiliate Clicks"
          value={clickCount.toLocaleString()}
          icon={<MousePointer className="h-4 w-4" />}
        />
        <StatCard
          label="Est. Revenue"
          value={formatCurrency(revenueTotal)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <a href="/dashboard/admin/creators" className="block">
          <StatCard
            label="Pending Creator Apps"
            value={creatorAppCount.toLocaleString()}
            icon={<Star className="h-4 w-4" />}
            className="cursor-pointer transition-shadow hover:shadow-md"
          />
        </a>
      </div>

      {/* User growth chart */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-1 text-sm font-semibold text-foreground">User Growth</h2>
        <p className="mb-4 text-xs text-muted-foreground">New signups over the last 30 days</p>
        <AnalyticsChart data={chartData} />
        <div className="mt-3 flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-4 rounded-full bg-[#0F0F0F]" />
            New Users
          </span>
        </div>
      </div>
    </div>
  )
}
