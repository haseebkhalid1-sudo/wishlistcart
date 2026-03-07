'use client'

import { useTransition, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createPoolContributionCheckout } from '@/lib/actions/group-gift'

interface ContributionFormProps {
  poolId: string
}

const SUGGESTED_AMOUNTS = [10, 25, 50, 100]

export function ContributionForm({ poolId }: ContributionFormProps) {
  const [isPending, startTransition] = useTransition()
  const [amount, setAmount] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSuggestedAmount(value: number) {
    setAmount(String(value))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    // Ensure amount from state is in formData (controlled input)
    formData.set('amount', amount)

    startTransition(async () => {
      const result = await createPoolContributionCheckout(poolId, formData)
      if (result.success) {
        window.location.href = result.data.url
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="contrib-name">Your name</Label>
        <Input
          id="contrib-name"
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="e.g. Aunt Sarah"
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contrib-email">Email address</Label>
        <Input
          id="contrib-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contrib-amount">Contribution amount (USD)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {SUGGESTED_AMOUNTS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleSuggestedAmount(val)}
              disabled={isPending}
              className={
                'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ' +
                (amount === String(val)
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-foreground hover:border-foreground')
              }
            >
              ${val}
            </button>
          ))}
        </div>
        <Input
          id="contrib-amount"
          name="amount"
          type="number"
          required
          min={1}
          max={100000}
          step="0.01"
          placeholder="$25"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contrib-message">Message (optional)</Label>
        <Textarea
          id="contrib-message"
          name="message"
          maxLength={500}
          rows={3}
          placeholder="Add a personal note..."
          disabled={isPending}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="contrib-anon"
          name="isAnonymous"
          value="true"
          disabled={isPending}
        />
        <Label htmlFor="contrib-anon" className="text-sm font-normal cursor-pointer">
          Keep my name private from the registry owner
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-foreground text-background hover:opacity-90 transition-opacity"
        disabled={isPending || !amount}
      >
        {isPending ? 'Redirecting to payment…' : 'Contribute'}
      </Button>
    </form>
  )
}
