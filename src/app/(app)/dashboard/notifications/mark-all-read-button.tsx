'use client'

import { useTransition } from 'react'
import { CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { markAllNotificationsRead } from '@/lib/actions/notifications-list'

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const result = await markAllNotificationsRead()
      if (result.success) {
        toast.success('All notifications marked as read')
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      <CheckCheck className="h-4 w-4 mr-1.5" />
      Mark all read
    </Button>
  )
}
