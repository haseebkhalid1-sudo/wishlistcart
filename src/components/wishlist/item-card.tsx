'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { MoreHorizontal, Trash2, Pencil, ExternalLink } from 'lucide-react'
import type { WishlistItem } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteItem } from '@/lib/actions/items'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Must have',
}

interface ItemCardProps {
  item: WishlistItem
  view?: 'grid' | 'list'
}

export function ItemCard({ item, view = 'grid' }: ItemCardProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteItem(item.id)
      if (!result.success) {
        toast.error(result.error)
      } else {
        toast.success('Item removed')
      }
    })
  }

  const buyUrl = item.affiliateUrl ?? item.url

  if (view === 'list') {
    return (
      <div className={`flex items-center gap-4 rounded-lg border border-border bg-subtle p-4 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        {/* Thumbnail */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-bg-overlay">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-lg">🎁</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
          {item.storeName && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
              {item.storeName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {item.price != null && (
            <span className="font-semibold text-foreground">
              {formatPrice(Number(item.price), item.currency)}
            </span>
          )}
          {buyUrl && (
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Buy <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <ItemMenu onDelete={handleDelete} isPending={isPending} />
        </div>
      </div>
    )
  }

  return (
    <div className={`group relative flex flex-col rounded-xl border border-border bg-subtle overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised ${isPending ? 'opacity-50' : ''}`}>
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-bg-overlay">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🎁</div>
        )}

        {/* Actions overlay on hover */}
        <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 to-transparent">
          {buyUrl && (
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background transition-colors flex items-center gap-1.5"
            >
              Buy <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <div className="ml-auto">
            <ItemMenu onDelete={handleDelete} isPending={isPending} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        {item.storeName && (
          <p className="text-micro text-muted-foreground uppercase tracking-wide mb-1">
            {item.storeName}
          </p>
        )}
        <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">{item.title}</p>

        <div className="mt-2 flex items-center justify-between">
          {item.price != null ? (
            <span className="font-semibold text-foreground">
              {formatPrice(Number(item.price), item.currency)}
            </span>
          ) : (
            <span />
          )}
          {item.priority >= 4 && (
            <Badge variant="outline" className="text-micro">
              {PRIORITY_LABELS[item.priority]}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

function ItemMenu({
  onDelete,
  isPending,
}: {
  onDelete: () => void
  isPending: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-md bg-background/90 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Item options"
          disabled={isPending}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
