import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'

export const metadata: Metadata = {
  title: 'System Health — Admin',
}

const ENV_VARS = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'INNGEST_EVENT_KEY',
  'NEXT_PUBLIC_APP_URL',
]

export default async function AdminSystemPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const [
    userCount,
    wishlistCount,
    itemCount,
    clickCount,
    viewCount,
    notificationCount,
    recentErrors,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.wishlist.count(),
    prisma.wishlistItem.count(),
    prisma.affiliateClick.count(),
    prisma.wishlistView.count(),
    prisma.notification.count(),
    prisma.notification.findMany({
      where: { type: { contains: 'error' } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        createdAt: true,
      },
    }),
  ])

  const tableCounts = [
    { table: 'users', count: userCount },
    { table: 'wishlists', count: wishlistCount },
    { table: 'wishlist_items', count: itemCount },
    { table: 'affiliate_clicks', count: clickCount },
    { table: 'wishlist_views', count: viewCount },
    { table: 'notifications', count: notificationCount },
  ]

  const envStatus = ENV_VARS.map((k) => ({ key: k, set: !!process.env[k] }))

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">System Health</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Database row counts, recent errors, and environment status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* DB table counts */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Database Row Counts</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Table
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Rows
                </th>
              </tr>
            </thead>
            <tbody>
              {tableCounts.map((row) => (
                <tr key={row.table} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{row.table}</td>
                  <td className="px-5 py-3 text-right font-medium text-foreground">
                    {row.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Environment variables */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Environment Variables</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Values are never shown — set/unset status only.
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Variable
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {envStatus.map((env) => (
                <tr key={env.key} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{env.key}</td>
                  <td className="px-5 py-3 text-right">
                    {env.set ? (
                      <span className="text-green-600 font-medium">&#10003; Set</span>
                    ) : (
                      <span className="text-red-500 font-medium">&#10007; Missing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent errors */}
      <div className="mt-6 rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Error Notifications</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Last 10 notifications with type containing &quot;error&quot;
          </p>
        </div>
        {recentErrors.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No error notifications found.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {recentErrors.map((n) => (
              <div key={n.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{n.body}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-xs text-muted-foreground">{n.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
