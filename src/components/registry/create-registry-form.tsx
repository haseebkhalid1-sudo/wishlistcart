'use client'

import { useState, useTransition } from 'react'
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

interface CreateRegistryFormProps {
  onSuccess: (registryId: string) => void
  onCancel?: () => void
}

export function CreateRegistryForm({ onSuccess, onCancel }: CreateRegistryFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)

    // Treat "NONE" event type as absent
    if (formData.get('eventType') === 'NONE') {
      formData.delete('eventType')
    }

    startTransition(async () => {
      try {
        const result = await createRegistry(formData)
        if (!result.success) {
          setError(result.error)
          toast.error(result.error)
          return
        }
        toast.success('Registry created!')
        onSuccess(result.data.id)
      } catch {
        const msg = 'Something went wrong. Please try again.'
        setError(msg)
        toast.error(msg)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Event Type */}
      <div className="space-y-1.5">
        <Label htmlFor="eventType">Event Type *</Label>
        <Select name="eventType" defaultValue="NONE">
          <SelectTrigger id="eventType">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">Select event type…</SelectItem>
            <SelectItem value="WEDDING">Wedding</SelectItem>
            <SelectItem value="BABY_SHOWER">Baby Shower</SelectItem>
            <SelectItem value="BIRTHDAY">Birthday</SelectItem>
            <SelectItem value="HOLIDAY">Holiday</SelectItem>
            <SelectItem value="HOUSEWARMING">Housewarming</SelectItem>
            <SelectItem value="GRADUATION">Graduation</SelectItem>
            <SelectItem value="ANNIVERSARY">Anniversary</SelectItem>
            <SelectItem value="BACK_TO_SCHOOL">Back to School</SelectItem>
            <SelectItem value="CUSTOM">Custom / Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Registry Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Registry Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Sarah & Tom's Wedding Registry"
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
          placeholder="Optional — share any details for your guests"
          rows={2}
          className="resize-none"
          maxLength={500}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Event Date */}
        <div className="space-y-1.5">
          <Label htmlFor="eventDate">Event Date</Label>
          <Input id="eventDate" name="eventDate" type="date" />
        </div>

        {/* Privacy */}
        <div className="space-y-1.5">
          <Label htmlFor="privacy">Privacy</Label>
          <Select name="privacy" defaultValue="SHARED">
            <SelectTrigger id="privacy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRIVATE">Private (just me)</SelectItem>
              <SelectItem value="SHARED">Shared (link only)</SelectItem>
              <SelectItem value="PUBLIC">Public (discoverable)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Event Location */}
      <div className="space-y-1.5">
        <Label htmlFor="eventLocation">Event Location</Label>
        <Input
          id="eventLocation"
          name="eventLocation"
          placeholder="New York, NY"
        />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating…' : 'Create Registry'}
        </Button>
      </div>
    </form>
  )
}
