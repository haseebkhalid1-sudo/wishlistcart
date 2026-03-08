import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShoppingCart, Users } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Feed — WishlistCart',
}

type FeedWishlist = Prisma.WishlistGetPayload<{
  include: {
    user: { select: { name: true; username: true; avatarUrl: true } }
    _count: { select: { items: true } }
    items: { select: { imageUrl: true } }
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
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default async function FeedPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get IDs of users the current user follows
  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    select: { followingId: true },
  })
  const followingIds = following.map((f) => f.followingId)

  // Fetch recent public wishlists from followed users
  const wishlists =
    followingIds.length > 0
      ? ((await prisma.wishlist.findMany({
          where: {
            userId: { in: followingIds },
            privacy: 'PUBLIC',
            isArchived: false,
          },
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
          take: 30,
        })) as unknown as FeedWishlist[])
      : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">Feed</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent wishlists from people you follow.
        </p>
      </div>

      {followingIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-24 text-center">
          <Users className="mb-4 h-10 w-10 text-muted-foreground/30" />
          <h2 className="text-base font-semibold text-foreground">
            You&apos;re not following anyone yet
          </h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Explore public wishlists and follow people to see their updates here.
          </p>
          <Link
            href="/explore"
            className="mt-6 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Explore wishlists
          </Link>
        </div>
      ) : wishlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-24 text-center">
          <ShoppingCart className="mb-4 h-10 w-10 text-muted-foreground/30" />
          <h2 className="text-base font-semibold text-foreground">Nothing new yet</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            The people you follow haven&apos;t shared any public wishlists yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlists.map((w) => (
            <FeedCard key={w.id} wishlist={w} />
          ))}
        </div>
      )}
    </div>
  )
}

function FeedCard({ wishlist }: { wishlist: FeedWishlist }) {
  const { user } = wishlist
  const href = user.username ? `/@${user.username}/${wishlist.slug}` : null
  const profileHref = user.username ? `/@${user.username}` : null
  const previews = wishlist.items.filter((i) => i.imageUrl).slice(0, 4)
  const initials = (user.name ?? user.username ?? '?')[0]?.toUpperCase() ?? '?'

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Owner row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-bg-overlay">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name ?? ''}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-muted-foreground">{initials}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {profileHref ? (
            <Link
              href={profileHref}
              className="text-sm font-medium text-foreground hover:underline"
            >
              {user.name ?? `@${user.username}`}
            </Link>
          ) : (
            <span className="text-sm font-medium text-foreground">
              {user.name ?? 'Unknown'}
            </span>
          )}
          <p className="text-xs text-muted-foreground">
            updated {timeAgo(new Date(wishlist.updatedAt))}
          </p>
        </div>
      </div>

      {/* Image preview */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 border-t border-border">
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
      )}

      {/* Title row */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{wishlist.name}</p>
          <p className="text-xs text-muted-foreground">
            {wishlist._count.items} item{wishlist._count.items !== 1 ? 's' : ''}
          </p>
        </div>
        {href && (
          <Link
            href={href}
            className="ml-3 shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-subtle"
          >
            View
          </Link>
        )}
      </div>
    </div>
  )
}
