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
      <section className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-16 text-center md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-subtle px-3 py-1 text-xs font-medium text-muted-foreground">
            Free to get started · No credit card required
          </div>

          <h1 className="font-serif text-display-sm sm:text-display-md lg:text-display-lg text-balance text-foreground">
            Save anything.{' '}
            <span className="text-muted-foreground">Share with everyone.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base sm:text-body-lg text-muted-foreground text-balance">
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

      {/* Works with any store — logo/pill strip */}
      <section className="border-t border-border py-10">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Works with products from any store
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {storePills.map((store) => (
              <span
                key={store}
                className="rounded-full border border-border bg-subtle px-3 py-1 text-sm text-muted-foreground"
              >
                {store}
              </span>
            ))}
            <span className="rounded-full border border-border bg-subtle px-3 py-1 text-sm text-muted-foreground">
              and thousands more
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-border bg-subtle py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="font-serif text-display-md text-center text-foreground">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
            Three simple steps to never lose track of something you love.
          </p>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Large serif numeral behind content */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 font-serif text-[6rem] font-bold leading-none text-border select-none"
                >
                  {step.display}
                </span>
                <div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-foreground text-sm font-semibold text-background">
                  {step.number}
                </div>
                <step.icon className="relative mb-4 h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="relative font-semibold text-foreground">{step.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof — stats */}
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
            Join thousands of people who save and share wishlists every day.
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

      {/* Testimonials */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="font-serif text-display-md text-center text-foreground">
            What people are saying
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-foreground">
            Real stories from people who have made gift-giving effortless.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border bg-subtle p-6 flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex gap-0.5 text-foreground" aria-label="5 out of 5 stars">
                  <span>★★★★★</span>
                </div>
                {/* Quote */}
                <p className="flex-1 text-sm italic text-muted-foreground leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-background"
                    style={{ backgroundColor: t.avatarColor }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    {t.role && (
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-subtle py-24">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
          <h2 className="font-serif text-display-md text-foreground">
            Ready to create your wishlist?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground text-balance">
            Stop guessing what people want. Start a wishlist, share it with the people who matter,
            and make every occasion effortless.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free forever · No credit card required
          </p>
        </div>
      </section>
    </>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const storePills = [
  'Amazon',
  'Target',
  'IKEA',
  'Etsy',
  'Walmart',
  'Zara',
  'Best Buy',
  'H&M',
  'Nike',
  'Apple',
]

const steps = [
  {
    number: 1,
    display: '01',
    icon: Link2,
    title: 'Paste any product URL',
    description:
      'Copy a link from any online store and we extract the product details, image, and price automatically.',
  },
  {
    number: 2,
    display: '02',
    icon: ListChecks,
    title: 'Organize into wishlists',
    description:
      'Group items by occasion — birthdays, holidays, home projects, or anything you can dream up.',
  },
  {
    number: 3,
    display: '03',
    icon: Share2,
    title: 'Share with anyone',
    description:
      'Send a single link via text, email, or QR code. Friends can claim items without spoiling the surprise.',
  },
]

const stats = [
  { value: '10,000+', label: 'Wishlists created' },
  { value: '50,000+', label: 'Items saved' },
  { value: '500+', label: 'Stores supported' },
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

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Birthday wishlist',
    initials: 'SK',
    avatarColor: '#3B3B3B',
    quote:
      'Finally replaced my Amazon wishlist. My family can now shop from any store, not just Amazon. Set one up for my birthday and everything was claimed within a week!',
  },
  {
    name: 'Marcus T.',
    role: 'Price tracking',
    initials: 'MT',
    avatarColor: '#5C5C5C',
    quote:
      'The price tracking alone is worth it. I watched an item drop from $89 to $52 and got an alert the moment it happened. Saved $37 on my first alert.',
  },
  {
    name: 'Emma & James',
    role: 'Wedding registry',
    initials: 'EJ',
    avatarColor: '#444444',
    quote:
      'Used it for our wedding registry. We wanted items from local boutiques, not just big box stores. Guests loved how easy it was to claim gifts.',
  },
  {
    name: 'Priya S.',
    role: 'Teacher',
    initials: 'PS',
    avatarColor: '#2E2E2E',
    quote:
      'As a teacher I share my classroom wishlist with parents every September. So much easier than a paper list. Parents can see what\'s already been bought.',
  },
  {
    name: 'Tom R.',
    role: 'Secret Santa organizer',
    initials: 'TR',
    avatarColor: '#484848',
    quote:
      'My team uses it for Secret Santa. Everyone adds their list, the organizer can see everything. No more awkward gift cards.',
  },
  {
    name: 'Diane M.',
    role: 'Holiday gifting',
    initials: 'DM',
    avatarColor: '#383838',
    quote:
      'I love the surprise mode. My kids can add things they want and their grandparents can see the list without me knowing what got bought. Stress-free holidays!',
  },
]
