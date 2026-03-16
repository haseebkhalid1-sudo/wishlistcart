import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, MousePointerClick, Check, Zap, Image, RefreshCw, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'WishlistCart Chrome Extension — Save Products from Any Store',
  description:
    'Add products to your WishlistCart wishlists from any website with one click. No copy-pasting URLs. Works on Amazon, eBay, Etsy, and 1,000+ stores.',
  alternates: { canonical: 'https://wishlistcart.com/browser-extension' },
  openGraph: {
    title: 'WishlistCart Chrome Extension — Save Products from Any Store',
    description:
      'Add products to your WishlistCart wishlists from any website with one click. No copy-pasting URLs. Works on Amazon, eBay, Etsy, and 1,000+ stores.',
    url: 'https://wishlistcart.com/browser-extension',
    siteName: 'WishlistCart',
    type: 'website',
  },
}

const FAQ_ITEMS = [
  {
    question: 'Is the extension free?',
    answer: 'Yes, completely free for all WishlistCart users. No Pro plan required to use the extension.',
  },
  {
    question: 'Does it work on every website?',
    answer:
      'It works on most product pages. We support 1,000+ stores and improve coverage weekly. If a site is not supported, you can still paste a URL directly into WishlistCart.',
  },
  {
    question: 'Do I need a WishlistCart account?',
    answer:
      'Yes, you need a free account to save items. Sign up at wishlistcart.com — it takes under a minute and is completely free.',
  },
]

const STEPS = [
  {
    number: '1',
    icon: Globe,
    title: 'Browse any store',
    description:
      'Shop on Amazon, Etsy, IKEA, Target, or any other website as you normally would.',
  },
  {
    number: '2',
    icon: MousePointerClick,
    title: 'Click the W button',
    description:
      'Our button appears on product pages. One click opens a mini popup right where you are.',
  },
  {
    number: '3',
    icon: Check,
    title: "It's saved",
    description:
      'Choose your wishlist, add notes or quantity — done. No tab switching, no copy-pasting.',
  },
]

const FEATURES = [
  {
    icon: Globe,
    title: 'Works on 1,000+ stores',
    description: 'Any site with a product URL. Amazon, Etsy, IKEA, Target, Best Buy, and thousands more.',
  },
  {
    icon: Image,
    title: 'Auto-detects price & image',
    description: 'Our scraper extracts the product title, price, and image automatically — nothing to fill in.',
  },
  {
    icon: Zap,
    title: 'Syncs instantly',
    description: 'Items appear in your WishlistCart dashboard in real-time. Share with friends right away.',
  },
  {
    icon: Gift,
    title: 'Free for all users',
    description: 'The extension is completely free. No Pro plan required — just install and start saving.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function BrowserExtensionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          Chrome Extension
        </div>
        <h1 className="font-serif text-5xl text-foreground leading-tight max-w-2xl mx-auto md:text-6xl">
          Save anything,{' '}
          <span className="italic">from anywhere.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The WishlistCart extension adds a one-click &quot;Save&quot; button to every product page.
          Amazon, Etsy, IKEA, anywhere — instantly added to your wishlist.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#0F0F0F] text-white hover:bg-gray-800 min-w-[220px]"
          >
            <Link href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
              Add to Chrome — It&apos;s Free
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[180px]">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Free forever &bull; Works on Chrome &amp; Firefox &bull; 1,000+ supported stores
        </p>

        {/* Browser mockup */}
        <div className="mt-16 mx-auto max-w-xl">
          <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
            {/* Browser chrome bar */}
            <div className="flex items-center gap-2 border-b border-border bg-subtle px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#E4E4E0]" />
                <div className="h-3 w-3 rounded-full bg-[#E4E4E0]" />
                <div className="h-3 w-3 rounded-full bg-[#E4E4E0]" />
              </div>
              <div className="flex-1 mx-4 rounded-md border border-border bg-background px-3 py-1 text-xs text-muted-foreground text-left truncate">
                amazon.com/dp/B0XXXXXXXX
              </div>
            </div>
            {/* Fake product page */}
            <div className="relative p-8">
              <div className="flex gap-6 text-left">
                {/* Product image placeholder */}
                <div className="h-28 w-28 shrink-0 rounded-lg border border-border bg-subtle flex items-center justify-center">
                  <div className="h-10 w-10 rounded bg-[#E4E4E0]" />
                </div>
                {/* Product details */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="h-3 w-40 rounded bg-[#E4E4E0]" />
                  <div className="h-3 w-32 rounded bg-[#E4E4E0]" />
                  <div className="h-4 w-20 rounded bg-[#E4E4E0] mt-2" />
                  <div className="h-8 w-28 rounded-md bg-[#E4E4E0] mt-2" />
                </div>
              </div>
              {/* WishlistCart "W" button overlay */}
              <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#0F0F0F] shadow-lg">
                <span className="font-serif text-sm font-bold text-white">W</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            The &ldquo;W&rdquo; button appears on every product page
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">How it works</h2>
          <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">
            Three steps. Ten seconds. Done.
          </p>
          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative flex flex-col items-start">
                  {/* Large background number */}
                  <span
                    className="absolute -top-2 left-0 font-serif text-7xl font-bold text-foreground/5 leading-none select-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <div className="relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="relative z-10 font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-3">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          Built to get out of your way and let you shop.
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
      </section>

      {/* Browser support */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">
            Browser support
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            Starting with Chrome. Firefox and Safari coming soon.
          </p>
          <div className="grid gap-5 sm:grid-cols-3 max-w-2xl mx-auto">
            {/* Chrome */}
            <div className="rounded-xl border border-foreground bg-background p-6 flex flex-col items-center text-center">
              {/* Chrome icon — simplified SVG */}
              <svg
                viewBox="0 0 48 48"
                className="h-10 w-10 mb-4"
                aria-label="Chrome"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="24" r="22" fill="#E4E4E0" />
                <circle cx="24" cy="24" r="9" fill="white" stroke="#0F0F0F" strokeWidth="1.5" />
                {/* Chrome arc segments represented as arcs */}
                <path d="M24 2 A22 22 0 0 1 43.1 35" stroke="#0F0F0F" strokeWidth="4" fill="none" />
                <path d="M43.1 35 A22 22 0 0 1 4.9 35" stroke="#0F0F0F" strokeWidth="4" fill="none" strokeDasharray="2 2" />
                <path d="M4.9 35 A22 22 0 0 1 24 2" stroke="#0F0F0F" strokeWidth="4" fill="none" />
                <circle cx="24" cy="24" r="7" fill="#0F0F0F" />
                <circle cx="24" cy="24" r="4.5" fill="white" />
              </svg>
              <p className="font-semibold text-foreground mb-1">Chrome</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-0.5 text-xs font-medium text-background">
                Available now
              </span>
            </div>

            {/* Firefox */}
            <div className="rounded-xl border border-border bg-background p-6 flex flex-col items-center text-center">
              <div className="h-10 w-10 mb-4 rounded-full border border-border bg-subtle flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">Firefox</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted-foreground">
                Coming soon
              </span>
            </div>

            {/* Safari */}
            <div className="rounded-xl border border-border bg-background p-6 flex flex-col items-center text-center">
              <div className="h-10 w-10 mb-4 rounded-full border border-border bg-subtle flex items-center justify-center">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">Safari</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted-foreground">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Install CTA */}
      <section id="install" className="bg-[#0F0F0F]">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h2 className="font-serif text-4xl text-white mb-4 leading-tight">
            Start saving in 30 seconds
          </h2>
          <p className="text-white/60 mb-10 max-w-md mx-auto">
            Free to install. Works with your existing WishlistCart account.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-[#0F0F0F] hover:bg-white/90 min-w-[200px]"
          >
            <Link
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Chrome
            </Link>
          </Button>
          <div className="mt-6">
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Already have an account? Sign in &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-border">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="py-6">
              <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
