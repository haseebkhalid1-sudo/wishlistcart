import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Share2,
  ExternalLink,
  CheckCircle2,
  Gift,
} from 'lucide-react'
import type { Prisma } from '@prisma/client'
import { getRegistryById } from '@/lib/actions/registries'
import { Button } from '@/components/ui/button'
import { CopyInput } from './copy-input'

// ─── Types ────────────────────────────────────────────────────────────────────

type RegistryWithItems = Prisma.WishlistGetPayload<{
  include: {
    items: { orderBy: [{ category: 'asc' }, { position: 'asc' }] }
    _count: { select: { items: true } }
    cashFund: true
  }
}>

type RegistryItem = RegistryWithItems['items'][number]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EVENT_TYPE_LABELS: Record<string, string> = {
  WEDDING: 'Wedding',
  BABY_SHOWER: 'Baby Shower',
  BIRTHDAY: 'Birthday',
  GRADUATION: 'Graduation',
  HOUSEWARMING: 'Housewarming',
  ANNIVERSARY: 'Anniversary',
  HOLIDAY: 'Holiday',
  BACK_TO_SCHOOL: 'Back to School',
  CUSTOM: 'Custom Event',
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getDaysUntil(date: Date): { label: string; passed: boolean } {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return { label: 'event passed', passed: true }
  if (diff === 0) return { label: 'today', passed: false }
  if (diff === 1) return { label: 'tomorrow', passed: false }
  return { label: `in ${diff} days`, passed: false }
}

function groupItemsByCategory(items: RegistryItem[]): Map<string, RegistryItem[]> {
  const map = new Map<string, RegistryItem[]>()
  for (const item of items) {
    const key = item.category?.trim() || 'General'
    const existing = map.get(key)
    if (existing) {
      existing.push(item)
    } else {
      map.set(key, [item])
    }
  }
  return map
}

function formatPrice(price: Prisma.Decimal | null | undefined): string | null {
  if (price == null) return null
  const n = Number(price)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

// ─── Item row ─────────────────────────────────────────────────────────────────

function RegistryItemRow({ item }: { item: RegistryItem }) {
  const price = formatPrice(item.price)

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-subtle px-4 py-3">
      {/* Thumbnail */}
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-bg-overlay">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gift className="h-4 w-4 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
        {item.storeName && (
          <p className="truncate text-xs text-muted-foreground">{item.storeName}</p>
        )}
      </div>

      {/* Right: price + status */}
      <div className="flex flex-shrink-0 items-center gap-3">
        {price && (
          <span className="text-sm font-medium text-foreground">{price}</span>
        )}
        {item.isPurchased ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/8 px-2 py-0.5 text-xs font-medium text-foreground">
            <CheckCircle2 className="h-3 w-3" />
            Purchased
          </span>
        ) : (
          item.url && (
            <a
              href={`/api/affiliate/redirect?id=${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              Buy
            </a>
          )
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const registry = await getRegistryById(id)
  return {
    title: registry ? `${registry.name} — Registry` : 'Registry',
  }
}

export default async function RegistryDashboardPage({ params }: Props) {
  const { id } = await params
  const registry = await getRegistryById(id)

  if (!registry) notFound()

  const items = registry.items
  const totalItems = items.length
  const purchasedItems = items.filter((i) => i.isPurchased).length
  const remainingItems = totalItems - purchasedItems
  const grouped = groupItemsByCategory(items)

  const shareUrl = registry.shareToken
    ? `${APP_URL}/registry/${registry.shareToken}`
    : null

  const eventTypeLabel = registry.eventType
    ? (EVENT_TYPE_LABELS[registry.eventType] ?? registry.eventType)
    : null

  const daysUntil = registry.eventDate ? getDaysUntil(new Date(registry.eventDate)) : null

  return (
    <div>
      {/* ── Header banner ── */}
      <div className="mb-8 rounded-xl border border-border bg-subtle px-6 py-6">
        <Link
          href="/dashboard/registries"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Registries
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: name + meta */}
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-display-md text-foreground leading-tight">
              {registry.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              {eventTypeLabel && (
                <span className="text-sm text-muted-foreground">{eventTypeLabel}</span>
              )}
              {registry.eventDate && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatEventDate(new Date(registry.eventDate))}
                </span>
              )}
              {registry.eventLocation && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {registry.eventLocation}
                </span>
              )}
              {daysUntil && (
                <span
                  className={`text-sm font-medium ${
                    daysUntil.passed ? 'text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {daysUntil.label}
                </span>
              )}
            </div>

            {registry.description && (
              <p className="mt-2 text-sm text-muted-foreground">{registry.description}</p>
            )}
          </div>

          {/* Right: action buttons */}
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
            {shareUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Share2 className="h-4 w-4" />
                  Share Registry
                </a>
              </Button>
            )}
            <Button size="sm" asChild>
              <Link href={`/dashboard/wishlists/${registry.id}`}>+ Add Items</Link>
            </Button>
          </div>
        </div>

        {/* Share URL copy input */}
        {shareUrl && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Share link
            </p>
            <CopyInput value={shareUrl} />
          </div>
        )}
      </div>

      {/* ── Stats row ── */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {(
          [
            { label: 'Total items', value: totalItems },
            { label: 'Purchased', value: purchasedItems },
            { label: 'Remaining', value: remainingItems },
          ] as const
        ).map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-5 text-center"
          >
            <span className="text-2xl font-semibold text-foreground">{value}</span>
            <span className="mt-0.5 text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Items grouped by category ── */}
      {totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-20 text-center">
          <Gift className="mb-4 h-10 w-10 text-muted-foreground/30" />
          <h2 className="text-lg font-semibold text-foreground">No items yet</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Add your first item to this registry.
          </p>
          <Button size="sm" className="mt-6" asChild>
            <Link href={`/dashboard/wishlists/${registry.id}`}>Add items</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([category, categoryItems]) => (
            <section key={category}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {category}
              </h2>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <RegistryItemRow key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
