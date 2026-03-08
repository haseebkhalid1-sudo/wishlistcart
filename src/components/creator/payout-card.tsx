'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { requestPayout } from '@/lib/actions/creator-payouts'

const MINIMUM_PAYOUT_USD = 10

interface PayoutCardProps {
  /** Initial pending earnings total in USD, fetched server-side */
  initialPendingUsd: number
  /** Whether the creator has connected their Stripe account */
  stripeConnected: boolean
}

export function PayoutCard({ initialPendingUsd, stripeConnected }: PayoutCardProps) {
  const [pendingUsd, setPendingUsd] = useState(initialPendingUsd)
  const [isPending, startTransition] = useTransition()

  const canPayout = stripeConnected && pendingUsd >= MINIMUM_PAYOUT_USD

  function handleRequestPayout() {
    startTransition(async () => {
      const result = await requestPayout()
      if (result.success) {
        toast.success('Payout requested! Funds will arrive in 2–3 business days.')
        // Optimistically clear the pending balance since earnings are now PROCESSING
        setPendingUsd(0)
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Card className="border border-zinc-200 bg-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-zinc-900">Pending Earnings</CardTitle>
        <CardDescription className="text-sm text-zinc-500">
          70% revenue share from affiliate commissions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold text-zinc-900 tabular-nums">
          ${pendingUsd.toFixed(2)}
          <span className="ml-1 text-base font-normal text-zinc-400">USD</span>
        </p>

        {!stripeConnected && (
          <p className="mt-2 text-xs text-amber-600">
            Connect your Stripe account to request a payout.
          </p>
        )}

        {stripeConnected && pendingUsd < MINIMUM_PAYOUT_USD && pendingUsd > 0 && (
          <p className="mt-2 text-xs text-zinc-500">
            Minimum payout is ${MINIMUM_PAYOUT_USD.toFixed(2)}. Keep earning!
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 border-t border-zinc-100 pt-4">
        <Button
          onClick={handleRequestPayout}
          disabled={!canPayout || isPending}
          className="bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting…
            </>
          ) : (
            'Request Payout'
          )}
        </Button>

        <p className="flex items-center gap-1 text-xs text-zinc-400">
          <Clock className="h-3 w-3" />
          Stripe payouts take 2–3 business days
        </p>
      </CardFooter>
    </Card>
  )
}
