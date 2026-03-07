'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteReminder } from '@/lib/actions/reminders'
import type { ReminderRow } from '@/lib/actions/reminders'

interface ReminderListProps {
  reminders: ReminderRow[]
}

function daysUntilNext(date: Date, isRecurring: boolean): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(date)
  if (isRecurring) {
    target.setFullYear(now.getFullYear())
    if (target < now) target.setFullYear(now.getFullYear() + 1)
  }
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function occasionIcon(occasionType: string): string {
  if (occasionType === 'birthday') return '🎂'
  if (occasionType === 'anniversary') return '💍'
  return '📅'
}

function occasionLabel(occasionType: string): string {
  if (occasionType === 'birthday') return 'Birthday'
  if (occasionType === 'anniversary') return 'Anniversary'
  return occasionType.charAt(0).toUpperCase() + occasionType.slice(1)
}

function CountdownBadge({ days }: { days: number }) {
  let className =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium '
  if (days <= 7) {
    className += 'bg-green-100 text-green-800'
  } else if (days <= 30) {
    className += 'bg-amber-100 text-amber-800'
  } else {
    className += 'bg-gray-100 text-gray-600'
  }

  const label = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `in ${days} days`

  return <span className={className}>{label}</span>
}

function ReminderRow({ reminder }: { reminder: ReminderRow }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const days = daysUntilNext(new Date(reminder.date), reminder.isRecurring)
  const formattedDate = new Date(reminder.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteReminder(reminder.id)
      if (result.success) {
        toast.success('Reminder deleted')
        router.refresh()
      } else {
        toast.error(result.error)
        setConfirmDelete(false)
      }
    })
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
      {/* Left: icon + info */}
      <div className="text-2xl leading-none select-none" aria-hidden>
        {occasionIcon(reminder.occasionType)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium text-foreground truncate">{reminder.personName}</span>
          <span className="text-xs text-muted-foreground">
            {occasionLabel(reminder.occasionType)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {formattedDate}
          {reminder.isRecurring && (
            <span className="text-muted-foreground/60"> · every year</span>
          )}
        </p>
      </div>

      {/* Middle: countdown */}
      <div className="shrink-0">
        <CountdownBadge days={days} />
      </div>

      {/* Right: delete */}
      <div className="shrink-0 flex items-center gap-1">
        {confirmDelete ? (
          <>
            <span className="text-xs text-muted-foreground mr-1">Sure?</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmDelete(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete reminder"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function ReminderList({ reminders }: ReminderListProps) {
  const sorted = [...reminders].sort((a, b) => {
    const da = daysUntilNext(new Date(a.date), a.isRecurring)
    const db = daysUntilNext(new Date(b.date), b.isRecurring)
    return da - db
  })

  return (
    <div className="space-y-2">
      {sorted.map((reminder) => (
        <ReminderRow key={reminder.id} reminder={reminder} />
      ))}
    </div>
  )
}
