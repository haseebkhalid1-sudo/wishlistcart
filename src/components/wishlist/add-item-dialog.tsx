'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { createItem } from '@/lib/actions/items'
import type { ScrapedProduct } from '@/types'
import { toast } from 'sonner'
import { Loader2, ExternalLink } from 'lucide-react'

interface AddItemDialogProps {
  wishlistId: string
}

export function AddItemDialog({ wishlistId }: AddItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // URL scraper state
  const [pasteUrl, setPasteUrl] = useState('')
  const [isScraping, setIsScraping] = useState(false)
  const [scraped, setScraped] = useState<ScrapedProduct | null>(null)
  const [scrapeError, setScrapeError] = useState<string | null>(null)

  async function handleScrape() {
    if (!pasteUrl.trim()) return
    setIsScraping(true)
    setScrapeError(null)
    setScraped(null)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pasteUrl }),
      })
      const data = (await res.json()) as ScrapedProduct | { error: string }

      if (!res.ok) {
        setScrapeError((data as { error: string }).error ?? 'Failed to extract product data')
      } else {
        setScraped(data as ScrapedProduct)
      }
    } catch {
      setScrapeError('Network error — please try again')
    } finally {
      setIsScraping(false)
    }
  }

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createItem(wishlistId, formData)
      if (!result.success) {
        setError(result.error)
        return
      }
      toast.success('Item added!')
      setOpen(false)
      resetState()
    })
  }

  function resetState() {
    setPasteUrl('')
    setScraped(null)
    setScrapeError(null)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetState() }}>
      <DialogTrigger asChild>
        <Button>+ Add item</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add an item</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="url">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="url" className="flex-1">Paste URL</TabsTrigger>
            <TabsTrigger value="manual" className="flex-1">Manual</TabsTrigger>
          </TabsList>

          {/* ---- URL Tab ---- */}
          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={pasteUrl}
                onChange={(e) => setPasteUrl(e.target.value)}
                placeholder="https://amazon.com/dp/…"
                type="url"
                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleScrape}
                disabled={isScraping || !pasteUrl.trim()}
              >
                {isScraping ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Extract'}
              </Button>
            </div>

            {scrapeError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {scrapeError}
              </p>
            )}

            {isScraping && (
              <div className="space-y-3 rounded-xl border border-border bg-subtle p-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}

            {scraped && !isScraping && (
              <ScrapedPreview scraped={scraped} wishlistId={wishlistId} onSave={() => { setOpen(false); resetState() }} />
            )}

            {!scraped && !isScraping && !scrapeError && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Paste a product link from Amazon, Etsy, Walmart, or any other store.
              </p>
            )}
          </TabsContent>

          {/* ---- Manual Tab ---- */}
          <TabsContent value="manual">
            <ManualForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} error={error} isPending={isPending} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// ---- Scraped product preview + save ----

function ScrapedPreview({
  scraped,
  wishlistId,
  onSave,
}: {
  scraped: ScrapedProduct
  wishlistId: string
  onSave: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('title', scraped.title ?? 'Untitled product')
      if (scraped.price != null) formData.set('price', String(scraped.price))
      formData.set('currency', scraped.currency ?? 'USD')
      if (scraped.url) formData.set('url', scraped.url)
      if (scraped.imageUrl) formData.set('imageUrl', scraped.imageUrl)
      if (scraped.storeName) formData.set('storeName', scraped.storeName)

      const result = await createItem(wishlistId, formData)
      if (!result.success) {
        setError(result.error)
        return
      }
      toast.success('Item added!')
      onSave()
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 rounded-xl border border-border bg-subtle p-4">
        {scraped.imageUrl && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-bg-overlay">
            <Image src={scraped.imageUrl} alt={scraped.title ?? ''} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground line-clamp-2 text-sm">
            {scraped.title ?? 'Unknown product'}
          </p>
          {scraped.storeName && (
            <p className="mt-0.5 text-xs text-muted-foreground uppercase tracking-wide">
              {scraped.storeName}
            </p>
          )}
          {scraped.price != null && (
            <p className="mt-1 font-semibold text-foreground">
              ${scraped.price.toFixed(2)} {scraped.currency}
            </p>
          )}
          {scraped.url && (
            <a
              href={scraped.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View product <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving…' : 'Add to wishlist'}
        </Button>
      </div>
    </div>
  )
}

// ---- Manual form ----

function ManualForm({
  onSubmit,
  onCancel,
  error,
  isPending,
}: {
  onSubmit: (formData: FormData) => void
  onCancel: () => void
  error: string | null
  isPending: boolean
}) {
  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" placeholder="Product name" required autoFocus />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="29.99" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Select name="currency" defaultValue="USD">
            <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="CAD">CAD</SelectItem>
              <SelectItem value="AUD">AUD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">Product URL</Label>
        <Input id="url" name="url" type="url" placeholder="https://…" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="storeName">Store</Label>
        <Input id="storeName" name="storeName" placeholder="Amazon, Etsy…" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://…" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="priority">Priority</Label>
        <Select name="priority" defaultValue="3">
          <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Low</SelectItem>
            <SelectItem value="2">Low-Medium</SelectItem>
            <SelectItem value="3">Medium</SelectItem>
            <SelectItem value="4">High</SelectItem>
            <SelectItem value="5">Must have</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Size, color, any notes…" rows={2} className="resize-none" />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Add item'}</Button>
      </div>
    </form>
  )
}
