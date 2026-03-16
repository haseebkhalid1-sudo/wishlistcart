import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code2, MousePointerClick, Heart, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Embed WishlistCart on Your Site — Widget Documentation',
  description:
    'Add a "Save to WishlistCart" button to any website in under 5 minutes. Free for all stores.',
  alternates: { canonical: 'https://wishlistcart.com/widget-docs' },
  openGraph: {
    title: 'Embed WishlistCart on Your Site — Widget Documentation',
    description:
      'Add a "Save to WishlistCart" button to any website in under 5 minutes. Free for all stores.',
    url: 'https://wishlistcart.com/widget-docs',
    siteName: 'WishlistCart',
    type: 'website',
  },
}

const FAQ_ITEMS = [
  {
    question: 'Is the widget free?',
    answer: 'Yes, completely free for all WishlistCart accounts. No paid plan required.',
  },
  {
    question: 'Which websites is it compatible with?',
    answer:
      'Any website that can add a <script> tag: Shopify, WordPress, Webflow, custom HTML, and more. If you can paste a script tag, you can embed the widget.',
  },
  {
    question: 'Can I customize the button style?',
    answer:
      'You can configure the button position (bottom-left or bottom-right) and button text via the window.WishlistCartWidget config object before loading the script.',
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

const STEPS = [
  {
    number: '01',
    title: 'Create a free API key',
    description: (
      <>
        Sign in and go to{' '}
        <Link
          href="/dashboard/widget"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Dashboard → Embed Widget
        </Link>
        . Create a widget and copy your API key — it&apos;s shown once.
      </>
    ),
  },
  {
    number: '02',
    title: 'Add the script tag',
    description:
      'Paste a single <script> tag into your page. No build step, no dependencies, no framework required.',
  },
  {
    number: '03',
    title: 'Done — your customers can now save products',
    description:
      'A floating button appears on your site. Visitors click it, sign in to WishlistCart, and save the current page to their wishlist.',
  },
]

const HOW_IT_WORKS = [
  {
    icon: MousePointerClick,
    title: 'Visitor sees the floating button',
    description:
      'A discreet "W" button appears in the corner of your page. It never covers your own UI.',
  },
  {
    icon: Heart,
    title: 'They click — a popup opens',
    description:
      'A lightweight popover opens showing their WishlistCart wishlists. No page navigation, no redirects.',
  },
  {
    icon: Check,
    title: 'Item saved to their wishlist',
    description:
      'The current product is added instantly. They can come back via their wishlist when ready to buy.',
  },
]

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/widget/{apiKey}/wishlists',
    description: 'Returns all public wishlists owned by the widget creator.',
    auth: 'API key in URL path',
    response: '{ wishlists: [{ id, name, slug, _count }] }',
    body: null,
  },
  {
    method: 'POST',
    path: '/api/widget/{apiKey}/add-item',
    description: 'Adds an item to a specific public wishlist.',
    auth: 'API key in URL path',
    response: '{ success: true, item: { id, title } }',
    body: '{ wishlistId, title, url?, price?, currency?, imageUrl?, quantity? }',
  },
]

export default function WidgetDocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          <Code2 className="h-3.5 w-3.5" />
          Embed Widget — Developer Docs
        </div>
        <h1 className="font-serif text-5xl text-foreground leading-tight max-w-3xl mx-auto md:text-6xl">
          Add wishlisting to your store{' '}
          <span className="italic">in 5 minutes</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          One script tag. Any website. Let your customers save products directly to their
          WishlistCart wishlists — driving return visits and purchases.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#0F0F0F] text-white hover:bg-gray-800 min-w-[200px]"
          >
            <Link href="/dashboard/widget">Get Your API Key</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[180px]">
            <Link href="#api-reference">View API Reference</Link>
          </Button>
        </div>

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
                yourstore.com/products/some-product
              </div>
            </div>
            {/* Fake product page */}
            <div className="relative p-8">
              <div className="flex gap-6 text-left">
                <div className="h-28 w-28 shrink-0 rounded-lg border border-border bg-subtle flex items-center justify-center">
                  <div className="h-10 w-10 rounded bg-[#E4E4E0]" />
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <div className="h-3 w-40 rounded bg-[#E4E4E0]" />
                  <div className="h-3 w-32 rounded bg-[#E4E4E0]" />
                  <div className="h-4 w-20 rounded bg-[#E4E4E0] mt-2" />
                  <div className="h-8 w-28 rounded-md bg-[#E4E4E0] mt-2" />
                </div>
              </div>
              {/* Floating WishlistCart button */}
              <div className="absolute bottom-5 right-5 flex items-center gap-2">
                <div className="rounded-full bg-background border border-border shadow-sm px-3 py-1.5 text-xs font-medium text-foreground whitespace-nowrap">
                  Save to Wishlist
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F0F0F] shadow-lg">
                  <span className="font-serif text-sm font-bold text-white">W</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            The floating button appears on every product page
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">Quick start</h2>
          <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">
            From zero to embedded in three steps.
          </p>

          <div className="grid gap-8 md:grid-cols-3 mb-14">
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

          {/* Code block */}
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold text-foreground mb-3">
              Step 2 — paste this into your HTML:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-[#0F0F0F] text-green-400 font-mono text-sm p-6 whitespace-pre-wrap">
              {`<script\n  src="https://wishlistcart.com/widget.js"\n  data-key="wlc_your_api_key_here"\n></script>`}
            </pre>
            <p className="mt-3 text-xs text-muted-foreground">
              That&apos;s it. No npm install, no build step, no configuration required to get
              started.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-3">
          How it works for your visitors
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          Minimal friction. Maximum delight.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-xl border border-border bg-background p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-subtle">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* API Reference */}
      <section id="api-reference" className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">API reference</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            Two endpoints. CORS-enabled. No extra auth headers needed — the key is in the URL.
          </p>

          <div className="space-y-4">
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} className="rounded-xl border border-border bg-background p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${
                      ep.method === 'GET'
                        ? 'bg-foreground/10 text-foreground'
                        : 'bg-foreground text-background'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="font-mono text-sm text-foreground">{ep.path}</code>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{ep.description}</p>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Auth</p>
                    <code className="font-mono text-muted-foreground">{ep.auth}</code>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Response</p>
                    <code className="font-mono text-muted-foreground">{ep.response}</code>
                  </div>
                  {ep.body && (
                    <div className="sm:col-span-2">
                      <p className="font-semibold text-foreground mb-1">Request body</p>
                      <code className="font-mono text-muted-foreground">{ep.body}</code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Optional config block */}
          <div className="mt-10">
            <p className="text-sm font-semibold text-foreground mb-3">
              Optional — configure before loading:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-[#0F0F0F] text-green-400 font-mono text-sm p-6 whitespace-pre-wrap">
              {`// Place this BEFORE the <script> tag\nwindow.WishlistCartWidget = {\n  apiKey: 'wlc_your_api_key_here',\n  buttonText: 'Save to Wishlist',\n  position: 'bottom-right', // or 'bottom-left'\n}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-3">Pricing</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          The widget is free for all WishlistCart accounts — no paid plan required.
        </p>
        <div className="mx-auto max-w-sm rounded-xl border border-foreground bg-background p-8 text-center">
          <p className="font-serif text-5xl text-foreground mb-2">Free</p>
          <p className="text-sm text-muted-foreground mb-6">for all plans, forever</p>
          <ul className="space-y-3 text-sm text-left mb-8">
            {[
              'Up to 5 widgets per account',
              'Unlimited requests',
              'CORS-enabled API',
              'Domain allowlist',
              'API key rotation',
            ].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <Check className="h-4 w-4 shrink-0 text-foreground" />
                {f}
              </li>
            ))}
          </ul>
          <Button asChild className="w-full bg-[#0F0F0F] text-white hover:bg-gray-800">
            <Link href="/login">Get started free</Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-3xl px-4 py-20">
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
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0F0F0F]">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h2 className="font-serif text-4xl text-white mb-4 leading-tight">
            Ready to add wishlisting to your store?
          </h2>
          <p className="text-white/60 mb-10 max-w-md mx-auto">
            Free to set up. No credit card. Works on any site that can run a script tag.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-[#0F0F0F] hover:bg-white/90 min-w-[200px]"
          >
            <Link href="/dashboard/widget">Get Your API Key</Link>
          </Button>
          <div className="mt-6">
            <Link
              href="/signup"
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              No account yet? Sign up free &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
