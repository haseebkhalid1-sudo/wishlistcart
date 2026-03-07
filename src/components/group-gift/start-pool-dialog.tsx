'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createGroupGiftPool } from '@/lib/actions/group-gift'

interface StartPoolDialogProps {
  itemId: string
  itemTitle: string
  itemPrice: number | null
  onPoolCreated?: (poolId: string) => void
}

export function StartPoolDialog({
  itemId,
  itemTitle,
  itemPrice,
  onPoolCreated,
}: StartPoolDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createGroupGiftPool(itemId, formData)

      if (result.success) {
        toast.success('Pool started!')
        setOpen(false)
        formRef.current?.reset()
        onPoolCreated?.(result.data.poolId)
        router.refresh()
      } else {
        setError(result.error)
        toast.error(result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" strokeWidth={1.5} />
          Start Group Gift
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Start a Group Gift Pool</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Let friends and family contribute toward this item together.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <p className="text-xs text-muted-foreground truncate">
            Item: <span className="text-foreground font-medium">{itemTitle}</span>
          </p>

          {/* Goal amount */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pool-goal" className="text-xs text-muted-foreground">
              Goal ($) <span className="text-foreground">*</span>
            </Label>
            <Input
              id="pool-goal"
              name="goalAmount"
              type="number"
              min={1}
              step="0.01"
              required
              defaultValue={itemPrice ?? ''}
              placeholder="e.g. 150"
              disabled={isPending}
              className="h-9 text-sm"
            />
          </div>

          {/* Deadline */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pool-deadline" className="text-xs text-muted-foreground">
              Collection deadline{' '}
              <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Input
              id="pool-deadline"
              name="deadline"
              type="date"
              disabled={isPending}
              className="h-9 text-sm"
            />
          </div>

          {/* Inline error */}
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

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
              className="flex-1 h-9 bg-foreground text-background hover:bg-foreground/90"
            >
              {isPending ? 'Creating…' : 'Start pool'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
