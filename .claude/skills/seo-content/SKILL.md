---
name: seo-content
description: Use when creating SEO content, gift guides, blog posts, metadata, structured data/schema, or planning the content strategy for WishlistCart.com. SEO is a primary revenue driver.
license: MIT
metadata:
  source: ~/.claude/skills-main/skills/seo-2026 (tailored for WishlistCart.com)
  version: "1.0.0"
  triggers: SEO, content, blog, gift guide, metadata, schema, structured data, keyword, ranking, Open Graph, sitemap, OG image, alt text, title tag, description
---

# SEO & Content — WishlistCart.com

Modern SEO + Answer Engine Optimization (AEO) for WishlistCart.com. SEO-driven content is a primary acquisition channel — gift guides and registry checklists should organically drive signups.

## WishlistCart SEO Strategy

### Core SEO Goals
1. **Rank** for high-intent queries: "create wishlist online", "wedding registry", "birthday wishlist maker", "universal gift registry"
2. **Get cited** by AI (ChatGPT, Perplexity, Google AI Overviews) for gift-related queries
3. **Drive viral loops** through shareable wishlist/registry pages that search-index well

### Target URL + Page Structure

| Priority | URL Pattern | Target Keywords | Content Type |
|----------|-------------|-----------------|--------------|
| P0 | `/gift-ideas/for/[person]` | "best gifts for [mom/dad/wife/etc]" | Gift guide SSG |
| P0 | `/gift-ideas/under/[price]` | "gifts under $50" | Gift list SSG |
| P0 | `/gift-ideas/for/[occasion]` | "wedding registry ideas" | Occasion guide SSG |
| P1 | `/blog/[slug]` | Long-tail gift/wishlist content | Blog posts SSG |
| P1 | `/@[username]/[slug]` | User-generated public wishlists | Dynamic SSR |
| P2 | `/explore/gift-guides/[slug]` | Curated guides | SSG + ISR |
| P2 | `/registry/[slug]` | Registry-specific SEO | SSR |

## Next.js Metadata (every public page)

```tsx
// src/app/(marketing)/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WishlistCart — Save Products from Any Store, Share with Everyone',
  description: 'Create wishlists from any online store, track prices, and coordinate gifts. The universal wishlist and gift registry for every occasion.',
  keywords: ['wishlist', 'gift registry', 'universal wishlist', 'price tracker', 'wedding registry'],
  openGraph: {
    title: 'WishlistCart — Save. Share. Celebrate.',
    description: 'Universal wishlist and gift registry. Add items from any store, track prices, coordinate gifts.',
    url: 'https://wishlistcart.com',
    siteName: 'WishlistCart',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'WishlistCart' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WishlistCart — Universal Wishlist & Gift Registry',
    description: 'Save products from any store. Share wishlists. Coordinate gifts.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://wishlistcart.com' },
}
```

### Dynamic Metadata for Public Wishlists
```tsx
// src/app/(public)/@[username]/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wishlist = await getPublicWishlist(params.username, params.slug)
  if (!wishlist) return { title: 'Not Found' }

  const title = `${wishlist.name} — ${wishlist.user.name || wishlist.user.username}'s Wishlist`
  const description = wishlist.description ||
    `${wishlist.user.name}'s wishlist on WishlistCart. ${wishlist._count.items} items from any store.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{
        url: `/api/og-image?title=${encodeURIComponent(wishlist.name)}&user=${encodeURIComponent(wishlist.user.name ?? '')}&type=wishlist`,
        width: 1200, height: 630,
      }],
      type: 'website',
    },
  }
}
```

## Structured Data (JSON-LD)

### Homepage — Organization Schema
```tsx
// src/app/(marketing)/layout.tsx or page.tsx
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WishlistCart',
  url: 'https://wishlistcart.com',
  logo: 'https://wishlistcart.com/logo.png',
  description: 'Universal wishlist and gift registry platform',
  sameAs: [
    'https://twitter.com/wishlistcart',
    'https://instagram.com/wishlistcart',
  ],
}

// In page component:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
```

### Gift Guide Page — ItemList Schema
```tsx
const giftGuideSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best Gifts for Mom 2026',
  description: '25 thoughtful gift ideas for Mother\'s Day and beyond',
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: item.title,
      image: item.imageUrl,
      offers: { '@type': 'Offer', price: item.price, priceCurrency: 'USD' },
    },
  })),
}
```

### Registry Page — Event Schema
```tsx
const registrySchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: wishlist.name,
  startDate: wishlist.eventDate?.toISOString(),
  eventStatus: 'https://schema.org/EventScheduled',
  organizer: {
    '@type': 'Person',
    name: wishlist.user.name,
  },
}
```

### Blog Post — Article Schema
```tsx
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: post.author.name,
    url: `https://wishlistcart.com/@${post.author.username}`,
  },
  publisher: {
    '@type': 'Organization',
    name: 'WishlistCart',
    logo: 'https://wishlistcart.com/logo.png',
  },
}
```

## Gift Guide Content Template

Use this structure for all gift guide pages (`/gift-ideas/for/[person]`, `/gift-ideas/under/[price]`):

```
Title: "25 Best Gifts for [Person] in 2026 — [Unique Angle]"

TL;DR Box (machine-liftable):
  Quick answer: Top 3 picks for [person] are X, Y, Z.
  Price range: $[min]–$[max]
  Best value: [specific pick]

H2: The Best Gifts for [Person] (Quick Picks)
  → Table with top 5: Product | Price | Why We Love It

H2: [Category 1] Gifts for [Person]
  → 5-7 specific products with price, where to buy, 2-3 sentences why

H2: [Category 2] Gifts for [Person]
  → ...

H2: Gifts Under $[X] for [Person]
  → Budget-specific section

H2: How to Choose the Perfect Gift for [Person]
  → Practical advice (information gain angle)

FAQ Section (FAQPage schema):
  Q: What is a good gift for [person]?
  Q: How much should I spend on a [occasion] gift?
  Q: [3-5 more common questions]

CTA: "Save these gift ideas to your WishlistCart"
```

## Sitemap & Technical SEO

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wishlistcart.com'

  // Static pages
  const staticPages = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/explore`, changeFrequency: 'daily', priority: 0.9 },
    // Gift guides (static)
    ...['mom', 'dad', 'wife', 'husband', 'girlfriend', 'boyfriend', 'kids', 'teens', 'coworker'].map(p => ({
      url: `${baseUrl}/gift-ideas/for/${p}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ]

  // Dynamic: public wishlists
  const publicWishlists = await prisma.wishlist.findMany({
    where: { privacy: 'PUBLIC', isArchived: false },
    select: { slug: true, updatedAt: true, user: { select: { username: true } } },
    orderBy: { updatedAt: 'desc' },
    take: 10000,
  })

  const wishlistPages = publicWishlists.map(w => ({
    url: `${baseUrl}/@${w.user.username}/${w.slug}`,
    lastModified: w.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...wishlistPages]
}
```

## Dynamic OG Image API

```typescript
// src/app/api/og-image/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'My Wishlist'
  const user = searchParams.get('user') ?? ''
  const type = searchParams.get('type') ?? 'wishlist'

  return new ImageResponse(
    (
      <div style={{
        display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #FFF5F3 0%, #FFE4E0 100%)',
        padding: '60px',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 20, color: '#E8523A', marginBottom: 24 }}>WishlistCart</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>{title}</div>
        {user && <div style={{ fontSize: 28, color: '#666', marginTop: 20 }}>by {user}</div>}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

## WishlistCart SEO Priority Checklist

### Launch (Phase 1A)
- [ ] Metadata API on all pages (title, description, OG, Twitter)
- [ ] `/api/og-image` dynamic OG image generator
- [ ] Organization schema on homepage
- [ ] `sitemap.ts` auto-generated
- [ ] `robots.txt` allowing all
- [ ] Canonical URLs on all pages
- [ ] Public wishlist pages SSR with proper meta tags
- [ ] Core Web Vitals > 90 (Lighthouse)

### Post-Launch (Phase 1B)
- [ ] 5-10 gift guide pages (`/gift-ideas/for/[person]`) — SSG
- [ ] ItemList schema on gift guides
- [ ] FAQPage schema on all guides
- [ ] Blog with 2 posts/month
- [ ] Internal linking: guides link to related guides

### Growth (Phase 2-3)
- [ ] 50+ gift guide pages covering all key personas
- [ ] Registry SEO: individual registry pages indexed
- [ ] Author bios for E-E-A-T
- [ ] Link building via PR and partnerships
