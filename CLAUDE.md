# WishlistCart.com — Claude Instructions

## Start of Every Session

1. **Read `.claude/memory/MEMORY.md`** — project context, architecture decisions, current phase
2. **Read `IMPLEMENTATION_PLAN.md`** — check Phase Progress Tracker for current status
3. **Load relevant skills** from `.claude/skills/` based on what you're building today:
   - `nextjs-developer/SKILL.md` — Next.js routes, layouts, API routes, middleware
   - `fullstack-feature/SKILL.md` — Building any feature end-to-end
   - `typescript-pro/SKILL.md` — Types, Zod schemas, Prisma types
   - `supabase-postgres/SKILL.md` — DB queries, RLS, auth, storage
   - `react-ui/SKILL.md` — React components, TanStack Query
   - `secure-code-guardian/SKILL.md` — Auth checks, input validation, security
   - `frontend-design/SKILL.md` — Theme, typography, UI design
   - `seo-content/SKILL.md` — Metadata, structured data, gift guides
   - `test-master/SKILL.md` — Tests (Vitest, RTL, Playwright)

## Project Context

- **Product**: Universal Wishlist + Gift Registry SaaS at wishlistcart.com
- **Stack**: Next.js 15 (App Router) + Supabase + Prisma + Vercel
- **Phase**: Working through phases in `IMPLEMENTATION_PLAN.md`
- **Reference docs**: `BUSINESS_PLAN.md` (product), `IMPLEMENTATION_PLAN.md` (technical)

## Rules

- Mark completed tasks in `IMPLEMENTATION_PLAN.md` with `[x]` as you finish them
- Always read a file before editing it
- Follow patterns in the loaded skills — they contain WishlistCart-specific conventions
- Auth check is ALWAYS the first operation in server actions (`supabase.auth.getUser()`)
- Never use `getSession()` on the server — use `getUser()` (re-validates with server)
- Ownership check before any mutation (user owns the resource)
- Surprise mode: owner can NEVER see gift claim data — enforced at DB query level
- All "Buy" links route through `/api/affiliate/redirect?item={id}`
- Use `ActionResult<T>` discriminated union for all server action returns
- No colored primary buttons — accent color is black (`#0F0F0F`)
- Design system is minimalistic white/ash — no coral, teal, or gradients

## What NOT to Do

- Do not use `getSession()` on the server
- Do not return claim data (isPurchased, purchasedBy, giftMessage) to wishlist owners
- Do not skip loading states or error boundaries
- Do not use `any` in TypeScript — use `unknown` and narrow
- Do not define types that duplicate Prisma schema (derive with `Prisma.XGetPayload<>`)
- Do not implement features beyond the current phase
