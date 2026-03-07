import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — WishlistCart',
  description: 'Updates, tips, and stories from the WishlistCart team.',
  alternates: { canonical: 'https://wishlistcart.com/blog' },
}

const posts = [
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
