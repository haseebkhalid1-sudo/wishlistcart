'use client'

import type { WishlistItem } from '@prisma/client'
import { ItemCard } from './item-card'
import { AddItemDialog } from './add-item-dialog'
import { Package } from 'lucide-react'

interface ItemGridProps {
  wishlistId: string
  items: WishlistItem[]
  view: 'grid' | 'list'
}

export function ItemGrid({ wishlistId, items, view }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-16 text-center">
        <Package className="mb-4 h-10 w-10 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold text-foreground">No items yet</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Add items manually or paste a product URL to get started.
        </p>
        <div className="mt-6">
          <AddItemDialog wishlistId={wishlistId} />
        </div>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} view="list" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} view="grid" />
      ))}
    </div>
  )
}
