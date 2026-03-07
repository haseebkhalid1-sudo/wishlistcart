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
  Settings,
} from 'lucide-react'
import type { Prisma } from '@prisma/client'
import { getRegistryById } from '@/lib/actions/registries'
import { prisma } from '@/lib/prisma/client'
import { Button } from '@/components/ui/button'
import { CopyInput } from './copy-input'
import { InviteDialog } from '@/components/registry/invite-dialog'
import { QrShare } from '@/components/registry/qr-share'
import { ThankYouTracker } from '@/components/registry/thankyou-tracker'
import { StartPoolDialog } from '@/components/group-gift/start-pool-dialog'
import { PoolStatusCard } from '@/components/group-gift/pool-status-card'
import { CashFundCard } from '@/components/registry/cash-fund-card'
import { CreateCashFundDialog } from '@/components/registry/create-cash-fund-dialog'

// ─── Types ────────────────────────────────────────────────────────────────────

type RegistryWithItems = Prisma.WishlistGetPayload<{
  include: {
    items: { orderBy: [{ category: 'asc' }, { position: 'asc' }] }
    _count: { select: { items: true } }
    cashFund: true
  }
}>

type RegistryItem = RegistryWithItems['items'][number]

type PoolSummary = {
  id: string
  itemId: string
  goalAmount: Prisma.Decimal
  currentAmount: Prisma.Decimal
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  deadline: Date | null
  _count: { contributions: number }
}

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

function RegistryItemRow({ item, pool }: { item: RegistryItem; pool: PoolSummary | null }) {
  const price = formatPrice(item.price)

  return (
  <div>
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

    {/* Pool section */}
    {pool ? (
      <PoolStatusCard pool={pool} />
    ) : (
      !item.isPurchased && item.price != null && (
        <div className="mt-1.5">
          <StartPoolDialog
            itemId={item.id}
            itemTitle={item.title}
            itemPrice={Number(item.price)}
          />
        </div>
      )
    )}
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

  // Batch-fetch group gift pools for all items
  const itemIds = items.map((i) => i.id)
  const itemPools = itemIds.length > 0
    ? await prisma.groupGiftPool.findMany({
        where: { itemId: { in: itemIds } },
        select: {
          id: true, itemId: true, goalAmount: true, currentAmount: true,
          status: true, deadline: true, _count: { select: { contributions: true } },
        },
      })
    : []
  const poolByItemId = new Map(itemPools.map((p) => [p.itemId, p] as const))

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
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/registries/${registry.id}/settings`}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
            {shareUrl && (
              <InviteDialog
                registryId={registry.id}
                registryName={registry.name}
                shareUrl={shareUrl}
              />
            )}
            {shareUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Share2 className="h-4 w-4" />
                  View public page
                </a>
              </Button>
            )}
            <Button size="sm" asChild>
              <Link href={`/dashboard/wishlists/${registry.id}`}>+ Add Items</Link>
            </Button>
          </div>
        </div>

        {/* Share URL copy input + QR */}
        {shareUrl && (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Share link
              </p>
              <CopyInput value={shareUrl} />
            </div>
            <div className="shrink-0">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                QR code
              </p>
              <QrShare url={shareUrl} size={120} />
            </div>
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

      {/* ── Cash fund section ── */}
      {registry.cashFund ? (
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Cash Fund
          </p>
          <CashFundCard fund={registry.cashFund} showContributeButton={false} />
        </div>
      ) : (
        <div className="mb-8 flex items-center justify-between rounded-xl border border-border bg-subtle px-5 py-4">
          <div>
            <p className="text-sm font-medium text-foreground">Add a Cash Fund</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Let guests contribute money directly — honeymoon fund, diaper fund, etc.
            </p>
          </div>
          <CreateCashFundDialog registryId={registry.id} />
        </div>
      )}

      {/* ── Thank-you tracker (purchased items only) ── */}
      {purchasedItems > 0 && (
        <ThankYouTracker
          registryId={registry.id}
          items={items
            .filter((i) => i.isPurchased)
            .map((i) => ({
              id: i.id,
              title: i.title,
              imageUrl: i.imageUrl,
              storeName: i.storeName,
              price: i.price != null ? Number(i.price) : null,
              purchasedAt: i.purchasedAt,
            }))}
        />
      )}

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
                  <RegistryItemRow key={item.id} item={item} pool={poolByItemId.get(item.id) ?? null} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
