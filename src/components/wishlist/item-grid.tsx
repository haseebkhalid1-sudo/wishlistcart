'use client'

import { useState, useCallback, useTransition } from 'react'
import type { WishlistItem } from '@prisma/client'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { ItemCard, SortableItemCard } from './item-card'
import { AddItemDialog } from './add-item-dialog'
import { Package } from 'lucide-react'
import { reorderItems } from '@/lib/actions/items'
import { toast } from 'sonner'

interface ItemGridProps {
  wishlistId: string
  items: WishlistItem[]
  view: 'grid' | 'list'
}

export function ItemGrid({ wishlistId, items, view }: ItemGridProps) {
  const [orderedItems, setOrderedItems] = useState(items)
  const [isPending, startTransition] = useTransition()

  // Sync if items prop changes (e.g. after add/delete)
  const [prevItems, setPrevItems] = useState(items)
  if (items !== prevItems) {
    setPrevItems(items)
    setOrderedItems(items)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      setOrderedItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id)
        const newIndex = prev.findIndex((i) => i.id === over.id)
        const reordered = arrayMove(prev, oldIndex, newIndex)

        // Persist in background
        startTransition(async () => {
          const result = await reorderItems(
            wishlistId,
            reordered.map((i) => i.id)
          )
          if (!result.success) {
            toast.error('Failed to save order')
            // Revert on failure
            setOrderedItems(prev)
          }
        })

        return reordered
      })
    },
    [wishlistId]
  )

  if (orderedItems.length === 0) {
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
        {orderedItems.map((item) => (
          <ItemCard key={item.id} item={item} view="list" />
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedItems.map((i) => i.id)}
        strategy={rectSortingStrategy}
      >
        <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${isPending ? 'opacity-75' : ''}`}>
          {orderedItems.map((item) => (
            <SortableItemCard key={item.id} item={item} view="grid" />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
