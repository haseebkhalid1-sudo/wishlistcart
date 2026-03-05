---
name: test-master
description: Use when writing tests, testing components, verifying server actions, or testing the scraper for WishlistCart.com. Uses Vitest + React Testing Library + Playwright.
license: MIT
metadata:
  source: claude-skills-main test-master (tailored for WishlistCart.com)
  version: "1.0.0"
  triggers: test, testing, unit test, integration test, E2E, Playwright, Vitest, coverage, assertion, mock, spec
---

# Test Master — WishlistCart.com

Testing specialist for WishlistCart.com. We test what matters: scraper extraction, affiliate URL generation, price alert logic, gift claiming (surprise mode), and auth flows.

## Test Stack

| Tool | Purpose |
|------|---------|
| Vitest | Unit + integration tests (fast, Vite-native) |
| React Testing Library | Component tests |
| Playwright | E2E tests (critical user flows) |
| MSW (Mock Service Worker) | Mock external API calls in tests |

## What to Test (Priority Order)

### P0 — Must have tests (business-critical)
1. **Scraper extractors** — Schema.org, OpenGraph, DOM heuristic
2. **Affiliate URL generation** — Correct tags per store
3. **Price alert logic** — Trigger conditions correct
4. **Surprise mode** — Owner never sees claim data
5. **Auth middleware** — Protected routes redirect correctly

### P1 — Should have tests
6. **Zod validators** — Edge cases for item/wishlist schemas
7. **Share token generation** — Unique, correct format
8. **Price history queries** — Correct data aggregation
9. **Group gift pool** — Contribution tracking logic

### P2 — Nice to have
10. Component tests for ItemCard, ShareDialog, AddItemDialog
11. E2E: complete wishlist creation + share + claim flow

## Test Patterns

### Scraper Unit Tests
```typescript
// tests/unit/scraper/schema-org.test.ts
import { describe, it, expect } from 'vitest'
import { extractSchemaOrg } from '@/lib/scraper/extractors/schema-org'

describe('Schema.org extractor', () => {
  it('extracts product data from JSON-LD', () => {
    const html = `
      <script type="application/ld+json">
        {"@context":"https://schema.org","@type":"Product","name":"Test Product","offers":{"price":"29.99","priceCurrency":"USD"},"image":"https://example.com/img.jpg"}
      </script>
    `
    const result = extractSchemaOrg(html)
    expect(result.title).toBe('Test Product')
    expect(result.price).toBe(29.99)
    expect(result.currency).toBe('USD')
    expect(result.imageUrl).toBe('https://example.com/img.jpg')
    expect(result.confidence).toBeGreaterThan(0.7)
  })

  it('returns null price when no price found', () => {
    const html = `<script type="application/ld+json">{"@type":"Product","name":"No Price"}</script>`
    const result = extractSchemaOrg(html)
    expect(result.price).toBeNull()
    expect(result.confidence).toBeLessThan(0.7)
  })
})
```

### Affiliate URL Tests
```typescript
// tests/unit/affiliate/networks.test.ts
import { describe, it, expect } from 'vitest'
import { generateAffiliateUrl } from '@/lib/affiliate'

describe('Affiliate URL generation', () => {
  it('appends Amazon associate tag', () => {
    const url = generateAffiliateUrl('https://amazon.com/dp/B001234', 'amazon.com')
    expect(url).toContain('tag=wishlistcart-20')
  })

  it('returns original URL for unknown stores', () => {
    const url = generateAffiliateUrl('https://unknownstore.com/product/123', 'unknownstore.com')
    expect(url).toBe('https://unknownstore.com/product/123')
  })

  it('handles URLs with existing query params', () => {
    const url = generateAffiliateUrl('https://amazon.com/dp/B001234?ref=sr_1_1', 'amazon.com')
    expect(url).toContain('tag=wishlistcart-20')
    expect(url).toContain('ref=sr_1_1')
  })
})
```

### Price Alert Logic Tests
```typescript
// tests/unit/alerts/trigger.test.ts
import { describe, it, expect } from 'vitest'
import { shouldTriggerAlert } from '@/lib/inngest/functions/process-alerts'

describe('Price alert trigger logic', () => {
  it('triggers on any price drop when type is ANY_DROP', () => {
    expect(shouldTriggerAlert({ type: 'ANY_DROP' }, 50, 45)).toBe(true)
    expect(shouldTriggerAlert({ type: 'ANY_DROP' }, 50, 50)).toBe(false)
    expect(shouldTriggerAlert({ type: 'ANY_DROP' }, 50, 55)).toBe(false)
  })

  it('triggers when price drops below target', () => {
    expect(shouldTriggerAlert({ type: 'TARGET_PRICE', targetPrice: 40 }, 50, 38)).toBe(true)
    expect(shouldTriggerAlert({ type: 'TARGET_PRICE', targetPrice: 40 }, 50, 42)).toBe(false)
  })

  it('triggers on sufficient percentage drop', () => {
    expect(shouldTriggerAlert({ type: 'PERCENTAGE_DROP', percentageDrop: 10 }, 100, 89)).toBe(true)
    expect(shouldTriggerAlert({ type: 'PERCENTAGE_DROP', percentageDrop: 10 }, 100, 92)).toBe(false)
  })
})
```

### Surprise Mode Test (Critical)
```typescript
// tests/unit/wishlist/surprise-mode.test.ts
import { describe, it, expect } from 'vitest'
import { getWishlistForOwner, getWishlistForGiftGiver } from '@/lib/queries/wishlist'
// Mock prisma

describe('Surprise mode — owner cannot see claims', () => {
  it('owner view does not include isPurchased field', async () => {
    const result = await getWishlistForOwner('wishlist-id', 'owner-user-id')
    result.items.forEach(item => {
      expect(item).not.toHaveProperty('isPurchased')
      expect(item).not.toHaveProperty('purchasedBy')
      expect(item).not.toHaveProperty('giftMessage')
    })
  })

  it('gift-giver view includes isPurchased but not purchasedBy', async () => {
    const result = await getWishlistForGiftGiver('wishlist-id')
    result?.items.forEach(item => {
      expect(item).toHaveProperty('isPurchased')
      expect(item).not.toHaveProperty('purchasedBy')  // don't reveal who
    })
  })
})
```

### E2E Critical Flow (Playwright)
```typescript
// tests/e2e/wishlist-flow.test.ts
import { test, expect } from '@playwright/test'

test('complete wishlist creation and sharing flow', async ({ page }) => {
  // Sign up
  await page.goto('/signup')
  await page.fill('[name=email]', 'test@example.com')
  await page.fill('[name=password]', 'password123')
  await page.click('button[type=submit]')
  await expect(page).toHaveURL('/dashboard/wishlists')

  // Create wishlist
  await page.click('button:has-text("Create Wishlist")')
  await page.fill('[name=name]', 'My Test Wishlist')
  await page.click('button:has-text("Create")')
  await expect(page.locator('h1')).toContainText('My Test Wishlist')

  // Add item manually
  await page.click('button:has-text("Add Item")')
  await page.fill('[name=title]', 'Test Product')
  await page.fill('[name=price]', '29.99')
  await page.click('button:has-text("Save")')
  await expect(page.locator('[data-testid=item-card]')).toBeVisible()

  // Share wishlist
  await page.click('button:has-text("Share")')
  const shareLink = await page.locator('[data-testid=share-link]').inputValue()
  expect(shareLink).toContain('wishlistcart.com')
})
```

## Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    alias: { '@': path.resolve(__dirname, './src') },
  },
})

// tests/setup.ts
import { vi } from 'vitest'
// Mock Prisma client for unit tests
vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    wishlist: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    wishlistItem: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    priceHistory: { create: vi.fn(), findMany: vi.fn() },
  },
}))
```
