'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface StripeConnectButtonProps {
  /** Pass true when the user already has a stripeConnectId saved in the DB */
  initialConnected?: boolean
}

export function StripeConnectButton({ initialConnected = false }: StripeConnectButtonProps) {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [connected, setConnected] = useState(initialConnected)

  // Show success toast when Stripe redirects back with ?connect=success
  useEffect(() => {
    const status = searchParams.get('connect')
    if (status === 'success') {
      setConnected(true)
      toast.success('Stripe account connected successfully!')
    } else if (status === 'refresh') {
      toast.info('Stripe onboarding was not completed. Please try again.')
    }
  }, [searchParams])

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="gap-1.5 border-green-200 bg-green-50 text-green-700"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Stripe Connected
        </Badge>
      </div>
    )
  }

  function handleConnect() {
    startTransition(async () => {
      try {
        const res = await fetch('/api/stripe/connect')
        if (!res.ok) {
          const body = (await res.json()) as { error?: string }
          toast.error(body.error ?? 'Failed to start Stripe onboarding.')
          return
        }
        const { url } = (await res.json()) as { url: string }
        window.location.href = url
      } catch {
        toast.error('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className="bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting…
        </>
      ) : (
        'Connect Stripe to receive payments'
      )}
    </Button>
  )
}
