'use client'

import Link from 'next/link'
import { ShoppingBag, Plus, ExternalLink } from 'lucide-react'
import type { MarketplaceProductRow } from '@/lib/actions/marketplace'
import { slugToLabel } from '@/lib/marketplace-utils'

interface MarketplaceProductCardProps {
  product: MarketplaceProductRow
}

export function MarketplaceProductCard({ product }: MarketplaceProductCardProps) {
  const affiliateUrl = `/api/affiliate/marketplace/redirect?productId=${product.id}`

  const addToWishlistUrl =
    `/dashboard/wishlists?addUrl=${encodeURIComponent(product.storeUrl)}` +
    `&title=${encodeURIComponent(product.title)}` +
    `&price=${product.price}` +
    (product.imageUrl ? `&imageUrl=${encodeURIComponent(product.imageUrl)}` : '')

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency ?? 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(product.price)

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-card">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-bg-overlay">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute left-2 top-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-background">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Category pill */}
        <Link
          href={`/marketplace/${product.category.toLowerCase()}`}
          className="self-start rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:bg-subtle"
        >
          {slugToLabel(product.category.toLowerCase())}
        </Link>

        {/* Title */}
        <p className="line-clamp-2 flex-1 text-sm font-medium leading-snug text-foreground">
          {product.title}
        </p>

        {/* Price */}
        <p className="text-base font-semibold text-foreground">{formattedPrice}</p>

        {/* Description (optional) */}
        {product.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            View Deal
            <ExternalLink className="h-3 w-3" />
          </a>
          <Link
            href={addToWishlistUrl}
            className="flex items-center justify-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-subtle"
            title="Add to Wishlist"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Wishlist</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
