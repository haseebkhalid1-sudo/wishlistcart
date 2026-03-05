# WishlistCart.com — Session Memory

## Project Overview
- **Domain**: wishlistcart.com
- **Type**: Universal Wishlist + Gift Registry SaaS
- **Stack**: Next.js 16 (App Router, Turbopack) + Supabase + Vercel
- **Stage**: Phase 1A in progress — Weeks 1–4 complete, Week 5–6 remaining

## Key Documents
- `BUSINESS_PLAN.md` — full product vision, personas, features, monetization
- `IMPLEMENTATION_PLAN.md` — phased tech plan with progress tracker (use `[x]` when done)
- `IDEAS.md` — original brainstormed ideas (reference only)

## Skills Loaded for This Project
All skills live in `.claude/skills/`:
1. `nextjs-developer` — Next.js 15 App Router patterns
2. `fullstack-feature` — feature implementation checklist + examples
3. `typescript-pro` — TypeScript strict patterns, Zod, Prisma types
4. `supabase-postgres` — DB queries, RLS, auth, storage
5. `react-ui` — React components, TanStack Query hooks
6. `secure-code-guardian` — auth checks, SSRF prevention, ownership checks
7. `frontend-design` — minimalistic white/ash/black theme, typography scale
8. `seo-content` — metadata API, structured data, gift guide templates
9. `test-master` — Vitest + RTL + Playwright patterns

## Design System (theme finalized)
- **Style**: Modern Minimalism (white/ash backgrounds, black text, no decorative color)
- **Primary background**: `#FFFFFF` (white)
- **Raised surfaces**: `#F8F8F7` (warm ash)
- **Text**: `#0F0F0F` (near-black)
- **Accent/buttons**: `#0F0F0F` black — no colored primary buttons
- **Fonts**: DM Serif Display (headings) + Inter (body/UI)
- **Full token set**: see `.claude/skills/frontend-design/SKILL.md`
- **No** gradients, colored backgrounds, coral/teal from old theme

## Architecture Decisions
- No separate backend — Next.js Server Actions + API routes + Supabase handles everything
- Auth: Supabase Auth (`getUser()` not `getSession()` for server-side)
- Background jobs: Inngest (not BullMQ — serverless-friendly)
- Affiliate: `/api/affiliate/redirect?id={itemId}` → logs click → 302 redirect
- Surprise mode: enforced at DB query level via two separate query fns (owner vs public view)
- Server Actions for mutations, API Routes for webhooks/streaming/external services
- Prisma 7: requires `prisma.config.ts` for datasource URL + `@prisma/adapter-pg` driver adapter
- Price field type: `Decimal` in Prisma — always cast to `Number()` before passing to formatPrice()

## Critical Gotchas
- `ZodError.issues` not `.errors` — Prisma 7 changed this
- `prisma.config.ts` holds `DATABASE_URL`, not `schema.prisma`
- Prisma client needs `PrismaPg` adapter from `@prisma/adapter-pg` — conditional on DATABASE_URL at build time
- `item.priority` is `Int` (1–5) in schema, not a string enum like 'HIGH'
- `item.price` is `Decimal` — use `Number(item.price)` before arithmetic or formatPrice()
- Middleware deprecation warning: Next.js 16 uses "proxy" but "middleware" still works

## Current Progress (as of March 2026)
### Completed
- **Week 1**: Next.js 15 app, Prisma schema (12 models), Supabase clients, auth middleware, auth pages (login/signup/reset), layouts (marketing/app/auth), mobile nav
- **Week 2**: Wishlist CRUD (create/update/delete/archive), item CRUD (create/delete/reorder), ItemCard (grid+list), AddItemDialog (manual tab + URL tab), WishlistGrid, CreateWishlistDialog
- **Week 3**: URL scraper (`/api/scrape`), extractors (Schema.org, OpenGraph, DOM heuristic, meta tags), Amazon adapter, generic adapter, SSRF protection, rate limiting (Upstash, gracefully optional), ScrapedPreview in AddItemDialog
- **Week 4**: Public wishlist page (`/@username/slug`), PublicItemGrid, ClaimDialog, ShareButtons, ShareDialog, sharing actions (generateShareLink/makePublic), claiming actions (claimItem/unclaimItem), wishlist queries (owner + public), affiliate network registry, buildAffiliateUrl, `/api/affiliate/redirect`

### Git (local only — no remote yet)
4 commits on `master` branch. GitHub + Vercel setup pending.

### Next Up (Week 5–6)
1. Wire affiliate redirect into item-card buy links
2. Edit item dialog
3. Wishlist settings edit form
4. `/api/og-image` implementation (@vercel/og or satori)
5. Pricing page
6. robots.txt + sitemap.ts
7. Sentry + PostHog setup
8. Supabase project creation + real `.env.local`
9. GitHub repo + Vercel first deploy

## Conventions
- Mark completed tasks in IMPLEMENTATION_PLAN.md with `[x]`
- Mark in-progress with `[~]`
- Always read a file before editing it
- Load relevant skills before implementing any feature
- Commit at end of each week with `feat: Week N — ...` message
