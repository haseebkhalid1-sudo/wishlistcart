import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, ChevronRight, TrendingDown } from 'lucide-react'
import { getUserPriceAlerts } from '@/lib/actions/price-alerts'
import { getBillingStatus } from '@/lib/actions/billing'
import { PriceAlertForm } from '@/components/price/price-alert-form'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Price Alerts' }

const ALERT_LABELS = {
  ANY_DROP: 'Any drop',
  TARGET_PRICE: 'Target price',
  PERCENTAGE_DROP: 'Percentage drop',
}

export default async function PriceAlertsPage() {
  const [alerts, billing] = await Promise.all([getUserPriceAlerts(), getBillingStatus()])
  const isPro = billing?.plan === 'PRO'

  if (alerts.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="font-serif text-display-md text-foreground">Price Alerts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Get notified when prices drop.</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No active price alerts</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Open any item on your wishlists and tap "Set price alert" to start tracking.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">Price Alerts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tracking {alerts.length} item{alerts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const price = alert.item.price ? Number(alert.item.price) : null
          return (
            <div
              key={alert.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-subtle p-4"
            >
              {/* Image */}
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-bg-overlay">
                {alert.item.imageUrl ? (
                  <Image src={alert.item.imageUrl} alt={alert.item.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/dashboard/wishlists/${alert.item.wishlistId}`}
                  className="font-medium text-foreground hover:underline line-clamp-1"
                >
                  {alert.item.title}
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  {price && (
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(price, alert.item.currency ?? 'USD')}
                    </span>
                  )}
                  <Badge variant="outline" className="text-micro">
                    {ALERT_LABELS[alert.alertType as keyof typeof ALERT_LABELS]}
                    {alert.alertType === 'TARGET_PRICE' && alert.targetPrice
                      ? ` · $${Number(alert.targetPrice).toFixed(2)}`
                      : ''}
                    {alert.alertType === 'PERCENTAGE_DROP' && alert.percentageDrop
                      ? ` · ${Number(alert.percentageDrop)}%`
                      : ''}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <PriceAlertForm
                  itemId={alert.item.id}
                  currentPrice={price}
                  existingAlertId={alert.id}
                  isPro={isPro}
                />
                <Link
                  href={`/dashboard/wishlists/${alert.item.wishlistId}`}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
