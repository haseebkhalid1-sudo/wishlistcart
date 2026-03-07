'use client'

import { useState, useTransition } from 'react'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { submitRsvp } from '@/lib/actions/registry-rsvp'

interface RsvpFormProps {
  shareToken: string
  registryName: string
}

type AttendingValue = 'YES' | 'NO' | 'MAYBE'

export function RsvpForm({ shareToken, registryName }: RsvpFormProps) {
  const [isPending, startTransition] = useTransition()
  const [attending, setAttending] = useState<AttendingValue | ''>('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const name = (formData.get('name') as string).trim()
    const email = (formData.get('email') as string).trim()
    const guestCountRaw = formData.get('guestCount') as string
    const message = (formData.get('message') as string | null)?.trim() || undefined

    if (!attending) {
      toast.error('Please select whether you will attend.')
      return
    }

    const guestCount =
      attending === 'YES' || attending === 'MAYBE'
        ? Math.max(1, Math.min(10, parseInt(guestCountRaw || '1', 10)))
        : undefined

    startTransition(async () => {
      const result = await submitRsvp(shareToken, {
        name,
        email,
        attending: attending as AttendingValue,
        guestCount,
        message,
      })

      if (result.success) {
        setSubmittedName(name)
        setSubmitted(true)
      } else {
        toast.error(result.error)
      }
    })
  }

  if (submitted) {
    return (
      <div className="border border-border rounded-xl p-6 flex flex-col items-center gap-3 text-center">
        <CheckCircle className="w-8 h-8 text-foreground" strokeWidth={1.5} />
        <p className="font-medium text-foreground">
          RSVP sent! Thank you, {submittedName}.
        </p>
        <p className="text-xs text-muted-foreground">
          The host of <span className="font-medium">{registryName}</span> will be notified.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-xl p-5">
      <h3 className="font-semibold text-sm text-foreground mb-4">RSVP</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="rsvp-name" className="text-xs text-muted-foreground">
            Name <span className="text-foreground">*</span>
          </Label>
          <Input
            id="rsvp-name"
            name="name"
            placeholder="Your name"
            required
            maxLength={100}
            disabled={isPending}
            className="h-9 text-sm"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="rsvp-email" className="text-xs text-muted-foreground">
            Email <span className="text-foreground">*</span>
          </Label>
          <Input
            id="rsvp-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            disabled={isPending}
            className="h-9 text-sm"
          />
        </div>

        {/* Attending */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">
            Attending <span className="text-foreground">*</span>
          </Label>
          <Select
            value={attending}
            onValueChange={(val) => setAttending(val as AttendingValue)}
            disabled={isPending}
            required
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YES">Yes, I&apos;ll be there</SelectItem>
              <SelectItem value="NO">Sorry, can&apos;t make it</SelectItem>
              <SelectItem value="MAYBE">Maybe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Guest count — only shown when YES or MAYBE */}
        {(attending === 'YES' || attending === 'MAYBE') && (
          <div className="flex flex-col gap-1">
            <Label htmlFor="rsvp-guests" className="text-xs text-muted-foreground">
              Number of guests
            </Label>
            <Input
              id="rsvp-guests"
              name="guestCount"
              type="number"
              min={1}
              max={10}
              defaultValue={1}
              disabled={isPending}
              className="h-9 text-sm"
            />
          </div>
        )}

        {/* Message */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="rsvp-message" className="text-xs text-muted-foreground">
            Message <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <textarea
            id="rsvp-message"
            name="message"
            placeholder="Optional message for the couple"
            rows={2}
            disabled={isPending}
            maxLength={500}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || !attending}
          className="w-full h-9 bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90 mt-1"
        >
          {isPending ? 'Sending…' : 'Send RSVP'}
        </Button>
      </form>
    </div>
  )
}
