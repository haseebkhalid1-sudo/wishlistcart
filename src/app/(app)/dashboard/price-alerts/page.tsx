import type { Metadata } from 'next'
import { Bell } from 'lucide-react'

export const metadata: Metadata = { title: 'Price Alerts' }

export default function PriceAlertsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-subtle border border-border">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="font-serif text-2xl text-foreground">Price Alerts</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Get notified when items on your wishlist drop in price. Coming in the next update.
      </p>
    </div>
  )
}
