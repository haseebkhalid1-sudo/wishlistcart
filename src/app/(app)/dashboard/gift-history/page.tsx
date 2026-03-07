import type { Metadata } from 'next'
import { Gift } from 'lucide-react'
import { getGiftHistory } from '@/lib/actions/gift-history'
import type { GiftHistoryItem } from '@/lib/actions/gift-history'

export const metadata: Metadata = { title: 'Gift History' }

function groupByMonth(
  items: GiftHistoryItem[],
): { label: string; items: GiftHistoryItem[] }[] {
  const map = new Map<string, GiftHistoryItem[]>()
  for (const item of items) {
    const label = item.purchasedAt
      ? new Date(item.purchasedAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : 'Unknown date'
    const group = map.get(label) ?? []
    group.push(item)
    map.set(label, group)
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

export default async function GiftHistoryPage() {
  const gifts = await getGiftHistory()

  const totalValue = gifts.reduce(
    (sum, item) => sum + (item.price != null ? Number(item.price) : 0),
    0,
  )

  const groups = groupByMonth(gifts)

  if (gifts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-display-md text-foreground">Gift History</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Items you&apos;ve gifted to others.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Gift className="mb-4 h-10 w-10 text-muted-foreground/30" />
          <h2 className="text-lg font-semibold text-foreground">No gifts yet</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            When you claim items on someone&apos;s wishlist or registry, they&apos;ll appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">Gift History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Items you&apos;ve gifted to others.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-6 flex items-center gap-6 rounded-lg border border-border bg-subtle px-4 py-3 text-sm">
        <span className="text-foreground font-medium">
          {gifts.length} gift{gifts.length !== 1 ? 's' : ''} given
        </span>
        {totalValue > 0 && (
          <>
            <span className="text-border">·</span>
            <span className="text-muted-foreground">
              Total value:{' '}
              <span className="font-medium text-foreground">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalValue)}
              </span>
            </span>
          </>
        )}
      </div>

      {/* Grouped list */}
      <div className="space-y-8">
        {groups.map(({ label, items }) => (
          <section key={label}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-subtle px-4 py-3"
                >
                  {/* Thumbnail */}
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-bg-overlay flex items-center justify-center">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Gift className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From{' '}
                      {item.wishlist.user.name ??
                        item.wishlist.user.username ??
                        'someone'}
                      &apos;s wishlist — {item.wishlist.name}
                    </p>
                    {item.purchasedAt && (
                      <p className="text-xs text-muted-foreground">
                        Gifted{' '}
                        {new Date(item.purchasedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Price + store */}
                  <div className="shrink-0 text-right">
                    {item.price != null && (
                      <p className="text-sm font-medium text-foreground">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: item.currency,
                        }).format(Number(item.price))}
                      </p>
                    )}
                    {item.storeName && (
                      <p className="text-xs text-muted-foreground">{item.storeName}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
