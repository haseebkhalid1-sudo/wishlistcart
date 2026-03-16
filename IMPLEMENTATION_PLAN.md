# WishlistCart.com - Technical Implementation Plan

> **Stack**: Next.js 15 + Supabase + Vercel
> **Version**: 1.0 | **Date**: March 2026
> **Reference**: BUSINESS_PLAN.md, wishlistcart_technical_specification.pdf
> **Approach**: Solo/small-team, bootstrap, ship fast, iterate

---

## 🚀 Start of Every Session — Load These First

**Before writing any code, load all project skills.** Each skill contains patterns, constraints, and code examples specific to WishlistCart.com. Use the Skill tool or reference the files directly.

| # | Skill | Location | Load When |
|---|-------|----------|-----------|
| 1 | `nextjs-developer` | `.claude/skills/nextjs-developer/SKILL.md` | Any Next.js routes, layouts, API routes, middleware |
| 2 | `fullstack-feature` | `.claude/skills/fullstack-feature/SKILL.md` | Building any new feature end-to-end |
| 3 | `typescript-pro` | `.claude/skills/typescript-pro/SKILL.md` | Writing types, Zod schemas, Prisma types |
| 4 | `supabase-postgres` | `.claude/skills/supabase-postgres/SKILL.md` | DB queries, RLS, auth, storage, migrations |
| 5 | `react-ui` | `.claude/skills/react-ui/SKILL.md` | React components, hooks, TanStack Query |
| 6 | `secure-code-guardian` | `.claude/skills/secure-code-guardian/SKILL.md` | Auth checks, input validation, API security |
| 7 | `frontend-design` | `.claude/skills/frontend-design/SKILL.md` | Any UI/visual work — theme, typography, layout |
| 8 | `seo-content` | `.claude/skills/seo-content/SKILL.md` | Metadata, structured data, gift guide pages |
| 9 | `test-master` | `.claude/skills/test-master/SKILL.md` | Writing tests (unit, integration, E2E) |

---

## 📋 Before Starting Work — Session Checklist

Run through this every session before writing code:

- [ ] **Read MEMORY.md** — check `.claude/memory/MEMORY.md` for notes from prior sessions
- [ ] **Check IMPLEMENTATION_PLAN.md** — review which phase steps are completed `[x]` vs pending `[ ]`
- [ ] **Read BUSINESS_PLAN.md** — if unsure about feature scope or product direction
- [ ] **Know the current phase** — confirm which Phase we are in (1A / 1B / 2 / 3)
- [ ] **Load relevant skills** — from the table above based on what you're building today
- [ ] **Check open files** — read any files you'll modify before editing them

### Key files to know

| File | Purpose |
|------|---------|
| `BUSINESS_PLAN.md` | Product vision, features, monetization, personas |
| `IMPLEMENTATION_PLAN.md` | This file — technical spec, phase tracking |
| `prisma/schema.prisma` | Source of truth for all DB models |
| `src/lib/actions/` | All server actions live here |
| `src/app/` | All Next.js routes and pages |
| `.env.local` | Local environment variables (never commit) |
| `.env.example` | Template for required environment variables |

### Completion Tracking Convention

Mark each task as you complete it:
- `[ ]` — Not started
- `[~]` — In progress
- `[x]` — **Completed** ✓

---

## Finalized Tech Stack

We simplify the spec's recommendations for bootstrap speed. No separate backend service needed - Next.js API routes + Supabase handle everything.

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 15 (App Router) | SSR/SSG for SEO, API routes, Server Actions, Vercel-native |
| **Language** | TypeScript 5.x | Type safety across entire codebase |
| **UI** | Tailwind CSS 4 + shadcn/ui | Rapid, consistent, accessible UI |
| **Database** | Supabase (PostgreSQL) | Auth, DB, Storage, Realtime, Edge Functions - all-in-one |
| **ORM** | Prisma | Type-safe queries, migrations, works great with Supabase PG |
| **Auth** | Supabase Auth | Google/Apple/Email built-in, RLS policies, session management |
| **State** | Zustand + TanStack Query | Client state + server state caching |
| **Forms** | React Hook Form + Zod | Validation shared between client & server |
| **Storage** | Supabase Storage | Product images, avatars (S3-compatible) |
| **Payments** | Stripe | Subscriptions, group gifting, cash funds |
| **Email** | Resend | Transactional emails, price alerts, digests |
| **Background Jobs** | Inngest | Price checking cron, email digests, scraping jobs |
| **Cache** | Upstash Redis | Rate limiting, price cache, session cache |
| **Analytics** | PostHog | Privacy-friendly, free tier (1M events/mo) |
| **Monitoring** | Sentry | Error tracking, performance |
| **Hosting** | Vercel | Zero-config, edge network, preview deployments |
| **CI/CD** | GitHub Actions + Vercel | Auto-deploy on push, preview per PR |

### Why Supabase over separate backend

The tech spec suggests NestJS/Express backend. For a solo builder, Supabase eliminates that entire layer:
- **Auth**: Built-in, no NextAuth.js config needed
- **Database**: Direct Postgres with dashboard, no separate DB hosting
- **RLS**: Row Level Security replaces most API authorization logic
- **Realtime**: WebSocket subscriptions built-in (for live gift claiming)
- **Storage**: S3-compatible file storage with auth policies
- **Edge Functions**: Deno-based serverless for custom logic
- We still use Next.js API routes for complex business logic (scraping, affiliate, Stripe webhooks)

---

## Project Structure

```
wishlistcart.com/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, type-check, test on PR
│       └── deploy-preview.yml        # Preview deployment
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Migration files
│   └── seed.ts                       # Seed data (dev)
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth group (login, signup, reset)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx            # Auth layout (centered, no nav)
│   │   ├── (marketing)/              # Public marketing pages
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── layout.tsx            # Marketing layout (header + footer)
│   │   ├── (app)/                    # Authenticated app pages
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Dashboard home
│   │   │   │   ├── wishlists/
│   │   │   │   │   ├── page.tsx      # All wishlists
│   │   │   │   │   ├── new/page.tsx  # Create wishlist
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx  # Edit wishlist
│   │   │   │   │       └── settings/page.tsx
│   │   │   │   ├── registries/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── new/page.tsx
│   │   │   │   ├── price-alerts/page.tsx
│   │   │   │   ├── reminders/page.tsx
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx      # General settings
│   │   │   │       ├── profile/page.tsx
│   │   │   │       ├── notifications/page.tsx
│   │   │   │       └── billing/page.tsx
│   │   │   └── layout.tsx            # App layout (sidebar + nav)
│   │   ├── (public)/                 # Public shared pages
│   │   │   ├── @[username]/
│   │   │   │   ├── page.tsx          # Public profile
│   │   │   │   └── [slug]/page.tsx   # Public wishlist
│   │   │   ├── registry/
│   │   │   │   └── [slug]/page.tsx   # Public registry
│   │   │   └── explore/
│   │   │       ├── page.tsx          # Discover
│   │   │       └── gift-guides/
│   │   │           └── [slug]/page.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/route.ts
│   │   │   │   └── inngest/route.ts
│   │   │   ├── scrape/route.ts       # Product URL scraping
│   │   │   ├── og-image/route.ts     # Dynamic OG images
│   │   │   └── affiliate/
│   │   │       └── redirect/route.ts # Affiliate link redirect + tracking
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── wishlist/                 # Wishlist-specific components
│   │   │   ├── wishlist-card.tsx
│   │   │   ├── wishlist-grid.tsx
│   │   │   ├── item-card.tsx
│   │   │   ├── add-item-dialog.tsx
│   │   │   ├── share-dialog.tsx
│   │   │   └── price-chart.tsx
│   │   ├── registry/                 # Registry components
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── mobile-nav.tsx
│   │   └── shared/                   # Shared components
│   │       ├── product-image.tsx
│   │       ├── price-display.tsx
│   │       └── share-buttons.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   ├── admin.ts              # Admin/service-role client
│   │   │   └── middleware.ts          # Auth middleware helper
│   │   ├── prisma/
│   │   │   └── client.ts             # Prisma client singleton
│   │   ├── stripe/
│   │   │   ├── client.ts             # Stripe client
│   │   │   ├── config.ts             # Plans, prices
│   │   │   └── webhooks.ts           # Webhook handlers
│   │   ├── scraper/
│   │   │   ├── index.ts              # Main scraper orchestrator
│   │   │   ├── extractors/
│   │   │   │   ├── schema-org.ts     # JSON-LD structured data
│   │   │   │   ├── open-graph.ts     # OG meta tags
│   │   │   │   ├── meta-tags.ts      # Standard meta tags
│   │   │   │   └── dom-parser.ts     # DOM heuristic fallback
│   │   │   └── adapters/             # Site-specific adapters
│   │   │       ├── amazon.ts
│   │   │       ├── walmart.ts
│   │   │       ├── target.ts
│   │   │       └── generic.ts
│   │   ├── affiliate/
│   │   │   ├── index.ts              # Affiliate link generator
│   │   │   ├── networks.ts           # Network configs
│   │   │   └── tracker.ts            # Click/conversion tracking
│   │   ├── email/
│   │   │   ├── client.ts             # Resend client
│   │   │   └── templates/
│   │   │       ├── welcome.tsx
│   │   │       ├── price-alert.tsx
│   │   │       ├── gift-claimed.tsx
│   │   │       └── weekly-digest.tsx
│   │   ├── inngest/
│   │   │   ├── client.ts             # Inngest client
│   │   │   └── functions/
│   │   │       ├── check-prices.ts   # Cron: price checking
│   │   │       ├── send-digest.ts    # Cron: weekly digest
│   │   │       ├── scrape-product.ts # Event: async scrape
│   │   │       └── process-alerts.ts # Event: price alert dispatch
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── url.ts               # URL parsing/validation
│   │   └── validators/
│   │       ├── wishlist.ts           # Zod schemas for wishlists
│   │       ├── item.ts              # Zod schemas for items
│   │       ├── registry.ts
│   │       └── user.ts
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-wishlists.ts
│   │   ├── use-items.ts
│   │   ├── use-user.ts
│   │   └── use-price-alerts.ts
│   ├── stores/                       # Zustand stores
│   │   ├── wishlist-store.ts
│   │   └── ui-store.ts
│   └── types/
│       ├── database.ts               # Generated from Prisma/Supabase
│       ├── api.ts                    # API request/response types
│       └── index.ts
├── extension/                        # Browser extension (separate build)
│   ├── manifest.json                 # Chrome Manifest V3
│   ├── src/
│   │   ├── content/                  # Content scripts
│   │   │   ├── detector.ts           # Product page detection
│   │   │   ├── extractor.ts          # Data extraction
│   │   │   └── overlay.tsx           # Save button UI overlay
│   │   ├── background/
│   │   │   └── service-worker.ts     # Background service worker
│   │   ├── popup/
│   │   │   ├── App.tsx               # Extension popup UI
│   │   │   └── index.html
│   │   └── shared/
│   │       ├── api.ts                # API client for WishlistCart
│   │       └── storage.ts            # Chrome storage helpers
│   ├── package.json
│   └── tsconfig.json
├── public/
│   ├── icons/                        # App icons, favicons
│   ├── images/                       # Static images
│   └── manifest.json                 # PWA manifest
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.local                        # Local env vars (gitignored)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── BUSINESS_PLAN.md
├── IMPLEMENTATION_PLAN.md            # This file
└── IDEAS.md
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Supabase requires direct connection for migrations
}

// ============================================================
// USER & AUTH
// ============================================================

model User {
  id              String    @id @default(uuid()) @db.Uuid
  email           String    @unique
  name            String?
  username        String?   @unique
  avatarUrl       String?   @map("avatar_url")
  bio             String?
  plan            Plan      @default(FREE)
  stripeCustomerId String?  @unique @map("stripe_customer_id")
  emailVerified   Boolean   @default(false) @map("email_verified")
  settings        Json      @default("{}")  // notifications, privacy, theme
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Relations
  wishlists       Wishlist[]
  items           WishlistItem[]      @relation("ItemOwner")
  purchasedItems  WishlistItem[]      @relation("ItemPurchaser")
  priceAlerts     PriceAlert[]
  reminders       OccasionReminder[]
  affiliateClicks AffiliateClick[]
  contributions   GroupGiftContribution[]
  notifications   Notification[]
  followers       Follow[]            @relation("Following")
  following       Follow[]            @relation("Follower")

  @@map("users")
}

enum Plan {
  FREE
  PRO
}

// ============================================================
// WISHLISTS & ITEMS
// ============================================================

model Wishlist {
  id            String          @id @default(uuid()) @db.Uuid
  userId        String          @map("user_id") @db.Uuid
  name          String
  slug          String
  description   String?
  type          WishlistType    @default(PERSONAL)
  coverImage    String?         @map("cover_image")
  privacy       Privacy         @default(PRIVATE)
  shareToken    String?         @unique @map("share_token")
  sharePassword String?         @map("share_password")  // hashed

  // Registry-specific fields
  eventType     EventType?      @map("event_type")
  eventDate     DateTime?       @map("event_date")
  eventLocation String?         @map("event_location")

  isArchived    Boolean         @default(false) @map("is_archived")
  position      Int             @default(0)

  createdAt     DateTime        @default(now()) @map("created_at")
  updatedAt     DateTime        @updatedAt @map("updated_at")

  // Relations
  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  items         WishlistItem[]
  cashFund      CashFund?

  @@unique([userId, slug])
  @@index([userId])
  @@index([shareToken])
  @@index([privacy])
  @@map("wishlists")
}

enum WishlistType {
  PERSONAL
  REGISTRY
  COLLABORATIVE
}

enum Privacy {
  PRIVATE
  SHARED      // accessible via share link only
  PUBLIC      // discoverable
}

enum EventType {
  WEDDING
  BABY_SHOWER
  BIRTHDAY
  HOLIDAY
  HOUSEWARMING
  GRADUATION
  ANNIVERSARY
  BACK_TO_SCHOOL
  CUSTOM
}

model WishlistItem {
  id              String    @id @default(uuid()) @db.Uuid
  wishlistId      String    @map("wishlist_id") @db.Uuid
  userId          String    @map("user_id") @db.Uuid  // who added it

  // Product data
  title           String
  description     String?
  url             String?                              // original product URL
  affiliateUrl    String?   @map("affiliate_url")
  storeName       String?   @map("store_name")
  storeDomain     String?   @map("store_domain")
  imageUrl        String?   @map("image_url")
  price           Decimal?  @db.Decimal(10, 2)
  currency        String    @default("USD")
  originalPrice   Decimal?  @map("original_price") @db.Decimal(10, 2)  // before sale

  // Organization
  priority        Int       @default(3)                // 1-5
  position        Int       @default(0)
  notes           String?                              // personal notes
  category        String?
  tags            String[]  @default([])

  // Gift coordination
  isPurchased     Boolean   @default(false) @map("is_purchased")
  purchasedBy     String?   @map("purchased_by") @db.Uuid
  purchasedAt     DateTime? @map("purchased_at")
  giftMessage     String?   @map("gift_message")
  isAnonymous     Boolean   @default(false) @map("is_anonymous")

  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Relations
  wishlist        Wishlist  @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  owner           User      @relation("ItemOwner", fields: [userId], references: [id])
  purchaser       User?     @relation("ItemPurchaser", fields: [purchasedBy], references: [id])
  priceHistory    PriceHistory[]
  priceAlerts     PriceAlert[]
  groupGiftPool   GroupGiftPool?
  affiliateClicks AffiliateClick[]

  @@index([wishlistId])
  @@index([userId])
  @@index([storeDomain])
  @@map("wishlist_items")
}

// ============================================================
// PRICE TRACKING
// ============================================================

model PriceHistory {
  id        String   @id @default(uuid()) @db.Uuid
  itemId    String   @map("item_id") @db.Uuid
  price     Decimal  @db.Decimal(10, 2)
  currency  String   @default("USD")
  checkedAt DateTime @default(now()) @map("checked_at")

  item      WishlistItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@index([itemId, checkedAt])
  @@map("price_history")
}

model PriceAlert {
  id            String        @id @default(uuid()) @db.Uuid
  userId        String        @map("user_id") @db.Uuid
  itemId        String        @map("item_id") @db.Uuid
  targetPrice   Decimal?      @map("target_price") @db.Decimal(10, 2)  // null = any drop
  alertType     AlertType     @default(ANY_DROP) @map("alert_type")
  isActive      Boolean       @default(true) @map("is_active")
  lastTriggered DateTime?     @map("last_triggered")
  createdAt     DateTime      @default(now()) @map("created_at")

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  item          WishlistItem  @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@unique([userId, itemId])
  @@map("price_alerts")
}

enum AlertType {
  ANY_DROP
  TARGET_PRICE
  PERCENTAGE_DROP
}

// ============================================================
// GROUP GIFTING & CASH FUNDS
// ============================================================

model GroupGiftPool {
  id              String        @id @default(uuid()) @db.Uuid
  itemId          String        @unique @map("item_id") @db.Uuid
  organizerId     String        @map("organizer_id") @db.Uuid
  goalAmount      Decimal       @map("goal_amount") @db.Decimal(10, 2)
  currentAmount   Decimal       @default(0) @map("current_amount") @db.Decimal(10, 2)
  deadline        DateTime?
  status          PoolStatus    @default(ACTIVE)
  createdAt       DateTime      @default(now()) @map("created_at")

  item            WishlistItem  @relation(fields: [itemId], references: [id], onDelete: Cascade)
  contributions   GroupGiftContribution[]

  @@map("group_gift_pools")
}

enum PoolStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

model GroupGiftContribution {
  id               String        @id @default(uuid()) @db.Uuid
  poolId           String        @map("pool_id") @db.Uuid
  contributorId    String?       @map("contributor_id") @db.Uuid  // null for guests
  contributorName  String        @map("contributor_name")
  contributorEmail String        @map("contributor_email")
  amount           Decimal       @db.Decimal(10, 2)
  message          String?
  isAnonymous      Boolean       @default(false) @map("is_anonymous")
  stripeChargeId   String?       @map("stripe_charge_id")
  createdAt        DateTime      @default(now()) @map("created_at")

  pool             GroupGiftPool @relation(fields: [poolId], references: [id], onDelete: Cascade)
  contributor      User?         @relation(fields: [contributorId], references: [id])

  @@map("group_gift_contributions")
}

model CashFund {
  id              String    @id @default(uuid()) @db.Uuid
  wishlistId      String    @unique @map("wishlist_id") @db.Uuid
  title           String                                          // "Honeymoon Fund"
  description     String?
  goalAmount      Decimal?  @map("goal_amount") @db.Decimal(10, 2)
  currentAmount   Decimal   @default(0) @map("current_amount") @db.Decimal(10, 2)
  isActive        Boolean   @default(true) @map("is_active")
  createdAt       DateTime  @default(now()) @map("created_at")

  wishlist        Wishlist  @relation(fields: [wishlistId], references: [id], onDelete: Cascade)

  @@map("cash_funds")
}

// ============================================================
// OCCASIONS & REMINDERS
// ============================================================

model OccasionReminder {
  id                  String    @id @default(uuid()) @db.Uuid
  userId              String    @map("user_id") @db.Uuid
  personName          String    @map("person_name")
  occasionType        String    @map("occasion_type")    // birthday, anniversary, custom
  date                DateTime
  isRecurring         Boolean   @default(true) @map("is_recurring")
  reminderDaysBefore  Int       @default(14) @map("reminder_days_before")
  linkedWishlistId    String?   @map("linked_wishlist_id") @db.Uuid
  createdAt           DateTime  @default(now()) @map("created_at")

  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("occasion_reminders")
}

// ============================================================
// SOCIAL
// ============================================================

model Follow {
  followerId  String   @map("follower_id") @db.Uuid
  followingId String   @map("following_id") @db.Uuid
  createdAt   DateTime @default(now()) @map("created_at")

  follower    User     @relation("Follower", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
  @@map("follows")
}

// ============================================================
// MONETIZATION & TRACKING
// ============================================================

model AffiliateClick {
  id               String    @id @default(uuid()) @db.Uuid
  itemId           String    @map("item_id") @db.Uuid
  userId           String?   @map("user_id") @db.Uuid    // null for anonymous visitors
  affiliateNetwork String    @map("affiliate_network")
  retailer         String
  clickedAt        DateTime  @default(now()) @map("clicked_at")
  converted        Boolean   @default(false)
  commissionAmount Decimal?  @map("commission_amount") @db.Decimal(10, 2)
  orderId          String?   @map("order_id")

  item             WishlistItem @relation(fields: [itemId], references: [id], onDelete: Cascade)
  user             User?        @relation(fields: [userId], references: [id])

  @@index([itemId])
  @@index([clickedAt])
  @@map("affiliate_clicks")
}

// ============================================================
// NOTIFICATIONS
// ============================================================

model Notification {
  id        String    @id @default(uuid()) @db.Uuid
  userId    String    @map("user_id") @db.Uuid
  type      String                                // price_drop, gift_claimed, reminder, etc.
  title     String
  body      String
  data      Json      @default("{}")              // arbitrary payload
  readAt    DateTime? @map("read_at")
  sentVia   String    @default("in_app") @map("sent_via")  // in_app, email, push
  createdAt DateTime  @default(now()) @map("created_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, readAt])
  @@index([userId, createdAt])
  @@map("notifications")
}
```

---

## API Design

All API routes live in `src/app/api/`. We use **Server Actions** for most mutations (simpler, no API route needed) and **API Routes** only for webhooks, external integrations, and the scraper.

### Server Actions (src/lib/actions/)

```
wishlists.ts
  ├── createWishlist(data)       → Wishlist
  ├── updateWishlist(id, data)   → Wishlist
  ├── deleteWishlist(id)         → void
  ├── archiveWishlist(id)        → void
  └── reorderWishlists(ids[])    → void

items.ts
  ├── addItem(wishlistId, data)  → WishlistItem
  ├── addItemByUrl(wishlistId, url) → WishlistItem  (triggers scrape)
  ├── updateItem(id, data)       → WishlistItem
  ├── deleteItem(id)             → void
  ├── moveItem(id, targetWishlistId) → void
  ├── claimItem(id, message?)    → void  (gift coordination)
  ├── unclaimItem(id)            → void
  └── reorderItems(ids[])        → void

sharing.ts
  ├── generateShareLink(wishlistId)   → { url, token }
  ├── revokeShareLink(wishlistId)     → void
  ├── setWishlistPrivacy(id, privacy) → void
  └── setSharePassword(id, password)  → void

alerts.ts
  ├── createPriceAlert(itemId, config) → PriceAlert
  ├── updatePriceAlert(id, config)     → PriceAlert
  ├── deletePriceAlert(id)             → void
  └── togglePriceAlert(id)             → void

profile.ts
  ├── updateProfile(data)        → User
  ├── updateSettings(data)       → User
  ├── setUsername(username)       → User
  └── deleteAccount()            → void
```

### API Routes (src/app/api/)

```
POST /api/scrape
  Body: { url: string }
  Response: { title, price, image, store, description }
  Auth: Required
  Purpose: Scrape product data from URL

GET  /api/affiliate/redirect?item={id}
  Response: 302 redirect to affiliate URL
  Auth: Optional (tracks if logged in)
  Purpose: Redirect through affiliate link with tracking

POST /api/webhooks/stripe
  Purpose: Handle Stripe events (subscription, payment)

POST /api/webhooks/inngest
  Purpose: Inngest event handler

GET  /api/og-image?title={}&items={}&type={}
  Purpose: Dynamic Open Graph images for shared wishlists
```

---

## Product Scraper Architecture

The scraper is the core differentiator. Multi-layer extraction with graceful fallbacks.

```
URL Input
    │
    ▼
┌─────────────────────────┐
│ 1. Check site adapter   │──→ Amazon, Walmart, Target have custom adapters
│    (site-specific)       │    using known DOM structure / APIs
└────────┬────────────────┘
         │ (no adapter match)
         ▼
┌─────────────────────────┐
│ 2. Schema.org JSON-LD   │──→ Parse <script type="application/ld+json">
│    extraction            │    Look for @type: "Product"
└────────┬────────────────┘
         │ (no structured data)
         ▼
┌─────────────────────────┐
│ 3. OpenGraph meta tags  │──→ Parse og:title, og:image, og:price:amount
│    extraction            │    product:price:amount, etc.
└────────┬────────────────┘
         │ (insufficient data)
         ▼
┌─────────────────────────┐
│ 4. Meta tag + heuristic │──→ <title>, meta description, first large image
│    DOM fallback          │    Price regex patterns in page content
└────────┬────────────────┘
         │ (still missing fields)
         ▼
┌─────────────────────────┐
│ 5. Manual entry fallback│──→ Return partial data, user fills in gaps
│    (always works)        │    Pre-fill what we found, editable form
└─────────────────────────┘
```

### Implementation

```typescript
// lib/scraper/index.ts - Orchestrator pattern

interface ScrapedProduct {
  title: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  storeName: string | null;
  storeDomain: string;
  url: string;
  confidence: number;  // 0-1, how confident we are in the data
}

async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  const domain = new URL(url).hostname;

  // Layer 1: Site-specific adapter
  const adapter = getAdapter(domain);
  if (adapter) {
    const result = await adapter.extract(url);
    if (result.confidence > 0.8) return result;
  }

  // Layer 2-4: Generic multi-layer extraction
  const html = await fetchPage(url);

  const schemaOrg = extractSchemaOrg(html);
  if (schemaOrg.confidence > 0.7) return merge(schemaOrg, { storeDomain: domain, url });

  const openGraph = extractOpenGraph(html);
  if (openGraph.confidence > 0.5) return merge(openGraph, { storeDomain: domain, url });

  const heuristic = extractHeuristic(html);
  return merge(heuristic, { storeDomain: domain, url });
}
```

### Rate Limiting & Caching

- Cache scraped results in Upstash Redis (1 hour TTL for same URL)
- Rate limit: 10 scrapes/minute per user (free), 30/minute (pro)
- Use headless fetch for most sites; Puppeteer (via Browserless.io) only for JS-rendered SPAs
- Queue heavy scrapes through Inngest to avoid API route timeouts

---

## Background Jobs (Inngest)

```typescript
// lib/inngest/functions/check-prices.ts

// Runs every 6 hours for free users, every 1 hour for pro
export const checkPrices = inngest.createFunction(
  { id: "check-prices", name: "Check Item Prices" },
  { cron: "0 */6 * * *" },  // every 6 hours
  async ({ step }) => {
    // Batch process items that need price checking
    const items = await step.run("get-items-to-check", async () => {
      return prisma.wishlistItem.findMany({
        where: {
          url: { not: null },
          wishlist: { isArchived: false },
        },
        include: { priceAlerts: { where: { isActive: true } } },
        orderBy: { updatedAt: "asc" },
        take: 500,  // process in batches
      });
    });

    // Check each item (with concurrency limit)
    for (const item of items) {
      await step.run(`check-${item.id}`, async () => {
        const currentPrice = await scrapePrice(item.url!);
        if (currentPrice === null) return;

        // Record price history
        await prisma.priceHistory.create({
          data: { itemId: item.id, price: currentPrice },
        });

        // Update item price
        await prisma.wishlistItem.update({
          where: { id: item.id },
          data: { price: currentPrice },
        });

        // Check alerts
        for (const alert of item.priceAlerts) {
          if (shouldTriggerAlert(alert, item.price, currentPrice)) {
            await inngest.send({
              name: "app/price-alert.triggered",
              data: { alertId: alert.id, oldPrice: item.price, newPrice: currentPrice },
            });
          }
        }
      });
    }
  }
);
```

### Job Schedule

| Job | Schedule | Description |
|-----|----------|-------------|
| `check-prices` | Every 6h (free) / 1h (pro) | Re-scrape prices, record history, trigger alerts |
| `send-weekly-digest` | Monday 9am | Weekly summary email of price changes + activity |
| `cleanup-expired-shares` | Daily midnight | Remove expired share links |
| `aggregate-analytics` | Daily 2am | Aggregate affiliate clicks, popular items |
| `send-occasion-reminders` | Daily 8am | Check upcoming occasions, send reminders |

---

## Affiliate Link System

```
User clicks "Buy" on item
        │
        ▼
GET /api/affiliate/redirect?item={itemId}
        │
        ▼
┌──────────────────────────┐
│ 1. Look up item          │
│ 2. Determine store       │
│ 3. Find affiliate network│
│    for that store         │
│ 4. Generate affiliate URL│
│ 5. Log click to DB       │
│ 6. 302 redirect to store │
└──────────────────────────┘
```

### Network Priority

```typescript
// lib/affiliate/networks.ts

const AFFILIATE_CONFIG: Record<string, AffiliateNetwork> = {
  "amazon.com":     { network: "amazon-associates", tag: "wishlistcart-20" },
  "walmart.com":    { network: "impact",    campaignId: "..." },
  "target.com":     { network: "impact",    campaignId: "..." },
  "bestbuy.com":    { network: "cj",        websiteId: "..." },
  "etsy.com":       { network: "awin",      publisherId: "..." },
  // ... add more as we onboard
};

// Fallback: For stores not in our network, link directly (no commission)
// Over time, add more networks to increase monetizable percentage
```

**Note on Amazon PA-API**: Requires 10 qualifying sales in 30 days before API access. Start with Amazon Associates tag links (append `?tag=wishlistcart-20`), upgrade to PA-API once threshold met.

---

## Phase-by-Phase Implementation

> **Tracking**: Use `[x]` for completed, `[~]` for in-progress, `[ ]` for not started.
> Update this tracker as you finish each deliverable.

### Last Session Summary
> **Date**: March 2026 | **PHASE 1 ✅ | PHASE 2 ✅ | PHASE 3 ✅ | PHASE 4 ✅ | PHASE 5 ✅ — ALL COMPLETE**
>
> **Phase 3 Weeks 25–28**: Public profiles, follow/unfollow, activity feed, explore page, gift finder quiz.
>
> **Phase 3 Weeks 29–32**: PWA (manifest + service worker + install prompt), Search (API + page + SearchBar),
> 40 gift guides (34 persona + 6 budget), gift finder quiz.
>
> **Phase 3 Weeks 33–36**: Creator Program — application flow, analytics dashboard (views/clicks/earnings),
> Stripe Connect Express accounts, 70/30 revenue share, payout flow.
>
> **Phase 4 Weeks 37–52 COMPLETE** — Admin dashboard, push notifications, PWA share target, 50 gift guides,
> 3 SEO blog posts, corporate landing page, classroom wishlist, CORPORATE Stripe plan, registry SEO schemas.
>
> **Phase 5 COMPLETE** — Referral program, onboarding wizard, dashboard improvements, React Email templates,
> profile settings, explore improvements, landing page polish, pricing FAQ, 6 new blog posts, welcome email,
> notification bell + /dashboard/notifications page, gift finder markdown rendering, item quantity field,
> multi-currency price display (10 currencies), ANTHROPIC_API_KEY + STRIPE_CORPORATE_PRICE_ID wired.
>
> **Phase 6 DEFINED** (March 2026) — Ecosystem expansion: Browser Extension (Wks 53–56), AI Gift Concierge
> (Wks 57–60), B2B Embeddable Widget (Wks 61–64), Marketplace MVP (Wks 65–68), Advanced Analytics (Wks 69–72),
> Partner Integrations & Public API (Wks 73–76). **Starting Phase 6 — Weeks 53–56 (Browser Extension).**

### Phase Progress Tracker

#### PHASE 5 — Monetization Scale & Polish (COMPLETE ✅)

**Referral & Onboarding**
- [x] Referral program (`/dashboard/referrals`, `ReferralCode` schema, `applyReferralCode` action)
- [x] Inngest `handleReferral`: FREE→PRO upgrade, referral-reward email, in-app notification
- [x] Onboarding wizard (`/onboarding` — 4-step: profile, wishlist, interests, done)
- [x] Dashboard home: quick stats (wishlists/items/alerts), recent activity feed, quick actions grid, 7-day welcome banner

**Email & Notifications**
- [x] 9 React Email templates (`src/emails/`) — welcome, price-drop, gift-claimed, weekly-digest, reminder, referral-reward, registry-invite, rsvp-notification, base-layout
- [x] Welcome email fired on signup (fire-and-forget via Resend in `auth.ts`)
- [x] Notification bell in topbar (`src/components/layout/notification-bell.tsx`) — unread count badge
- [x] `/dashboard/notifications` page — unread/read sections, mark-as-read on click, mark-all-read button
- [x] `src/lib/actions/notifications-list.ts` — getNotifications, markNotificationRead, markAllNotificationsRead

**Profile & Social Polish**
- [x] Profile settings form: avatar upload, display name, username, bio (`src/lib/actions/profile.ts`)
- [x] Explore page improvements: CTA banner, category pills, registry section, wishlist count

**Landing & Marketing**
- [x] Landing page: store pills, testimonials, stats (10K+/50K+), decorative numerals, two-button CTA
- [x] Pricing page: monthly/yearly toggle (20% off), FAQ section, FAQPage JSON-LD
- [x] 6 new blog posts: how-to, gift-ideas, registry-apps, wedding, baby, price-tracking

**SEO Cross-linking**
- [x] 33 RELATED_GUIDES across gift guide pages for cross-linking

**Item & UI Improvements**
- [x] Item quantity field: `WishlistItem.quantity` (Int, default 1, max 99) — dialogs + `×N` card badge
- [x] Gift finder markdown renderer: bold text, numbered list badges, paragraph breaks (no new packages)
- [x] Multi-currency: 10 currencies in Add/Edit dialogs (USD/EUR/GBP/CAD/AUD/JPY/INR/MXN/BRL/CHF), shared `formatPrice(amount, currency)` everywhere

**Infrastructure**
- [x] `STRIPE_CORPORATE_PRICE_ID` added to Vercel env
- [x] `ANTHROPIC_API_KEY` added to Vercel env
- [x] Gift finder route: lazy Anthropic client init (fixes 405 when key missing)
- [x] `date-fns` installed for `formatDistanceToNow` in notification items

---

#### PHASE 6 — Ecosystem Expansion (Weeks 53–76)

> **Goal**: Open new revenue streams — B2B widget, enhanced AI, browser extension, marketplace MVP, and partner integrations.

---

**Weeks 53–56: Browser Extension (Deferred from Phase 1)**
- [x] Chrome extension: "Add to WishlistCart" button on any product page
- [x] Extension popup: select target wishlist, set quantity/priority/note
- [x] Extension background script: calls `/api/scrape` with active tab URL
- [x] Extension auth: uses existing Supabase session (shared cookie domain)
- [x] `public/extension/` build output — `manifest.json` v3, background service worker
- [ ] Submit to Chrome Web Store ($5 one-time dev fee)
- [ ] Firefox extension (WebExtension API compatible)
- [x] Extension landing page at `/browser-extension` (install CTA + demo GIF)

**Weeks 57–60: AI Gift Concierge**
- [x] `/gift-concierge` page — conversational AI gift advisor (Anthropic streaming)
- [x] `src/app/api/gift-concierge/route.ts` — POST, streams Claude response
- [x] Multi-turn chat UI: `src/components/gift-concierge/chat.tsx` (message history, typing indicator)
- [x] Budget + recipient + occasion inputs → personalized product recommendations
- [x] "Save to Wishlist" button on each AI-recommended item
- [x] Concierge history: last 5 sessions stored in `User.settings.conciergeHistory` (Json)
- [x] Pro gate: unlimited sessions; Free: 3/month (tracked via `ConciergeSession` model)
- [x] Sidebar nav item: Concierge (Sparkles icon)

**Weeks 61–64: B2B Embeddable Widget**
- [x] `WishlistWidget` Prisma model: `id`, `userId`, `name`, `allowedDomains` (String[]), `apiKey`, `createdAt`
- [x] `src/lib/actions/widget.ts`: `createWidget`, `updateWidget`, `deleteWidget`, `rotateApiKey`
- [x] `/dashboard/widget` — widget management dashboard (create, configure, embed code)
- [x] `/api/widget/[apiKey]/wishlists` — public API: returns user's public wishlists (CORS-enabled)
- [x] `/api/widget/[apiKey]/add-item` — POST: add item to wishlist from external site
- [x] Embed snippet: `<script src="https://wishlistcart.com/widget.js" data-key="..."></script>`
- [x] `public/widget.js` — vanilla JS widget (no framework deps, < 10 KB gzipped)
- [x] Widget UI: floating "Add to WishlistCart" button + popover with wishlist select
- [x] API key shown once on creation, stored as bcrypt hash
- [x] `/widget-docs` marketing page — integration guide, code examples, pricing

**Weeks 65–68: Marketplace MVP**
- [x] `MarketplaceProduct` model: `id`, `title`, `description`, `price`, `currency`, `imageUrl`, `storeUrl`, `tags` (String[]), `category`, `isFeatured`, `createdAt`
- [x] `/marketplace` page — curated product discovery grid (filter by category, price range)
- [x] `src/lib/actions/marketplace.ts`: `getMarketplaceProducts`, `searchMarketplace`
- [x] Admin: `addMarketplaceProduct`, `featureProduct` — admin-only actions
- [x] "Add to Wishlist" from marketplace → AddItemDialog pre-filled
- [x] Marketplace categories: Home, Tech, Fashion, Beauty, Kids, Books, Sports, Food
- [x] Marketplace items link through `/api/affiliate/redirect` for commission tracking
- [x] SEO: `/marketplace/[category]` pages with static generation + metadata
- [x] Sitemap updated with all marketplace category pages

**Weeks 69–72: Advanced Analytics (Pro)**
- [x] `src/app/(app)/dashboard/analytics/page.tsx` — Pro-gated analytics hub
- [x] Wishlist view tracking: chart (7d/30d/90d), top wishlists by views
- [x] Affiliate click analytics: clicks per item, conversion estimate, top earners
- [x] Gift claim analytics: most-gifted items, claim rate per wishlist
- [x] Referral funnel: referral clicks → signups → conversions
- [x] CSV export: all analytics data as downloadable CSV
- [x] `src/lib/queries/analytics.ts` — aggregate queries with Prisma groupBy
- [x] Weekly analytics digest email (Pro only) — new Resend template

**Weeks 73–76: Partner Integrations & API**
- [x] Public REST API: `/api/v1/` — authenticated with user API keys
- [x] API key management: `ApiKey` model, `/dashboard/api-keys` page (create/revoke)
- [x] `/api/v1/wishlists` — GET (list), POST (create)
- [x] `/api/v1/wishlists/[id]/items` — GET (list), POST (add item)
- [x] `/api/v1/me` — GET current user profile
- [x] Rate limiting: 100 req/min (Free), 1000 req/min (Pro) via Upstash Redis
- [x] API docs page: `/developers` — OpenAPI spec viewer (Scalar or Redoc)
- [x] `openapi.yaml` in `public/` — machine-readable API spec
- [x] Zapier integration guide (webhook triggers: item-added, gift-claimed)
- [x] Partnership outreach page: `/partners` — embed + API CTAs for e-commerce stores

---

#### PHASE 1A — Foundation & MVP Core (Weeks 1–6)

**Week 1: Project Bootstrap**
- [x] Project created with Next.js 15, TypeScript, Tailwind, App Router
- [x] Prisma initialized and schema written (12 models, Prisma 7 config)
- [x] Supabase project configured (Auth: email/password — Google OAuth TBD)
- [x] shadcn/ui initialized and base components installed
- [x] Environment variables configured (.env.local + Vercel env vars)
- [x] GitHub repo created, Vercel project linked
- [x] ESLint + Prettier configured
- [x] Database migrated from Supabase Postgres to Vercel Prisma Postgres + Accelerate
- [x] First deploy verified (live at wishlistcart.com)
- [x] Login page built (email + Google OAuth)
- [x] Signup page built
- [x] Password reset flow built
- [x] Root layout created (fonts, metadata, Toaster)
- [x] Auth middleware (protected routes, redirect logic)
- [x] All route directories scaffolded
- [x] Marketing layout + app layout (sidebar) created
- [x] Mobile responsive navigation (hamburger menu)

**Week 2: Wishlist CRUD**
- [x] Dashboard page (grid of wishlist cards)
- [x] Create Wishlist dialog (name, description, privacy, occasion type)
- [x] Wishlist detail page (items + empty state)
- [x] Edit wishlist settings (full page with edit form, share section, danger zone)
- [x] Delete wishlist (server action)
- [x] Archive/unarchive wishlist (server action)
- [x] Server Actions for all wishlist mutations
- [x] Manual Add Item dialog (title, price, currency, URL, store, image, priority, notes)
- [x] Item card component (grid + list view, buy link, delete)
- [x] Grid + List view toggle
- [x] Delete item
- [x] Edit item (dialog with full pre-fill — done Week 5)
- [x] Drag-and-drop reorder (dnd-kit — wired with SortableItemCard)
- [x] Empty states + toast notifications

**Week 3: URL Scraper & Auto-Add**
- [x] POST /api/scrape route (accepts URL, returns product data)
- [x] Schema.org / JSON-LD extractor
- [x] OpenGraph meta tag extractor
- [x] Standard meta tag extractor
- [x] DOM heuristic fallback extractor
- [x] Amazon adapter (handle auth walls + ASINs)
- [ ] Walmart adapter (skipped — generic adapter handles it)
- [ ] Target adapter (skipped — generic adapter handles it)
- [x] Generic adapter (store name from hostname)
- [x] Scraper orchestrator (confidence scoring, extractor priority)
- [x] URL paste field in Add Item dialog (auto-populate form)
- [x] Product preview card before saving
- [ ] Image proxy/storage (save to Supabase Storage) — deferred to Phase 1B
- [x] SSRF protection on URL input

**Week 4: Sharing & Gift Coordination**
- [x] Share token generation (nanoid, stored on wishlist)
- [x] Privacy controls: PRIVATE / SHARED / PUBLIC
- [x] Public wishlist page (SSR) at /@username/[slug]
- [x] Share dialog (copy link, make public — no QR code yet)
- [x] Gift-giver view of shared wishlist (PublicItemGrid)
- [x] Claim item action (for gift-givers, no auth required)
- [x] Unclaim item action (requires auth + ownership)
- [x] Surprise mode: owner cannot see claim data (enforced at query level)
- [x] Anonymous claiming support
- [x] "Already claimed" indicator (visible to non-owner)

**Week 5: Affiliate Integration**
- [x] /api/affiliate/redirect route (item ID → affiliate URL → 302)
- [x] Amazon Associates tag integration
- [x] URL rewriting at item save time (buildAffiliateUrl)
- [x] Affiliate click logging (AffiliateClick table)
- [x] All "Buy Now" / "Buy" links routed through affiliate redirect — wired in item-card
- [ ] Walmart / Target / Best Buy affiliate tags (env vars ready, tags TBD)

**Week 5 extras (done this session)**
- [x] Edit item dialog (pre-filled form, updateItem server action)
- [x] Wishlist settings page (edit form + share section + danger zone)

**Week 6: Beta Launch Prep**
- [x] Landing page (hero, features, how it works, CTA) — basic version from Week 1
- [x] Landing page polish (How It Works, Social Proof, Features grid, CTAs)
- [x] Pricing page (Free vs Pro, FAQ section)
- [x] robots.txt + sitemap.ts
- [x] Metadata API on all pages (title, description, OG, Twitter) — root + app layouts + auth pages + public wishlist
- [x] Dynamic OG image implementation (next/og, edge runtime, title/subtitle/items params)
- [x] Organization JSON-LD schema on homepage
- [x] Core Web Vitals ≥ 90 (Lighthouse) — 100/100 mobile & desktop confirmed
- [x] Sentry error monitoring configured (SDK + instrumentation + global-error + tunnel route)
- [x] PostHog analytics configured (provider + pageview tracking)
- [x] Beta: open signup (no invite system needed for launch)

---

#### PHASE 1B — Price Intelligence & Extension (Weeks 7–12)

**Week 7–8: Price Tracking Engine**
- [x] Inngest configured (webhook route + serve handler at /api/inngest)
- [x] Price checker job (cron every 6h, batch processing, per-item steps)
- [x] PriceHistory records created on every check
- [x] Current price updated on WishlistItem
- [x] Price history chart component (Recharts line chart)
- [x] "Lowest price" and "Highest price" badges (shown in item-detail-sheet)
- [x] Deal score calculation
- [x] Price alert creation UI (ANY_DROP / TARGET_PRICE / PERCENTAGE_DROP)
- [x] /dashboard/price-alerts management page
- [x] Inngest function: process-alerts on price change
- [x] Email notification for triggered alerts (Resend)
- [x] In-app notification for triggered alerts
- [x] Weekly price digest email (Resend + Inngest cron — Monday 9am)
- [x] Sale detection (flag where price < original_price — shown as "Price drop" badge in item-detail-sheet)

**Week 9–10: Browser Extension**
- [ ] Extension directory setup (Manifest V3, TypeScript, Vite build)
- [ ] Content script: product page detection
- [ ] Content script: data extraction (Schema.org + OG + heuristic)
- [ ] Save button overlay on product pages
- [ ] Extension popup (wishlist selector + save)
- [ ] Auth via supabase-js in extension
- [ ] Chrome Web Store submission

**Week 11: Premium Subscription**
- [x] Stripe Customer created on user signup (lazy — on first checkout)
- [x] Subscription checkout (Stripe hosted checkout via createCheckoutSession)
- [x] /api/webhooks/stripe handler (checkout.session.completed, subscription.updated/deleted)
- [x] isPro flag set on user in DB via webhook
- [x] /dashboard/settings page (profile + billing tabs, upgrade CTA, manage billing portal)
- [x] Pro feature gates (price alerts, extension, price history)
- [x] Free tier limits enforced (3 wishlists max on Free, price alerts require Pro)

**Week 12: Public Launch**
- [x] 9 gift guide pages (/gift-ideas/for/[person]) — mom, dad, wife, husband, boyfriend, girlfriend, kids, teens, coworker
- [x] 3 budget gift guide pages (/gift-ideas/under/[price]) — $25, $50, $100
- [x] ItemList schema on gift guides
- [x] FAQPage schema on guides
- [x] ProductHunt launch prepared (see PRODUCTHUNT_LAUNCH.md)
- [x] Launch blog post (wishlistcart.com/blog/introducing-wishlistcart)
- [x] Monitoring all green (Sentry, Vercel) — verified

---

#### PHASE 2 — Gift Registries & Group Gifting (Weeks 13–24)

**Weeks 13–16: Event Registries**
- [x] Registry creation flow (event type, date, location, privacy — full page + dialog)
- [x] Registry public page (SSR at /registry/[shareToken] — beautiful event header, countdown, categorized items, claim flow)
- [x] Registry dashboard (owner view with purchased/remaining stats, items grouped by category)
- [x] Registry-specific sharing (share URL with copy button, shareToken auto-generated on create)
- [x] Multi-category organization (items grouped by category field, General as fallback)
- [x] Thank-you tracker (localStorage-based checklist for purchased items on owner dashboard)
- [x] RSVP form integration (on public registry page, sends email to registry owner via Resend)
- [x] Email invite (InviteDialog on owner dashboard, sends invite emails via Resend)
- [x] QR code for registry share (QrShare component with download link, shown in share section)
- [x] Registry settings page (edit name/event details + archive/delete danger zone)

**Weeks 17–20: Group Gifting & Cash Funds**
- [x] Group gift pool creation on item (StartPoolDialog, auto-sets goal to item price)
- [x] Contribution checkout flow (Stripe Payment mode, no Stripe Connect needed for v1)
- [x] Pool progress indicator (PoolStatusCard on owner dashboard)
- [x] Public pool contribution page (/gift-pool/[poolId]) with ContributionForm
- [x] Stripe webhook extended to record GroupGiftContribution, auto-complete pool on goal reached
- [x] Cash fund creation (CreateCashFundDialog — honeymoon fund, etc.)
- [x] Cash fund page + contribution flow (/cash-fund/[fundId])
- [x] Cash fund card on public registry page and owner dashboard
- [ ] Stripe Connect / automated payouts (deferred — handled manually for v1)

**Weeks 21–24: Occasion System**
- [x] OccasionReminder creation (birthday, anniversary, custom — stored in occasionType field)
- [x] /dashboard/reminders page (AddReminderDialog, ReminderList with countdown badges + delete)
- [x] Inngest cron: send-occasion-reminders (daily 9am UTC, matches daysUntil === reminderDaysBefore)
- [x] Gift history (/dashboard/gift-history — items where purchasedBy === user.id, grouped by month)
- [x] Gift History + Reminders nav links added to sidebar + mobile nav
- [ ] Firefox + Safari extension ports (deferred — separate build)

---

#### PHASE 3 — Social & Community (Weeks 25–36)

**Weeks 25–28: Social Features**
- [x] Public user profile pages (/@username) — avatar, bio, follow counts, FollowButton, public wishlists grid
- [x] Follow/unfollow system — followUser/unfollowUser server actions, Follow model composite PK
- [x] Activity feed (/dashboard/feed) — recent public wishlists from followed users
- [x] Explore page (/explore) — all recent public wishlists, 2×2 previews, owner chip
- [x] Feed + Explore nav links added to sidebar + mobile nav (Rss + Compass icons)
- [ ] Like/heart items on shared wishlists — deferred (no schema model)
- [ ] Comments on items — deferred (no schema model)
- [ ] Collaborative wishlists (multi-editor with permissions) — deferred (no schema model)

**Weeks 29–32: Discovery & Content**
- [x] Curated gift guides (staff + community) — 40 pages (34 person + 6 budget)
- [x] Gift finder quiz (AI-powered, Claude API) — /gift-finder page + /api/gift-finder
- [x] 50+ gift guide pages covering all key personas
- [x] PWA support (manifest.json + service worker + install prompt)
- [x] Search — GET /api/search, /search page (tabs: All/Wishlists/People), SearchBar in header + sidebar

**Weeks 33–36: Creator Program**
- [x] Creator application flow — apply form, hub page (4 states), CreatorBadge on profiles
- [x] Creator analytics dashboard — WishlistView tracking, views/clicks chart, earnings table
- [x] Revenue sharing via Stripe Connect — Express accounts, 70/30 split, payout flow

---

#### PHASE 4 — Scale & Expand (Weeks 37–52)

**Weeks 37–40: Admin Dashboard & Operations**
- [x] Admin dashboard (/dashboard/admin) — user growth, revenue overview, affiliate stats
- [x] Creator application review queue — approve/reject with note
- [x] Affiliate performance breakdown (clicks, conversions, revenue by retailer)
- [x] System health panel (env var status, DB row counts)

**Weeks 41–44: Push Notifications & PWA Enhancements**
- [x] Web push notifications (service worker PushManager API, web-push, VAPID)
- [x] Push notification types: item claimed, price drop, new follower, reminder (preferences)
- [x] PWA share target (manifest share_target → /add-item → /dashboard/wishlists?addUrl=)
- [x] Notification preferences page — 7 toggles (email + push per type)

**Weeks 45–48: SEO Occasion Guides & Content Expansion**
- [x] Occasion gift guides: wedding, baby-shower, birthday, christmas, valentines-day, mothers-day, fathers-day, graduation, housewarming, anniversary — total 50 guides
- [x] Registry SEO: public registry pages fully indexed (sitemap + schema)
- [x] 2-4 new blog posts (wedding registry checklist, baby registry guide, price tracking tips)
- [ ] Internal linking strategy between gift guides and feature pages

**Weeks 49–52: Corporate Gifting & B2B**
- [x] Corporate gifting landing page (/corporate)
- [x] Corporate plan Stripe tier + feature gates (CORPORATE Plan enum, createCorporateCheckoutSession)
- [x] Teacher/classroom wishlist templates (/classroom-wishlist SEO page)
- [ ] Bulk wishlist creation for teams (corporate plan — admin UI)
- [ ] B2B wishlist widget API (embeddable on partner sites)

---

### PHASE 1A: Foundation & MVP Core (Weeks 1-6)

**Goal**: Ship a working product - users can save items, organize wishlists, share them, and we earn affiliate revenue.

#### Week 1: Project Bootstrap

```
Day 1-2: Project setup
├── npx create-next-app@latest wishlistcart --typescript --tailwind --app --src-dir
├── Initialize Prisma: npx prisma init
├── Configure Supabase project (create via dashboard)
├── Setup shadcn/ui: npx shadcn@latest init
├── Configure environment variables (.env.local)
├── Create GitHub repo, connect to Vercel
├── Setup ESLint + Prettier config
└── First deploy to verify pipeline works

Day 3-4: Database & Auth
├── Write Prisma schema (User, Wishlist, WishlistItem tables only for now)
├── Run first migration: npx prisma migrate dev
├── Setup Supabase Auth (enable Google OAuth + email/password)
├── Create auth helper files (lib/supabase/client.ts, server.ts)
├── Create middleware.ts for auth session refresh
├── Build login page (email + Google OAuth button)
├── Build signup page
└── Build password reset flow

Day 5: Layout & Navigation
├── Root layout with font loading, metadata
├── Marketing layout (header with logo + Login/Signup buttons, footer)
├── App layout (sidebar nav, top bar with user menu)
├── Mobile responsive navigation (hamburger menu)
└── Auth-guarded layout wrapper (redirect if not logged in)
```

**Deliverables**: Deployed app with auth working, user can sign up/in, see empty dashboard.

#### Week 2: Wishlist CRUD

```
Day 1-2: Wishlist management
├── Dashboard page showing all wishlists (grid of cards)
├── "Create Wishlist" dialog/page
│   ├── Name, description, privacy selector
│   ├── Auto-generate slug from name
│   └── Cover image upload (Supabase Storage)
├── Wishlist detail page (shows items, empty state)
├── Edit wishlist settings (name, description, privacy)
├── Delete wishlist (with confirmation)
├── Archive/unarchive wishlist
└── Server Actions for all mutations (lib/actions/wishlists.ts)

Day 3-4: Item management (manual add)
├── "Add Item" dialog within wishlist
│   ├── Manual form: title, price, image URL, link, notes, priority
│   ├── Image preview on URL input
│   └── Zod validation on all fields
├── Item card component (image, title, price, store, priority badge)
├── Grid view + List view toggle
├── Edit item (inline or dialog)
├── Delete item (with confirmation)
├── Drag-and-drop reorder (using @dnd-kit/sortable)
└── Sort items by: price, date added, priority, store

Day 5: Polish
├── Empty states with illustrations/CTAs
├── Loading skeletons for all data-fetching pages
├── Toast notifications for actions (sonner)
├── Breadcrumb navigation
└── Basic error boundaries
```

**Deliverables**: Full wishlist CRUD with manual item entry, sorting, two view modes.

#### Week 3: URL Scraper & Auto-Add

```
Day 1-3: Product scraper
├── API route: POST /api/scrape
├── Schema.org JSON-LD extractor
├── OpenGraph meta tag extractor
├── Generic meta tag + heuristic fallback
├── Site-specific adapters: Amazon, Walmart, Target (top 3)
├── Merge logic: combine results from multiple extractors
├── Confidence scoring
├── Redis caching for repeated URLs (1hr TTL)
├── Rate limiting (Upstash, 10/min per user)
└── Error handling: return partial data on failure

Day 4: "Add by URL" flow
├── URL input field at top of wishlist (paste or type)
├── Loading state while scraping (skeleton card appears)
├── Preview scraped data before adding
├── Allow user to edit any field before confirming
├── Handle failures gracefully (fallback to manual form pre-filled)
└── Store original URL + scraped data

Day 5: Image handling
├── Download and store product images in Supabase Storage
│   (so they persist even if retailer changes image URL)
├── Image optimization (Next.js Image component)
├── Fallback placeholder for missing images
└── Image proxy for external URLs (avoid mixed content)
```

**Deliverables**: Users can paste any product URL and have it auto-extracted. Top 3 stores have custom adapters.

#### Week 4: Sharing & Gift Coordination

```
Day 1-2: Share system
├── Generate unique share token per wishlist
├── Share link generation: wishlistcart.com/@username/wishlist-slug
├── Public wishlist page (SSR for SEO + social previews)
│   ├── Product grid (read-only for visitors)
│   ├── List owner info (avatar, name)
│   ├── "Create your own wishlist" CTA for non-users
│   └── Proper meta tags + Open Graph for link previews
├── Share dialog component
│   ├── Copy link button
│   ├── QR code generation (using qrcode library)
│   ├── Share to: WhatsApp, Email, Twitter/X, Facebook
│   └── Privacy toggle (private/shared/public)
├── Password-protected sharing (optional)
└── Revoke share link

Day 3-4: Gift coordination
├── "I'm Buying This" button (visible to non-owners only)
│   ├── Mark item as claimed with optional message
│   ├── Claimed status visible to OTHER gift-givers
│   ├── HIDDEN from wishlist owner (surprise mode)
│   └── Unclaim if plans change
├── Anonymous gifting option
├── "Purchased" confirmation step
├── Visual indicators: claimed badge, purchased badge
└── Wishlist owner's registry dashboard (post-event):
    └── See all gifts received, who gave what, thank-you status

Day 5: Notifications
├── In-app notification system
│   ├── Notification bell in header
│   ├── Notification list dropdown
│   ├── Mark as read
│   └── Notification types: item_claimed, wishlist_shared
├── Email notifications (via Resend)
│   ├── "Someone claimed an item from your wishlist"
│   ├── "You've been shared a wishlist"
│   └── Welcome email on signup
└── User notification preferences (settings page)
```

**Deliverables**: Wishlists can be shared via link, gift-givers can claim items without owner seeing.

#### Week 5: Affiliate Integration & Monetization

```
Day 1-2: Affiliate links
├── Affiliate config file (store domain → network + ID mapping)
├── API route: GET /api/affiliate/redirect?item={id}
│   ├── Look up item → determine store → generate affiliate URL
│   ├── Log click to affiliate_clicks table
│   ├── 302 redirect to retailer
│   └── Handle unknown stores (direct link, no commission)
├── "Buy" / "View at Store" button on every item
│   └── Routes through affiliate redirect
├── Apply Amazon Associates tag to all Amazon links
├── Setup ShareASale account + get approved for merchants
└── Setup Impact account

Day 3: Affiliate tracking dashboard (admin)
├── Simple admin page: /dashboard/admin (owner-only)
├── Total clicks, clicks by store, clicks by day
├── Conversion tracking (manual for now, webhook later)
└── Revenue estimates

Day 4-5: SEO & Landing page
├── Landing page with:
│   ├── Hero section: tagline + screenshot + CTA
│   ├── Feature highlights (3-4 key features)
│   ├── How it works (3 steps)
│   ├── Social proof placeholder
│   ├── Pricing preview (free vs pro)
│   └── Final CTA
├── Sitemap.xml generation (next-sitemap)
├── robots.txt
├── Structured data (Organization, WebSite)
├── Meta tags for all pages
└── Open Graph images (dynamic via /api/og-image)
```

**Deliverables**: Every "Buy" click generates potential affiliate revenue. Professional landing page.

#### Week 6: Beta Launch Prep

```
Day 1-2: Polish & bug fixes
├── End-to-end testing of complete user flow
├── Mobile responsiveness audit (every page)
├── Performance audit (Lighthouse, Core Web Vitals)
├── Fix all critical/high-priority bugs
├── Loading states everywhere
└── Error handling for edge cases

Day 3: Onboarding
├── First-time user onboarding flow
│   ├── "Create your first wishlist" prompt
│   ├── Quick tutorial tooltip tour (optional)
│   └── Example wishlist with sample items
├── Username selection on first login
└── Profile completion prompt

Day 4: Monitoring & analytics
├── Sentry setup (error tracking)
├── PostHog setup (product analytics)
│   ├── Track: signup, create_wishlist, add_item, share, buy_click
├── Uptime monitoring (betterstack or similar free tool)
└── Basic health check endpoint

Day 5: Soft launch
├── Deploy final build
├── Test with 10-20 beta users (friends, family, communities)
├── Collect feedback
├── Create feedback form / email
└── Fix critical issues from beta
```

**Phase 1A Complete Deliverables**:
- Working web app: signup, create wishlists, add items by URL, share, gift coordination
- Product scraping from any URL (top stores have custom adapters)
- Affiliate revenue on every purchase click
- Mobile-responsive, SEO-optimized
- Deployed on Vercel, database on Supabase

---

### PHASE 1B: Price Intelligence & Extension (Weeks 7-12)

#### Week 7-8: Price Tracking Engine

```
Week 7:
├── Inngest setup + webhook route
├── Price checker job (cron every 6 hours)
│   ├── Fetch current price for tracked items
│   ├── Store in price_history table
│   ├── Update current price on item
│   └── Batch processing with concurrency limits
├── Price history chart component (Recharts or Chart.js)
│   └── Show on item detail/hover: price over time
├── "Lowest price" and "Highest price" badges
└── Deal score calculation (current vs average vs lowest)

Week 8:
├── Price alert system
│   ├── Create alert: "Alert me on any drop" or "Alert when under $X"
│   ├── Alert management page: /dashboard/price-alerts
│   ├── Inngest function: process alerts on price change
│   ├── Email notification for triggered alerts
│   └── In-app notification for triggered alerts
├── Weekly price digest email
│   ├── Resend email template (React Email)
│   ├── Summary: price drops, new lows, items to watch
│   └── Inngest cron: every Monday 9am
├── Price comparison placeholder
│   └── "Also available at:" section (same product at other stores)
│       (Basic version: link to Google Shopping search)
└── Sale detection: flag items where price < original_price
```

#### Week 9-10: Browser Extension (Chrome)

```
Week 9:
├── Extension project setup (extension/ directory)
│   ├── Manifest V3 config
│   ├── TypeScript + build pipeline (Vite or webpack)
│   └── Shared types with main app
├── Content script: product page detection
│   ├── Check for Schema.org Product data
│   ├── Check for known store URL patterns
│   └── Detect product page vs category/search page
├── Content script: data extraction
│   ├── Same extractors as server (Schema.org, OG, heuristic)
│   └── Client-side extraction (no server round-trip needed for display)
├── Save button overlay
│   ├── Floating "Save to WishlistCart" button on product pages
│   ├── Positioned near product image or Add to Cart button
│   └── Only appears on detected product pages
└── Authentication
    ├── Check if user is logged in (via cookie/token)
    ├── Login flow within extension popup
    └── Store auth token in chrome.storage

Week 10:
├── Popup UI
│   ├── Quick view of recent wishlists
│   ├── "Save this page" button (for current tab)
│   ├── Choose which wishlist to save to
│   ├── Edit fields before saving
│   └── Success confirmation
├── Right-click context menu
│   └── "Save to WishlistCart" on any link or image
├── Badge icon notification
│   └── Shows count of price drops on wishlisted items
├── Submit to Chrome Web Store
│   ├── Store listing: screenshots, description, privacy policy
│   └── Review process (~1-3 days)
└── Extension website integration
    └── "Get the Extension" CTA on dashboard + landing page
```

#### Week 11: Premium Subscription (Stripe)

```
├── Stripe setup
│   ├── Create Product + Price in Stripe Dashboard
│   ├── Monthly ($4.99/mo) + Annual ($39.99/yr) plans
│   ├── Stripe customer creation on signup
│   └── Webhook handler for subscription events
├── Billing page: /dashboard/settings/billing
│   ├── Current plan display
│   ├── Upgrade to Pro button → Stripe Checkout
│   ├── Manage subscription (Stripe Customer Portal)
│   ├── Cancel subscription
│   └── Invoice history
├── Feature gating middleware
│   ├── Check user.plan in server actions
│   ├── Enforce limits: wishlists, items, alerts, scrapes
│   ├── Show upgrade prompts when limit hit
│   └── Graceful degradation (don't break, prompt upgrade)
├── Pricing page: /pricing
│   ├── Feature comparison table (Free vs Pro)
│   ├── FAQ section
│   └── CTA to sign up / upgrade
└── Pro badge on profile
```

#### Week 12: Public Launch

```
├── Final polish pass
│   ├── Performance optimization
│   │   ├── Image optimization (next/image, proper sizes)
│   │   ├── Code splitting verification
│   │   ├── Database query optimization (add missing indexes)
│   │   └── Lighthouse score > 90 on all pages
│   ├── Accessibility audit (keyboard nav, screen readers)
│   └── Cross-browser testing
├── Content
│   ├── 3-5 gift guide blog posts (SEO seeds)
│   ├── Help/FAQ page
│   ├── Privacy policy + Terms of service
│   └── About page
├── Launch campaign
│   ├── Product Hunt submission (Tuesday AM)
│   ├── Hacker News "Show HN" post
│   ├── Reddit posts: r/SideProject, r/webdev, r/startups, r/gifts
│   ├── Twitter/X announcement
│   └── Personal network outreach
└── Post-launch monitoring
    ├── Monitor Sentry for errors
    ├── Monitor PostHog for user flows / drop-offs
    ├── Respond to all feedback within 24h
    └── Daily bug fix deploys for first week
```

**Phase 1B Complete Deliverables**:
- Price tracking with history charts on all items
- Price drop alerts (email + in-app)
- Chrome browser extension (one-click save from any store)
- Premium subscription ($4.99/mo) with Stripe
- Public launch with content + marketing

---

### PHASE 2: Gift Registries & Group Gifting (Weeks 13-24)

#### Weeks 13-16: Event Registries

```
Weeks 13-14: Registry system
├── Registry creation flow
│   ├── Choose event type (wedding, baby, birthday, holiday, custom)
│   ├── Event details: date, location, description, cover photo
│   ├── Custom URL: wishlistcart.com/registry/sarah-and-mike-wedding
│   ├── Registry-specific templates/checklists
│   │   ├── Wedding: kitchen, bedroom, dining, experiences
│   │   ├── Baby: nursery, feeding, clothing, gear
│   │   └── Birthday/Holiday: general categories
│   └── Import existing wishlist items into registry
├── Registry public page (SSR)
│   ├── Beautiful event header (cover photo, date, description)
│   ├── Item grid organized by category
│   ├── Progress indicator (X of Y items fulfilled)
│   ├── Gift-giver experience: browse → claim → buy
│   └── SEO optimized (wedding registry pages rank well)
├── Registry dashboard (owner view)
│   ├── See all claimed/purchased items
│   ├── Manage categories
│   └── Add/remove items
└── Registry-specific sharing
    ├── Email invitation templates
    ├── QR code for physical invitations
    └── Embeddable widget for wedding websites

Weeks 15-16: Registry enhancements
├── Thank-you tracker
│   ├── Mark gifts as "thanked"
│   ├── Generate thank-you list
│   └── Thank-you note templates
├── RSVP integration (basic)
│   ├── RSVP form on registry page
│   ├── Guest list management
│   └── Guest count tracking
├── Suggested items
│   ├── "Don't forget" checklists by event type
│   ├── Popular items in category
│   └── Price range suggestions
└── Multi-category organization
    ├── Custom categories per registry
    ├── Drag-and-drop category ordering
    └── Category cover images
```

#### Weeks 17-20: Group Gifting & Cash Funds

```
Weeks 17-18: Group gifting
├── "Start Group Gift" on any item
│   ├── Set goal amount (default: item price)
│   ├── Optional deadline
│   ├── Share pool link with contributors
│   └── Organizer can message contributors
├── Contribution flow
│   ├── Public pool page (no auth required to contribute)
│   ├── Stripe payment form (embedded)
│   ├── Amount input (with suggested amounts)
│   ├── Name, email, optional message
│   ├── Anonymous option
│   └── Platform fee display (2.5%, waived for Pro)
├── Pool dashboard
│   ├── Progress bar (current/goal)
│   ├── Contributor list
│   ├── Payout management
│   └── Status updates to contributors
├── Stripe Connect integration
│   ├── Pool owner creates Stripe Express account
│   ├── Contributions held in platform account
│   ├── Payout when goal reached or deadline passes
│   └── Refund handling if cancelled
└── Group gift notifications
    ├── Contribution received
    ├── Goal reached
    ├── Deadline approaching
    └── Payout processed

Weeks 19-20: Cash funds
├── Cash fund creation (per registry)
│   ├── Title: "Honeymoon Fund", "College Savings", custom
│   ├── Description & image
│   ├── Optional goal amount
│   └── Multiple funds per registry
├── Contribution flow (same Stripe flow as group gifting)
├── Fund withdrawal
│   ├── Stripe payout to bank account
│   ├── 3% platform fee
│   └── Withdrawal request + approval
└── Fund display on registry page
    ├── Beautiful fund card with progress
    ├── Recent contributors (with privacy controls)
    └── Contribute button
```

#### Weeks 21-24: Occasion System & Phase 2 Polish

```
Weeks 21-22: Occasion reminders
├── Birthday calendar
│   ├── Add people + their birthdays
│   ├── Calendar view of upcoming occasions
│   └── Linked to their public wishlist (if they have one)
├── Reminder system
│   ├── Configurable: remind X days before
│   ├── Email reminder with gift suggestions
│   ├── In-app reminder with link to person's wishlist
│   └── Recurring annual reminders
├── Gift history
│   ├── Track what you've given to whom
│   ├── Avoid repeat gifts
│   └── Spending history by person
└── Smart suggestions
    └── "Sarah's birthday is in 2 weeks. Here's her wishlist."

Weeks 23-24: Phase 2 polish
├── Performance optimization
│   ├── Database query optimization (N+1 queries, indexes)
│   ├── Redis caching for hot paths (popular registries)
│   ├── ISR for public registry pages
│   └── Bundle size audit
├── Email templates upgrade
│   ├── Beautiful React Email templates
│   ├── Registry invitation email
│   ├── Group gift invitation email
│   ├── Occasion reminder email
│   └── Monthly activity summary
├── Safari + Firefox extension ports
├── Additional store adapters (5-10 more stores)
├── Data export (CSV download of wishlists)
└── Bug fixes + user feedback implementation
```

**Phase 2 Complete Deliverables**:
- Event registries for all occasions (wedding, baby, birthday, etc.)
- Group gifting with Stripe payment pooling
- Cash funds (honeymoon fund, etc.)
- Occasion reminders + gift history
- Multi-browser extension support

---

### PHASE 3: Social & Community (Weeks 25-36)

#### Weeks 25-28: Social Features

```
├── User profiles
│   ├── Public profile page: /@username
│   ├── Bio, avatar, public wishlists
│   ├── Follower/following counts
│   └── Profile customization
├── Follow system
│   ├── Follow/unfollow users
│   ├── Following list page
│   ├── Followers list page
│   └── Follow suggestions (based on shared wishlists)
├── Activity feed
│   ├── Feed page: /dashboard/feed
│   ├── Events: friend added item, created list, has upcoming birthday
│   ├── Infinite scroll with cursor pagination
│   └── Filter by activity type
├── Comments & likes
│   ├── Like/heart items on shared wishlists
│   ├── Comments on items ("I have this, it's great!")
│   └── Comment notifications
└── Collaborative wishlists
    ├── Invite others to add items to a list
    ├── Permission levels (view, add, admin)
    └── Activity log per list
```

#### Weeks 29-32: Discovery & Content

```
├── Explore page: /explore
│   ├── Trending wishlists
│   ├── Popular items (most wishlisted)
│   ├── Featured collections
│   └── Category browsing
├── Curated gift guides
│   ├── Staff-created gift guides
│   ├── Community-submitted guides
│   ├── Seasonal (Christmas, Valentine's, etc.)
│   ├── By recipient (for mom, for dad, etc.)
│   ├── By budget (under $25, $50, $100)
│   └── Each guide = curated wishlist with editorial content
├── Gift finder quiz
│   ├── "Find the perfect gift" interactive quiz
│   ├── 5-7 questions (recipient, occasion, budget, interests)
│   ├── AI-powered suggestions based on answers
│   └── Links to items available on platform
├── Search
│   ├── Search public wishlists
│   ├── Search items across platform
│   ├── Search users
│   └── Full-text search (Supabase pg_trgm or Meilisearch)
└── SEO content expansion
    ├── 20+ gift guide pages (SSG)
    ├── Category landing pages
    └── Blog with 2-4 posts/month
```

#### Weeks 33-36: Creator Program & Phase 3 Polish

```
├── Creator/influencer features
│   ├── Creator application + verification
│   ├── "Creator" badge on profile
│   ├── Recommendation lists with affiliate revenue sharing
│   │   ├── Creator gets 70% of affiliate commission
│   │   ├── Platform gets 30%
│   │   └── Creator dashboard with earnings
│   ├── Fan gifting (fans buy items from creator's wishlist)
│   │   └── Shipping address hidden from buyers
│   ├── Analytics: views, clicks, earnings
│   └── Platform integration links (YouTube, Twitch, etc.)
├── Advanced analytics (admin)
│   ├── User growth dashboard
│   ├── Revenue dashboard (affiliate + subscriptions + fees)
│   ├── Popular stores, items, categories
│   ├── Conversion funnel analysis
│   └── Cohort retention analysis
├── PWA enhancements
│   ├── Offline wishlist viewing
│   ├── Push notifications (web push)
│   ├── "Add to Home Screen" prompt
│   └── Share target (share URLs from other apps → WishlistCart)
└── Phase 3 polish + performance
    ├── Database optimization for social queries
    ├── CDN caching strategy for popular pages
    ├── Rate limiting refinement
    └── Security audit
```

---

## Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database (Supabase Postgres)
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...

# Resend (Email)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@wishlistcart.com

# Inngest
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Affiliate
AMAZON_ASSOCIATE_TAG=wishlistcart-20
SHAREASALE_MERCHANT_ID=...
IMPACT_ACCOUNT_SID=...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# App
NEXT_PUBLIC_APP_URL=https://wishlistcart.com
```

---

## Deployment Pipeline

```
GitHub Push/PR
      │
      ├──→ GitHub Actions CI
      │    ├── TypeScript type checking
      │    ├── ESLint
      │    ├── Unit tests (Vitest)
      │    └── Build check
      │
      └──→ Vercel
           ├── Preview deployment (on PR)
           │   └── Unique URL per PR for testing
           └── Production deployment (on merge to main)
               ├── Build Next.js
               ├── Run Prisma migrations (via build script)
               ├── Deploy to edge network
               └── Purge CDN cache
```

### Production Checklist

```
Vercel:
├── Custom domain: wishlistcart.com + www redirect
├── Environment variables set
├── Edge config (if needed)
└── Analytics enabled

Supabase:
├── RLS policies on all tables
├── Database backups enabled (daily)
├── Connection pooling configured (PgBouncer)
├── Storage buckets created (product-images, avatars)
└── Storage policies set

Stripe:
├── Live mode keys configured
├── Webhook endpoint registered
├── Products/Prices created
└── Tax settings configured

DNS:
├── A record → Vercel
├── MX records → email provider
├── SPF/DKIM/DMARC for email deliverability
└── subdomain: app.wishlistcart.com (if needed)
```

---

## Key Technical Decisions & Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| No separate backend | Next.js API routes + Server Actions | Simplicity for solo dev, Vercel deploys both |
| Supabase over separate PG + Auth | All-in-one | Single dashboard, built-in auth, RLS, storage, realtime |
| Prisma over Drizzle | Prisma | Better migration story, more mature, great Supabase support |
| Server Actions over API routes | Server Actions for mutations | Less boilerplate, type-safe, works with revalidation |
| Inngest over BullMQ | Inngest | Serverless-friendly, no Redis queue needed, great DX, free tier |
| Resend over SendGrid | Resend | Better DX, React Email support, built for modern stack |
| shadcn/ui over Material/Ant | shadcn/ui | Copy-paste components (own the code), Tailwind-native |
| Zustand over Redux/Context | Zustand | Minimal boilerplate, works with server components |
| PWA before native app | PWA | Ship to all platforms instantly, native app in Phase 4+ |
| No GraphQL initially | REST + Server Actions | Simpler, faster to build, GraphQL added only if needed |

---

*This is our build guide. Reference BUSINESS_PLAN.md for feature details and priorities. Update this document as we ship each phase.*
