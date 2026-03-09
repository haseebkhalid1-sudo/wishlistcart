'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  Tag,
  Gift,
  Bell,
  TrendingDown,
  Users,
  Star,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { markNotificationRead } from '@/lib/actions/notifications-list'
import type { NotificationItem as NotificationItemType } from '@/lib/actions/notifications-list'

const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; iconClass: string }
> = {
  price_drop: { icon: TrendingDown, iconClass: 'text-amber-600' },
  gift_claimed: { icon: Gift, iconClass: 'text-green-600' },
  reminder: { icon: Bell, iconClass: 'text-blue-600' },
  new_follower: { icon: Users, iconClass: 'text-purple-600' },
  referral_reward: { icon: Star, iconClass: 'text-yellow-600' },
  wishlist_shared: { icon: Tag, iconClass: 'text-indigo-600' },
}

function getConfig(type: string) {
  return TYPE_CONFIG[type] ?? { icon: Info, iconClass: 'text-muted-foreground' }
}

interface Props {
  notification: NotificationItemType
}

export function NotificationItem({ notification }: Props) {
  const [isPending, startTransition] = useTransition()
  const { icon: Icon, iconClass } = getConfig(notification.type)
  const isUnread = !notification.readAt
  const data = (notification.data ?? {}) as Record<string, unknown>
  const url = typeof data['url'] === 'string' ? data['url'] : null

  function handleRead() {
    if (!isUnread || isPending) return
    startTransition(async () => {
      await markNotificationRead(notification.id)
    })
  }

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-border p-4 transition-colors',
        isUnread
          ? 'bg-background hover:bg-subtle cursor-pointer'
          : 'bg-subtle opacity-75'
      )}
      onClick={url ? undefined : handleRead}
    >
      {/* Icon */}
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUnread ? 'bg-background shadow-xs' : 'bg-overlay'
        )}
      >
        <Icon className={cn('h-4 w-4', iconClass)} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm leading-snug',
              isUnread ? 'font-medium text-foreground' : 'font-normal text-muted-foreground'
            )}
          >
            {notification.title}
          </p>
          {isUnread && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground" />
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
          {notification.body}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  )

  if (url) {
    return (
      <Link href={url} onClick={handleRead} className="block">
        {content}
      </Link>
    )
  }

  return content
}
