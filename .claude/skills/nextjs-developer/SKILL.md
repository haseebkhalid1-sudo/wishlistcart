---
name: nextjs-developer
description: Use when building any Next.js feature for WishlistCart.com — pages, layouts, server actions, API routes, data fetching, or Vercel deployment. Core skill for this project.
license: MIT
metadata:
  source: claude-skills-main (tailored for WishlistCart.com)
  version: "2.0.0"
  triggers: Next.js, App Router, Server Components, Server Actions, API route, page, layout, loading, error, middleware, Vercel, deployment, data fetching, ISR, SSR, SSG
---

# Next.js Developer — WishlistCart.com

Senior Next.js developer building the WishlistCart.com platform: a universal wishlist + gift registry platform on **Next.js 16** (Turbopack) + Supabase + Vercel.

## ⚠️ Confirmed Runtime Behaviour (Weeks 1–4)

- Framework is **Next.js 16.1.6** (not 15) — Turbopack is the default build tool
- Middleware file is `src/middleware.ts` — Next.js 16 shows a deprecation warning ("use proxy") but middleware still works fine, ignore the warning
- Route group `(public)` with `@[username]/[slug]` renders in the route table as `/[slug]` — that's correct parallel route behaviour
- `createServerClient()` must be `async` — `cookies()` from `next/headers` is async in Next.js 15+:
  ```typescript
  export async function createServerClient() {
    const cookieStore = await cookies()
    // ...
  }
  ```
- `params` in page components is a **Promise** in Next.js 15+:
  ```typescript
  interface Props { params: Promise<{ id: string }> }
  export default async function Page({ params }: Props) {
    const { id } = await params
  }
  ```
- `generateMetadata` also receives `params` as Promise — always `await params`

## Project Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Supabase (PostgreSQL via Prisma) |
| Auth | Supabase Auth |
| State | Zustand + TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Payments | Stripe |
| Email | Resend (React Email) |
| Jobs | Inngest |
| Cache | Upstash Redis |
| Hosting | Vercel |

## Project Structure (App Router)

```
src/app/
├── (auth)/          → login, signup, reset-password
├── (marketing)/     → landing page, pricing, about
├── (app)/           → authenticated dashboard
│   └── dashboard/
│       ├── wishlists/
│       ├── registries/
│       ├── price-alerts/
│       └── settings/
├── (public)/        → @username/slug, registry/slug, explore
└── api/             → scrape, affiliate/redirect, webhooks/stripe, webhooks/inngest
```

## Core Patterns for This Project

### Data Fetching (Server Components)
```tsx
// Always use server components for initial data load
// src/app/(app)/dashboard/wishlists/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'

export default async function WishlistsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: user!.id, isArchived: false },
    include: { _count: { select: { items: true } } },
    orderBy: { position: 'asc' },
  })

  return <WishlistGrid wishlists={wishlists} />
}
```

### Server Actions (Mutations)
```tsx
// src/lib/actions/wishlists.ts
'use server'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { wishlistSchema } from '@/lib/validators/wishlist'

export async function createWishlist(formData: FormData) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const data = wishlistSchema.parse(Object.fromEntries(formData))

  const wishlist = await prisma.wishlist.create({
    data: { ...data, userId: user.id, slug: generateSlug(data.name) },
  })

  revalidatePath('/dashboard/wishlists')
  return wishlist
}
```

### API Routes (Webhooks & External Services)
```tsx
// src/app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { scrapeProduct } from '@/lib/scraper'
import { rateLimit } from '@/lib/utils/rate-limit'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = await rateLimit(user.id, 'scrape', 10) // 10/min free
  if (limited) return NextResponse.json({ error: 'Rate limited' }, { status: 429 })

  const { url } = await req.json()
  const product = await scrapeProduct(url)
  return NextResponse.json(product)
}
```

### Supabase Auth Middleware (actual working pattern)
```tsx
// src/middleware.ts — WORKING pattern as of Weeks 1-4
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = request.nextUrl.pathname.startsWith('/dashboard') ||
                      request.nextUrl.pathname.startsWith('/settings')
  const isAuthRoute = ['/login', '/signup', '/reset-password'].includes(request.nextUrl.pathname)

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

### Public Wishlist Pages (SSR + OG)
```tsx
// src/app/(public)/@[username]/[slug]/page.tsx
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }): Promise<Metadata> {
  const wishlist = await getWishlist(params)
  if (!wishlist) return {}
  return {
    title: `${wishlist.name} — ${wishlist.user.name}'s Wishlist`,
    openGraph: {
      images: [`/api/og-image?title=${encodeURIComponent(wishlist.name)}`],
    },
  }
}

export default async function PublicWishlistPage({ params }) {
  const wishlist = await getWishlist(params)
  if (!wishlist || wishlist.privacy === 'PRIVATE') notFound()
  return <PublicWishlistView wishlist={wishlist} />
}
```

## Rendering Strategy by Route

| Route | Strategy | Why |
|-------|----------|-----|
| `/` (landing) | SSG | Static, SEO-critical |
| `/dashboard/*` | Dynamic SSR | User-specific, auth required |
| `/@username/slug` | SSR | Public + SEO, changes often |
| `/registry/slug` | SSR | Public + SEO, changes often |
| `/explore` | ISR (5min) | Semi-static, popular content |
| `/gift-ideas/*` | SSG | Static gift guides for SEO |
| `/blog/*` | SSG | Static content |
| `/api/*` | Dynamic | API handlers |

## Constraints

### MUST DO
- App Router only (never pages/)
- TypeScript strict mode everywhere
- Server Components by default, 'use client' only when needed
- Supabase auth in middleware + server components (never client-side for protected routes)
- Zod validation in server actions before any DB operation
- revalidatePath() after all mutations
- next/image for all images (optimize product images)
- Metadata API for SEO on every public page
- Error boundaries + loading.tsx for all dashboard routes
- Loading skeletons that match the actual content shape

### MUST NOT DO
- Fetch data in client components (use server components)
- Expose Supabase service role key to client
- Put business logic in route handlers (use lib/ functions)
- Skip validation before prisma operations
- Use any instead of proper types
- Create client components for static content

## WishlistCart-Specific Patterns

### Affiliate Redirect Route
All "Buy" buttons MUST go through `/api/affiliate/redirect?id={itemId}` — never link directly to retailer.
- Route: `src/app/api/affiliate/redirect/route.ts`
- Logs to `AffiliateClick` table (fields: `itemId`, `affiliateNetwork`, `retailer`)
- Use fire-and-forget `.catch(() => null)` for the DB write so redirect is never blocked

### Share Tokens
Public wishlists have a `shareToken` in URL for SHARED privacy lists. Never expose userId in public URLs.

### Price Revalidation
After price check jobs run, trigger `revalidatePath` on affected public wishlist pages.

### Image Storage
Product images are stored in Supabase Storage bucket `product-images/{userId}/{itemId}`. Always serve via Supabase CDN URL, not original retailer URL.
