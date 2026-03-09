// src/app/(public)/explore/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Explore Wishlists — WishlistCart',
  description: 'Discover public wishlists and gift registries from the WishlistCart community.',
}

type ExploreWishlist = Prisma.WishlistGetPayload<{
  include: {
    user: { select: { name: true; username: true; avatarUrl: true } }
    _count: { select: { items: true } }
    items: { select: { imageUrl: true } }
  }
}>

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

const CATEGORY_LINKS = [
  { label: 'Birthday', href: '/gift-ideas/for/birthday' },
  { label: 'Wedding', href: '/gift-ideas/for/wedding' },
  { label: 'Baby Shower', href: '/gift-ideas/for/baby-shower' },
  { label: 'Christmas', href: '/gift-ideas/for/christmas' },
  { label: 'Graduation', href: '/gift-ideas/for/graduation' },
]

export default async function ExplorePage() {
  const [wishlists, registries, totalCount] = await Promise.all([
    prisma.wishlist.findMany({
      where: { privacy: 'PUBLIC', isArchived: false, type: 'PERSONAL' },
      include: {
        user: { select: { name: true, username: true, avatarUrl: true } },
        _count: { select: { items: true } },
        items: {
          take: 4,
          orderBy: { position: 'asc' },
          select: { imageUrl: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 40,
    }) as unknown as Promise<ExploreWishlist[]>,

    prisma.wishlist.findMany({
      where: { privacy: 'PUBLIC', isArchived: false, type: 'REGISTRY' },
      include: {
        user: { select: { name: true, username: true, avatarUrl: true } },
        _count: { select: { items: true } },
        items: {
          take: 4,
          orderBy: { position: 'asc' },
          select: { imageUrl: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 8,
    }) as unknown as Promise<ExploreWishlist[]>,

    prisma.wishlist.count({
      where: { privacy: 'PUBLIC', isArchived: false },
    }),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <div className="flex flex-col items-center text-center">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Community
            </p>
            <h1 className="font-serif text-display-md text-foreground">Explore Wishlists</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Discover wishlists and registries from the WishlistCart community.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 space-y-12">
        {/* CTA banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-subtle px-5 py-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Add items from any store and share your wishlist in minutes.
          </p>
          <a
            href={`${APP_URL}/signup`}
            className="shrink-0 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Create your own
          </a>
        </div>

        {/* Discover by category */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Discover by occasion
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_LINKS.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-subtle"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Registries section */}
        {registries.length > 0 && (
          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-xl text-foreground">Registries</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {registries.map((w) => (
                <ExploreCard key={w.id} wishlist={w} />
              ))}
            </div>
          </section>
        )}

        {/* Wishlists section */}
        <section>
          {wishlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="mb-4 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No public wishlists yet — be the first!</p>
              <a
                href={`${APP_URL}/signup`}
                className="mt-4 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Create a wishlist
              </a>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="font-serif text-xl text-foreground">Wishlists</h2>
                {totalCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {totalCount.toLocaleString()} wishlist{totalCount !== 1 ? 's' : ''} shared
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {wishlists.map((w) => (
                  <ExploreCard key={w.id} wishlist={w} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{' '}
          <a href={APP_URL} className="font-medium text-foreground hover:underline">
            WishlistCart
          </a>{' '}
          ·{' '}
          <a href={`${APP_URL}/signup`} className="hover:underline">
            Create your own wishlist
          </a>
        </p>
      </div>
    </div>
  )
}

function ExploreCard({ wishlist }: { wishlist: ExploreWishlist }) {
  const { user } = wishlist
  const href =
    user.username
      ? `/@${user.username}/${wishlist.slug}`
      : null
  const previews = wishlist.items.filter((i) => i.imageUrl).slice(0, 4)
  const initials = (user.name ?? user.username ?? '?')[0]?.toUpperCase() ?? '?'

  const inner = (
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-card">
      {/* Preview */}
      {previews.length > 0 ? (
        <div className="grid grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-bg-overlay">
              {previews[i]?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previews[i]!.imageUrl!}
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-bg-overlay">
          <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
        </div>
      )}

      <div className="p-3">
        <p className="truncate text-sm font-medium text-foreground group-hover:underline">
          {wishlist.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {wishlist._count.items} item{wishlist._count.items !== 1 ? 's' : ''}
        </p>

        {/* Owner */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-bg-overlay">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.name ?? ''} width={20} height={20} className="h-full w-full object-cover" />
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
