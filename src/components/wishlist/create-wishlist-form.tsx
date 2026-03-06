'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
import { createWishlist } from '@/lib/actions/wishlists'
import { toast } from 'sonner'

export function CreateWishlistForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        const result = await createWishlist(formData)
        if (!result.success) {
          setError(result.error)
          return
        }
        toast.success('Wishlist created!')
        router.push(`/dashboard/wishlists/${result.data.id}`)
      } catch (err) {
        console.error('[CreateWishlistForm]', err)
        setError('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Birthday wishlist, Wedding registry…"
          required
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Optional description"
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="privacy">Privacy</Label>
          <Select name="privacy" defaultValue="PRIVATE">
            <SelectTrigger id="privacy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRIVATE">Private</SelectItem>
              <SelectItem value="SHARED">Share with link</SelectItem>
              <SelectItem value="PUBLIC">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="eventType">Occasion</Label>
          <Select name="eventType" defaultValue="">
            <SelectTrigger id="eventType">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="BIRTHDAY">Birthday</SelectItem>
              <SelectItem value="WEDDING">Wedding</SelectItem>
              <SelectItem value="BABY_SHOWER">Baby shower</SelectItem>
              <SelectItem value="HOLIDAY">Holiday</SelectItem>
              <SelectItem value="HOUSEWARMING">Housewarming</SelectItem>
              <SelectItem value="GRADUATION">Graduation</SelectItem>
              <SelectItem value="ANNIVERSARY">Anniversary</SelectItem>
              <SelectItem value="CUSTOM">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating…' : 'Create wishlist'}
        </Button>
      </div>
    </form>
  )
}
