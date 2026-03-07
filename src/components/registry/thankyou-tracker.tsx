'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

// ---- Types ----

interface ThankYouItem {
  id: string
  title: string
  imageUrl: string | null
  storeName: string | null
  price: number | null // already converted from Decimal to number before passing
  purchasedAt: Date | string | null
}

interface ThankYouTrackerProps {
  items: ThankYouItem[] // only purchased items, passed from server component
  registryId: string
}

// ---- Helpers ----

function formatPrice(price: number | null): string | null {
  if (price == null) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

function formatDate(purchasedAt: Date | string | null): string {
  if (!purchasedAt) return ''
  return new Date(purchasedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

const STORAGE_KEY = (registryId: string) => `thankyou-${registryId}`

// ---- Component ----

export function ThankYouTracker({ items, registryId }: ThankYouTrackerProps) {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY(registryId))
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        setSentIds(new Set(parsed))
      }
    } catch {
      // localStorage unavailable or invalid JSON — start fresh
    }
    setMounted(true)
  }, [registryId])

  function toggle(itemId: string, checked: boolean) {
    setSentIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(itemId)
      } else {
        next.delete(itemId)
      }
      try {
        localStorage.setItem(STORAGE_KEY(registryId), JSON.stringify([...next]))
      } catch {
        // ignore write errors
      }
      return next
    })
  }

  if (items.length === 0) return null

  const allSent = mounted && items.every((item) => sentIds.has(item.id))

  return (
    <section className="mt-8">
      <div className="mb-3">
        <h2 className="font-semibold text-sm text-foreground">Thank-you checklist</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Track which guests you&apos;ve thanked for their gifts.
        </p>
      </div>

      {allSent && (
        <div className="flex items-center gap-2 text-sm text-foreground mb-4 p-3 border border-border rounded-lg bg-muted/30">
          <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <span className="font-medium">All thank-yous sent!</span>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const isSent = mounted && sentIds.has(item.id)
          return (
            <li
              key={item.id}
              className={`flex items-center gap-3 border border-border rounded-lg p-3 transition-colors ${
                isSent ? 'bg-muted/20' : 'bg-background'
              }`}
            >
              {/* Checkbox */}
              <label className="flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isSent}
                  onChange={(e) => toggle(item.id, e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                  aria-label={`Mark thank-you sent for ${item.title}`}
                />
              </label>

              {/* Thumbnail */}
              {item.imageUrl && (
                <div className="w-10 h-10 rounded-md overflow-hidden border border-border shrink-0 bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Item details */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-tight truncate ${
                    isSent ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.storeName && (
                    <span className="text-xs text-muted-foreground">{item.storeName}</span>
                  )}
                  {item.storeName && (item.price != null || item.purchasedAt) && (
                    <span className="text-xs text-muted-foreground/40">·</span>
                  )}
                  {formatPrice(item.price) && (
                    <span className="text-xs text-muted-foreground">
                      {formatPrice(item.price)}
                    </span>
                  )}
                  {item.purchasedAt && (
                    <>
                      {(item.storeName || item.price != null) && (
                        <span className="text-xs text-muted-foreground/40">·</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.purchasedAt)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Sent badge */}
              {isSent && (
                <span className="shrink-0 text-xs text-muted-foreground font-medium">
                  Sent
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
