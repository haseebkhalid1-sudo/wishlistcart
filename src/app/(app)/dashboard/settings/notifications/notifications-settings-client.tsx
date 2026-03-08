'use client'

import { useState, useTransition } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateNotificationPreferences } from '@/lib/actions/notifications'
import type { NotificationPreferences } from '@/lib/actions/notifications'
import { PushOptIn, PushOptOut } from '@/components/notifications/push-opt-in'
import { toast } from 'sonner'

interface Props {
  initialPrefs: NotificationPreferences
}

interface PrefToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}

function PrefToggle({ label, description, checked, onChange }: PrefToggleProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {/* Minimal toggle — no external library needed */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
          checked ? 'bg-foreground' : 'bg-border'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}

export function NotificationsSettingsClient({ initialPrefs }: Props) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(initialPrefs)
  const [isPending, startTransition] = useTransition()

  function set<K extends keyof NotificationPreferences>(key: K, value: boolean) {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateNotificationPreferences(prefs)
      if (result.success) {
        toast.success('Notification preferences saved.')
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-display-md text-foreground">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how and when WishlistCart contacts you.
        </p>
      </div>

      {/* Push opt-in banner */}
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-3">
          <Bell className="h-4 w-4 text-foreground" />
          <h2 className="font-medium text-foreground text-sm">Browser push notifications</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Get instant alerts even when WishlistCart isn&apos;t open in your browser.
        </p>
        <div className="flex items-center gap-3">
          <PushOptIn />
          <PushOptOut />
        </div>
      </div>

      {/* Email preferences */}
      <div className="rounded-xl border border-border px-5 divide-y divide-border">
        <h2 className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Email
        </h2>
        <PrefToggle
          label="Price drops"
          description="Email me when a tracked item drops in price."
          checked={prefs.emailPriceDrops}
          onChange={(v) => set('emailPriceDrops', v)}
        />
        <PrefToggle
          label="Gift claimed"
          description="Email me when someone claims an item on my wishlist."
          checked={prefs.emailGiftClaimed}
          onChange={(v) => set('emailGiftClaimed', v)}
        />
        <PrefToggle
          label="New follower"
          description="Email me when someone follows me."
          checked={prefs.emailNewFollower}
          onChange={(v) => set('emailNewFollower', v)}
        />
        <PrefToggle
          label="Weekly digest"
          description="Weekly summary of price movements and activity."
          checked={prefs.emailWeeklyDigest}
          onChange={(v) => set('emailWeeklyDigest', v)}
        />
      </div>

      {/* Push preferences */}
      <div className="rounded-xl border border-border px-5 divide-y divide-border">
        <h2 className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Push
        </h2>
        <PrefToggle
          label="Price drops"
          description="Push notification when a tracked item drops in price."
          checked={prefs.pushPriceDrops}
          onChange={(v) => set('pushPriceDrops', v)}
        />
        <PrefToggle
          label="Gift claimed"
          description="Push notification when someone claims an item on your wishlist."
          checked={prefs.pushGiftClaimed}
          onChange={(v) => set('pushGiftClaimed', v)}
        />
        <PrefToggle
          label="New follower"
          description="Push notification when someone follows you."
          checked={prefs.pushNewFollower}
          onChange={(v) => set('pushNewFollower', v)}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving…' : 'Save preferences'}
        </Button>
      </div>
    </div>
  )
}
