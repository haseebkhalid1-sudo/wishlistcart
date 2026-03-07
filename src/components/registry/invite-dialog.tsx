'use client'

import { useState, useTransition } from 'react'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { sendRegistryInvite } from '@/lib/actions/registry-invite'

interface InviteDialogProps {
  registryId: string
  registryName: string
  shareUrl: string
}

export function InviteDialog({ registryId, registryName }: InviteDialogProps) {
  const [open, setOpen] = useState(false)
  const [rawText, setRawText] = useState('')
  const [isPending, startTransition] = useTransition()

  function parseEmails(text: string): string[] {
    return text
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
  }

  function handleSend() {
    const emails = parseEmails(rawText)
    if (emails.length === 0) {
      toast.error('No valid email addresses found')
      return
    }

    startTransition(async () => {
      const result = await sendRegistryInvite(registryId, emails)
      if (result.success) {
        toast.success(`Invitations sent to ${result.data.sent} ${result.data.sent === 1 ? 'person' : 'people'}!`)
        setRawText('')
        setOpen(false)
      } else {
        toast.error(result.error ?? 'Failed to send invitations')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Mail className="h-4 w-4" />
          Invite guests
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite guests to {registryName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Enter email addresses to send them a link to your registry.
          </p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-emails">Email addresses</Label>
            <Textarea
              id="invite-emails"
              placeholder={'alice@example.com\nbob@example.com'}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={5}
              className="resize-none font-mono text-sm"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple addresses with commas, semicolons, or new lines. Up to 20 per send.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90"
              onClick={handleSend}
              disabled={isPending}
            >
              {isPending ? 'Sending…' : 'Send invitations'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
