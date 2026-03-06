'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Settings, LayoutGrid, List } from 'lucide-react'
import type { WishlistWithItems } from '@/lib/actions/wishlists'
import { Button } from '@/components/ui/button'
import { ItemGrid } from '@/components/wishlist/item-grid'
import { AddItemDialog } from '@/components/wishlist/add-item-dialog'

interface Props {
  wishlist: WishlistWithItems
}

export function WishlistDetailClient({ wishlist }: Props) {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/wishlists" className="hover:text-foreground transition-colors">
              Wishlists
            </Link>
            <span>/</span>
            <span className="text-foreground">{wishlist.name}</span>
          </div>
          <h1 className="mt-1 font-serif text-display-md text-foreground">{wishlist.name}</h1>
          {wishlist.description && (
            <p className="mt-1 text-sm text-muted-foreground">{wishlist.description}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {wishlist._count.items} {wishlist._count.items === 1 ? 'item' : 'items'} ·{' '}
            {wishlist.privacy.charAt(0) + wishlist.privacy.slice(1).toLowerCase()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-md border border-border">
            <button
              onClick={() => setView('grid')}
              className={`rounded-l-md p-2 transition-colors ${
                view === 'grid'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-r-md p-2 transition-colors ${
                view === 'list'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/wishlists/${wishlist.id}/settings`}>
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </Button>

          <AddItemDialog wishlistId={wishlist.id} />
        </div>
      </div>

      {/* Items */}
      <ItemGrid wishlistId={wishlist.id} items={wishlist.items} view={view} />
    </div>
  )
}
