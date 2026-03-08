// src/app/(public)/@[username]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import {
  getPublicProfile,
  getPublicWishlists,
  getFollowStatus,
  type PublicWishlistCard,
} from '@/lib/actions/social'
import { FollowButton } from '@/components/social/follow-button'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile) return { title: 'Not found' }

  const name = profile.name ?? `@${username}`
  const title = `${name} — WishlistCart`
  const description = profile.bio ?? `${name}'s wishlists on WishlistCart.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'profile' },
    twitter: { card: 'summary', title, description },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile) notFound()

  const [publicWishlists, followStatus, supabase] = await Promise.all([
    getPublicWishlists(profile.id),
    getFollowStatus(profile.id),
    createServerClient(),
  ])

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isOwner = user?.id === profile.id

  const initials = (profile.name ?? username).replace('@', '')[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-background">
      {/* ── Profile header ── */}
      <div className="border-b border-border bg-subtle">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-overlay shadow-card">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name ?? username}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-medium text-muted-foreground">{initials}</span>
              )}
            </div>

            <h1 className="font-serif text-display-md text-foreground">
              {profile.name ?? `@${username}`}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">@{username}</p>

            {profile.bio && (
              <p className="mt-3 max-w-md text-sm text-muted-foreground">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="mt-5 flex items-center gap-8">
              {(
                [
                  { label: 'Wishlists', value: profile._count.wishlists },
                  { label: 'Followers', value: followStatus.followerCount },
                  { label: 'Following', value: followStatus.followingCount },
                ] as const
              ).map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-semibold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Follow button (only for other users) */}
            {!isOwner && (
              <div className="mt-5">
                <FollowButton
                  targetUserId={profile.id}
                  initialIsFollowing={followStatus.isFollowing}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Wishlists grid ── */}
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        {publicWishlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingCart className="mb-4 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No public wishlists yet.</p>
          </div>
        ) : (
          <>
            <h2 className="mb-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Wishlists
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {publicWishlists.map((w) => (
                <WishlistMiniCard key={w.id} wishlist={w} username={username} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Footer ── */}
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

// ── Mini card ──────────────────────────────────────────────────────────────────

function WishlistMiniCard({
  wishlist,
  username,
}: {
  wishlist: PublicWishlistCard
  username: string
}) {
  const previews = wishlist.items.filter((i) => i.imageUrl).slice(0, 4)

  return (
    <Link
      href={`/@${username}/${wishlist.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-card"
    >
      {/* Preview grid */}
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
        <div className="flex aspect-[2/1] items-center justify-center bg-bg-overlay">
          <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
        </div>
      )}

      <div className="p-4">
        <p className="truncate font-medium text-foreground group-hover:underline">
          {wishlist.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {wishlist._count.items} item{wishlist._count.items !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  )
}
