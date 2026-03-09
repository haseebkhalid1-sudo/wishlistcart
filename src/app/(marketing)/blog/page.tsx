import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — WishlistCart',
  description: 'Updates, tips, and stories from the WishlistCart team.',
  alternates: { canonical: 'https://wishlistcart.com/blog' },
}

const posts = [
  {
    slug: 'best-registry-apps-2026',
    title:
      'Best Registry Apps in 2026 — Honest Comparison (Amazon, Zola, WishlistCart, and More)',
    description:
      'A plain-language comparison of the top registry platforms in 2026 — universal store support, group gifting, price tracking, and privacy, all weighed honestly.',
    date: '2026-03-09',
    readTime: '7 min read',
    category: 'Guides',
  },
  {
    slug: 'gift-ideas-for-people-who-have-everything',
    title: 'Gift Ideas for People Who Have Everything — 40 Thoughtful Picks for 2026',
    description:
      "Stuck buying for someone who already has everything? Here are 40 thoughtful ideas — from experiences and subscriptions to personalized gifts they can't buy themselves.",
    date: '2026-03-09',
    readTime: '8 min read',
    category: 'Guides',
  },
  {
    slug: 'how-to-create-a-wishlist',
    title: 'How to Create a Wishlist Online in 2026 — The Complete Guide',
    description:
      'Everything you need to know about creating, sharing, and managing a digital wishlist — from your first item to coordinating gifts without the awkwardness.',
    date: '2026-03-09',
    readTime: '6 min read',
    category: 'Guides',
  },
  {
    slug: 'wedding-registry-checklist-2026',
    title: 'The Complete Wedding Registry Checklist for 2026 — 150+ Items by Category',
    description:
      'Everything you need on your wedding registry, organized by category. From kitchen essentials to bedroom luxuries — the complete list for modern couples.',
    date: '2026-03-09',
    readTime: '8 min read',
    category: 'Guides',
  },
  {
    slug: 'baby-registry-must-haves-2026',
    title: 'Baby Registry Must-Haves in 2026 — What You Actually Need (And What to Skip)',
    description:
      'Cut through the noise. Here are the baby registry essentials new parents actually use, organized by stage — plus what to skip entirely.',
    date: '2026-03-09',
    readTime: '7 min read',
    category: 'Guides',
  },
  {
    slug: 'price-tracking-wishlists-2026',
    title: 'How to Never Overpay Again — Using Price Tracking on Your Wishlist',
    description:
      "Price tracking turns your wishlist into a money-saving machine. Here's how to set up price alerts, read price history charts, and buy at the perfect time.",
    date: '2026-03-09',
    readTime: '6 min read',
    category: 'Guides',
  },
  {
    slug: 'introducing-wishlistcart',
    title: 'Introducing WishlistCart',
    description:
      'One place to save products from any store, track prices automatically, and coordinate gifts without the awkwardness.',
    date: '2026-03-07',
    readTime: '4 min read',
  },
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 md:px-6">
      <h1 className="font-serif text-4xl text-foreground mb-2">Blog</h1>
      <p className="text-muted-foreground mb-12">Updates and stories from the WishlistCart team.</p>

      <ul className="space-y-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <p className="text-xs text-muted-foreground mb-1">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                · {post.readTime}
              </p>
              <h2 className="font-serif text-2xl text-foreground group-hover:underline mb-2">
                {post.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
