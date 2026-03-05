import Link from 'next/link'
import { Heart, Lock, Globe, Share2 } from 'lucide-react'
import type { WishlistWithCount } from '@/lib/actions/wishlists'
import { CreateWishlistDialog } from './create-wishlist-dialog'

interface WishlistGridProps {
  wishlists: WishlistWithCount[]
}

export function WishlistGrid({ wishlists }: WishlistGridProps) {
  if (wishlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-20 text-center">
        <Heart className="mb-4 h-10 w-10 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold text-foreground">No wishlists yet</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Create your first wishlist to start saving products from any store.
        </p>
        <div className="mt-6">
          <CreateWishlistDialog />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {wishlists.map((wishlist) => (
        <WishlistCard key={wishlist.id} wishlist={wishlist} />
      ))}
    </div>
  )
}

function WishlistCard({ wishlist }: { wishlist: WishlistWithCount }) {
  const privacyIcon =
    wishlist.privacy === 'PRIVATE' ? (
      <Lock className="h-3 w-3" />
    ) : wishlist.privacy === 'PUBLIC' ? (
      <Globe className="h-3 w-3" />
    ) : (
      <Share2 className="h-3 w-3" />
    )

  const privacyLabel =
    wishlist.privacy === 'PRIVATE'
      ? 'Private'
      : wishlist.privacy === 'PUBLIC'
        ? 'Public'
        : 'Shared'

  return (
    <Link
      href={`/dashboard/wishlists/${wishlist.id}`}
      className="group flex flex-col rounded-xl border border-border bg-subtle p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised"
    >
      {/* Cover image placeholder */}
      <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-bg-overlay">
        {wishlist.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={wishlist.coverImage}
            alt={wishlist.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Heart className="h-8 w-8 text-muted-foreground/20" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-foreground line-clamp-1">{wishlist.name}</h3>

      {wishlist.description && (
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{wishlist.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-sm text-muted-foreground">
          {wishlist._count.items} {wishlist._count.items === 1 ? 'item' : 'items'}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {privacyIcon}
          {privacyLabel}
        </span>
      </div>
    </Link>
  )
}
