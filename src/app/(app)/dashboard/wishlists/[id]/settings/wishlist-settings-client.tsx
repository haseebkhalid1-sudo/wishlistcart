'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Prisma } from '@prisma/client'
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
import { Separator } from '@/components/ui/separator'
import { updateWishlist, deleteWishlist, toggleArchiveWishlist } from '@/lib/actions/wishlists'
import { generateShareLink, makePublic } from '@/lib/actions/sharing'
import { toast } from 'sonner'
import { Copy, Check, Globe, Lock, Link2 } from 'lucide-react'

type WishlistFull = Prisma.WishlistGetPayload<{
  include: { _count: { select: { items: true } } }
}>

interface Props {
  wishlist: WishlistFull
}

export function WishlistSettingsClient({ wishlist }: Props) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function handleSave(formData: FormData) {
    setFormError(null)
    startTransition(async () => {
      const result = await updateWishlist(wishlist.id, formData)
      if (!result.success) {
        setFormError(result.error)
        return
      }
      toast.success('Settings saved')
    })
  }

  function handleGenerateLink() {
    startTransition(async () => {
      const result = await generateShareLink(wishlist.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setShareUrl(result.data.url)
      toast.success('Share link generated')
    })
  }

  function handleMakePublic() {
    startTransition(async () => {
      const result = await makePublic(wishlist.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Wishlist is now public')
    })
  }

  function handleCopyLink() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDelete() {
    if (!confirm(`Delete "${wishlist.name}"? This cannot be undone.`)) return
    startTransition(async () => {
      await deleteWishlist(wishlist.id)
      // deleteWishlist redirects internally
    })
  }

  function handleArchive() {
    startTransition(async () => {
      const result = await toggleArchiveWishlist(wishlist.id, !wishlist.isArchived)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(wishlist.isArchived ? 'Wishlist unarchived' : 'Wishlist archived')
      router.push('/dashboard/wishlists')
    })
  }

  const currentShareUrl =
    shareUrl ??
    (wishlist.shareToken
      ? `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'}/@${wishlist.userId}/${wishlist.slug}`
      : null)

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/wishlists" className="hover:text-foreground transition-colors">
          Wishlists
        </Link>
        <span>/</span>
        <Link
          href={`/dashboard/wishlists/${wishlist.id}`}
          className="hover:text-foreground transition-colors"
        >
          {wishlist.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Settings</span>
      </div>

      <h1 className="mb-8 font-serif text-display-md text-foreground">Wishlist settings</h1>

      {/* ---- General settings ---- */}
      <section className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          General
        </h2>

        <form action={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={wishlist.name}
              placeholder="My wishlist"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={wishlist.description ?? ''}
              placeholder="What's this list for?"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="privacy">Privacy</Label>
            <Select name="privacy" defaultValue={wishlist.privacy}>
              <SelectTrigger id="privacy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE">
                  <span className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" /> Private — only you
                  </span>
                </SelectItem>
                <SelectItem value="SHARED">
                  <span className="flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5" /> Shared — anyone with the link
                  </span>
                </SelectItem>
                <SelectItem value="PUBLIC">
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" /> Public — discoverable
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </section>

      <Separator className="my-8" />

      {/* ---- Sharing ---- */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Sharing
        </h2>

        <p className="text-sm text-muted-foreground">
          Share this wishlist with friends and family so they can see what you want.
        </p>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateLink} disabled={isPending}>
            <Link2 className="mr-2 h-4 w-4" />
            {wishlist.shareToken ? 'Regenerate link' : 'Generate share link'}
          </Button>
          <Button variant="outline" onClick={handleMakePublic} disabled={isPending || wishlist.privacy === 'PUBLIC'}>
            <Globe className="mr-2 h-4 w-4" />
            Make public
          </Button>
        </div>

        {currentShareUrl && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-subtle p-3">
            <p className="flex-1 truncate text-sm text-muted-foreground">{currentShareUrl}</p>
            <Button size="sm" variant="outline" onClick={handleCopyLink} className="shrink-0">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}
      </section>

      <Separator className="my-8" />

      {/* ---- Danger zone ---- */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-destructive">
          Danger zone
        </h2>

        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {wishlist.isArchived ? 'Unarchive this wishlist' : 'Archive this wishlist'}
              </p>
              <p className="text-xs text-muted-foreground">
                {wishlist.isArchived
                  ? 'Restore the wishlist to your active lists.'
                  : 'Hide from your dashboard. Items are preserved.'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleArchive} disabled={isPending}>
              {wishlist.isArchived ? 'Unarchive' : 'Archive'}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Delete this wishlist</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete this wishlist and all {wishlist._count.items} items. Cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
              Delete
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
