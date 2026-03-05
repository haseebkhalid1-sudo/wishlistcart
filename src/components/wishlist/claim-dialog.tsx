'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { claimItem } from '@/lib/actions/claiming'

interface ClaimDialogProps {
  itemId: string
  itemTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaimed: () => void
}

export function ClaimDialog({ itemId, itemTitle, open, onOpenChange, onClaimed }: ClaimDialogProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClaim() {
    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }

    startTransition(async () => {
      const result = await claimItem(itemId, { name, message: message || undefined, isAnonymous })
      if (result.success) {
        toast.success('Item claimed! The wishlist owner won\'t see who got it.')
        onClaimed()
        onOpenChange(false)
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>I'll get this gift</DialogTitle>
          <DialogDescription>
            Let others know this item is taken. The wishlist owner won't know — it's a surprise!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground line-clamp-1">
            <span className="font-medium text-foreground">Item:</span> {itemTitle}
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="claim-name">Your name</Label>
            <Input
              id="claim-name"
              placeholder="e.g. Aunt Sarah"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="claim-message">Message (optional)</Label>
            <Textarea
              id="claim-message"
              placeholder="Add a personal note..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="claim-anon"
              checked={isAnonymous}
              onCheckedChange={(v) => setIsAnonymous(!!v)}
            />
            <Label htmlFor="claim-anon" className="text-sm font-normal cursor-pointer">
              Stay anonymous (show as "Someone")
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleClaim} disabled={isPending}>
            {isPending ? 'Claiming…' : 'Confirm claim'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
