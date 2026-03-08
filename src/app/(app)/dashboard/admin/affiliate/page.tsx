import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { Badge } from '@/components/ui/badge'
import { AnalyticsChart, type ChartDataPoint } from '@/components/creator/analytics-chart'

export const metadata: Metadata = {
  title: 'Affiliate Performance — Admin',
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

export default async function AdminAffiliatePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  // Top 10 retailers by converted click count + commission
  const byRetailerRaw = (await prisma.affiliateClick.groupBy({
    by: ['retailer'],
    _count: { id: true },
    _sum: { commissionAmount: true },
    where: { converted: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  })) as unknown as Array<{
    retailer: string
    _count: { id: number }
    _sum: { commissionAmount: string | null }
  }>

  // Total clicks per retailer (all clicks, not just converted)
  const allClicksByRetailerRaw = (await prisma.affiliateClick.groupBy({
    by: ['retailer'],
    _count: { id: true },
  })) as unknown as Array<{ retailer: string; _count: { id: number } }>

  const allClicksMap = new Map(
    allClicksByRetailerRaw.map((r) => [r.retailer, r._count.id])
  )

  const byRetailer = byRetailerRaw.map((r) => {
    const totalClicks = allClicksMap.get(r.retailer) ?? 0
    const conversions = r._count.id
    const conversionRate = totalClicks > 0 ? ((conversions / totalClicks) * 100).toFixed(1) : '0.0'
    return {
      retailer: r.retailer,
      totalClicks,
      conversions,
      conversionRate,
      commission: Number(r._sum.commissionAmount ?? 0),
    }
  })

  // Recent 50 affiliate clicks
  const recentClicks = await prisma.affiliateClick.findMany({
    orderBy: { clickedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      retailer: true,
      converted: true,
      commissionAmount: true,
      clickedAt: true,
    },
  })

  // 30-day click trend
  const trendClicks = await prisma.affiliateClick.findMany({
    where: { clickedAt: { gte: thirtyDaysAgo } },
    select: { clickedAt: true },
    orderBy: { clickedAt: 'asc' },
  })

  // Build chart data (views = clicks, clicks = 0 — single line)
  const trendMap = new Map<string, number>()
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
    trendMap.set(formatDate(d), 0)
  }
  for (const c of trendClicks) {
    const key = formatDate(new Date(c.clickedAt))
    const current = trendMap.get(key)
    if (current !== undefined) trendMap.set(key, current + 1)
  }
  const trendData: ChartDataPoint[] = Array.from(trendMap.entries()).map(([date, count]) => ({
    date,
    views: count,
    clicks: 0,
  }))

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">Affiliate Performance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Click and commission data across all retailers.
        </p>
      </div>

      {/* 30-day trend chart */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-1 text-sm font-semibold text-foreground">30-Day Click Trend</h2>
        <p className="mb-4 text-xs text-muted-foreground">Total affiliate clicks per day</p>
        <AnalyticsChart data={trendData} />
        <div className="mt-3 flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-4 rounded-full bg-[#0F0F0F]" />
            Clicks
          </span>
        </div>
      </div>

      {/* Top retailers table */}
      <div className="mb-8 rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Top Retailers by Conversions</h2>
        </div>
        {byRetailer.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No converted clicks yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Retailer
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Clicks
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Conversions
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Conv. Rate
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Est. Commission
                  </th>
                </tr>
              </thead>
              <tbody>
                {byRetailer.map((row) => (
                  <tr key={row.retailer} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">{row.retailer}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {row.totalClicks.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {row.conversions.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {row.conversionRate}%
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-foreground">
                      {formatCurrency(row.commission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent clicks table */}
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Affiliate Clicks</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Last 50 clicks</p>
        </div>
        {recentClicks.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">No clicks yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Retailer
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Converted
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentClicks.map((click) => (
                  <tr key={click.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(click.clickedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{click.retailer}</td>
                    <td className="px-5 py-3">
                      {click.converted ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Converted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-foreground">
                      {click.commissionAmount
                        ? formatCurrency(Number(click.commissionAmount))
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
