import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Link2,
  TrendingDown,
  Gift,
  Heart,
  Bell,
  Globe,
  Users,
  ListChecks,
  Share2,
} from 'lucide-react'

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

      {/* How It Works */}
      <section className="border-t border-border bg-subtle py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="font-serif text-display-md text-center text-foreground">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
            Three simple steps to never lose track of something you love.
          </p>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-foreground text-sm font-semibold text-background">
                  {step.number}
                </div>
                <step.icon className="mb-4 h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-border py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-8 text-center md:flex-row md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-display-md text-foreground">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Join 1,000+ users who save and share wishlists every day.
          </p>
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
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-background p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-subtle">
                  <feature.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                </div>
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
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <h2 className="font-serif text-display-md text-foreground">
            Your next gift, perfectly chosen
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground text-balance">
            Stop guessing what people want. Start a wishlist, share it with the people who matter,
            and make every occasion effortless.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Get started for free</Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Free forever · No credit card required
          </p>
        </div>
      </section>
    </>
  )
}

const steps = [
  {
    number: 1,
    icon: Link2,
    title: 'Paste any product URL',
    description:
      'Copy a link from any online store and we extract the product details, image, and price automatically.',
  },
  {
    number: 2,
    icon: ListChecks,
    title: 'Organize into wishlists',
    description:
      'Group items by occasion — birthdays, holidays, home projects, or anything you can dream up.',
  },
  {
    number: 3,
    icon: Share2,
    title: 'Share with anyone',
    description:
      'Send a single link via text, email, or QR code. Friends can claim items without spoiling the surprise.',
  },
]

const stats = [
  { value: '1,000+', label: 'Wishlists created' },
  { value: '10,000+', label: 'Items saved' },
  { value: '50+', label: 'Stores supported' },
]

const features = [
  {
    icon: Link2,
    title: 'Add from any store',
    description:
      'Paste any product URL — Amazon, Walmart, Etsy, or anywhere else. We extract the details automatically.',
  },
  {
    icon: TrendingDown,
    title: 'Track prices',
    description:
      'Get notified when prices drop. Set target prices or get alerts on any drop.',
  },
  {
    icon: Gift,
    title: 'Coordinate gifts',
    description:
      'Share your wishlist and let friends claim items privately — with surprise mode so you never find out.',
  },
  {
    icon: Heart,
    title: 'Wedding & baby registries',
    description:
      'Create beautiful registries for any occasion with group gifting, cash funds, and thank-you tracking.',
  },
  {
    icon: Bell,
    title: 'Never miss a birthday',
    description:
      'Set reminders for important dates and always know what to get — pulled from their wishlist.',
  },
  {
    icon: Globe,
    title: 'Universal wishlist',
    description:
      'One link works everywhere. Share via WhatsApp, email, or QR code at your next event.',
  },
]
