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
import { updateRegistry, archiveRegistry, deleteRegistry } from '@/lib/actions/registries'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegistrySettingsFormProps {
  registry: {
    id: string
    name: string
    description: string | null
    eventType: string | null
    eventDate: Date | null
    eventLocation: string | null
    privacy: string
  }
}

// ─── Registry Settings Form ───────────────────────────────────────────────────

export function RegistrySettingsForm({ registry }: RegistrySettingsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const eventDateValue = registry.eventDate
    ? new Date(registry.eventDate).toISOString().split('T')[0]
    : ''

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        const result = await updateRegistry(registry.id, formData)
        if (!result.success) {
          setError(result.error)
          toast.error(result.error)
          return
        }
        toast.success('Registry updated')
        router.refresh()
      } catch {
        const msg = 'Something went wrong. Please try again.'
        setError(msg)
        toast.error(msg)
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
          defaultValue={registry.name}
          placeholder="Our Wedding Registry, Baby Shower…"
          required
        />
      </div>

      {/* Event type */}
      <div className="space-y-1.5">
        <Label htmlFor="eventType">Event type</Label>
        <Select name="eventType" defaultValue={registry.eventType ?? 'WEDDING'}>
          <SelectTrigger id="eventType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WEDDING">Wedding</SelectItem>
            <SelectItem value="BABY_SHOWER">Baby Shower</SelectItem>
            <SelectItem value="BIRTHDAY">Birthday</SelectItem>
            <SelectItem value="HOLIDAY">Holiday</SelectItem>
            <SelectItem value="HOUSEWARMING">Housewarming</SelectItem>
            <SelectItem value="GRADUATION">Graduation</SelectItem>
            <SelectItem value="ANNIVERSARY">Anniversary</SelectItem>
            <SelectItem value="BACK_TO_SCHOOL">Back to School</SelectItem>
            <SelectItem value="CUSTOM">Custom Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Event date + location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="eventDate">Event date</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={eventDateValue}
            className="block"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="eventLocation">Location</Label>
          <Input
            id="eventLocation"
            name="eventLocation"
            defaultValue={registry.eventLocation ?? ''}
            placeholder="City, venue…"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={registry.description ?? ''}
          placeholder="A short note for your guests (optional)"
          rows={3}
          maxLength={500}
          className="resize-none"
        />
      </div>

      {/* Privacy */}
      <div className="space-y-1.5">
        <Label htmlFor="privacy">Visibility</Label>
        <Select name="privacy" defaultValue={registry.privacy}>
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

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-foreground text-background hover:bg-foreground/90"
      >
        {isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}

// ─── Danger Zone ──────────────────────────────────────────────────────────────

interface DangerZoneProps {
  registryId: string
  isArchived: boolean
}

export function DangerZone({ registryId, isArchived }: DangerZoneProps) {
  const router = useRouter()
  const [isArchivePending, startArchiveTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)

  function handleArchive() {
    startArchiveTransition(async () => {
      try {
        const result = await archiveRegistry(registryId, !isArchived)
        if (!result.success) {
          toast.error(result.error)
          return
        }
        toast.success(isArchived ? 'Registry restored' : 'Registry archived')
        router.refresh()
      } catch {
        toast.error('Something went wrong. Please try again.')
      }
    })
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      try {
        const result = await deleteRegistry(registryId)
        if (!result.success) {
          toast.error(result.error)
          return
        }
        toast.success('Registry deleted')
        router.push('/dashboard/registries')
      } catch {
        // deleteRegistry calls redirect() on success which throws internally —
        // treat non-redirect throws as real errors
        toast.error('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <div className="rounded-xl border border-destructive/30 divide-y divide-destructive/20">
      {/* Archive */}
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            {isArchived ? 'Restore registry' : 'Archive registry'}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isArchived
              ? 'This will restore the registry to your dashboard.'
              : 'This hides the registry from your dashboard.'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleArchive}
          disabled={isArchivePending}
          className="shrink-0"
        >
          {isArchivePending
            ? isArchived
              ? 'Restoring…'
              : 'Archiving…'
            : isArchived
              ? 'Restore'
              : 'Archive'}
        </Button>
      </div>

      {/* Delete */}
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-sm font-medium text-foreground">Delete registry</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Permanently removes this registry and all its items. This cannot be undone.
          </p>
        </div>

        {showConfirm ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              disabled={isDeletePending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeletePending}
            >
              {isDeletePending ? 'Deleting…' : 'Yes, delete'}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirm(true)}
            className="shrink-0 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
