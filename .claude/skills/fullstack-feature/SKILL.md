---
name: fullstack-feature
description: Use when implementing a complete feature end-to-end for WishlistCart.com — database schema → server action → API route → UI component. The primary skill for building new features.
license: MIT
metadata:
  source: claude-skills-main fullstack-guardian (tailored for WishlistCart.com)
  version: "1.0.0"
  triggers: implement, build, create feature, add feature, new feature, end-to-end, full stack
---

# Fullstack Feature Builder — WishlistCart.com

Senior full-stack engineer implementing features across the complete WishlistCart.com stack: Supabase → Prisma → Server Actions → Next.js → shadcn/ui.

## Feature Implementation Checklist

For every feature, consider all three layers:

**[DB]** Database: schema changes, migrations, indexes, RLS
**[API]** Server: server actions or API routes, validation, auth checks
**[UI]** Frontend: server component, client interactivity, loading/error states

## Implementation Pattern

### 1. Start with DB (if schema change needed)
- Edit `prisma/schema.prisma`
- Run `npx prisma migrate dev --name "feature_name"`
- Add RLS policy in Supabase dashboard SQL editor
- Run `npx prisma generate`

### 2. Create Server Action or API Route
- Server Action for mutations (create, update, delete)
- API Route for: webhooks, external service calls, streaming responses
- Always: auth check → Zod validation → DB operation → revalidatePath

### 3. Build Server Component (data fetching)
- Fetch in server component using Prisma
- Pass data as props to client components
- Add loading.tsx skeleton and error.tsx boundary

### 4. Add Client Component (interactivity)
- Only for: user interactions, forms, animations, real-time updates
- Use useTransition for server action calls
- Toast notifications for feedback

## Feature Examples

### Feature: "Share Wishlist"

**DB**: No schema change (shareToken already in schema)

**Server Action**:
```typescript
// src/lib/actions/sharing.ts
'use server'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'

export async function generateShareLink(wishlistId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { userId: true },
  })
  if (!wishlist || wishlist.userId !== user.id) throw new Error('Forbidden')

  const shareToken = nanoid(12)
  const updated = await prisma.wishlist.update({
    where: { id: wishlistId },
    data: {
      shareToken,
      privacy: 'SHARED',
    },
    select: { shareToken: true, slug: true, user: { select: { username: true } } },
  })

  revalidatePath('/dashboard/wishlists')
  return {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/@${updated.user.username}/${updated.slug}`,
    token: shareToken,
  }
}
```

**UI Component**:
```tsx
// src/components/wishlist/share-dialog.tsx
'use client'
import { useState, useTransition } from 'react'
import { generateShareLink } from '@/lib/actions/sharing'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Share2, Copy, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'

export function ShareDialog({ wishlistId }: { wishlistId: string }) {
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleGenerate = () => {
    startTransition(async () => {
      const { url } = await generateShareLink(wishlistId)
      setShareUrl(url)
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleGenerate}>
          <Share2 className="h-4 w-4 mr-2" />Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Share Wishlist</DialogTitle></DialogHeader>
        {shareUrl ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly />
              <Button size="icon" variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex justify-center">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
          </div>
        ) : (
          isPending && <p className="text-center text-muted-foreground">Generating link...</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

### Feature: "Claim Item (Gift Coordination)"

**DB**: No schema change (isPurchased, purchasedBy, giftMessage already in schema)

**Server Action**:
```typescript
// src/lib/actions/items.ts
export async function claimItem(
  itemId: string,
  claimerInfo: { name: string; message?: string; isAnonymous: boolean }
) {
  // No auth required — gift-givers may not have accounts
  // But we need to verify the item is on a public/shared list

  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    include: { wishlist: { select: { privacy: true, userId: true } } },
  })

  if (!item) throw new Error('Not found')
  if (item.wishlist.privacy === 'PRIVATE') throw new Error('Forbidden')
  if (item.isPurchased) throw new Error('Already claimed')

  // Optionally link to user account
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  await prisma.wishlistItem.update({
    where: { id: itemId },
    data: {
      isPurchased: true,
      purchasedBy: user?.id ?? null,
      giftMessage: claimerInfo.message,
      isAnonymous: claimerInfo.isAnonymous,
      purchasedAt: new Date(),
    },
  })

  // Notify wishlist owner (via Inngest event)
  await inngest.send({
    name: 'app/item.claimed',
    data: { itemId, wishlistOwnerId: item.wishlist.userId },
  })
}
```

## Phase 1A Features to Build (in order)

1. **Auth flow** (login, signup, password reset, middleware)
2. **Wishlist CRUD** (create, list, edit, delete, archive)
3. **Manual item add** (form with Zod validation)
4. **URL scraper** (paste URL → auto-extract → preview → save)
5. **Wishlist sharing** (share token, public page, privacy control)
6. **Gift claiming** (claim/unclaim, surprise mode)
7. **Affiliate redirect** (every buy click → /api/affiliate/redirect)
8. **Landing page** (marketing homepage)

## WishlistCart Domain Concepts

| Concept | Description |
|---------|-------------|
| `Wishlist` | A named collection of items (personal or registry) |
| `WishlistItem` | A product saved to a wishlist (with URL, price, image) |
| `Registry` | A wishlist with an event (type: WEDDING, BABY, etc.) |
| `ShareToken` | Unique token for sharing SHARED-privacy wishlists |
| `Affiliate URL` | Every item URL rewritten through our affiliate network |
| `Price Alert` | Notify user when item price drops below threshold |
| `Group Gift Pool` | Collective payment toward an expensive item |
| `Surprise Mode` | Owner cannot see gift claims (enforced in DB queries) |
| `Occasion Reminder` | Recurring birthday/anniversary reminders |

## Constraints

### MUST DO
- Auth check as first operation in every server action
- Ownership check before any mutation (even for pro features)
- Optimistic UI for fast interactions (use useTransition)
- Loading state for every async operation
- Error handling with user-friendly messages (no stack traces)
- Revalidate affected paths after mutations

### MUST NOT DO
- Mix server and client logic (keep server actions pure server-side)
- Return sensitive data to the wrong user (owner ≠ gift-giver)
- Skip loading states (broken UI frustrates users)
- Throw raw errors to the UI (catch and format)
- Implement features beyond the current phase without justification
