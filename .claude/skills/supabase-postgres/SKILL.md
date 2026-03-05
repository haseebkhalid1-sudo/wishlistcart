---
name: supabase-postgres
description: Use when working with Supabase, PostgreSQL, Prisma schema, RLS policies, database queries, migrations, or Supabase Auth for WishlistCart.com.
license: MIT
metadata:
  source: claude-skills-main postgres-pro + database-optimizer (tailored for WishlistCart.com)
  version: "1.0.0"
  triggers: Supabase, PostgreSQL, Prisma, database, migration, RLS, Row Level Security, query, index, schema, auth, storage
---

# Supabase + PostgreSQL — WishlistCart.com

Database specialist for WishlistCart.com's Supabase PostgreSQL instance managed via Prisma ORM.

## Stack Details

- **Supabase** (hosted PostgreSQL) with pgBouncer connection pooling
- **Prisma** ORM for type-safe queries and migrations
- **Two connection strings**: `DATABASE_URL` (pooled, for app) + `DIRECT_URL` (direct, for migrations)
- **Supabase Auth**: users are in `auth.users` (Supabase) and mirrored to `public.users` (Prisma)
- **Supabase Storage**: product images in `product-images` bucket, avatars in `avatars` bucket
- **RLS**: Row Level Security enabled on all tables for defense-in-depth

## ⚠️ Prisma 7 Breaking Changes (confirmed in production)

Prisma 7 is installed. It has breaking changes vs Prisma 5/6:

1. **No `url` in `schema.prisma` datasource** — configure in `prisma.config.ts`:
   ```typescript
   // prisma.config.ts (project root)
   import { defineConfig } from 'prisma/config'
   export default defineConfig({
     datasource: { url: process.env.DATABASE_URL },
   })
   ```

2. **Requires driver adapter** — `@prisma/adapter-pg` must be installed:
   ```bash
   npm install @prisma/adapter-pg pg @types/pg
   ```

3. **`previewFeatures = ["driverAdapters"]` in schema generator**:
   ```prisma
   generator client {
     provider        = "prisma-client-js"
     previewFeatures = ["driverAdapters"]
   }
   ```

4. **`ZodError.issues` not `.errors`** — Prisma 7 updated this across all validation.

## Prisma Client Setup (Prisma 7 — ACTUAL working code)

```typescript
// src/lib/prisma/client.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const connectionString = process.env['DATABASE_URL'] ?? ''
  // Conditional: skip adapter at build time when no DATABASE_URL
  if (!connectionString) return new PrismaClient()
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Supabase Client Setup (async — Next.js 15+ required)

```typescript
// src/lib/supabase/server.ts (for Server Components + Server Actions)
import { createServerClient as createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// NOTE: async required — cookies() is async in Next.js 15+
export async function createServerClient() {
  const cookieStore = await cookies()
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies can't be set, ignore
          }
        },
      },
    }
  )
}

// src/lib/supabase/client.ts (for Client Components)
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## Common Query Patterns

### Get User's Wishlists with Item Count
```typescript
const wishlists = await prisma.wishlist.findMany({
  where: { userId, isArchived: false },
  include: {
    _count: { select: { items: true } },
    items: {
      take: 4,
      orderBy: { position: 'asc' },
      select: { imageUrl: true },
    },
  },
  orderBy: { position: 'asc' },
})
```

### Get Public Wishlist (with auth check)
```typescript
async function getPublicWishlist(username: string, slug: string) {
  const wishlist = await prisma.wishlist.findFirst({
    where: {
      slug,
      user: { username },
      OR: [{ privacy: 'PUBLIC' }, { privacy: 'SHARED' }],
    },
    include: {
      user: { select: { name: true, username: true, avatarUrl: true } },
      items: {
        where: { wishlist: { privacy: { not: 'PRIVATE' } } },
        orderBy: { position: 'asc' },
      },
      cashFund: true,
    },
  })
  return wishlist
}
```

### Add Item with Affiliate URL
```typescript
async function addItem(wishlistId: string, userId: string, data: CreateItemInput) {
  const affiliateUrl = generateAffiliateUrl(data.url, data.storeDomain)
  return prisma.wishlistItem.create({
    data: {
      ...data,
      wishlistId,
      userId,
      affiliateUrl,
      position: await getNextPosition(wishlistId),
    },
  })
}

async function getNextPosition(wishlistId: string): Promise<number> {
  const last = await prisma.wishlistItem.findFirst({
    where: { wishlistId },
    orderBy: { position: 'desc' },
    select: { position: true },
  })
  return (last?.position ?? 0) + 1
}
```

### Price History Query
```typescript
// Get price history for chart (last 90 days)
const history = await prisma.priceHistory.findMany({
  where: {
    itemId,
    checkedAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
  },
  orderBy: { checkedAt: 'asc' },
  select: { price: true, checkedAt: true },
})
```

### Items Due for Price Check
```typescript
// Used by Inngest price-check job
const itemsToCheck = await prisma.wishlistItem.findMany({
  where: {
    url: { not: null },
    wishlist: { isArchived: false },
    priceAlerts: { some: { isActive: true } },
  },
  include: {
    priceAlerts: { where: { isActive: true } },
    priceHistory: {
      orderBy: { checkedAt: 'desc' },
      take: 1,
    },
  },
})
```

## Row Level Security (RLS) Policies

Apply these in Supabase SQL editor after Prisma migrations.

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "Users: own data only" ON users
  FOR ALL USING (auth.uid()::text = id::text);

-- Wishlists: owners can do everything, others can read public/shared
CREATE POLICY "Wishlists: owner full access" ON wishlists
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Wishlists: public read" ON wishlists
  FOR SELECT USING (privacy IN ('PUBLIC', 'SHARED'));

-- Wishlist items: follow parent wishlist visibility
CREATE POLICY "Items: owner access" ON wishlist_items
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Items: public wishlist read" ON wishlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wishlists w
      WHERE w.id = wishlist_id
        AND w.privacy IN ('PUBLIC', 'SHARED')
    )
  );

-- Price alerts: private to owner
CREATE POLICY "Alerts: owner only" ON price_alerts
  FOR ALL USING (auth.uid()::text = user_id::text);
```

## Indexes (add to Prisma schema or via migration)

```sql
-- Critical indexes for WishlistCart query patterns
CREATE INDEX idx_wishlists_user_archived ON wishlists(user_id, is_archived);
CREATE INDEX idx_items_wishlist_position ON wishlist_items(wishlist_id, position);
CREATE INDEX idx_items_store_domain ON wishlist_items(store_domain);
CREATE INDEX idx_price_history_item_time ON price_history(item_id, checked_at DESC);
CREATE INDEX idx_affiliate_clicks_item ON affiliate_clicks(item_id, clicked_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
-- For public wishlist lookup by username + slug
CREATE INDEX idx_wishlists_slug ON wishlists(slug);
CREATE INDEX idx_users_username ON users(username);
```

## Migrations Workflow

```bash
# After editing prisma/schema.prisma:
npx prisma migrate dev --name "add_price_history"   # Development
npx prisma migrate deploy                             # Production (in CI/CD)
npx prisma generate                                   # Regenerate types
npx prisma studio                                     # Visual DB browser
```

## Supabase Storage

```typescript
// Upload product image
async function uploadProductImage(userId: string, itemId: string, imageUrl: string) {
  const supabase = createAdminClient() // service role for storage writes
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const path = `${userId}/${itemId}.jpg`

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: true })

  if (error) throw error
  return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
}
```

## Constraints

### MUST DO
- Always get userId from Supabase Auth (never trust client-provided userId)
- Use `prisma.$transaction()` for operations that must be atomic
- Add `@index` to all FK columns in Prisma schema
- Use `select` to limit columns returned (never fetch unnecessary data)
- Use cursor-based pagination for large collections
- Run migrations in CI/CD, never manually in production
- Use `DIRECT_URL` for migrations, `DATABASE_URL` (pooled) for app queries

### MUST NOT DO
- Use service role key in client-side code
- Bypass RLS with service role key in user-facing queries
- Store sensitive data unencrypted (use Supabase Vault for secrets)
- SELECT * in production queries
- Run raw SQL without parameterized queries
- Delete users directly (cascade handles related data)
- Use Prisma in Edge Functions (use Supabase client directly there)

## Auth Sync Pattern

When a new user signs up via Supabase Auth, create the corresponding `users` record:

```sql
-- Supabase: Database → Functions → Create function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id::text::uuid,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(), NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```
