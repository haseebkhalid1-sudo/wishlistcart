import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Gift, ShoppingBag, Bell, ArrowRight, List, CalendarHeart, Compass, Users } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Dashboard',
}

type RecentItem = Prisma.WishlistItemGetPayload<{
  select: {
    id: true
    title: true
    imageUrl: true
    price: true
    currency: true
    createdAt: true
    wishlist: { select: { name: true } }
  }
}>

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

const QUICK_ACTIONS = [
  {
    href: '/dashboard/wishlists',
    icon: List,
    title: 'Add items to your wishlist',
    description: 'Save products from any store with one click.',
  },
  {
    href: '/dashboard/registries/new',
    icon: CalendarHeart,
    title: 'Create a registry',
    description: 'Build a registry for weddings, birthdays, and more.',
  },
  {
    href: '/explore',
    icon: Compass,
    title: 'Explore community wishlists',
    description: 'Discover what others are saving and follow them.',
  },
  {
    href: '/dashboard/referrals',
    icon: Users,
    title: 'Invite friends',
    description: 'Share WishlistCart and earn rewards together.',
  },
]

const WELCOME_ACTIONS = [
  { href: '/dashboard/wishlists/new', label: 'Create your first wishlist' },
  { href: '/dashboard/registries/new', label: 'Start a gift registry' },
  { href: '/explore', label: 'Explore community wishlists' },
]

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { onboardingDone: true, createdAt: true },
    })
    if (!dbUser?.onboardingDone) {
      redirect('/onboarding')
    }

    const userId = user.id

    // Parallel data fetching
    const [wishlistCount, itemCount, alertCount, recentItems] = await Promise.all([
      prisma.wishlist.count({ where: { userId } }),
      prisma.wishlistItem.count({ where: { wishlist: { userId } } }),
      prisma.priceAlert.count({ where: { userId, isActive: true } }),
      prisma.wishlistItem.findMany({
        where: { wishlist: { userId } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          price: true,
          currency: true,
          createdAt: true,
          wishlist: { select: { name: true } },
        },
      }) as unknown as Promise<RecentItem[]>,
    ])

    const isNewUser =
      dbUser.createdAt != null &&
      Date.now() - new Date(dbUser.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000

    const name = (user?.user_metadata?.['name'] as string | undefined) ?? 'there'
    const firstName = name.split(' ')[0]

    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-display-md text-foreground">
            Good morning, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your wishlists.
          </p>
        </div>

        {/* Welcome banner — shown for first 7 days */}
        {isNewUser && (
          <div className="rounded-xl border border-border bg-subtle p-6">
            <h2 className="text-base font-semibold text-foreground">
              Welcome to WishlistCart, {firstName}! Here are 3 things to try first:
            </h2>
            <ol className="mt-4 space-y-2">
              {WELCOME_ACTIONS.map((action, i) => (
                <li key={action.href} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-foreground">
                    {i + 1}
                  </span>
                  <Link
                    href={action.href}
                    className="text-sm text-foreground underline-offset-2 hover:underline"
                  >
                    {action.label}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Quick stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<List className="h-5 w-5 text-muted-foreground" />}
            value={wishlistCount}
            label="Wishlists"
            href="/dashboard/wishlists"
          />
          <StatCard
            icon={<ShoppingBag className="h-5 w-5 text-muted-foreground" />}
            value={itemCount}
            label="Items saved"
            href="/dashboard/wishlists"
          />
          <StatCard
            icon={<Bell className="h-5 w-5 text-muted-foreground" />}
            value={alertCount}
            label="Active price alerts"
            href="/dashboard/price-alerts"
          />
        </div>

        {/* Recent activity */}
        {recentItems.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recently added
            </h2>
            <div className="divide-y divide-border rounded-xl border border-border bg-subtle">
              {(recentItems as RecentItem[]).map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-4 py-3">
                  {/* Thumbnail */}
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-bg-overlay flex items-center justify-center">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Gift className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.wishlist.name} &middot; {timeAgo(new Date(item.createdAt))}
                    </p>
                  </div>

                  {/* Price */}
                  {item.price != null && (
                    <p className="shrink-0 text-sm font-medium text-foreground">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: item.currency ?? 'USD',
                      }).format(Number(item.price))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick actions grid */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Quick actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {QUICK_ACTIONS.map(({ href, icon: Icon, title, description }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-4 rounded-xl border border-border bg-subtle p-5 transition-colors hover:bg-bg-overlay"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Fallback if no user (middleware should catch this, but be safe)
  redirect('/login')
}

function StatCard({
  icon,
  value,
  label,
  href,
}: {
  icon: React.ReactNode
  value: number
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border border-border bg-subtle p-5 transition-colors hover:bg-bg-overlay"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Link>
  )
}
