import type { Metadata } from 'next'
import Link from 'next/link'
import { Crown } from 'lucide-react'
import { getUserWishlists } from '@/lib/actions/wishlists'
import { getBillingStatus } from '@/lib/actions/billing'
import { WishlistGrid } from '@/components/wishlist/wishlist-grid'
import { CreateWishlistDialog } from '@/components/wishlist/create-wishlist-dialog'
import { FREE_WISHLIST_LIMIT } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'My Wishlists',
}

export default async function WishlistsPage() {
  const [wishlists, billing] = await Promise.all([getUserWishlists(), getBillingStatus()])
  const isPro = billing?.plan === 'PRO'
  const atLimit = !isPro && wishlists.length >= FREE_WISHLIST_LIMIT

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">My Wishlists</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wishlists.length} {wishlists.length === 1 ? 'wishlist' : 'wishlists'}
            {!isPro && ` · ${FREE_WISHLIST_LIMIT} max on free plan`}
          </p>
        </div>
        <CreateWishlistDialog disabled={atLimit} />
      </div>

      {/* Upgrade banner when at limit */}
      {atLimit && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-subtle px-5 py-4">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">You've reached the free plan limit</p>
              <p className="text-xs text-muted-foreground">Upgrade to Pro for unlimited wishlists.</p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 transition-opacity"
          >
            Upgrade
          </Link>
        </div>
      )}

      <WishlistGrid wishlists={wishlists} />
    </div>
  )
}
