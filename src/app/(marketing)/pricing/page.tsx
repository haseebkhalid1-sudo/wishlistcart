import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — WishlistCart',
  description:
    'WishlistCart is free to get started. Upgrade to Pro for price tracking, price alerts, and the browser extension.',
  alternates: { canonical: 'https://wishlistcart.com/pricing' },
}

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

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'WishlistCart Pricing',
            url: 'https://wishlistcart.com/pricing',
            description:
              'Free and Pro plans for WishlistCart — universal wishlist and gift registry.',
          }),
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-serif text-display-lg text-foreground">Simple, honest pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you want price tracking and the browser extension.
          </p>
        </div>

        {/* Plans */}
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
                <span className="font-serif text-4xl font-bold text-background">$4</span>
                <span className="text-background/60">/month</span>
              </div>
              <p className="mt-2 text-sm text-background/60">Billed monthly. Cancel anytime.</p>
            </div>

            <Button asChild className="w-full mb-8 bg-background text-foreground hover:bg-background/90">
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

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl text-foreground text-center mb-10">
            Frequently asked questions
          </h2>

          <div className="space-y-8">
            {[
              {
                q: 'Is there really a free plan?',
                a: 'Yes — WishlistCart is free to use for up to 3 wishlists with unlimited items. We earn a small commission when someone buys through a link on your list.',
              },
              {
                q: 'What is price tracking?',
                a: 'Pro members get automatic price monitoring on every item they save. We check prices every hour and send you an alert when an item drops in price.',
              },
              {
                q: 'What stores does the URL importer support?',
                a: 'Any store with a product page — Amazon, Etsy, Walmart, Target, IKEA, Zara, and thousands more. If a store doesn\'t work perfectly, you can always add items manually.',
              },
              {
                q: 'Can I cancel Pro at any time?',
                a: 'Absolutely. Cancel from your billing settings at any time. You keep Pro features until the end of your billing period.',
              },
              {
                q: 'Do gift-givers need to sign up?',
                a: 'No. Anyone with your share link can view your wishlist and mark items as "claimed" — no account required.',
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-medium text-foreground mb-2">{q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Business upsell banner */}
        <div className="mt-16 rounded-xl border border-border bg-subtle p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-2">Need it for your team?</h3>
          <p className="text-muted-foreground mb-6">
            WishlistCart for Business includes team management, budget controls, custom gift templates, and dedicated support.
          </p>
          <Button asChild className="bg-[#0F0F0F] text-white hover:bg-gray-800 inline-flex items-center gap-2">
            <Link href="/corporate">
              See Business Plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
