'use client'

import { useState } from 'react'
import { Star, StarOff, Trash2, Loader2 } from 'lucide-react'
import { featureProduct, deleteMarketplaceProduct } from '@/lib/actions/marketplace'
import type { MarketplaceProductRow } from '@/lib/actions/marketplace'
import { useRouter } from 'next/navigation'

interface AdminProductRowProps {
  product: MarketplaceProductRow
}

export function AdminProductRow({ product }: AdminProductRowProps) {
  const router = useRouter()
  const [loadingFeature, setLoadingFeature] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  async function handleFeature() {
    setLoadingFeature(true)
    await featureProduct(product.id, !product.isFeatured)
    setLoadingFeature(false)
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return
    setLoadingDelete(true)
    await deleteMarketplaceProduct(product.id)
    setLoadingDelete(false)
    router.refresh()
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency ?? 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(product.price)

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      {/* Thumbnail */}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-bg-overlay">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="h-full w-full object-contain" />
        ) : null}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
        <p className="text-xs text-muted-foreground">
          {product.category} · {formattedPrice} · {product.clickCount} clicks
        </p>
        {product.isFeatured && (
          <span className="inline-block rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
            Featured
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleFeature}
          disabled={loadingFeature}
          title={product.isFeatured ? 'Unfeature' : 'Feature'}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground disabled:opacity-50"
        >
          {loadingFeature ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : product.isFeatured ? (
            <StarOff className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loadingDelete}
          title="Delete product"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-subtle hover:text-destructive disabled:opacity-50"
        >
          {loadingDelete ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
