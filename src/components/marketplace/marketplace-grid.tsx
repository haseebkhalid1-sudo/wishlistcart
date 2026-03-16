'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { MarketplaceProductRow } from '@/lib/actions/marketplace'
import { MARKETPLACE_CATEGORIES } from '@/lib/actions/marketplace'
import { MarketplaceProductCard } from './marketplace-product-card'

interface MarketplaceGridProps {
  products: MarketplaceProductRow[]
  /** If provided, only show one category (for category pages) */
  activeCategory?: string
}

type PriceRange = 'all' | 'under25' | '25to100' | 'over100'

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'All Prices' },
  { value: 'under25', label: 'Under $25' },
  { value: '25to100', label: '$25 – $100' },
  { value: 'over100', label: 'Over $100' },
]

export function MarketplaceGrid({ products, activeCategory }: MarketplaceGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategory ?? 'all')
  const [priceRange, setPriceRange] = useState<PriceRange>('all')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catMatch =
        selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase()
      const priceMatch =
        priceRange === 'all' ||
        (priceRange === 'under25' && p.price < 25) ||
        (priceRange === '25to100' && p.price >= 25 && p.price <= 100) ||
        (priceRange === 'over100' && p.price > 100)
      return catMatch && priceMatch
    })
  }, [products, selectedCategory, priceRange])

  return (
    <div>
      {/* Category tabs — only shown on the main /marketplace page */}
      {!activeCategory && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-foreground hover:bg-subtle'
            }`}
          >
            All
          </button>
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/marketplace/${cat.slug}`}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selectedCategory === cat.slug
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-foreground hover:bg-subtle'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      )}

      {/* Price range filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PRICE_RANGES.map((range) => (
          <button
            key={range.value}
            type="button"
            onClick={() => setPriceRange(range.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              priceRange === range.value
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:bg-subtle'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="mb-4 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No products found in this category yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">Check back soon — we curate new finds weekly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <MarketplaceProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} · Affiliate links help support WishlistCart
        </p>
      )}
    </div>
  )
}
