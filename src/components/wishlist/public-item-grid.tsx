'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClaimDialog } from '@/components/wishlist/claim-dialog'
import { formatPrice } from '@/lib/utils'
import type { PublicWishlistItem } from '@/lib/queries/wishlist'

interface PublicItemGridProps {
  items: PublicWishlistItem[]
}

export function PublicItemGrid({ items }: PublicItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">No items in this wishlist yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <PublicItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function PublicItemCard({ item }: { item: PublicWishlistItem }) {
  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [claimed, setClaimed] = useState(item.isPurchased)

  const buyUrl = item.affiliateUrl ?? item.url
  const displayPrice = item.price != null ? formatPrice(Number(item.price), item.currency ?? 'USD') : null

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-card">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-bg-overlay">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}

          {claimed && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
                  <Check className="h-5 w-5 text-background" />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {item.isAnonymous ? 'Claimed' : 'Claimed'}
                </span>
              </div>
            </div>
          )}

          {item.priority === 1 && !claimed && (
            <Badge className="absolute left-2 top-2 text-[10px]" variant="default">
              Top pick
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
            {item.title}
          </p>

          {item.storeName && (
            <p className="text-[10px] text-muted-foreground">{item.storeName}</p>
          )}

          {displayPrice && (
            <p className="text-sm font-semibold text-foreground">{displayPrice}</p>
          )}

          <div className="mt-auto flex flex-col gap-1.5 pt-1">
            {!claimed ? (
              <>
                {buyUrl && (
                  <a
                    href={buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-subtle"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View item
                  </a>
                )}
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setClaimDialogOpen(true)}
                >
                  I'll get this
                </Button>
              </>
            ) : (
              buyUrl && (
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-subtle"
                >
                  <ExternalLink className="h-3 w-3" />
                  View item
                </a>
              )
            )}
          </div>
        </div>
      </div>

      <ClaimDialog
        itemId={item.id}
        itemTitle={item.title}
        open={claimDialogOpen}
        onOpenChange={setClaimDialogOpen}
        onClaimed={() => setClaimed(true)}
      />
    </>
  )
}
