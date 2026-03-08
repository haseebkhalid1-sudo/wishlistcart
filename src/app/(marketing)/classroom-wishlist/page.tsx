import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, BookOpen, Palette, FlaskConical, Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Free Classroom Wishlist for Teachers — WishlistCart',
  description:
    'Create a classroom wishlist in 2 minutes. Share with parents. Get exactly what your students need — pencils, books, art supplies, and more.',
  alternates: { canonical: 'https://wishlistcart.com/classroom-wishlist' },
}

const HOW_IT_WORKS = [
  { step: '1', title: 'Create your wishlist', description: 'Sign up free and create a new wishlist called "Classroom Supplies" or whatever fits.' },
  { step: '2', title: 'Add your supplies', description: 'Paste Amazon, Target, or any store link. We pull in the title, price, and image automatically.' },
  { step: '3', title: 'Share with parents', description: 'Copy your wishlist link and paste it in your class newsletter, app, or email.' },
  { step: '4', title: 'Parents buy directly', description: 'Parents open the link, pick an item, and buy it. Items get marked claimed so nothing gets doubled up.' },
]

const TEMPLATE_CATEGORIES = [
  {
    icon: Apple,
    label: 'Back-to-school essentials',
    items: ['Pencils (No. 2)', 'Markers (washable)', 'Composition notebooks', 'Facial tissues (Kleenex)', 'Hand sanitizer', 'Disinfecting wipes (Clorox)'],
  },
  {
    icon: BookOpen,
    label: 'Reading & literacy',
    items: ['Decodable readers', 'Sight word flashcards', 'Chapter books (Grades 3–5)', 'Picture books', 'Guided reading sets', 'Reading logs'],
  },
  {
    icon: Palette,
    label: 'Art supplies',
    items: ['Watercolor paint sets', 'Construction paper (assorted)', 'Colored pencils', 'Glue sticks', 'Safety scissors', 'Foam brushes'],
  },
  {
    icon: FlaskConical,
    label: 'STEM supplies',
    items: ['Building blocks / LEGO', 'Magnifying glasses', 'Measuring tape', 'Graph paper pads', 'Coding cards (Scratch Jr.)', 'Simple circuit kits'],
  },
]

export default function ClassroomWishlistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Classroom Wishlist for Teachers — WishlistCart',
            url: 'https://wishlistcart.com/classroom-wishlist',
            description:
              'Free classroom wishlist for teachers. Share with parents and get exactly what your students need.',
          }),
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-subtle px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          Free for teachers
        </div>
        <h1 className="font-serif text-5xl text-foreground leading-tight max-w-2xl mx-auto md:text-6xl">
          Classroom Wishlists{' '}
          <span className="italic">for Teachers</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Create a classroom wishlist in 2 minutes. Share with parents. Get exactly what your
          students need — without spending a dollar of your own money.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="bg-[#0F0F0F] text-white hover:bg-gray-800">
            <Link href="/signup">Create Your Classroom Wishlist — Free</Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">No credit card. No setup fee. Free forever.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-4xl px-4 py-20">
          <h2 className="font-serif text-3xl text-foreground text-center mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">
            Four simple steps from signup to stocked classroom.
          </p>
          <div className="grid gap-8 md:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="flex flex-col">
                <span className="font-serif text-4xl text-muted-foreground/30 mb-4">{s.step}</span>
                <h3 className="font-semibold text-foreground text-sm mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template suggestions */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-3">
          What teachers typically need
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          Use these as a starting point for your own classroom wishlist.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <div key={cat.label} className="rounded-xl border border-border bg-subtle p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-3">{cat.label}</h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 shrink-0 text-foreground mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <blockquote className="font-serif text-2xl text-foreground leading-relaxed italic md:text-3xl">
            &ldquo;I shared my wishlist link in the class newsletter and had $200 worth of supplies donated in 24 hours. I&apos;ve never had a back-to-school like it.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold">
              M
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Mrs. Mitchell</p>
              <p className="text-xs text-muted-foreground">3rd Grade Teacher, Austin TX</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why it beats Amazon lists */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <h2 className="font-serif text-3xl text-foreground text-center mb-12">
          Better than an Amazon list
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              title: 'Any store, any link',
              description: 'Add items from Target, Walmart, Staples, or any store — not just Amazon.',
            },
            {
              title: 'No duplicates',
              description: 'Gift claiming marks items as taken so two parents never buy the same thing.',
            },
            {
              title: 'Always free',
              description: 'WishlistCart is free for personal use. No ads, no upsell, no catch.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-subtle p-6">
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="font-serif text-4xl text-foreground mb-4">
            Your classroom deserves better supplies
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of teachers who use WishlistCart to get their classrooms stocked — without spending out of pocket.
          </p>
          <Button asChild size="lg" className="bg-[#0F0F0F] text-white hover:bg-gray-800">
            <Link href="/signup">Create Your Classroom Wishlist — Free</Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Takes 2 minutes. Share with parents today.
          </p>
        </div>
      </section>
    </>
  )
}
