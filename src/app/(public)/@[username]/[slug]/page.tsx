import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPublicWishlist } from '@/lib/queries/wishlist'
import { PublicItemGrid } from '@/components/wishlist/public-item-grid'
import { ShareButtons } from '@/components/shared/share-buttons'
import { ViewTracker } from '@/components/wishlist/view-tracker'

interface Props {
  params: Promise<{ username: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params
  const wishlist = await getPublicWishlist(username, slug)
  if (!wishlist) return { title: 'Not found' }

  const owner = wishlist.user.name ?? username
  const title = `${wishlist.name} — ${owner}'s Wishlist`
  const description =
    `${owner}'s wishlist on WishlistCart. ${wishlist._count.items} items from any store.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og-image?title=${encodeURIComponent(wishlist.name)}&subtitle=${encodeURIComponent(`by ${owner}`)}&items=${wishlist._count.items}`,
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function PublicWishlistPage({ params }: Props) {
  const { username, slug } = await params
  const wishlist = await getPublicWishlist(username, slug)

  if (!wishlist) notFound()

  const owner = wishlist.user
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'
  const shareUrl = `${appUrl}/@${username}/${slug}`

  return (
    <div className="min-h-screen bg-background">
      {/* View tracking — fire-and-forget client component */}
      <ViewTracker wishlistId={wishlist.id} />

      {/* Header */}
      <div className="border-b border-border bg-subtle">
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <div className="flex flex-col items-center text-center">
            {/* Owner avatar */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-overlay shadow-card">
              {owner.avatarUrl ? (
                <Image src={owner.avatarUrl} alt={owner.name ?? username} width={64} height={64} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-medium text-muted-foreground">
                  {(owner.name ?? username)[0]?.toUpperCase()}
                </span>
              )}
            </div>

            <h1 className="font-serif text-display-md text-foreground">{wishlist.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              by {owner.name ?? `@${username}`}
            </p>

            {wishlist.description && (
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{wishlist.description}</p>
            )}

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>{wishlist._count.items} items</span>
              {wishlist.eventDate && (
                <>
                  <span>·</span>
                  <span>{new Date(wishlist.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </>
              )}
            </div>

            <div className="mt-5">
              <ShareButtons url={shareUrl} title={wishlist.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <PublicItemGrid items={wishlist.items} />
      </div>

      {/* Footer branding */}
      <div className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{' '}
          <a href={appUrl} className="font-medium text-foreground hover:underline">
            WishlistCart
          </a>{' '}
          ·{' '}
          <a href={`${appUrl}/signup`} className="hover:underline">
            Create your own wishlist
          </a>
        </p>
      </div>
    </div>
  )
}
