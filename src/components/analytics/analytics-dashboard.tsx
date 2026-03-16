'use client'

import { useState } from 'react'
import { Eye, MousePointerClick, Gift, Users2, Download } from 'lucide-react'
import { StatCard } from '@/components/creator/stat-card'
import { AnalyticsChart, type ChartDataPoint } from '@/components/creator/analytics-chart'
import type { DashboardAnalytics, AnalyticsPeriod } from '@/lib/queries/analytics'

interface AnalyticsDashboardProps {
  analytics: DashboardAnalytics
  days: AnalyticsPeriod
}

export function AnalyticsDashboard({ analytics, days }: AnalyticsDashboardProps) {
  const [exporting, setExporting] = useState(false)

  const chartData: ChartDataPoint[] = analytics.viewsByDay.map((v) => ({
    date: v.date,
    views: v.count,
    clicks: 0,
  }))

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/analytics/export')
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const today = new Date().toISOString().slice(0, 10)
      a.download = `wishlistcart-analytics-${today}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // silent
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      {/* Export button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-subtle disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Overview stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Views"
          value={analytics.totalViews.toLocaleString()}
          icon={<Eye className="h-4 w-4" />}
        />
        <StatCard
          label="Affiliate Clicks"
          value={analytics.totalClicks.toLocaleString()}
          icon={<MousePointerClick className="h-4 w-4" />}
        />
        <StatCard
          label="Items Claimed"
          value={analytics.totalClaimed.toLocaleString()}
          icon={<Gift className="h-4 w-4" />}
        />
        <StatCard
          label="Referral Signups"
          value={analytics.referralSignups.toLocaleString()}
          icon={<Users2 className="h-4 w-4" />}
        />
      </div>

      {/* Views over time chart */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Views over time ({days}d)</h2>
        <AnalyticsChart data={chartData} />
        <div className="mt-3 flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-4 rounded-full bg-[#0F0F0F]" />
            Views
          </span>
        </div>
      </div>

      {/* Top wishlists by views + affiliate performance */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top wishlists */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Top Wishlists by Views</h2>
          </div>
          {analytics.topWishlists.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No views yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {analytics.topWishlists.map((w) => (
                <div key={w.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                    <p className="text-xs text-muted-foreground">/{w.slug}</p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {w.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {w.claimRate.toFixed(0)}% claimed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Affiliate performance */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Affiliate Performance</h2>
              <span className="text-xs text-muted-foreground">
                {analytics.conversionRate.toFixed(1)}% conversion
              </span>
            </div>
          </div>
          {analytics.topClickedItems.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No affiliate clicks yet.
            </p>
          ) : (
            <div>
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-border px-5 py-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Item
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Clicks
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Conv.
                </p>
              </div>
              <div className="divide-y divide-border">
                {analytics.topClickedItems.map((item) => (
                  <div
                    key={item.itemId}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.wishlistName}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.clicks.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.converted}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gift claims + Referral funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gift claims */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Gift Claims</h2>
              <span className="text-xs text-muted-foreground">
                {analytics.overallClaimRate.toFixed(0)}% overall
              </span>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-center">
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {analytics.totalItems}
                </p>
                <p className="text-xs text-muted-foreground">Total items</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {analytics.totalClaimed}
                </p>
                <p className="text-xs text-muted-foreground">Claimed</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {(analytics.totalItems - analytics.totalClaimed).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
            {analytics.mostClaimedItems.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Recently Claimed
                </p>
                <div className="space-y-2">
                  {analytics.mostClaimedItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground">{item.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.wishlistName}</p>
                      </div>
                      {item.claimedAt && (
                        <p className="ml-3 shrink-0 text-xs text-muted-foreground">
                          {new Date(item.claimedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {analytics.mostClaimedItems.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No items claimed yet.
              </p>
            )}
          </div>
        </div>

        {/* Referral funnel */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Referral Funnel</h2>
          </div>
          <div className="px-5 py-4">
            {analytics.referralCode ? (
              <div>
                <div className="mb-4 rounded-lg bg-subtle px-4 py-3">
                  <p className="mb-0.5 text-xs text-muted-foreground">Your referral code</p>
                  <p className="font-mono text-lg font-bold text-foreground">
                    {analytics.referralCode}
                  </p>
                </div>
                <div className="space-y-3">
                  {/* Funnel steps */}
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Clicks</p>
                      <p className="text-xs text-muted-foreground">Referral link visited</p>
                    </div>
                    <p className="font-serif text-2xl font-semibold text-foreground">
                      {analytics.referralClicks.toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4 h-4 w-0.5 bg-border" />
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Signups</p>
                      <p className="text-xs text-muted-foreground">
                        {analytics.referralClicks > 0
                          ? `${((analytics.referralSignups / analytics.referralClicks) * 100).toFixed(0)}% of clicks`
                          : '—'}
                      </p>
                    </div>
                    <p className="font-serif text-2xl font-semibold text-foreground">
                      {analytics.referralSignups.toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4 h-4 w-0.5 bg-border" />
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Paid Conversions</p>
                      <p className="text-xs text-muted-foreground">
                        {analytics.referralSignups > 0
                          ? `${((analytics.referralConversions / analytics.referralSignups) * 100).toFixed(0)}% of signups`
                          : '—'}
                      </p>
                    </div>
                    <p className="font-serif text-2xl font-semibold text-foreground">
                      {analytics.referralConversions.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="mb-3 text-sm text-muted-foreground">
                  You don&apos;t have a referral code yet.
                </p>
                <a
                  href="/dashboard/referrals"
                  className="text-sm font-medium text-foreground underline underline-offset-2"
                >
                  Set up referrals
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
