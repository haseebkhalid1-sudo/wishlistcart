'use client'

import { useState, useEffect, useTransition } from 'react'
import Image from 'next/image'
import { ExternalLink, TrendingDown } from 'lucide-react'
import type { WishlistItem } from '@prisma/client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { PriceHistoryChart } from '@/components/price/price-history-chart'
import { PriceAlertForm } from '@/components/price/price-alert-form'
import { getItemPriceHistory, getUserPriceAlerts } from '@/lib/actions/price-alerts'
import { getBillingStatus } from '@/lib/actions/billing'
import { formatPrice } from '@/lib/utils'

interface ItemDetailSheetProps {
  item: WishlistItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

type PricePoint = { price: number | { toNumber: () => number }; checkedAt: Date | string }

export function ItemDetailSheet({ item, open, onOpenChange }: ItemDetailSheetProps) {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [existingAlertId, setExistingAlertId] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    startTransition(async () => {
      const [history, alerts, billing] = await Promise.all([
        getItemPriceHistory(item.id),
        getUserPriceAlerts(),
        getBillingStatus(),
      ])
      setPriceHistory(history)
      const active = alerts.find((a) => a.item.id === item.id)
      setExistingAlertId(active?.id ?? null)
      setIsPro(billing?.plan === 'PRO')
    })
  }, [open, item.id])

  const price = item.price != null ? Number(item.price) : null
  const buyUrl = item.url ? `/api/affiliate/redirect?id=${item.id}` : null

  // Sale detection: price is at least 5% below original (heuristic from price history)
  const lowestHistorical = priceHistory.length
    ? Math.min(...priceHistory.map((p) => Number(p.price)))
    : null
  const highestHistorical = priceHistory.length
    ? Math.max(...priceHistory.map((p) => Number(p.price)))
    : null
  const isSale =
    price != null && highestHistorical != null && price < highestHistorical * 0.95

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="font-serif text-xl text-foreground line-clamp-2 text-left">
            {item.title}
          </SheetTitle>
        </SheetHeader>

        {/* Image */}
        {item.imageUrl && (
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-subtle">
            <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-2" />
          </div>
        )}

        {/* Price + badges */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          {price != null && (
            <span className="text-2xl font-semibold text-foreground">
              {formatPrice(price, item.currency)}
            </span>
          )}
          {isSale && (
            <Badge className="bg-destructive/10 text-destructive border-0 text-xs">
              Price drop
            </Badge>
          )}
          {lowestHistorical != null && price === lowestHistorical && priceHistory.length > 1 && (
            <Badge className="bg-green-50 text-green-700 border-0 text-xs">
              Lowest ever
            </Badge>
          )}
          {highestHistorical != null && price === highestHistorical && priceHistory.length > 1 && (
            <Badge className="bg-subtle text-muted-foreground border border-border text-xs">
              Highest price
            </Badge>
          )}
        </div>

        {/* Store */}
        {item.storeName && (
          <p className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">
            {item.storeName}
          </p>
        )}

        {/* Buy button */}
        {buyUrl && (
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            Buy now <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}

        {/* Price history chart */}
        {item.url && (
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Price history</h3>
              {priceHistory.length >= 2 && (
                <span className="text-xs text-muted-foreground">
                  {priceHistory.length} data points
                </span>
              )}
            </div>
            {priceHistory.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-subtle text-xs text-muted-foreground">
                <TrendingDown className="mr-2 h-4 w-4" />
                No price history yet — check back after the first price check runs.
              </div>
            ) : (
              <PriceHistoryChart data={priceHistory} currency={item.currency} />
            )}
          </div>
        )}

        {/* Price alert */}
        {item.url && (
          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-sm font-medium text-foreground">Price alert</h3>
            <PriceAlertForm
              itemId={item.id}
              currentPrice={price}
              existingAlertId={existingAlertId}
              isPro={isPro}
            />
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="mt-4 border-t border-border pt-4">
            <h3 className="mb-1 text-sm font-medium text-foreground">Notes</h3>
            <p className="text-sm text-muted-foreground">{item.notes}</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
