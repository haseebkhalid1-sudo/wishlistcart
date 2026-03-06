'use client'

import { useState, useTransition } from 'react'
import { Bell, BellOff } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createPriceAlert, deletePriceAlert } from '@/lib/actions/price-alerts'
import { toast } from 'sonner'

interface PriceAlertFormProps {
  itemId: string
  currentPrice?: number | null
  existingAlertId?: string | null
  isPro?: boolean
}

export function PriceAlertForm({ itemId, currentPrice, existingAlertId, isPro }: PriceAlertFormProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'ANY_DROP' | 'TARGET_PRICE' | 'PERCENTAGE_DROP'>('ANY_DROP')
  const [targetPrice, setTargetPrice] = useState('')
  const [percentageDrop, setPercentageDrop] = useState('10')
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    startTransition(async () => {
      const data: Record<string, unknown> = { itemId, type }
      if (type === 'TARGET_PRICE') data.targetPrice = parseFloat(targetPrice)
      if (type === 'PERCENTAGE_DROP') data.percentageDrop = parseInt(percentageDrop)

      const result = await createPriceAlert(data)
      if (result.success) {
        toast.success('Price alert set!')
        setOpen(false)
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!existingAlertId) return
    startTransition(async () => {
      const result = await deletePriceAlert(existingAlertId)
      if (result.success) {
        toast.success('Alert removed')
      } else {
        toast.error(result.error)
      }
    })
  }

  // Free plan upgrade prompt
  if (!isPro && !existingAlertId) {
    return (
      <div className="rounded-lg border border-border bg-subtle p-3 text-sm">
        <p className="font-medium text-foreground">Price alerts are a Pro feature</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Upgrade to get notified when this item drops in price.</p>
        <a
          href="/dashboard/settings"
          className="mt-2 inline-block rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 transition-opacity"
        >
          Upgrade to Pro
        </a>
      </div>
    )
  }

  if (existingAlertId) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={isPending}
        className="gap-1.5 text-foreground"
      >
        <BellOff className="h-3.5 w-3.5" />
        Remove alert
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Bell className="h-3.5 w-3.5" />
          Set price alert
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Set price alert</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {currentPrice && (
            <p className="text-sm text-muted-foreground">
              Current price: <span className="font-medium text-foreground">${currentPrice.toFixed(2)}</span>
            </p>
          )}

          <div className="space-y-1.5">
            <Label>Alert me when</Label>
            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANY_DROP">Price drops at all</SelectItem>
                <SelectItem value="TARGET_PRICE">Price drops below a target</SelectItem>
                <SelectItem value="PERCENTAGE_DROP">Price drops by a percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'TARGET_PRICE' && (
            <div className="space-y-1.5">
              <Label htmlFor="targetPrice">Target price ($)</Label>
              <Input
                id="targetPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 29.99"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            </div>
          )}

          {type === 'PERCENTAGE_DROP' && (
            <div className="space-y-1.5">
              <Label htmlFor="percentageDrop">Drop percentage (%)</Label>
              <Input
                id="percentageDrop"
                type="number"
                min="1"
                max="99"
                placeholder="e.g. 10"
                value={percentageDrop}
                onChange={(e) => setPercentageDrop(e.target.value)}
              />
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                isPending ||
                (type === 'TARGET_PRICE' && !targetPrice) ||
                (type === 'PERCENTAGE_DROP' && !percentageDrop)
              }
            >
              {isPending ? 'Saving…' : 'Set alert'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
