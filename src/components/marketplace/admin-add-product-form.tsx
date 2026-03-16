'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { addMarketplaceProduct } from '@/lib/actions/marketplace'
import { MARKETPLACE_CATEGORIES } from '@/lib/marketplace-utils'

export function AdminAddProductForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const form = e.currentTarget
    const data = new FormData(form)

    const tagsRaw = (data.get('tags') as string) ?? ''
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const result = await addMarketplaceProduct({
      title: data.get('title') as string,
      description: (data.get('description') as string) || undefined,
      price: parseFloat(data.get('price') as string),
      currency: (data.get('currency') as string) || 'USD',
      imageUrl: (data.get('imageUrl') as string) || undefined,
      storeUrl: data.get('storeUrl') as string,
      tags,
      category: data.get('category') as string,
      isFeatured: data.get('isFeatured') === 'on',
    })

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setSuccess(true)
    form.reset()
    setTimeout(() => {
      setSuccess(false)
      setOpen(false)
    }, 1500)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Add Product
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Add Marketplace Product</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            name="title"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground"
            placeholder="e.g. Kindle Paperwhite"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground">Description</label>
          <textarea
            name="description"
            rows={2}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground"
            placeholder="Optional short description"
          />
        </div>

        {/* Price */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Price <span className="text-destructive">*</span>
          </label>
          <input
            name="price"
            type="number"
            required
            min="0"
            step="0.01"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground"
            placeholder="29.99"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">Currency</label>
          <input
            name="currency"
            defaultValue="USD"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground"
            placeholder="USD"
          />
        </div>

        {/* Image URL */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground">Image URL</label>
          <input
            name="imageUrl"
            type="url"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground"
            placeholder="https://..."
          />
        </div>

        {/* Store URL */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-foreground">
            Store URL <span className="text-destructive">*</span>
          </label>
          <input
            name="storeUrl"
            type="url"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground"
            placeholder="https://amazon.com/dp/..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Category <span className="text-destructive">*</span>
          </label>
          <select
            name="category"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground"
          >
            <option value="">Select category…</option>
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">Tags (comma-separated)</label>
          <input
            name="tags"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground"
            placeholder="kindle, reading, gift"
          />
        </div>

        {/* Featured */}
        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="isFeatured" className="text-sm text-foreground">
            Mark as featured
          </label>
        </div>

        {/* Error / success */}
        {error && <p className="sm:col-span-2 text-xs text-destructive">{error}</p>}
        {success && <p className="sm:col-span-2 text-xs text-green-600">Product added!</p>}

        {/* Submit */}
        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {loading ? 'Adding…' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
