import type { Metadata } from 'next'
import { getUserWishlists } from '@/lib/actions/wishlists'
import { WishlistGrid } from '@/components/wishlist/wishlist-grid'
import { CreateWishlistDialog } from '@/components/wishlist/create-wishlist-dialog'

export const metadata: Metadata = {
  title: 'My Wishlists',
}

export default async function WishlistsPage() {
  const wishlists = await getUserWishlists()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">My Wishlists</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wishlists.length} {wishlists.length === 1 ? 'wishlist' : 'wishlists'}
          </p>
        </div>
        <CreateWishlistDialog />
      </div>

      <WishlistGrid wishlists={wishlists} />
    </div>
  )
}
