import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { isPaidPlan } from '@/lib/plans'
import { getDashboardAnalytics, type AnalyticsPeriod } from '@/lib/queries/analytics'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

export const metadata: Metadata = {
  title: 'Analytics — WishlistCart',
  description: 'Track wishlist views, affiliate clicks, gift claims, and referrals.',
}

interface Props {
  searchParams: Promise<{ period?: string }>
}

export default async function AnalyticsPage({ searchParams }: Props) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { plan: true },
  })
  if (!dbUser) redirect('/login')

  // Pro gate — show upsell to free users
  if (!isPaidPlan(dbUser.plan)) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-serif text-display-md text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track wishlist views, affiliate clicks, gift claims, and referrals.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-bg-overlay">
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Analytics is a Pro feature</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Upgrade to Pro to unlock detailed analytics: wishlist views, affiliate clicks, gift
            claims, and your referral funnel.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    )
  }

  const { period } = await searchParams
  const days: AnalyticsPeriod = period === '7' ? 7 : period === '90' ? 90 : 30

  const analytics = await getDashboardAnalytics(user.id, days)

  return (
    <div>
      {/* Heading + period selector */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track wishlist views, affiliate clicks, gift claims, and referrals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {([7, 30, 90] as const).map((d) => (
            <a
              key={d}
              href={`/dashboard/analytics?period=${d}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                days === d
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:bg-subtle'
              }`}
            >
              {d}d
            </a>
          ))}
        </div>
      </div>

      <AnalyticsDashboard analytics={analytics} days={days} />
    </div>
  )
}
