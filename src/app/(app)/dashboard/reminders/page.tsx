import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = { title: 'Reminders' }

export default function RemindersPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-subtle border border-border">
        <Calendar className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="font-serif text-2xl text-foreground">Occasion Reminders</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Never forget a birthday or anniversary. Set reminders and we'll alert you before the date.
      </p>
    </div>
  )
}
