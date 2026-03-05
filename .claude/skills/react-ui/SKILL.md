---
name: react-ui
description: Use when building React components, UI pages, dialogs, forms, or interactive elements for WishlistCart.com. Uses shadcn/ui + Tailwind + Zustand + TanStack Query.
license: MIT
metadata:
  source: claude-skills-main react-expert (tailored for WishlistCart.com)
  version: "1.0.0"
  triggers: component, UI, button, dialog, form, card, grid, layout, dropdown, modal, toast, skeleton, loading state, animation, responsive, mobile
---

# React UI — WishlistCart.com

Senior React specialist building the WishlistCart.com interface with shadcn/ui, Tailwind CSS 4, Zustand, and TanStack Query v5.

## UI Stack

| Tool | Purpose |
|------|---------|
| shadcn/ui | Base components (copy-paste, owned code) |
| Tailwind CSS 4 | Utility-first styling |
| Lucide React | Icons |
| Zustand | Client state (UI state, optimistic updates) |
| TanStack Query v5 | Server state caching, mutations |
| React Hook Form + Zod | Forms with validation |
| Sonner | Toast notifications |
| @dnd-kit/sortable | Drag-and-drop for reordering |
| Recharts | Price history charts |
| qrcode.react | QR codes for sharing |
| React Email | Email templates |

## Key Component Patterns

### Wishlist Item Card
```tsx
// src/components/wishlist/item-card.tsx
'use client'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Heart, MoreHorizontal } from 'lucide-react'
import { PriceDisplay } from '@/components/shared/price-display'
import type { WishlistItemWithHistory } from '@/types'

interface ItemCardProps {
  item: WishlistItemWithHistory
  isOwner: boolean
  onClaim?: (itemId: string) => void
}

export function ItemCard({ item, isOwner, onClaim }: ItemCardProps) {
  const isPriceDropped = item.originalPrice && item.price < item.originalPrice

  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-muted">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
        )}
        {isPriceDropped && (
          <Badge variant="destructive" className="absolute top-2 left-2">Sale</Badge>
        )}
        {item.isPurchased && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">Gifted ✓</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-3 space-y-1">
        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
        {item.storeName && (
          <p className="text-xs text-muted-foreground">{item.storeName}</p>
        )}
        <div className="flex items-center justify-between">
          <PriceDisplay price={item.price} originalPrice={item.originalPrice} currency={item.currency} />
          <div className="flex gap-1">
            {item.affiliateUrl && (
              <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                <a href={`/api/affiliate/redirect?item=${item.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>
        {!isOwner && !item.isPurchased && onClaim && (
          <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => onClaim(item.id)}>
            I'm buying this 🎁
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

### Add Item Dialog (URL paste)
```tsx
// src/components/wishlist/add-item-dialog.tsx
'use client'
import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { addItemByUrl } from '@/lib/actions/items'

export function AddItemDialog({ wishlistId }: { wishlistId: string }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    startTransition(async () => {
      try {
        await addItemByUrl(wishlistId, url)
        toast.success('Item added!')
        setOpen(false)
        setUrl('')
      } catch (err) {
        toast.error('Failed to add item. Try adding manually.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-2" />Add Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item from URL</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Paste product URL from any store..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="url"
          />
          <Button type="submit" className="w-full" disabled={isPending || !url.trim()}>
            {isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Fetching product...</> : 'Add to Wishlist'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### TanStack Query Hooks
```tsx
// src/hooks/use-wishlists.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useWishlists() {
  return useQuery({
    queryKey: ['wishlists'],
    queryFn: async () => {
      const res = await fetch('/api/wishlists')
      return res.json()
    },
    staleTime: 30_000,
  })
}

// Use for client-side optimistic updates (e.g., drag-and-drop reorder)
export function useReorderWishlists() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await fetch('/api/wishlists/reorder', { method: 'PATCH', body: JSON.stringify({ ids }) })
    },
    onMutate: async (ids) => {
      // Optimistic update
      await qc.cancelQueries({ queryKey: ['wishlists'] })
      const prev = qc.getQueryData(['wishlists'])
      // Update local order immediately
      return { prev }
    },
    onError: (_, __, ctx) => qc.setQueryData(['wishlists'], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['wishlists'] }),
  })
}
```

### Loading Skeletons
```tsx
// src/components/wishlist/wishlist-grid-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function WishlistGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}
```

## WishlistCart UI Components Needed

### Phase 1A (Build Now)
- `WishlistCard` - List card showing name, item count, cover image
- `WishlistGrid` - Responsive grid of wishlist cards
- `ItemCard` - Product card with image, price, buy button
- `ItemGrid` - Grid/list toggle view of items
- `AddItemDialog` - URL paste + manual entry form
- `ShareDialog` - Share link, QR code, privacy toggle
- `ClaimItemDialog` - "I'm buying this" confirmation
- `EmptyState` - Empty wishlists, empty items, etc.
- `PriceDisplay` - Price with sale indicator
- `StoreIcon` - Store logo/favicon

### Phase 1B (Price Intelligence)
- `PriceChart` - Recharts line chart for price history
- `PriceAlertForm` - Set alert target price
- `PriceAlertBadge` - "Tracking price" indicator
- `DealScore` - Visual score badge (1-10)
- `ExtensionCTA` - "Install Chrome Extension" banner

### Phase 2 (Registries)
- `RegistryCard` - Event registry card with event type icon
- `RegistryHeader` - Registry page hero with event details
- `CategorySection` - Registry items grouped by category
- `GroupGiftProgress` - Progress bar + contributors
- `CashFundCard` - Fund with progress and contribute button

## Design System for WishlistCart

### Color Palette (use CSS variables in globals.css)
- Primary: Warm rose/coral (`#E8523A` or similar) - "wishlist" warmth
- Secondary: Soft teal - "cart" / purchase completion
- Neutral: Clean grays
- Success: Green for "purchased/gifted"
- Warning: Amber for "price alert triggered"

### Typography
- Display: A distinctive serif or slab for headings (e.g., Playfair Display, DM Serif)
- Body: Clean sans (Geist, DM Sans)
- Mono: Geist Mono (prices, codes)

### Key UX Principles
1. **Instant feedback**: Every action has a loading state and success/error toast
2. **Surprise mode**: Gift-givers' claims NEVER shown to list owner (strict)
3. **Mobile-first**: Test every component at 375px width first
4. **Affiliate transparency**: "Buy" buttons are honest (we earn commission, that's OK)
5. **Empty states**: Every empty state has a clear CTA, not just "no items yet"

## Constraints

### MUST DO
- Use shadcn/ui components as base (never rebuild from scratch)
- 'use client' only on interactive components
- Loading skeletons that match the actual layout
- Error states for failed mutations
- Toast notifications (sonner) for all actions
- Accessible: proper ARIA labels, keyboard navigation
- Mobile responsive (Tailwind responsive prefixes)
- useTransition for server action calls (non-blocking UI)

### MUST NOT DO
- Put 'use client' on pages (only components that need interactivity)
- Use window/document without checking for SSR
- Create custom form inputs when shadcn/ui has them
- Inline styles (Tailwind only)
- Hard-code colors (use CSS variables / Tailwind config)
- Skip loading states for async operations
