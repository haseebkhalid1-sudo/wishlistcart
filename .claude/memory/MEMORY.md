# WishlistCart.com — Session Memory

## Project Overview
- **Domain**: wishlistcart.com
- **Type**: Universal Wishlist + Gift Registry SaaS
- **Stack**: Next.js 15 (App Router) + Supabase + Vercel
- **Stage**: Pre-development (planning complete, ready to code)

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
- Affiliate: `/api/affiliate/redirect?item={id}` → logs click → 302 redirect
- Surprise mode: enforced at DB query level, not just UI
- Server Actions for mutations, API Routes for webhooks/streaming/external services

## Current Phase
- **Status**: Phase 1A not yet started
- **Next step**: Initialize Next.js project (Week 1, Day 1)
- See `IMPLEMENTATION_PLAN.md` → "Phase Progress Tracker" for full checklist

## Conventions
- Mark completed tasks in IMPLEMENTATION_PLAN.md with `[x]`
- Mark in-progress with `[~]`
- Always read a file before editing it
- Load relevant skills before implementing any feature
