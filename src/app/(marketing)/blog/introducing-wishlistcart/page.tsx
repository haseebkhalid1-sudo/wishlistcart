import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Introducing WishlistCart — WishlistCart Blog',
  description:
    'One place to save products from any store, track prices automatically, and coordinate gifts without the awkwardness.',
  alternates: { canonical: 'https://wishlistcart.com/blog/introducing-wishlistcart' },
  openGraph: {
    title: 'Introducing WishlistCart',
    description:
      'One place to save products from any store, track prices automatically, and coordinate gifts without the awkwardness.',
    type: 'article',
    publishedTime: '2026-03-07',
    url: 'https://wishlistcart.com/blog/introducing-wishlistcart',
  },
}

export default function IntroducingWishlistCartPost() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 md:px-6">
      {/* Back link */}
      <Link
        href="/blog"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-10 inline-block"
      >
        ← Blog
      </Link>

      {/* Header */}
      <header className="mb-12">
        <p className="text-xs text-muted-foreground mb-3">March 7, 2026 · 4 min read</p>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground text-balance mb-4">
          Introducing WishlistCart
        </h1>
        <p className="text-lg text-muted-foreground text-balance">
          One place to save products from any store, track prices automatically, and coordinate gifts
          without the awkwardness.
        </p>
      </header>

      {/* Body */}
      <article className="prose prose-neutral max-w-none text-foreground">
        <p>
          Gift-giving should be joyful. But it rarely starts that way. It starts with a group chat
          going nowhere, someone buying the same thing as someone else, and an Amazon wishlist that
          only covers one of the dozen stores your family shops from.
        </p>

        <p>
          We built WishlistCart to fix that — a universal wishlist that works with any store, tracks
          prices so you buy at the right moment, and coordinates gifts without spoiling the surprise.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-4">Save from any store</h2>
        <p>
          Paste a product URL — from Amazon, Target, IKEA, Etsy, or anywhere else — and WishlistCart
          pulls in the title, image, and price automatically. No browser extension required, though
          one is coming. One wishlist, every store you shop at.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-4">Price tracking that actually works</h2>
        <p>
          WishlistCart checks prices on your saved items every six hours. When something drops, you
          get an email. You can also set a target price — "alert me when this drops below $80" — and
          we will. The price history chart shows you whether today&apos;s price is actually a deal or
          just retailer theater.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-4">Gift coordination without the spoilers</h2>
        <p>
          Share a wishlist with a link. Gift-givers can mark items as claimed — so two people
          don&apos;t buy the same thing — but the wishlist owner never sees who claimed what. We call
          it surprise mode, and it&apos;s enforced at the database level, not just the UI. Gifts stay
          surprising.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-4">Built for every occasion</h2>
        <p>
          Whether it&apos;s a birthday, wedding registry, baby shower, or just things you want to
          remember, WishlistCart handles it. Create multiple wishlists, set them to private or
          public, share them with a link or make them discoverable. Your wishlist, your rules.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-4">Free to start</h2>
        <p>
          The core product — saving items, sharing wishlists, gift claiming — is free. Price alerts,
          unlimited wishlists, and the browser extension are part of our Pro plan at $5/month. We
          think that&apos;s fair for something you&apos;ll use year-round.
        </p>

        <h2 className="font-serif text-2xl mt-10 mb-4">What&apos;s next</h2>
        <p>
          We&apos;re just getting started. On the roadmap: a proper browser extension for one-click
          saving, group gifting where multiple people chip in on a single item, occasion reminders so
          you never forget a birthday, and social features so you can follow friends&apos; wishlists.
        </p>

        <p>
          If you try it and have thoughts, we&apos;d love to hear them. Reply to any email we send,
          or find us on{' '}
          <a
            href="https://twitter.com/wishlistcart"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            X / Twitter
          </a>
          .
        </p>

        <p className="mt-10 text-muted-foreground text-sm">
          — The WishlistCart team
        </p>
      </article>

      {/* CTA */}
      <div className="mt-16 border-t border-border pt-10">
        <p className="text-sm text-muted-foreground mb-4">Ready to try it?</p>
        <Link
          href="/signup"
          className="inline-flex items-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
        >
          Create your free wishlist
        </Link>
      </div>
    </div>
  )
}
