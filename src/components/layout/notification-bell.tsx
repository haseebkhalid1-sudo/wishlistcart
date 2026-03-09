import Link from 'next/link'
import { Bell } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'

interface NotificationBellProps {
  userId: string
}

export async function NotificationBell({ userId }: NotificationBellProps) {
  const unreadCount = await prisma.notification
    .count({
      where: { userId, readAt: null },
    })
    .catch(() => 0)

  return (
    <Link
      href="/dashboard/notifications"
      className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
