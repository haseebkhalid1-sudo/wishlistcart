import type { Metadata } from 'next'
import Link from 'next/link'
import { Code2, ShoppingBag, GitCompare, Puzzle, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Partner Integrations — WishlistCart',
  description:
    'Integrate WishlistCart into your store or app. Embed wishlist functionality with our widget or REST API.',
  alternates: { canonical: 'https://wishlistcart.com/partners' },
}

const PARTNERSHIP_TYPES = [
  {
    icon: Code2,
    title: 'Embed Widget',
    description:
      'Add a "Save to WishlistCart" button to your product pages with a single script tag. No backend required — works on any e-commerce platform.',
    features: [
      'One-line JavaScript snippet',
      'Works on Shopify, WooCommerce, and any HTML site',
      'Customisable button styles',
      'No backend code required',
    ],
    cta: 'View widget docs',
    href: '/widget-docs',
  },
  {
    icon: GitCompare,
    title: 'REST API Integration',
    description:
      'Full programmatic access to wishlist data. Create wishlists, add items, and read user data from your own backend.',
    features: [
      'JSON REST API with Bearer auth',
      'Create and manage wishlists',
      'Add items from any product source',
      'Paginated list endpoints',
    ],
    cta: 'Read the API docs',
    href: '/developers',
  },
]

const USE_CASES = [
  {
    icon: Store,
    title: 'E-commerce stores',
    description:
      'Let shoppers save any product to their WishlistCart with one click. Increase purchase intent and return traffic.',
  },
  {
    icon: ShoppingBag,
    title: 'Gift registries',
    description:
      'Sync your registry platform with WishlistCart so users manage one universal list across all stores.',
  },
  {
    icon: GitCompare,
    title: 'Price comparison sites',
    description:
      'Add a save button next to every deal. Users bookmark items to their wishlist and get price-drop alerts.',
  },
  {
    icon: Puzzle,
    title: 'Browser extensions',
    description:
      'Use the REST API inside your extension to add items to WishlistCart from any page the user visits.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Sign up for free',
    description:
      'Create a WishlistCart account. No credit card required. Free tier includes 100 API calls per minute.',
  },
  {
    number: '02',
    title: 'Get your API key',
    description:
      'Generate an API key from your dashboard in seconds. Keys start with wlc_ and are ready to use immediately.',
  },
  {
    number: '03',
    title: 'Start integrating',
    description:
      'Follow our quick-start guide or embed the widget with a single script tag. Most integrations go live in under an hour.',
  },
]

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          Partner Integrations
        </div>
        <h1 className="font-serif text-5xl text-foreground leading-tight max-w-3xl mx-auto md:text-6xl">
          Partner with WishlistCart
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Add wishlist functionality to your e-commerce store or app. Two simple integration
          paths — a drop-in widget or our full REST API.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-[#0F0F0F] text-white hover:bg-gray-800 min-w-[160px]">
            <Link href="/signup">Get started free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[160px]">
            <Link href="/developers">API documentation</Link>
          </Button>
        </div>
      </section>

      {/* Partnership types */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">
            Two ways to integrate
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Choose the integration method that fits your technical setup.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {PARTNERSHIP_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <div
                  key={type.title}
                  className="rounded-xl border border-border bg-background p-8 flex flex-col"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-subtle">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-3">{type.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {type.description}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={type.href}>{type.cta}</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-3">Who integrates?</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          WishlistCart fits into a wide range of products and platforms.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon
            return (
              <div key={uc.title} className="rounded-xl border border-border bg-subtle p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1.5">{uc.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{uc.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">How it works</h2>
          <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">
            From zero to integrated in under an hour.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col">
                <span className="font-serif text-4xl text-muted-foreground/30 mb-4">
                  {step.number}
                </span>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner inquiry */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-xl border border-border bg-subtle p-10 md:p-14">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl text-foreground mb-3">
              Looking for a custom integration?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you&apos;re working on a large-scale integration, need a custom data feed, or want
              to discuss a co-marketing opportunity, reach out to our partnerships team. We&apos;re
              happy to talk.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="bg-[#0F0F0F] text-white hover:bg-gray-800"
              >
                <Link href="mailto:partnerships@wishlistcart.com">
                  partnerships@wishlistcart.com
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/developers">Read the API docs</Link>
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Typical response time: 1–2 business days.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="font-serif text-4xl text-foreground mb-4">
            Ready to integrate?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Sign up for free, generate an API key, and ship your first integration today.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-[#0F0F0F] text-white hover:bg-gray-800 min-w-[160px]">
              <Link href="/signup">Get started free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px]">
              <Link href="/developers">API reference</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">No credit card required.</p>
        </div>
      </section>
    </>
  )
}
