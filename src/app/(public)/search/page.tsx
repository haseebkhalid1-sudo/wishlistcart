// src/app/(public)/search/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart, User } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Search — WishlistCart',
  description: 'Search wishlists and people on WishlistCart.',
}

type SearchWishlist = Prisma.WishlistGetPayload<{
  include: {
    user: { select: { username: true; name: true; avatarUrl: true } }
    _count: { select: { items: true } }
  }
}>

type SearchUser = {
  id: string
  username: string | null
  name: string | null
  avatarUrl: string | null
  _count: { wishlists: number }
}

interface Props {
  searchParams: Promise<{ q?: string; tab?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, tab = 'all' } = await searchParams
  const query = q?.trim() ?? ''

  let wishlists: SearchWishlist[] = []
  let users: SearchUser[] = []

  if (query.length >= 2) {
    const [wl, us] = await Promise.all([
      prisma.wishlist.findMany({
        where: {
          privacy: 'PUBLIC',
          isArchived: false,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          user: { select: { username: true, name: true, avatarUrl: true } },
          _count: { select: { items: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 40,
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          _count: { select: { wishlists: true } },
        },
        take: 40,
      }),
    ])
    wishlists = wl as unknown as SearchWishlist[]
    users = us as unknown as SearchUser[]
  }

  const activeTab = tab === 'wishlists' ? 'wishlists' : tab === 'people' ? 'people' : 'all'

  const tabs = [
    { key: 'all', label: 'All', count: wishlists.length + users.length },
    { key: 'wishlists', label: 'Wishlists', count: wishlists.length },
    { key: 'people', label: 'People', count: users.length },
  ] as const

  const showWishlists = activeTab === 'all' || activeTab === 'wishlists'
  const showPeople = activeTab === 'all' || activeTab === 'people'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-subtle">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <h1 className="font-serif text-display-md text-foreground">
            {query ? `Results for "${query}"` : 'Search WishlistCart'}
          </h1>
          {!query && (
            <p className="mt-2 text-sm text-muted-foreground">
              Search for wishlists, registries, and people.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {/* No query state */}
        {!query && (
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="mb-4 text-sm font-medium text-foreground">Search tips</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>· Search by wishlist name or description</li>
              <li>· Search by username or display name</li>
              <li>· Results show only public wishlists</li>
              <li>· Minimum 2 characters to search</li>
            </ul>
          </div>
        )}

        {/* Results */}
        {query.length >= 2 && (
          <>
            {/* Tabs */}
            <div className="mb-6 flex gap-1 border-b border-border">
              {tabs.map(({ key, label, count }) => {
                const isActive = activeTab === key
                const href = `/search?q=${encodeURIComponent(query)}&tab=${key}`
                return (
                  <Link
                    key={key}
                    href={href}
                    className={[
                      'flex items-center gap-1.5 border-b-2 pb-3 pt-1 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-foreground text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                  >
                    {label}
                    <span
                      className={[
                        'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                        isActive
                          ? 'bg-foreground text-background'
                          : 'bg-border text-muted-foreground',
                      ].join(' ')}
                    >
                      {count}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Empty state */}
            {wishlists.length === 0 && users.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Search className="mb-4 h-10 w-10 text-muted-foreground/30" />
                <p className="font-medium text-foreground">No results found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term.
                </p>
              </div>
            )}

            {/* Wishlists grid */}
            {showWishlists && wishlists.length > 0 && (
              <section className="mb-10">
                {activeTab === 'all' && (
                  <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Wishlists
                  </h2>
                )}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {wishlists.map((w) => (
                    <WishlistCard key={w.id} wishlist={w} />
                  ))}
                </div>
              </section>
            )}

            {/* People list */}
            {showPeople && users.length > 0 && (
              <section>
                {activeTab === 'all' && (
                  <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    People
                  </h2>
                )}
                <div className="space-y-2">
                  {users.map((u) => (
                    <UserCard key={u.id} user={u} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Wishlist card ────────────────────────────────────────────────────────────

function WishlistCard({ wishlist }: { wishlist: SearchWishlist }) {
  const { user } = wishlist
  const href = user.username ? `/@${user.username}/${wishlist.slug}` : null
  const initials = (user.name ?? user.username ?? '?')[0]?.toUpperCase() ?? '?'

  const inner = (
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-card">
      {/* Placeholder preview */}
      <div className="flex aspect-[4/3] items-center justify-center bg-bg-overlay">
        <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-medium text-foreground group-hover:underline">
          {wishlist.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {wishlist._count.items} item{wishlist._count.items !== 1 ? 's' : ''}
        </p>

        {/* Owner chip */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg-overlay border border-border">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name ?? ''}
                width={20}
                height={20}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[9px] font-medium text-muted-foreground">{initials}</span>
            )}
          </div>
          <span className="truncate text-[11px] text-muted-foreground">
            {user.name ?? (user.username ? `@${user.username}` : 'Unknown')}
          </span>
        </div>
      </div>
    </div>
  )

  if (!href) return <div>{inner}</div>
  return <Link href={href}>{inner}</Link>
}

// ── User card ────────────────────────────────────────────────────────────────

function UserCard({ user }: { user: SearchUser }) {
  if (!user.username) return null
  const initials = (user.name ?? user.username)[0]?.toUpperCase() ?? '?'

  return (
    <Link
      href={`/@${user.username}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-card"
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-overlay">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name ?? user.username}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">
          {user.name ?? `@${user.username}`}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          @{user.username} · {user._count.wishlists} wishlist
          {user._count.wishlists !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  )
}
