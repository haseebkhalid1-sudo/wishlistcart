'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, Gift, ShoppingCart, ExternalLink, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClaimDialog } from '@/components/wishlist/claim-dialog'
import { ShareButtons } from '@/components/shared/share-buttons'
import { RsvpForm } from '@/components/registry/rsvp-form'
import { CashFundCard } from '@/components/registry/cash-fund-card'
import { formatPrice } from '@/lib/utils'
import type { PublicRegistry, PublicRegistryItem } from '@/lib/queries/registry'
import type { EventType } from '@prisma/client'

// ---- Event type label helper ----

function getEventTypeLabel(eventType: EventType | null | undefined): string {
  switch (eventType) {
    case 'WEDDING':        return 'Wedding Registry'
    case 'BABY_SHOWER':    return 'Baby Shower Registry'
    case 'BIRTHDAY':       return 'Birthday Wishlist'
    case 'HOLIDAY':        return 'Holiday Registry'
    case 'HOUSEWARMING':   return 'Housewarming Registry'
    case 'GRADUATION':     return 'Graduation Registry'
    case 'ANNIVERSARY':    return 'Anniversary Registry'
    case 'BACK_TO_SCHOOL': return 'Back to School List'
    case 'CUSTOM':
    default:               return 'Gift Registry'
  }
}

// ---- Grouping helper ----

function groupItemsByCategory(
  items: PublicRegistryItem[]
): { category: string; items: PublicRegistryItem[] }[] {
  const map = new Map<string, PublicRegistryItem[]>()

  for (const item of items) {
    const key = item.category?.trim() || 'General'
    const group = map.get(key) ?? []
    group.push(item)
    map.set(key, group)
  }

  // Sort: non-General categories alphabetically, General always last
  const entries = Array.from(map.entries())
  entries.sort(([a], [b]) => {
    if (a === 'General') return 1
    if (b === 'General') return -1
    return a.localeCompare(b)
  })

  return entries.map(([category, items]) => ({ category, items }))
}

// ---- Props ----

interface PublicRegistryViewProps {
  registry: PublicRegistry
  shareToken: string
}

// ---- Main component ----

export function PublicRegistryView({ registry, shareToken }: PublicRegistryViewProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'
  const shareUrl = `${appUrl}/registry/${shareToken}`

  const owner = registry.user
  const ownerName = owner.name ?? (owner.username ? `@${owner.username}` : 'Someone')
  const initials = ownerName.replace('@', '')[0]?.toUpperCase() ?? '?'

  const eventTypeLabel = getEventTypeLabel(registry.eventType)

  const totalItems = registry.items.length
  const purchasedCount = registry.items.filter((i) => i.isPurchased).length
  const remainingCount = totalItems - purchasedCount
  const progressPct = totalItems > 0 ? Math.round((purchasedCount / totalItems) * 100) : 0
  const showProgress = totalItems > 0 && purchasedCount > 0

  const groups = groupItemsByCategory(registry.items)

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Hero header ---- */}
      <div className="border-b border-border bg-subtle">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
          <div className="flex flex-col items-center text-center">
            {/* Owner avatar */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-overlay shadow-card">
              {owner.avatarUrl ? (
                <Image
                  src={owner.avatarUrl}
                  alt={ownerName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-medium text-muted-foreground">{initials}</span>
              )}
            </div>

            {/* Event type label */}
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {eventTypeLabel}
            </p>

            {/* Registry name */}
            <h1 className="font-serif text-display-md text-foreground">{registry.name}</h1>

            {/* Owner name */}
            <p className="mt-2 text-sm text-muted-foreground">by {ownerName}</p>

            {/* Description */}
            {registry.description && (
              <p className="mt-3 max-w-md text-sm text-muted-foreground">{registry.description}</p>
            )}

            {/* Event details */}
            {(registry.eventDate || registry.eventLocation || totalItems > 0) && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {registry.eventDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {new Date(registry.eventDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
                {registry.eventLocation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {registry.eventLocation}
                  </span>
                )}
                {totalItems > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Gift className="h-3.5 w-3.5 shrink-0" />
                    {remainingCount} of {totalItems} items still available
                  </span>
                )}
              </div>
            )}

            {/* Share buttons */}
            <div className="mt-6">
              <ShareButtons url={shareUrl} title={registry.name} />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="border-t border-border">
            <div className="mx-auto max-w-4xl px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-foreground transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="shrink-0 text-[11px] text-muted-foreground">
                  {purchasedCount} of {totalItems} items gifted
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---- Items section ---- */}
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Gift className="mb-4 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Registry is being set up — check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map(({ category, items }) => (
              <section key={category}>
                <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {category}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
                  {items.map((item) => (
                    <RegistryItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* ---- Cash fund section ---- */}
      {registry.cashFund && registry.cashFund.isActive && (
        <div className="mx-auto max-w-4xl px-4 pb-8 md:px-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Cash Fund
          </h2>
          <CashFundCard fund={registry.cashFund} showContributeButton={true} />
        </div>
      )}

      {/* ---- RSVP section ---- */}
      <div className="mx-auto max-w-md px-4 pb-10 md:px-6">
        <RsvpForm shareToken={shareToken} registryName={registry.name} />
      </div>

      {/* ---- Footer branding ---- */}
      <div className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{' '}
          <a href={appUrl} className="font-medium text-foreground hover:underline">
            WishlistCart
          </a>{' '}
          ·{' '}
          <a href={`${appUrl}/signup`} className="hover:underline">
            Create your own registry
          </a>
        </p>
      </div>
    </div>
  )
}

// ---- Item card ----

function RegistryItemCard({ item }: { item: PublicRegistryItem }) {
  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [claimed, setClaimed] = useState(item.isPurchased)

  const affiliateUrl = `/api/affiliate/redirect?id=${item.id}`
  const displayPrice =
    item.price != null ? formatPrice(Number(item.price), item.currency ?? 'USD') : null

  return (
    <>
      <div
        className={[
          'group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow',
          claimed ? 'opacity-60' : 'hover:shadow-card',
        ].join(' ')}
      >
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-bg-overlay">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}

          {/* Claimed overlay */}
          {claimed && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
                  <Check className="h-5 w-5 text-background" />
                </div>
                <span className="text-xs font-medium text-foreground">Gifted</span>
              </div>
            </div>
          )}

          {/* Priority badge */}
          {item.priority === 1 && !claimed && (
            <Badge
              className="absolute left-2 top-2 text-[10px]"
              variant="default"
            >
              Most wanted
            </Badge>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
            {item.title}
          </p>

          {item.storeName && (
            <p className="text-[10px] text-muted-foreground">{item.storeName}</p>
          )}

          {displayPrice && (
            <p className="text-sm font-semibold text-foreground">{displayPrice}</p>
          )}

          <div className="mt-auto flex flex-col gap-1.5 pt-1">
            {!claimed ? (
              <>
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setClaimDialogOpen(true)}
                >
                  Gift this
                </Button>
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  View item
                </a>
              </>
            ) : (
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-3 w-3" />
                View item
              </a>
            )}
          </div>
        </div>
      </div>

      <ClaimDialog
        itemId={item.id}
        itemTitle={item.title}
        open={claimDialogOpen}
        onOpenChange={setClaimDialogOpen}
        onClaimed={() => setClaimed(true)}
      />
    </>
  )
}
