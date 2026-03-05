---
name: typescript-pro
description: Use when writing TypeScript types, Zod schemas, Prisma types, or ensuring type safety across the WishlistCart.com codebase.
license: MIT
metadata:
  source: claude-skills-main typescript-pro (tailored for WishlistCart.com)
  version: "1.0.0"
  triggers: TypeScript, type, interface, generic, Zod, schema, Prisma type, type safety, type error, infer
---

# TypeScript Pro — WishlistCart.com

TypeScript specialist ensuring full type safety across the WishlistCart.com stack: Prisma → Server Actions → API routes → React components.

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Type Architecture

### Prisma-Derived Types
```typescript
// src/types/database.ts
import type { Prisma } from '@prisma/client'

// Build types from Prisma includes — stay in sync with schema automatically
export type WishlistWithItemCount = Prisma.WishlistGetPayload<{
  include: {
    _count: { select: { items: true } }
    items: { take: 4; select: { imageUrl: true } }
  }
}>

export type WishlistItemWithHistory = Prisma.WishlistItemGetPayload<{
  include: {
    priceHistory: { orderBy: { checkedAt: 'desc' }; take: 30 }
    priceAlerts: { where: { isActive: true } }
  }
}>

export type PublicWishlist = Prisma.WishlistGetPayload<{
  include: {
    user: { select: { name: true; username: true; avatarUrl: true } }
    items: true
    cashFund: true
  }
}>

export type WishlistItemPublic = Pick<
  Prisma.WishlistItemGetPayload<{}>,
  'id' | 'title' | 'imageUrl' | 'price' | 'currency' | 'storeName' | 'affiliateUrl' | 'isPurchased' | 'priority'
>
```

### API Types (Request/Response)
```typescript
// src/types/api.ts

// Scraper response
export interface ScrapedProduct {
  title: string | null
  description: string | null
  price: number | null
  currency: string
  imageUrl: string | null
  imageUrls: string[]
  storeName: string | null
  storeDomain: string
  url: string
  confidence: number  // 0-1
}

// Server Action responses (use discriminated unions)
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// Price alert types
export type AlertTriggerType = 'ANY_DROP' | 'TARGET_PRICE' | 'PERCENTAGE_DROP'

export interface PriceAlertConfig {
  type: AlertTriggerType
  targetPrice?: number       // for TARGET_PRICE
  percentageDrop?: number    // for PERCENTAGE_DROP (0-100)
}
```

### Zod Validators (shared client + server)
```typescript
// src/lib/validators/wishlist.ts
import { z } from 'zod'

export const createWishlistSchema = z.object({
  name: z.string().min(1, 'Name required').max(100).trim(),
  description: z.string().max(500).trim().optional(),
  privacy: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).default('PRIVATE'),
  eventType: z.enum([
    'WEDDING', 'BABY_SHOWER', 'BIRTHDAY', 'HOLIDAY',
    'HOUSEWARMING', 'GRADUATION', 'ANNIVERSARY', 'CUSTOM',
  ]).optional().nullable(),
  eventDate: z.coerce.date().optional().nullable(),
})

export type CreateWishlistInput = z.infer<typeof createWishlistSchema>

// src/lib/validators/item.ts
export const createItemSchema = z.object({
  title: z.string().min(1).max(500).trim(),
  url: z.string().url('Must be a valid URL').optional().nullable(),
  price: z.number().positive().max(999999).optional().nullable(),
  currency: z.string().length(3).default('USD'),
  imageUrl: z.string().url().optional().nullable(),
  storeName: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).trim().optional().nullable(),
  priority: z.number().int().min(1).max(5).default(3),
  category: z.string().max(50).optional().nullable(),
  tags: z.array(z.string().max(30)).max(10).default([]),
})

export type CreateItemInput = z.infer<typeof createItemSchema>
```

### Utility Types
```typescript
// src/types/index.ts

// Non-nullable helper
export type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[]
  nextCursor: string | null
  total: number
}

// Cursor pagination input
export interface PaginationInput {
  cursor?: string
  limit?: number  // default 20, max 100
}

// Branded types for IDs (prevent ID confusion)
type Brand<T, B> = T & { readonly _brand: B }
export type UserId = Brand<string, 'UserId'>
export type WishlistId = Brand<string, 'WishlistId'>
export type ItemId = Brand<string, 'ItemId'>

// Price type (always in cents internally? or Decimal — pick one)
export type Price = number  // USD dollars as float (matches Prisma Decimal)
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'

// Affiliate networks
export type AffiliateNetwork =
  | 'amazon-associates'
  | 'shareasale'
  | 'impact'
  | 'cj-affiliate'
  | 'awin'
  | 'direct'  // no affiliate, direct link
```

## Type Patterns

### Type-Safe Server Actions
```typescript
// Use ActionResult<T> for consistent error handling
export async function createWishlist(
  input: CreateWishlistInput
): Promise<ActionResult<WishlistWithItemCount>> {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const validated = createWishlistSchema.safeParse(input)
    if (!validated.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const wishlist = await prisma.wishlist.create({ ... })
    return { success: true, data: wishlist }
  } catch (e) {
    return { success: false, error: 'Failed to create wishlist' }
  }
}
```

### Type-Safe Affiliate Config
```typescript
// src/lib/affiliate/networks.ts
interface AffiliateNetworkConfig {
  network: AffiliateNetwork
  generateUrl: (productUrl: string) => string
}

const NETWORK_CONFIG: Record<string, AffiliateNetworkConfig> = {
  'amazon.com': {
    network: 'amazon-associates',
    generateUrl: (url) => {
      const u = new URL(url)
      u.searchParams.set('tag', process.env.AMAZON_ASSOCIATE_TAG!)
      return u.toString()
    },
  },
  // ...
} as const satisfies Record<string, AffiliateNetworkConfig>
```

## Constraints

### MUST DO
- Enable strict mode + noUncheckedIndexedAccess
- Use Prisma-derived types (never manually duplicate schema types)
- Use `z.infer<typeof schema>` for form/action input types
- Use discriminated unions for state machines (ActionResult, scraper results)
- Use `satisfies` operator for config objects
- Type all server action return values

### MUST NOT DO
- Use `any` (use `unknown` and narrow)
- Use `as` type assertions without a guard
- Define types that duplicate Prisma schema (derive instead)
- Use `@ts-ignore` (fix the type error)
- Import types that are only needed at runtime (use `import type`)
