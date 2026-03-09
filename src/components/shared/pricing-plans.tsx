'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PricingToggle } from './pricing-toggle'

const FREE_FEATURES = [
  'Up to 3 wishlists',
  'Unlimited items per wishlist',
  'URL auto-import from any store',
  'Share wishlists with friends',
  'Gift claiming & surprise mode',
  'Affiliate buy links',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited wishlists',
  'Price tracking on every item',
  'Price drop alerts (email + in-app)',
  'Price history charts',
  'Browser extension (Chrome)',
  'Priority support',
]

const PRICES = {
  monthly: {
    pro: { display: '$4', sub: '/month', note: 'Billed monthly. Cancel anytime.' },
  },
  yearly: {
    pro: { display: '$3.20', sub: '/month', note: 'Billed $38.40/yr. Cancel anytime.' },
  },
}

export function PricingPlans() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const price = PRICES[billing].pro

  return (
    <div>
      {/* Toggle */}
      <div className="mb-10 flex justify-center">
        <PricingToggle billing={billing} onChange={setBilling} />
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-subtle p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Free
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-serif text-4xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Forever free. No credit card.</p>
          </div>

          <Button asChild variant="outline" className="w-full mb-8">
            <Link href="/signup">Get started free</Link>
          </Button>

          <ul className="space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                <Check className="h-4 w-4 shrink-0 text-foreground mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border border-foreground bg-foreground p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-background border border-border px-3 py-1 text-xs font-semibold text-foreground">
              Most popular
            </span>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-background/60">
              Pro
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-serif text-4xl font-bold text-background">{price.display}</span>
              <span className="text-background/60">{price.sub}</span>
            </div>
            <p className="mt-2 text-sm text-background/60">{price.note}</p>
          </div>

          <Button
            asChild
            className="w-full mb-8 bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/signup?plan=pro">Start Pro free trial</Link>
          </Button>

          <ul className="space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-background">
                <Check className="h-4 w-4 shrink-0 text-background mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
