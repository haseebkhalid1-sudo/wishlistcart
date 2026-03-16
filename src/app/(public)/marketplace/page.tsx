import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { getMarketplaceProducts } from '@/lib/actions/marketplace'
import { MARKETPLACE_CATEGORIES } from '@/lib/actions/marketplace'
import { MarketplaceGrid } from '@/components/marketplace/marketplace-grid'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Gift Marketplace — WishlistCart',
  description:
    'Discover curated gift ideas across every category. Add anything to your wishlist with one click.',
  alternates: { canonical: 'https://wishlistcart.com/marketplace' },
  openGraph: {
    title: 'Gift Marketplace — WishlistCart',
    description: 'Discover curated gift ideas across every category.',
    url: 'https://wishlistcart.com/marketplace',
    type: 'website',
  },
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

export default async function MarketplacePage() {
  const result = await getMarketplaceProducts({ limit: 200 })
  const products = result.success ? result.data : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-subtle">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="flex flex-col items-center text-center">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Curated Picks
            </p>
            <h1 className="font-serif text-display-md text-foreground">Gift Marketplace</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Handpicked products across every category. Add anything to your wishlist with one click.
            </p>
          </div>

          {/* Category quick links */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/marketplace/${cat.slug}`}
                className="rounded-full border border-border bg-background px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <h2 className="font-serif text-xl text-foreground">Coming Soon</h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Our curated marketplace is launching soon. In the meantime, add items from any store
              to your wishlist.
            </p>
            <a
              href={`${APP_URL}/signup`}
              className="mt-6 rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Create a Wishlist
            </a>
          </div>
        ) : (
          <MarketplaceGrid products={products} />
        )}
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
