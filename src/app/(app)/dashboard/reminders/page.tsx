import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'
import { getUserReminders } from '@/lib/actions/reminders'
import { AddReminderDialog } from '@/components/reminders/add-reminder-dialog'
import { ReminderList } from '@/components/reminders/reminder-list'

export const metadata: Metadata = { title: 'Occasion Reminders' }

export default async function RemindersPage() {
  const reminders = await getUserReminders()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-foreground">Occasion Reminders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Never forget a birthday or anniversary.
          </p>
        </div>
        <AddReminderDialog />
      </div>

      <div className="mt-8">
        {reminders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-subtle">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="font-medium text-foreground">No reminders yet</h2>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Add a reminder and we'll alert you before the date so you have time to find
              the perfect gift.
            </p>
            <div className="mt-6">
              <AddReminderDialog />
            </div>
          </div>
        ) : (
          <ReminderList reminders={reminders} />
        )}
      </div>
    </div>
  )
}
