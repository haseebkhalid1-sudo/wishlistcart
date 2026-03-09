import { Metadata } from 'next'
import { Bell } from 'lucide-react'
import { getNotifications } from '@/lib/actions/notifications-list'
import { NotificationItem } from './notification-item'
import { MarkAllReadButton } from './mark-all-read-button'

export const metadata: Metadata = {
  title: 'Notifications — WishlistCart',
}

export default async function NotificationsPage() {
  const notifications = await getNotifications()

  const unread = notifications.filter((n) => !n.readAt)
  const read = notifications.filter((n) => n.readAt)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-display-md text-foreground">Notifications</h1>
          {unread.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {unread.length} unread
            </p>
          )}
        </div>
        {unread.length > 0 && <MarkAllReadButton />}
      </div>

      {/* Empty state */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-subtle py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-overlay">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No notifications yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll let you know about price drops, gift claims, and more.
          </p>
        </div>
      )}

      {/* Unread section */}
      {unread.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New
          </h2>
          <div className="space-y-2">
            {unread.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        </section>
      )}

      {/* Read section */}
      {read.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Earlier
          </h2>
          <div className="space-y-2">
            {read.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
