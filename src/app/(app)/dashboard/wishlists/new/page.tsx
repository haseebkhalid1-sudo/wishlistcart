import type { Metadata } from 'next'
import { CreateWishlistForm } from '@/components/wishlist/create-wishlist-form'

export const metadata: Metadata = {
  title: 'Create Wishlist',
}

export default function NewWishlistPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-serif text-display-md text-foreground">Create a wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Save products from any store, share with friends and family.
      </p>
      <div className="mt-6">
        <CreateWishlistForm />
      </div>
    </div>
  )
}
