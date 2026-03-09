import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PricingPlans } from '@/components/shared/pricing-plans'

export const metadata: Metadata = {
  title: 'Pricing — WishlistCart',
  description:
    'WishlistCart is free to get started. Upgrade to Pro for price tracking, price alerts, and the browser extension.',
  alternates: { canonical: 'https://wishlistcart.com/pricing' },
}

const FAQ_ITEMS = [
  {
    q: 'Is WishlistCart really free?',
    a: 'Yes — the Free plan has no time limit and never requires a credit card. You can create 3 wishlists, add unlimited items to each, share them, and use gift coordination features.',
  },
  {
    q: 'What does Pro include that Free doesn\'t?',
    a: 'Pro gives you unlimited wishlists, price tracking on every item, price drop alerts (email + in-app), price history charts, and priority support.',
  },
  {
    q: 'Can I cancel my Pro subscription?',
    a: 'Yes, anytime through your account settings. You won\'t be charged again and you\'ll keep Pro access until the end of your billing period.',
  },
  {
    q: 'Do you take a commission on purchases?',
    a: 'We earn a small affiliate commission when you click through to a store. This never affects prices — you always pay the same price you\'d see going directly to the store.',
  },
  {
    q: 'Is there a plan for teams/businesses?',
    a: 'Yes — our Team plan supports up to 25 members, bulk wishlist management, and budget controls. Visit /corporate for details.',
  },
]

export default function PricingPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-24">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="font-serif text-display-lg text-foreground">Simple, honest pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you want price tracking and the browser extension.
          </p>
        </div>

        {/* Social proof */}
        <p className="mb-12 text-center text-sm font-medium text-muted-foreground">
          Join 10,000+ people who save smarter with WishlistCart
        </p>

        {/* Plans with toggle */}
        <PricingPlans />

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl text-foreground text-center mb-10">
            Frequently asked questions
          </h2>

          <div className="space-y-8">
            {FAQ_ITEMS.map(({ q, a }) => (
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
            WishlistCart for Business includes team management, budget controls, custom gift
            templates, and dedicated support.
          </p>
          <Button
            asChild
            className="bg-[#0F0F0F] text-white hover:bg-gray-800 inline-flex items-center gap-2"
          >
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
