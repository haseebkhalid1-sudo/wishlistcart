import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Eye, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { getCreatorAnalytics } from '@/lib/queries/creator-analytics'
import { StatCard } from '@/components/creator/stat-card'
import { AnalyticsChart, type ChartDataPoint } from '@/components/creator/analytics-chart'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Creator Analytics — WishlistCart',
}

// ---------- helpers ----------

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

function buildChartData(
  views: { viewedAt: Date; wishlistId: string }[],
  clicks: { clickedAt: Date }[],
  since: Date,
  days: number
): ChartDataPoint[] {
  // Build a map of date → { views, clicks }
  const map = new Map<string, { views: number; clicks: number }>()

  // Pre-fill every day in the range
  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000)
    const key = formatDate(d)
    map.set(key, { views: 0, clicks: 0 })
  }

  for (const v of views) {
    const key = formatDate(new Date(v.viewedAt))
    const entry = map.get(key)
    if (entry) entry.views += 1
  }

  for (const c of clicks) {
    const key = formatDate(new Date(c.clickedAt))
    const entry = map.get(key)
    if (entry) entry.clicks += 1
  }

  return Array.from(map.entries()).map(([date, counts]) => ({ date, ...counts }))
}

function buildTopWishlists(
  wishlists: { id: string; name: string; slug: string }[],
  views: { wishlistId: string }[],
  clicks: { clickedAt: Date }[]
) {
  // clicks don't have wishlistId — we attribute clicks at wishlist level via views proxy
  // Just count views per wishlist; clicks are already bucketed across all wishlists
  const viewCounts = new Map<string, number>()
  for (const v of views) {
    viewCounts.set(v.wishlistId, (viewCounts.get(v.wishlistId) ?? 0) + 1)
  }

  return wishlists
    .map((w) => ({ ...w, viewCount: viewCounts.get(w.id) ?? 0, clickCount: 0 }))
    .sort((a, b) => b.viewCount - a.viewCount)
}

function earningStatusVariant(status: string): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'PAID':
      return 'default'
    case 'PENDING':
    case 'PROCESSING':
      return 'secondary'
    default:
      return 'outline'
  }
}

// ---------- page ----------

interface Props {
  searchParams: Promise<{ period?: string }>
}

export default async function CreatorAnalyticsPage({ searchParams }: Props) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch db user to check isCreator
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isCreator: true },
  })
  if (!dbUser?.isCreator) redirect('/dashboard')

  const { period } = await searchParams
  const days = period === '7' ? 7 : 30

  const { wishlists, views, clicks, earnings, totalEarnings, since } =
    await getCreatorAnalytics(user.id, days)

  // Stat calculations
  const totalViews = views.length
  const totalClicks = clicks.length
  const conversions = clicks.filter((c) => c.converted).length
  const conversionRate =
    totalClicks > 0 ? ((conversions / totalClicks) * 100).toFixed(1) : '0.0'
  const earningsTotal = Number(totalEarnings._sum.amount ?? 0)

  const chartData = buildChartData(views, clicks, since, days)
  const topWishlists = buildTopWishlists(wishlists, views, clicks)

  return (
    <div>
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">Creator Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance overview for your public wishlists.
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2">
          <a
            href="/dashboard/creator/analytics?period=7"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              days === 7
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:bg-subtle'
            }`}
          >
            7 days
          </a>
          <a
            href="/dashboard/creator/analytics?period=30"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              days === 30
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:bg-subtle'
            }`}
          >
            30 days
          </a>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Views"
          value={totalViews.toLocaleString()}
          icon={<Eye className="h-4 w-4" />}
        />
        <StatCard
          label="Affiliate Clicks"
          value={totalClicks.toLocaleString()}
          icon={<MousePointerClick className="h-4 w-4" />}
        />
        <StatCard
          label="Conversion Rate"
          value={`${conversionRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Earnings"
          value={formatCurrency(earningsTotal)}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Views over time</h2>
        <AnalyticsChart data={chartData} />
        <div className="mt-3 flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-4 rounded-full bg-[#0F0F0F]" />
            Views
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-4 rounded-full bg-[#9ca3af]" />
            Clicks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top wishlists */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Top Wishlists</h2>
          </div>
          {topWishlists.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No public wishlists yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {topWishlists.map((w) => (
                <div key={w.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                    <p className="text-xs text-muted-foreground">/{w.slug}</p>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {w.viewCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent earnings */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Earnings</h2>
          </div>
          {earnings.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No earnings yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {earnings.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(Number(e.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge variant={earningStatusVariant(e.status)} className="ml-3 shrink-0">
                    {e.status.charAt(0) + e.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
