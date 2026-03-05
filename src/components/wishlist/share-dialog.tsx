'use client'

import { useState, useTransition } from 'react'
import { Link2, Globe, Lock, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateShareLink, makePublic } from '@/lib/actions/sharing'

interface ShareDialogProps {
  wishlistId: string
  currentPrivacy: string
  currentSlug: string
  username: string
  children: React.ReactNode
}

export function ShareDialog({ wishlistId, currentPrivacy, currentSlug, username, children }: ShareDialogProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'
  const shareUrl = `${appUrl}/@${username}/${currentSlug}`

  const [privacy, setPrivacy] = useState(currentPrivacy)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy link')
    }
  }

  function handleMakePublic() {
    startTransition(async () => {
      const result = await makePublic(wishlistId)
      if (result.success) {
        setPrivacy('PUBLIC')
        toast.success('Wishlist is now public')
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleGenerateLink() {
    startTransition(async () => {
      const result = await generateShareLink(wishlistId)
      if (result.success) {
        setPrivacy('SHARED')
        await navigator.clipboard.writeText(result.data.url).catch(() => null)
        toast.success('Share link copied to clipboard!')
      } else {
        toast.error(result.error)
      }
    })
  }

  const isPrivate = privacy === 'PRIVATE'

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share wishlist</DialogTitle>
          <DialogDescription>
            Choose how friends and family can access your wishlist.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Privacy status */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-subtle p-3">
            {privacy === 'PUBLIC' ? (
              <Globe className="h-4 w-4 text-foreground" />
            ) : privacy === 'SHARED' ? (
              <Link2 className="h-4 w-4 text-foreground" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {privacy === 'PUBLIC' ? 'Public' : privacy === 'SHARED' ? 'Shared via link' : 'Private'}
              </p>
              <p className="text-xs text-muted-foreground">
                {privacy === 'PUBLIC'
                  ? 'Anyone can find and view this wishlist'
                  : privacy === 'SHARED'
                  ? 'Only people with the link can view'
                  : 'Only you can see this wishlist'}
              </p>
            </div>
          </div>

          {/* Share URL */}
          {!isPrivate && (
            <div className="space-y-1.5">
              <Label>Wishlist link</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="text-xs" />
                <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {isPrivate && (
              <>
                <Button onClick={handleGenerateLink} disabled={isPending} variant="outline" className="w-full">
                  <Link2 className="mr-2 h-4 w-4" />
                  Create share link
                </Button>
                <Button onClick={handleMakePublic} disabled={isPending} className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  Make public
                </Button>
              </>
            )}

            {privacy === 'SHARED' && (
              <Button onClick={handleMakePublic} disabled={isPending} variant="outline" className="w-full">
                <Globe className="mr-2 h-4 w-4" />
                Make fully public
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
