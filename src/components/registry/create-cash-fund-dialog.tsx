'use client'

import { useState, useTransition, useRef } from 'react'
import { Gift } from 'lucide-react'
import { toast } from 'sonner'
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
import { createCashFund } from '@/lib/actions/cash-fund'

interface CreateCashFundDialogProps {
  registryId: string
  onCreated?: (fundId: string) => void
}

export function CreateCashFundDialog({ registryId, onCreated }: CreateCashFundDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createCashFund(registryId, formData)

      if (result.success) {
        toast.success('Cash fund created!')
        setOpen(false)
        formRef.current?.reset()
        onCreated?.(result.data.fundId)
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Gift className="h-4 w-4 mr-2" strokeWidth={1.5} />
          Add Cash Fund
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add a cash fund</DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cf-title" className="text-xs text-muted-foreground">
              Title <span className="text-foreground">*</span>
            </Label>
            <Input
              id="cf-title"
              name="title"
              placeholder="Honeymoon Fund, Diaper Fund…"
              required
              maxLength={100}
              disabled={isPending}
              className="h-9 text-sm"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cf-description" className="text-xs text-muted-foreground">
              Description <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea
              id="cf-description"
              name="description"
              placeholder="Tell guests what this fund is for…"
              rows={2}
              maxLength={500}
              disabled={isPending}
              className="text-sm resize-none"
            />
          </div>

          {/* Goal amount */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cf-goal" className="text-xs text-muted-foreground">
              Goal amount <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Input
              id="cf-goal"
              name="goalAmount"
              type="number"
              min={1}
              max={999999}
              step="0.01"
              placeholder="500 (optional)"
              disabled={isPending}
              className="h-9 text-sm"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-9"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-9 bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90"
            >
              {isPending ? 'Creating…' : 'Create fund'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
