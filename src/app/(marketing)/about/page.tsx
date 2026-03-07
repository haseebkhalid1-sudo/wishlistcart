import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — WishlistCart',
  description:
    'WishlistCart is a universal wishlist and gift registry platform. Save products from any store, track prices, and coordinate gifts for every occasion.',
  alternates: { canonical: 'https://wishlistcart.com/about' },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 md:px-6">
      <h1 className="font-serif text-4xl text-foreground mb-6">About WishlistCart</h1>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          WishlistCart is a universal wishlist and gift registry built for how people actually shop
          — across dozens of stores, for every occasion, with friends and family spread across
          different apps and group chats.
        </p>

        <p>
          We started with one frustration: there was no good way to keep a single wishlist that
          worked with Amazon <em>and</em> Etsy <em>and</em> the independent store you found on
          Instagram. Existing tools were either locked to one retailer, too complicated, or designed
          for registries only.
        </p>

        <p>
          So we built the thing we wanted. Paste any product URL and it saves automatically. Share
          with a link. Gift-givers can claim items without spoiling the surprise. Prices get tracked
          in the background so you know when to buy.
        </p>

        <p>
          It&apos;s a small team working on this. We&apos;re building in public and iterating fast
          based on what real users tell us. If you have feedback — good or bad — we genuinely want to
          hear it.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
        >
          Get started free
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-subtle transition-colors"
        >
          Read the blog
        </Link>
      </div>
    </div>
  )
}
