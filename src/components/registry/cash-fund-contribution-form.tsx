'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCashFundContributionCheckout } from '@/lib/actions/cash-fund'

interface CashFundContributionFormProps {
  fundId: string
}

const SUGGESTED_AMOUNTS = [10, 25, 50, 100]

export function CashFundContributionForm({ fundId }: CashFundContributionFormProps) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createCashFundContributionCheckout(fundId, formData)

      if (result.success) {
        window.location.href = result.data.url
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="border border-border rounded-xl p-5">
      <h3 className="font-semibold text-sm text-foreground mb-4">Make a contribution</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cf-contrib-name" className="text-xs text-muted-foreground">
            Your name <span className="text-foreground">*</span>
          </Label>
          <Input
            id="cf-contrib-name"
            name="name"
            placeholder="Jane Smith"
            required
            maxLength={100}
            disabled={isPending}
            className="h-9 text-sm"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cf-contrib-email" className="text-xs text-muted-foreground">
            Email <span className="text-foreground">*</span>
          </Label>
          <Input
            id="cf-contrib-email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            required
            disabled={isPending}
            className="h-9 text-sm"
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cf-contrib-amount" className="text-xs text-muted-foreground">
            Amount (USD) <span className="text-foreground">*</span>
          </Label>

          {/* Suggested amounts */}
          <div className="flex gap-2 flex-wrap">
            {SUGGESTED_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                disabled={isPending}
                onClick={() => {
                  const input = document.getElementById('cf-contrib-amount') as HTMLInputElement | null
                  if (input) input.value = String(amt)
                }}
                className="px-3 py-1 text-xs border border-border rounded-md hover:border-foreground transition-colors disabled:opacity-50"
              >
                ${amt}
              </button>
            ))}
          </div>

          <Input
            id="cf-contrib-amount"
            name="amount"
            type="number"
            min={1}
            step="1"
            placeholder="Enter amount"
            required
            disabled={isPending}
            className="h-9 text-sm"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cf-contrib-message" className="text-xs text-muted-foreground">
            Message <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <Textarea
            id="cf-contrib-message"
            name="message"
            placeholder="Write a note for the couple…"
            rows={2}
            maxLength={500}
            disabled={isPending}
            className="text-sm resize-none"
          />
        </div>

        {/* Anonymous */}
        <div className="flex items-center gap-2">
          <input
            id="cf-contrib-anon"
            name="isAnonymous"
            type="checkbox"
            disabled={isPending}
            className="h-4 w-4 rounded border-border"
          />
          <Label htmlFor="cf-contrib-anon" className="text-xs text-muted-foreground cursor-pointer">
            Contribute anonymously
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-9 bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90 mt-1"
        >
          {isPending ? 'Redirecting to checkout…' : 'Contribute'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Secure payment powered by Stripe
        </p>
      </form>
    </div>
  )
}
