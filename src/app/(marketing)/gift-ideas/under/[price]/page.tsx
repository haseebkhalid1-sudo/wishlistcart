import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface BudgetGuide {
  amount: number
  title: string
  description: string
  intro: string
  categories: {
    heading: string
    items: { name: string; price: string; why: string; searchUrl: string }[]
  }[]
  faqs: { q: string; a: string }[]
}

const BUDGET_GUIDES: Record<string, BudgetGuide> = {
  '25': {
    amount: 25,
    title: 'Best Gifts Under $25 in 2026',
    description: 'Thoughtful gifts under $25 that don\'t look cheap — for Secret Santa, coworkers, birthdays, and anyone on a tight budget.',
    intro: "Under $25 doesn't mean under-thought. These picks look and feel more expensive than they are — and most of them ship fast.",
    categories: [
      {
        heading: 'For Everyone',
        items: [
          {
            name: 'Fancy Candle',
            price: '$12–$22',
            why: 'A Voluspa tin or a nice soy candle. Always appreciated, never wrong.',
            searchUrl: 'https://www.amazon.com/s?k=voluspa+candle+gift',
          },
          {
            name: 'Moleskine Pocket Notebook',
            price: '$10–$18',
            why: 'Classic, useful, and feels premium. Pair with a Pilot G2 for the perfect desk gift.',
            searchUrl: 'https://www.amazon.com/s?k=moleskine+pocket+notebook',
          },
          {
            name: 'Magnetic Bookmark Set',
            price: '$8–$15',
            why: 'Clever little gift for book lovers. Satisfying to use, hard to find on your own.',
            searchUrl: 'https://www.amazon.com/s?k=magnetic+bookmark+set',
          },
        ],
      },
      {
        heading: 'For Her',
        items: [
          {
            name: 'Silk Scrunchie Set',
            price: '$12–$20',
            why: 'Nicer than regular scrunchies, genuinely gentler on hair. Any beauty lover will use these daily.',
            searchUrl: 'https://www.amazon.com/s?k=silk+scrunchie+set',
          },
          {
            name: 'Mini Hand Cream Set',
            price: '$15–$25',
            why: 'L\'Occitane or The Body Shop mini sets. Luxurious feel, perfect size.',
            searchUrl: 'https://www.amazon.com/s?k=hand+cream+gift+set+mini',
          },
        ],
      },
      {
        heading: 'For Him',
        items: [
          {
            name: 'Pocket Multi-Tool',
            price: '$15–$25',
            why: 'Leatherman or Gerber keychain tool. He\'ll use it constantly and wonder how he lived without it.',
            searchUrl: 'https://www.amazon.com/s?k=pocket+multi+tool+keychain',
          },
          {
            name: 'Card Holder Wallet',
            price: '$12–$25',
            why: 'Slim RFID-blocking card holder. A genuine upgrade from an overstuffed wallet.',
            searchUrl: 'https://www.amazon.com/s?k=slim+card+holder+wallet+rfid',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What are good gifts under $25?',
        a: "The best gifts under $25 are consumable or practical: a nice candle, a quality notebook, a small self-care set, or a specialty food item. Presentation elevates a cheap gift — wrap it nicely and add a handwritten note.",
      },
      {
        q: 'What is a good Secret Santa gift under $25?',
        a: "For Secret Santa under $25: a Voluspa candle, a desk plant, a gourmet snack box, a Moleskine notebook, or a cozy mug with specialty hot cocoa. Safe, universally liked, and feels more expensive than it is.",
      },
      {
        q: 'Can you get a thoughtful gift for under $25?',
        a: "Absolutely. A handwritten note with a $20 book by someone's favorite author is more thoughtful than a $100 generic gift. Under $25 forces creativity — focus on something they'd enjoy but wouldn't buy themselves.",
      },
    ],
  },
  '50': {
    amount: 50,
    title: 'Best Gifts Under $50 in 2026',
    description: 'The best gifts under $50 — quality picks that feel like real presents without breaking the bank.',
    intro: "The $50 range is the sweet spot: enough to get something genuinely nice, not so much that it feels awkward. These picks land well for almost any occasion.",
    categories: [
      {
        heading: 'Tech & Accessories',
        items: [
          {
            name: 'Wireless Charging Pad',
            price: '$20–$40',
            why: 'Anker or Belkin. Clean desk, no cables. Every phone user can use one.',
            searchUrl: 'https://www.amazon.com/s?k=wireless+charging+pad+gift',
          },
          {
            name: 'Portable Power Bank',
            price: '$25–$45',
            why: 'Anker 10,000mAh. Practical, compact, used constantly.',
            searchUrl: 'https://www.amazon.com/s?k=anker+power+bank+10000mah',
          },
          {
            name: 'Cable Organizer Kit',
            price: '$15–$30',
            why: 'Premium leather or magnetic cable management. The gift that fixes the mess on his or her desk.',
            searchUrl: 'https://www.amazon.com/s?k=cable+organizer+desk+gift',
          },
        ],
      },
      {
        heading: 'Food & Drink',
        items: [
          {
            name: 'Specialty Coffee Sampler',
            price: '$25–$45',
            why: '5–6 single-origin coffees in a gift box. Perfect for coffee drinkers. Atlas or Trade Coffee subscriptions are great picks.',
            searchUrl: 'https://www.amazon.com/s?k=specialty+coffee+sampler+gift+box',
          },
          {
            name: 'Cocktail Bitters Gift Set',
            price: '$30–$50',
            why: 'The kitchen upgrade for home bartenders. Dashfire or Fee Brothers sets are excellent.',
            searchUrl: 'https://www.amazon.com/s?k=cocktail+bitters+gift+set',
          },
          {
            name: 'Charcuterie Snack Box',
            price: '$25–$50',
            why: 'Cured meats, artisan crackers, and fancy mustards. Instantly shareable.',
            searchUrl: 'https://www.amazon.com/s?k=charcuterie+snack+box+gift',
          },
        ],
      },
      {
        heading: 'Self-Care & Home',
        items: [
          {
            name: 'Weighted Eye Mask',
            price: '$20–$40',
            why: 'Lavender-scented, heated option available. Great for stress relief and sleep.',
            searchUrl: 'https://www.amazon.com/s?k=weighted+eye+mask+sleep',
          },
          {
            name: 'Essential Oil Diffuser',
            price: '$25–$45',
            why: 'Turns any room into a spa. Pairs well with a sampler pack of oils.',
            searchUrl: 'https://www.amazon.com/s?k=essential+oil+diffuser+gift',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What are good gifts under $50?',
        a: "Under $50 you can get genuinely great gifts: quality tech accessories (wireless charger, power bank), food gifts (specialty coffee, charcuterie), self-care items (nice candle, diffuser), or a good book plus a related experience. The $30–$50 range is perfect for close friends, coworkers, and family.",
      },
      {
        q: 'What are the best birthday gifts under $50?',
        a: "For birthdays under $50, personalize where possible: a book by their favorite author, a piece of jewelry with their birthstone, a plant from their favorite genre (succulents, herbs), or a specialty food item they love. Generic gifts feel cheap; personal gifts feel valuable regardless of price.",
      },
      {
        q: 'What are good Christmas gifts under $50?',
        a: "Christmas gifts under $50: cozy socks + candle + hot cocoa bundle, a specialty food box, a nice planner or journal, a streaming gift card, or a small experience (escape room voucher, pottery class for one). Presentation matters — add tissue paper and a good card.",
      },
    ],
  },
  '100': {
    amount: 100,
    title: 'Best Gifts Under $100 in 2026',
    description: 'Premium gift ideas under $100 — the range where you can get something genuinely special.',
    intro: "Under $100 is where gifting gets fun. You can afford quality, personality, and real impact. These picks feel like treats — for anyone on your list.",
    categories: [
      {
        heading: 'Tech',
        items: [
          {
            name: 'JBL Clip 4 Bluetooth Speaker',
            price: '$55–$80',
            why: 'Waterproof, compact, clips anywhere. Best-in-class under $100.',
            searchUrl: 'https://www.amazon.com/s?k=jbl+clip+4+speaker',
          },
          {
            name: 'Kindle Paperwhite',
            price: '$90–$100',
            why: "The e-reader for people who say they don't need one — until they have it.",
            searchUrl: 'https://www.amazon.com/s?k=kindle+paperwhite',
          },
          {
            name: 'Smart Plug Set',
            price: '$25–$40',
            why: 'Kasa or TP-Link. Turn any lamp or appliance into a smart device. Practical and surprisingly delightful.',
            searchUrl: 'https://www.amazon.com/s?k=smart+plug+set+gift',
          },
        ],
      },
      {
        heading: 'Kitchen & Home',
        items: [
          {
            name: 'Lodge Cast Iron Skillet',
            price: '$30–$60',
            why: "Indestructible, improves with age, used for everything. A forever gift for any cook.",
            searchUrl: 'https://www.amazon.com/s?k=lodge+cast+iron+skillet+10+inch',
          },
          {
            name: 'Instant-Read Thermometer (ThermoPro)',
            price: '$25–$50',
            why: 'The kitchen tool professional cooks swear by. Makes meat, candy, and baking instantly better.',
            searchUrl: 'https://www.amazon.com/s?k=thermopro+instant+read+thermometer',
          },
          {
            name: 'Aeropress Coffee Maker',
            price: '$35–$45',
            why: 'Cult-favorite portable coffee brewer. Better coffee in 2 minutes. Coffee lovers will be obsessed.',
            searchUrl: 'https://www.amazon.com/s?k=aeropress+coffee+maker',
          },
        ],
      },
      {
        heading: 'Style & Accessories',
        items: [
          {
            name: 'Ray-Ban Wayfarer Sunglasses',
            price: '$80–$100',
            why: "The classic that never goes out of style. They'll wear them for years.",
            searchUrl: 'https://www.amazon.com/s?k=ray+ban+wayfarer+sunglasses',
          },
          {
            name: 'Leather Card Holder Wallet',
            price: '$40–$80',
            why: 'Cuoieria Fiorentina or Bellroy. Quality leather, slim profile, years of daily use.',
            searchUrl: 'https://www.amazon.com/s?k=bellroy+card+holder+wallet',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What are good gifts under $100?',
        a: "Under $100, you can give someone something they\'d use every day: a Kindle, quality kitchen tools, nice headphones, or a leather accessory. Focus on durability — gifts in this range should feel like real investments, not just nice-to-haves.",
      },
      {
        q: 'What is a thoughtful gift for $100 or less?',
        a: "Thoughtful gifts at this price point: a curated experience (cooking class, wine tasting), a piece of jewelry with personal meaning, a high-quality version of something they use daily (better headphones, nicer wallet), or a hardcover collection of their favorite author's work.",
      },
      {
        q: 'What are luxury gifts under $100?',
        a: "Gifts that feel luxurious under $100: Diptyque or Maison Margiela candles ($50–$70), a silk pillowcase, a Kindle Paperwhite, a bottle of quality wine or whiskey, or a cashmere beanie. The key is brand — a $60 item from the right brand feels more luxurious than a $90 generic.",
      },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(BUDGET_GUIDES).map((price) => ({ price }))
}

export async function generateMetadata({ params }: { params: Promise<{ price: string }> }): Promise<Metadata> {
  const { price } = await params
  const guide = BUDGET_GUIDES[price]
  if (!guide) return { title: 'Not Found' }

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `https://wishlistcart.com/gift-ideas/under/${price}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://wishlistcart.com/gift-ideas/under/${price}`,
      type: 'article',
    },
  }
}

export default async function BudgetGiftGuidePage({ params }: { params: Promise<{ price: string }> }) {
  const { price } = await params
  const guide = BUDGET_GUIDES[price]
  if (!guide) notFound()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: guide.title,
    description: guide.description,
    numberOfItems: guide.categories.reduce((sum, c) => sum + c.items.length, 0),
    itemListElement: guide.categories.flatMap((cat, ci) =>
      cat.items.map((item, ii) => ({
        '@type': 'ListItem',
        position: ci * 10 + ii + 1,
        name: item.name,
        description: item.why,
      }))
    ),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const otherBudgets = Object.entries(BUDGET_GUIDES).filter(([p]) => p !== price)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span>Gift Ideas</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">Under ${guide.amount}</span>
        </nav>

        {/* Hero */}
        <h1 className="font-serif text-display-lg text-foreground">{guide.title}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground leading-relaxed">{guide.intro}</p>

        {/* CTA */}
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-subtle px-5 py-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Save these ideas to a wishlist</p>
            <p className="text-xs text-muted-foreground mt-0.5">Share it so people know exactly what you want.</p>
          </div>
          <Button size="sm" asChild>
            <Link href="/signup">Try it free <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        {/* Gift categories */}
        {guide.categories.map((cat) => (
          <section key={cat.heading} className="mt-14">
            <h2 className="font-serif text-2xl text-foreground mb-6">{cat.heading}</h2>
            <div className="space-y-4">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-border bg-subtle p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.why}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-medium text-foreground">{item.price}</span>
                      <div className="mt-1">
                        <a
                          href={item.searchUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Shop →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Mid-page CTA */}
        <div className="mt-16 rounded-2xl border border-border bg-subtle p-8 text-center">
          <h2 className="font-serif text-2xl text-foreground">Build your gift wishlist</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
            Save any of these items to a WishlistCart wishlist and share it so people know exactly what to get you.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/signup">Create your free wishlist</Link>
          </Button>
        </div>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl text-foreground mb-8">Frequently asked questions</h2>
          <div className="space-y-8">
            {guide.faqs.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-medium text-foreground mb-2">{q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related guides */}
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-semibold text-foreground mb-4">More gift guides by budget</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {otherBudgets.map(([p, g]) => (
              <Link
                key={p}
                href={`/gift-ideas/under/${p}`}
                className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                Gifts under ${g.amount}
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Looking for gifts by recipient?{' '}
            {['mom', 'dad', 'wife', 'husband', 'kids'].map((p, i) => (
              <span key={p}>
                <Link href={`/gift-ideas/for/${p}`} className="underline hover:text-foreground transition-colors capitalize">
                  gifts for {p}
                </Link>
                {i < 4 ? ', ' : ''}
              </span>
            ))}
          </p>
        </section>
      </div>
    </>
  )
}
