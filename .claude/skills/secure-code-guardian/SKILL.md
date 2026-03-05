---
name: secure-code-guardian
description: Use when implementing auth, payment flows, affiliate tracking, Supabase RLS, API security, or any feature involving user data or money in WishlistCart.com.
license: MIT
metadata:
  source: claude-skills-main secure-code-guardian (tailored for WishlistCart.com)
  version: "1.0.0"
  triggers: security, auth, authentication, authorization, Stripe, payment, RLS, rate limit, CSRF, XSS, SQL injection, input validation, webhook, secret, API key, session
---

# Secure Code Guardian — WishlistCart.com

Security-focused developer for WishlistCart.com. This platform handles user data, payment transactions (Stripe), and affiliate revenue — security is non-negotiable.

## Platform Attack Surface

| Area | Risk | Priority |
|------|------|---------|
| Supabase Auth | Account takeover | Critical |
| Stripe webhooks | Payment fraud | Critical |
| Product scraper API | Rate abuse, SSRF | High |
| Affiliate redirect | Click fraud, open redirect | High |
| Gift claiming (surprise mode) | Owner peeking at claims | High |
| Public wishlist pages | Data enumeration | Medium |
| Price alert system | DoS via alert spam | Medium |
| URL inputs (item add) | SSRF | High |

## Authentication Patterns

### Server Action Auth Check (always first line)
```typescript
// ALWAYS do this at the start of every server action
import { createServerClient } from '@/lib/supabase/server'

export async function someServerAction(data: unknown) {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // Use getUser() NOT getSession() — getUser() validates with Supabase server
  if (error || !user) {
    throw new Error('Unauthorized')  // or redirect('/login')
  }

  // NOW safe to use user.id
}
```

### Resource Ownership Check
```typescript
// Always verify the resource belongs to the authenticated user
export async function deleteWishlist(wishlistId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check ownership BEFORE deleting
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    select: { userId: true },
  })

  if (!wishlist || wishlist.userId !== user.id) {
    throw new Error('Forbidden')  // Don't leak whether it exists
  }

  await prisma.wishlist.delete({ where: { id: wishlistId } })
  revalidatePath('/dashboard/wishlists')
}
```

## Stripe Webhook Security

```typescript
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()  // Raw body for signature verification
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    // MUST verify signature — prevents fraudulent webhook calls
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Invalid Stripe webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Process event...
  switch (event.type) {
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
      break
    case 'payment_intent.succeeded':
      await handleGroupGiftPayment(event.data.object as Stripe.PaymentIntent)
      break
  }

  return NextResponse.json({ received: true })
}
```

## SSRF Prevention (Product Scraper)

```typescript
// src/lib/scraper/index.ts
import { URL } from 'url'

const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254']
const ALLOWED_PROTOCOLS = ['http:', 'https:']

export function validateScrapeUrl(rawUrl: string): URL {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new Error('Invalid URL')
  }

  if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
    throw new Error('Only HTTP/HTTPS URLs allowed')
  }

  const hostname = url.hostname.toLowerCase()

  // Block internal/private IP ranges (SSRF prevention)
  if (BLOCKED_HOSTS.some(h => hostname === h) ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.')) {
    throw new Error('URL not allowed')
  }

  return url
}
```

## Affiliate Redirect (Open Redirect Prevention)

Query param is `?id=` (not `?item=`). Route: `src/app/api/affiliate/redirect/route.ts`

```typescript
// ACTUAL working pattern — param is ?id=, not ?item=
export async function GET(request: NextRequest) {
  const itemId = request.nextUrl.searchParams.get('id')  // ← ?id= not ?item=
  if (!itemId) return NextResponse.json({ error: 'Missing item id' }, { status: 400 })

  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    select: { url: true, affiliateUrl: true, storeDomain: true, storeName: true,
              wishlist: { select: { privacy: true } } },
  })

  // Check item exists, has a URL, and wishlist is not private
  if (!item || !item.url || item.wishlist.privacy === 'PRIVATE') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const destination = item.affiliateUrl ?? buildAffiliateUrl(item.url)

  // Fire-and-forget — never block redirect with DB write
  prisma.affiliateClick.create({
    data: {
      itemId,
      affiliateNetwork: getNetworkName(item.url),   // from src/lib/affiliate
      retailer: item.storeName ?? item.storeDomain ?? new URL(destination).hostname,
    },
  }).catch(() => null)   // ← catch(() => null) not catch(console.error)

  return NextResponse.redirect(destination, { status: 302 })
}
```

## Surprise Mode (Gift Claiming)

The owner of a wishlist must NEVER see who claimed what. This is critical for gift-giving surprise.

```typescript
// When an owner views their own wishlist — strip claim data
export async function getWishlistForOwner(wishlistId: string, userId: string) {
  return prisma.wishlist.findFirst({
    where: { id: wishlistId, userId },
    include: {
      items: {
        select: {
          id: true, title: true, imageUrl: true, price: true,
          storeDomain: true, affiliateUrl: true, notes: true,
          // NEVER include: isPurchased, purchasedBy, purchasedAt, giftMessage
          // when returning to the owner
        },
      },
    },
  })
}

// Gift-givers see claim status (excluding owner)
export async function getWishlistForGiftGiver(wishlistId: string) {
  return prisma.wishlist.findFirst({
    where: { id: wishlistId, privacy: { in: ['PUBLIC', 'SHARED'] } },
    include: {
      items: {
        select: {
          id: true, title: true, imageUrl: true, price: true,
          storeDomain: true, affiliateUrl: true,
          isPurchased: true,          // Gift-givers CAN see claimed status
          isAnonymous: true,
          // NEVER include purchasedBy (gift-giver identity)
        },
      },
    },
  })
}
```

## Rate Limiting (Upstash Redis — graceful fallback)

Rate limiting is **optional** — app works without Upstash configured (dev-friendly).
The scraper route at `src/app/api/scrape/route.ts` uses this pattern:

```typescript
// Graceful fallback if Upstash not configured
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, '1 m'),  // 20 req/min per user
  })
}

// In route handler:
if (ratelimit) {
  const { success } = await ratelimit.limit(user.id)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
```

## Input Validation (Zod)

```typescript
// src/lib/validators/item.ts
import { z } from 'zod'

export const createItemSchema = z.object({
  title: z.string().min(1).max(500).trim(),
  url: z.string().url().optional().nullable(),
  price: z.number().positive().max(999999).optional().nullable(),
  currency: z.string().length(3).default('USD'),
  notes: z.string().max(1000).trim().optional().nullable(),
  priority: z.number().int().min(1).max(5).default(3),
  // Never accept: userId, wishlistId, isPurchased, purchasedBy from client
})

// Always validate in server actions:
export async function addItem(wishlistId: string, rawData: unknown) {
  const data = createItemSchema.parse(rawData)  // throws ZodError if invalid
  // ...
}
```

## Security Headers (next.config.ts)

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // Next.js requires
      "img-src 'self' data: blob: https:",  // Allow product images from any https
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com",
    ].join('; '),
  },
]
```

## Constraints

### MUST DO
- `supabase.auth.getUser()` (not `getSession()`) as first line of every server action
- Check resource ownership before any mutation
- Verify Stripe webhook signatures before processing
- Validate all user input with Zod before touching the database
- Rate limit scraper and auth endpoints
- Use SSRF prevention for all URL inputs
- Keep surprise mode: never expose claim data to wishlist owner
- Log security events (failed auth, rate limits, suspicious activity)

### MUST NOT DO
- Trust `userId` from request body/params (always from auth)
- Skip Stripe webhook signature verification
- Expose Supabase service role key to client
- Return different errors for "not found" vs "forbidden" (prevents enumeration)
- Allow redirects to arbitrary user-supplied URLs
- Log sensitive data (passwords, card numbers, full addresses)
- Disable RLS policies for convenience
