import Link from 'next/link'
import { Gift, Lock, Globe, Share2 } from 'lucide-react'
import type { RegistryWithCount } from '@/lib/actions/registries'
import { RegistryTypeIcon, getEventTypeLabel } from './registry-type-icon'
import { CreateRegistryDialog } from './create-registry-dialog'

export function RegistryGrid({ registries }: { registries: RegistryWithCount[] }) {
  if (registries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-20 text-center">
        <Gift className="mb-4 h-10 w-10 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold text-foreground">No registries yet</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Create your first registry to coordinate gifts for your special occasion.
        </p>
        <div className="mt-6">
          <CreateRegistryDialog />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {registries.map((registry) => (
        <RegistryCard key={registry.id} registry={registry} />
      ))}
    </div>
  )
}

function RegistryCard({ registry }: { registry: RegistryWithCount }) {
  const privacyIcon =
    registry.privacy === 'PRIVATE' ? (
      <Lock className="h-3 w-3" />
    ) : registry.privacy === 'PUBLIC' ? (
      <Globe className="h-3 w-3" />
    ) : (
      <Share2 className="h-3 w-3" />
    )

  const privacyLabel =
    registry.privacy === 'PRIVATE'
      ? 'Private'
      : registry.privacy === 'PUBLIC'
        ? 'Public'
        : 'Shared'

  const eventDate = registry.eventDate ? new Date(registry.eventDate) : null

  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const daysUntil = eventDate
    ? Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const itemCount = registry._count.items

  return (
    <Link
      href={`/dashboard/registries/${registry.id}`}
      className="group flex flex-col rounded-xl border border-border bg-subtle p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised"
    >
      {/* Icon + event type badge row */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background">
          {registry.eventType ? (
            <RegistryTypeIcon
              eventType={registry.eventType}
              className="h-5 w-5 text-muted-foreground"
            />
          ) : (
            <Gift className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>
        {registry.eventType && (
          <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
            {getEventTypeLabel(registry.eventType)}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-serif font-semibold text-foreground line-clamp-1">{registry.name}</h3>

      {/* Event date + countdown */}
      {formattedDate && (
        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
          {daysUntil !== null && daysUntil > 0 && (
            <span className="text-xs text-muted-foreground/70">in {daysUntil} days</span>
          )}
        </div>
      )}

      {/* Location */}
      {registry.eventLocation && (
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{registry.eventLocation}</p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {privacyIcon}
          {privacyLabel}
        </span>
      </div>
    </Link>
  )
}
