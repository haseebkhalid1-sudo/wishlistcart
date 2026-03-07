'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { createRegistry } from '@/lib/actions/registries'
import { toast } from 'sonner'

export function CreateRegistryForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        const result = await createRegistry(formData)
        if (!result.success) {
          setError(result.error)
          return
        }
        toast.success('Registry created!')
        router.push(`/dashboard/registries/${result.data.id}`)
      } catch {
        setError('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Registry name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Registry name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Our Wedding Registry, Baby Shower…"
          required
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="A short note for your guests (optional)"
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Event type + privacy */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="eventType">Event type *</Label>
          <Select name="eventType" defaultValue="WEDDING">
            <SelectTrigger id="eventType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEDDING">Wedding</SelectItem>
              <SelectItem value="BABY_SHOWER">Baby Shower</SelectItem>
              <SelectItem value="BIRTHDAY">Birthday</SelectItem>
              <SelectItem value="GRADUATION">Graduation</SelectItem>
              <SelectItem value="HOUSEWARMING">Housewarming</SelectItem>
              <SelectItem value="ANNIVERSARY">Anniversary</SelectItem>
              <SelectItem value="HOLIDAY">Holiday</SelectItem>
              <SelectItem value="BACK_TO_SCHOOL">Back to School</SelectItem>
              <SelectItem value="CUSTOM">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="privacy">Visibility</Label>
          <Select name="privacy" defaultValue="SHARED">
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
      </div>

      {/* Event date + location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="eventDate">Event date</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            className="block"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="eventLocation">Location</Label>
          <Input
            id="eventLocation"
            name="eventLocation"
            placeholder="City, venue…"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button type="button" variant="outline" asChild disabled={isPending}>
          <Link href="/dashboard/registries">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating…' : 'Create registry'}
        </Button>
      </div>
    </form>
  )
}
