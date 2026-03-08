import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Users, Gift, LayoutGrid, CircleDollarSign, Building2, GraduationCap, Heart, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Corporate Gifting Platform — WishlistCart for Business',
  description:
    'Streamline corporate gifting with personalized wishlists for teams, clients, and events. No more gift cards nobody uses.',
  alternates: { canonical: 'https://wishlistcart.com/corporate' },
}

const FEATURES = [
  {
    icon: Users,
    title: 'Team Wishlists',
    description:
      'Each employee adds items to their own wishlist. HR and managers can browse and purchase. No more gift cards nobody uses.',
  },
  {
    icon: Gift,
    title: 'Client Gift Registries',
    description:
      'Send clients a link. They add what they actually want. You order directly — no guessing, no returns.',
  },
  {
    icon: LayoutGrid,
    title: 'Bulk Management',
    description:
      'Manage wishlists for your entire team from one admin view. See everything at a glance.',
  },
  {
    icon: CircleDollarSign,
    title: 'Budget Controls',
    description:
      'Set per-person gift budgets. See what has been purchased. Track everything in one place.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Create your company account',
    description: 'Sign up and invite team members with one click. Everyone gets their own wishlist space.',
  },
  {
    number: '02',
    title: 'Everyone builds their wishlist',
    description: 'Team members add items from any store. HR and managers can browse all lists from a single dashboard.',
  },
  {
    number: '03',
    title: 'Order directly from wishlists',
    description: 'Buy items straight from the wishlist. No duplicates, no waste, no more asking what they want.',
  },
]

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'Perfect for small teams just getting started.',
    features: [
      'Up to 5 team members',
      'Basic wishlists',
      'Share links',
      'Gift claiming',
    ],
    cta: 'Get started free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    description: 'For growing teams that need more control.',
    features: [
      'Up to 25 team members',
      'Bulk wishlist management',
      'Budget tracking per person',
      'Priority support',
      'Custom gift templates',
    ],
    cta: 'Start free trial',
    href: '/signup?plan=corporate',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs.',
    features: [
      'Unlimited team members',
      'Dedicated account support',
      'Custom branding',
      'SSO & advanced security',
      'Custom integrations',
    ],
    cta: 'Contact sales',
    href: 'mailto:admin@wishlistcart.com',
    highlight: false,
  },
]

const USE_CASES = [
  {
    icon: Building2,
    title: 'Employee appreciation',
    description: 'Holiday gifts, work anniversaries, birthdays — make every occasion feel personal.',
  },
  {
    icon: Gift,
    title: 'Client gifting',
    description: 'Onboarding gifts, thank-you gifts, holiday packages — clients get what they actually want.',
  },
  {
    icon: GraduationCap,
    title: 'Teacher wishlists',
    description: 'Classroom supplies, art materials, books — parents contribute directly with zero friction.',
  },
  {
    icon: Heart,
    title: 'Nonprofit wishlists',
    description: 'Donor-funded wish lists for organizations — transparent, trackable, impactful.',
  },
]

export default function CorporatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'WishlistCart for Business — Corporate Gifting Platform',
            url: 'https://wishlistcart.com/corporate',
            description:
              'Streamline corporate gifting with personalized wishlists for teams, clients, and events.',
          }),
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          WishlistCart for Business
        </div>
        <h1 className="font-serif text-5xl text-foreground leading-tight max-w-3xl mx-auto md:text-6xl">
          Corporate Gifting,{' '}
          <span className="italic">Simplified</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Give your team, clients, and partners gifts they actually want. WishlistCart makes
          corporate gifting personal at scale.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-[#0F0F0F] text-white hover:bg-gray-800 min-w-[160px]">
            <Link href="mailto:admin@wishlistcart.com">Get a Demo</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[160px]">
            <Link href="/signup">Start Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">
            Everything your team needs
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Built for HR managers, office admins, and anyone who wants to make gifting feel thoughtful — without the headache.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-border bg-background p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-subtle">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-3">How it works</h2>
        <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">
          Up and running in minutes. No IT department required.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col">
              <span className="font-serif text-4xl text-muted-foreground/30 mb-4">{step.number}</span>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">Simple pricing</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            Start free. Scale as your team grows.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-8 flex flex-col ${
                  tier.highlight
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background'
                }`}
              >
                {tier.highlight && (
                  <div className="mb-4">
                    <span className="rounded-full bg-background/20 px-3 py-1 text-xs font-semibold text-background">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <p
                    className={`text-sm font-semibold uppercase tracking-widest ${
                      tier.highlight ? 'text-background/60' : 'text-muted-foreground'
                    }`}
                  >
                    {tier.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span
                      className={`font-serif text-4xl font-bold ${
                        tier.highlight ? 'text-background' : 'text-foreground'
                      }`}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className={tier.highlight ? 'text-background/60' : 'text-muted-foreground'}>
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      tier.highlight ? 'text-background/60' : 'text-muted-foreground'
                    }`}
                  >
                    {tier.description}
                  </p>
                </div>

                <Button
                  asChild
                  className={`w-full mb-8 ${
                    tier.highlight
                      ? 'bg-background text-foreground hover:bg-background/90'
                      : 'bg-[#0F0F0F] text-white hover:bg-gray-800'
                  }`}
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>

                <ul className="space-y-3 mt-auto">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-sm ${
                        tier.highlight ? 'text-background' : 'text-foreground'
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          tier.highlight ? 'text-background' : 'text-foreground'
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-3">Built for every occasion</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          From employee appreciation to classroom supplies — WishlistCart adapts to your needs.
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

      {/* Bottom CTA */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="font-serif text-4xl text-foreground mb-4">
            Ready to make corporate gifting personal?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Join companies that have replaced generic gift cards with wishlists their teams actually love.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-[#0F0F0F] text-white hover:bg-gray-800 min-w-[160px]">
              <Link href="mailto:admin@wishlistcart.com">Talk to us</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px]">
              <Link href="/signup">Start for free</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required. Setup takes under 5 minutes.
          </p>
        </div>
      </section>
    </>
  )
}
