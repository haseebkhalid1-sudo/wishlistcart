import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'WishlistCart — Save Products from Any Store, Share with Everyone',
  alternates: { canonical: 'https://wishlistcart.com' },
}

export default function LandingPage() {
  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'WishlistCart',
            url: 'https://wishlistcart.com',
            description: 'Universal wishlist and gift registry platform',
          }),
        }}
      />

      {/* Hero */}
      <section className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-subtle px-3 py-1 text-xs font-medium text-muted-foreground">
            Free to get started · No credit card required
          </div>

          <h1 className="font-serif text-display-xl text-balance text-foreground">
            Save anything.{' '}
            <span className="text-muted-foreground">Share with everyone.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-body-lg text-muted-foreground text-balance">
            WishlistCart lets you save products from any online store, track prices automatically,
            and coordinate gifts for every occasion.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Create your free wishlist</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-subtle py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="font-serif text-display-md text-center text-foreground">
            Everything you need for gifts
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            One place for all your wishlists — birthdays, weddings, holidays, or just things you love.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-background p-6">
                <div className="mb-3 text-2xl">{feature.icon}</div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <h2 className="font-serif text-display-md text-foreground">
            Start your wishlist today
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of people who use WishlistCart to organize their wishes and coordinate gifts.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Get started for free</Link>
          </Button>
        </div>
      </section>
    </>
  )
}

const features = [
  {
    icon: '🔗',
    title: 'Add from any store',
    description:
      'Paste any product URL — Amazon, Walmart, Etsy, or anywhere else. We extract the details automatically.',
  },
  {
    icon: '📉',
    title: 'Track prices',
    description:
      'Get notified when prices drop. Set target prices or get alerts on any drop.',
  },
  {
    icon: '🎁',
    title: 'Coordinate gifts',
    description:
      'Share your wishlist and let friends claim items privately — with surprise mode so you never find out.',
  },
  {
    icon: '💍',
    title: 'Wedding & baby registries',
    description:
      'Create beautiful registries for any occasion with group gifting, cash funds, and thank-you tracking.',
  },
  {
    icon: '🔔',
    title: 'Never miss a birthday',
    description:
      'Set reminders for important dates and always know what to get — pulled from their wishlist.',
  },
  {
    icon: '🌐',
    title: 'Universal wishlist',
    description:
      'One link works everywhere. Share via WhatsApp, email, or QR code at your next event.',
  },
]
