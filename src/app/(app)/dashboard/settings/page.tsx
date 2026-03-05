import type { Metadata } from 'next'
import { Settings } from 'lucide-react'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-subtle border border-border">
        <Settings className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="font-serif text-2xl text-foreground">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Profile, notifications, billing and account settings. Coming soon.
      </p>
    </div>
  )
}
