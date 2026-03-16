import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getMarketplaceProducts, MARKETPLACE_CATEGORIES, slugToLabel } from '@/lib/actions/marketplace'
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid'

export const revalidate = 300

const BASE_URL = 'https://wishlistcart.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? BASE_URL

export async function generateStaticParams() {
  return MARKETPLACE_CATEGORIES.map((cat) => ({ category: cat.slug }))
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const label = slugToLabel(category)
  const isValid = MARKETPLACE_CATEGORIES.some((c) => c.slug === category)
  if (!isValid) return {}

  return {
    title: `${label} Gift Ideas — WishlistCart Marketplace`,
    description: `Browse curated ${label.toLowerCase()} gift picks. Add anything to your wishlist with one click.`,
    alternates: { canonical: `${BASE_URL}/marketplace/${category}` },
    openGraph: {
      title: `${label} Gift Ideas — WishlistCart Marketplace`,
      description: `Browse curated ${label.toLowerCase()} gift picks.`,
      url: `${BASE_URL}/marketplace/${category}`,
      type: 'website',
    },
  }
}

export default async function MarketplaceCategoryPage({ params }: PageProps) {
  const { category } = await params

  const isValid = MARKETPLACE_CATEGORIES.some((c) => c.slug === category)
  if (!isValid) notFound()

  const label = slugToLabel(category)

  const result = await getMarketplaceProducts({ category, limit: 200 })
  const products = result.success ? result.data : []

  // JSON-LD ItemList schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${label} Gift Ideas`,
    description: `Curated ${label.toLowerCase()} gift picks on WishlistCart`,
    url: `${BASE_URL}/marketplace/${category}`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${BASE_URL}/api/affiliate/marketplace/redirect?productId=${p.id}`,
      offers: {
        '@type': 'Offer',
        price: p.price.toString(),
        priceCurrency: p.currency ?? 'USD',
        availability: 'https://schema.org/InStock',
      },
    })),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="border-b border-border bg-subtle">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/marketplace" className="hover:text-foreground hover:underline">
              Marketplace
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{label}</span>
          </nav>

          <div className="flex flex-col items-center text-center">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <h1 className="font-serif text-display-md text-foreground">{label} Gift Ideas</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Curated {label.toLowerCase()} picks — add anything to your wishlist with one click.
            </p>
          </div>

          {/* Other category links */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {MARKETPLACE_CATEGORIES.filter((c) => c.slug !== category).map((cat) => (
              <Link
                key={cat.slug}
                href={`/marketplace/${cat.slug}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <MarketplaceGrid products={products} activeCategory={category} />
      </div>

      {/* Footer */}
      <div className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by{' '}
          <a href={APP_URL} className="font-medium text-foreground hover:underline">
            WishlistCart
          </a>{' '}
          · Prices may vary · Affiliate links help support WishlistCart at no extra cost to you
        </p>
      </div>
    </div>
  )
}
