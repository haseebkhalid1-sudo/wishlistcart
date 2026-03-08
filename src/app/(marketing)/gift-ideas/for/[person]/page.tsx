import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface GiftGuide {
  title: string
  description: string
  intro: string
  categories: {
    heading: string
    items: { name: string; price: string; why: string; searchUrl: string }[]
  }[]
  faqs: { q: string; a: string }[]
}

const GUIDES: Record<string, GiftGuide> = {
  mom: {
    title: 'Best Gifts for Mom in 2026',
    description:
      'Find the perfect gift for mom — from sentimental keepsakes to practical luxuries. Curated gift ideas for every budget.',
    intro:
      "Shopping for mom is both the easiest and hardest thing in the world. She deserves something thoughtful, but you know she'll say 'you didn't have to.' Here are 25 genuinely great gifts that she'll actually use and love.",
    categories: [
      {
        heading: 'Relaxation & Self-Care',
        items: [
          {
            name: 'Weighted Blanket',
            price: '$40–$80',
            why: 'The gift that says "rest more" without the lecture.',
            searchUrl: 'https://www.amazon.com/s?k=weighted+blanket',
          },
          {
            name: 'Aromatherapy Diffuser Set',
            price: '$25–$50',
            why: 'Turn her home into a spa. She deserves it.',
            searchUrl: 'https://www.amazon.com/s?k=aromatherapy+diffuser+set',
          },
          {
            name: 'Silk Pillowcase',
            price: '$30–$60',
            why: 'Better sleep and better hair — a rare double win.',
            searchUrl: 'https://www.amazon.com/s?k=silk+pillowcase',
          },
        ],
      },
      {
        heading: 'Kitchen & Home',
        items: [
          {
            name: 'Le Creuset Dutch Oven',
            price: '$200–$350',
            why: 'If she loves to cook, this is the forever gift.',
            searchUrl: 'https://www.amazon.com/s?k=le+creuset+dutch+oven',
          },
          {
            name: 'Nespresso Machine',
            price: '$80–$180',
            why: 'Café-quality coffee at home. Mornings just got better.',
            searchUrl: 'https://www.amazon.com/s?k=nespresso+machine',
          },
          {
            name: 'Herb Garden Kit',
            price: '$30–$60',
            why: 'A living gift that keeps giving all year.',
            searchUrl: 'https://www.amazon.com/s?k=indoor+herb+garden+kit',
          },
        ],
      },
      {
        heading: 'Experiences & Sentimental',
        items: [
          {
            name: 'Custom Photo Book',
            price: '$25–$60',
            why: 'A year of memories, beautifully printed. She will cry (happy tears).',
            searchUrl: 'https://www.shutterfly.com',
          },
          {
            name: 'Personalized Jewelry',
            price: '$40–$150',
            why: "A necklace with her children's initials never goes out of style.",
            searchUrl: 'https://www.etsy.com/search?q=personalized+jewelry+mom',
          },
          {
            name: 'Cooking Class Subscription',
            price: '$80–$150',
            why: 'Something to do, not just to have. Great for curious cooks.',
            searchUrl: 'https://www.amazon.com/s?k=online+cooking+class+gift+card',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a good gift for mom for Mother\'s Day?',
        a: "The best Mother's Day gifts are personal. A custom photo book, her favorite skincare product, or an experience like a cooking class or spa day show you paid attention. If in doubt, a heartfelt card with a restaurant gift card rarely fails.",
      },
      {
        q: 'What is a thoughtful gift for mom on a budget?',
        a: "Under $50, some of the best options are: a weighted blanket, a silk pillowcase, a nice candle set, or a personalized photo mug. Presentation matters as much as price — wrap it nicely.",
      },
      {
        q: 'What do moms actually want as gifts?',
        a: "Most moms want to feel seen and appreciated. Gifts that align with her actual hobbies and interests always land better than generic items. Ask her siblings or friends for ideas if you're stuck.",
      },
    ],
  },
  dad: {
    title: 'Best Gifts for Dad in 2026',
    description:
      "Gift ideas for the dad who says he doesn't need anything — from tech gadgets to grilling essentials.",
    intro:
      "Dad says he doesn't need anything. Dad is wrong. Here are genuinely useful gifts he'll actually appreciate, organized by interest.",
    categories: [
      {
        heading: 'Grilling & Outdoors',
        items: [
          {
            name: 'Instant-Read Thermometer',
            price: '$25–$50',
            why: 'Every grill master needs one. ThermoPro and Thermapen are the go-tos.',
            searchUrl: 'https://www.amazon.com/s?k=instant+read+meat+thermometer',
          },
          {
            name: 'Cast Iron Skillet Set',
            price: '$40–$80',
            why: 'Virtually indestructible. Lodge makes the best value.',
            searchUrl: 'https://www.amazon.com/s?k=lodge+cast+iron+skillet',
          },
          {
            name: 'Portable Bluetooth Speaker',
            price: '$50–$150',
            why: 'For the backyard, garage, or camping trip.',
            searchUrl: 'https://www.amazon.com/s?k=portable+waterproof+bluetooth+speaker',
          },
        ],
      },
      {
        heading: 'Tech & Gadgets',
        items: [
          {
            name: 'Smart Home Hub',
            price: '$50–$100',
            why: 'Amazon Echo or Google Home. Dad will pretend not to love it, then use it daily.',
            searchUrl: 'https://www.amazon.com/s?k=smart+home+hub',
          },
          {
            name: 'Wireless Charging Pad',
            price: '$20–$40',
            why: 'The gift that ends the cable clutter. Finally.',
            searchUrl: 'https://www.amazon.com/s?k=wireless+charging+pad',
          },
          {
            name: 'E-Reader (Kindle)',
            price: '$100–$180',
            why: "If he likes to read, a Kindle is life-changing. And he'll actually use it.",
            searchUrl: 'https://www.amazon.com/s?k=kindle+e-reader',
          },
        ],
      },
      {
        heading: 'Personal Care',
        items: [
          {
            name: 'Electric Shaver or Grooming Kit',
            price: '$50–$150',
            why: 'Braun or Philips Norelco are reliable picks. Much better than a grocery store razor.',
            searchUrl: 'https://www.amazon.com/s?k=electric+shaver+men',
          },
          {
            name: 'Premium Wallet',
            price: '$40–$100',
            why: "If his wallet is older than his car, it's time.",
            searchUrl: 'https://www.amazon.com/s?k=slim+leather+wallet+men',
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What do you get the dad who has everything?",
        a: "Focus on consumables (nice whiskey, specialty coffee, jerky subscription), experiences (golf lesson, concert tickets, sports game), or upgrade something he already has but uses daily (new wallet, better headphones, quality knife).",
      },
      {
        q: "What is a good Father's Day gift under $50?",
        a: "Great options under $50: an instant-read thermometer, a portable Bluetooth speaker, a cast iron skillet, a wireless charging pad, or a book by his favorite author with a handwritten note.",
      },
      {
        q: "What gifts do dads actually use?",
        a: "The gifts dads use most are practical ones tied to their hobbies. A golfer uses golf gear. A home cook uses kitchen tools. A tech enthusiast uses gadgets. Match the gift to the activity, not to a generic 'dad' stereotype.",
      },
    ],
  },
  wife: {
    title: 'Best Gifts for Your Wife in 2026',
    description: 'Romantic and thoughtful gift ideas for your wife — for anniversaries, birthdays, Christmas, and everyday moments.',
    intro: "The best gifts for your wife aren't the most expensive ones — they're the most thoughtful. Here are ideas that show you've been paying attention.",
    categories: [
      {
        heading: 'Jewelry & Accessories',
        items: [
          {
            name: 'Personalized Name Necklace',
            price: '$50–$150',
            why: 'Timeless. Gets better with a birthstone added.',
            searchUrl: 'https://www.etsy.com/search?q=personalized+name+necklace',
          },
          {
            name: 'Pearl Earrings',
            price: '$40–$120',
            why: 'Classic, wearable, and always appropriate.',
            searchUrl: 'https://www.amazon.com/s?k=pearl+earrings+women',
          },
          {
            name: 'Leather Handbag',
            price: '$100–$300',
            why: "A quality leather bag lasts decades. Check her wishlist for style preference.",
            searchUrl: 'https://www.amazon.com/s?k=leather+handbag+women',
          },
        ],
      },
      {
        heading: 'Experiences',
        items: [
          {
            name: 'Spa Day Voucher',
            price: '$80–$200',
            why: "Book it, don't just give a voucher. Show you made the effort.",
            searchUrl: 'https://www.spafinder.com',
          },
          {
            name: 'Cooking or Pottery Class for Two',
            price: '$60–$150',
            why: 'Something you do together. Double the value.',
            searchUrl: 'https://www.airbnb.com/experiences',
          },
        ],
      },
      {
        heading: 'Home & Comfort',
        items: [
          {
            name: 'Cashmere Robe',
            price: '$80–$200',
            why: 'Luxurious, practical, and something she would never buy herself.',
            searchUrl: 'https://www.amazon.com/s?k=cashmere+robe+women',
          },
          {
            name: 'Luxury Candle',
            price: '$30–$80',
            why: "Diptyque, Maison Margiela, or Voluspa. She'll love it.",
            searchUrl: 'https://www.amazon.com/s?k=luxury+candle+gift',
          },
          {
            name: 'Subscription Box',
            price: '$30–$100/mo',
            why: 'The gift that arrives every month. FabFitFun, Ipsy, or a wine club.',
            searchUrl: 'https://www.amazon.com/s?k=subscription+box+women+gift',
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is a romantic gift for your wife?",
        a: "The most romantic gifts combine surprise with thoughtfulness. Book a dinner at her favorite restaurant with a small meaningful gift — like a charm for her bracelet or a first-edition of her favorite book. The effort is the gift.",
      },
      {
        q: "What is a good anniversary gift for wife?",
        a: "For milestone anniversaries, consider jewelry with sentimental value, a weekend trip, or recreating your first date. For smaller anniversaries, a personalized photo book or engraved keepsake is always meaningful.",
      },
      {
        q: "What does my wife want for her birthday?",
        a: "Ask her, then actually listen. If she's mentioned something in passing — a book, a restaurant, a trip — that's your answer. If you want to surprise her, focus on the category she loves most: beauty, fashion, home, experiences, or jewelry.",
      },
    ],
  },
  husband: {
    title: 'Best Gifts for Your Husband in 2026',
    description: 'Thoughtful gift ideas for your husband — for birthdays, anniversaries, Father\'s Day, and Christmas.',
    intro: "Shopping for your husband doesn't have to be hard. Whether he's into tech, sports, cooking, or just needs something practical he'd never buy himself — here's what actually works.",
    categories: [
      {
        heading: 'Tech & Entertainment',
        items: [
          {
            name: 'Noise-Cancelling Headphones',
            price: '$150–$350',
            why: 'Sony WH-1000XM5 or Bose QC45. He\'ll use them every day.',
            searchUrl: 'https://www.amazon.com/s?k=noise+cancelling+headphones+men',
          },
          {
            name: 'Smart Watch',
            price: '$200–$400',
            why: 'Apple Watch or Galaxy Watch. Fitness tracking + notifications in one.',
            searchUrl: 'https://www.amazon.com/s?k=smartwatch+men',
          },
          {
            name: 'Portable Projector',
            price: '$100–$300',
            why: 'Movie nights in the backyard. Way cooler than another streaming subscription.',
            searchUrl: 'https://www.amazon.com/s?k=portable+mini+projector',
          },
        ],
      },
      {
        heading: 'Sports & Outdoors',
        items: [
          {
            name: 'Golf Rangefinder',
            price: '$100–$250',
            why: 'If he golfs, this is the practical upgrade he\'s been putting off.',
            searchUrl: 'https://www.amazon.com/s?k=golf+rangefinder',
          },
          {
            name: 'Hydro Flask Bottle',
            price: '$30–$50',
            why: 'Keeps drinks cold for 24 hours. Indestructible. He\'ll use it forever.',
            searchUrl: 'https://www.amazon.com/s?k=hydro+flask+water+bottle',
          },
          {
            name: 'Fitness Tracker Band',
            price: '$50–$150',
            why: "Fitbit or Garmin. Great for the health-conscious guy who doesn't want a full smartwatch.",
            searchUrl: 'https://www.amazon.com/s?k=fitness+tracker+band+men',
          },
        ],
      },
      {
        heading: 'Style & Grooming',
        items: [
          {
            name: 'Cologne Gift Set',
            price: '$60–$150',
            why: 'A new fragrance feels like a fresh start. Sauvage, Bleu de Chanel, or Acqua di Gio are safe bets.',
            searchUrl: 'https://www.amazon.com/s?k=mens+cologne+gift+set',
          },
          {
            name: 'Premium Leather Belt',
            price: '$40–$100',
            why: 'A quality belt he\'ll actually wear daily. Trafalgar and Fossil make great options.',
            searchUrl: 'https://www.amazon.com/s?k=leather+dress+belt+men',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a good anniversary gift for your husband?',
        a: "The best anniversary gifts lean sentimental or experiential — a weekend trip to somewhere meaningful, a framed photo from your wedding, or tickets to a game or concert he\'d love. For material gifts, focus on quality over quantity: one great thing rather than a basket of small items.",
      },
      {
        q: "What do husbands actually want as gifts?",
        a: "Most husbands want something tied to their hobbies or something they\'d never justify buying themselves. Tech upgrades, high-quality gear for their hobby, or a curated experience (cooking class, whiskey tasting, sporting event) tend to land much better than generic gifts.",
      },
      {
        q: "What is a unique gift for a husband who has everything?",
        a: "Focus on experiences: a private wine tasting, a race track driving experience, a golf lesson with a pro, or a custom whiskey blend kit. Alternatively, upgrade something he already uses daily — better headphones, a nicer wallet, a quality watch.",
      },
    ],
  },
  boyfriend: {
    title: 'Best Gifts for Your Boyfriend in 2026',
    description: 'Gift ideas for your boyfriend — from budget-friendly to splurge-worthy. For birthdays, anniversaries, and just because.',
    intro: "The best gifts for your boyfriend show you pay attention — to what he geeks out about, what he uses every day, and what he'd love but wouldn't spend money on himself.",
    categories: [
      {
        heading: 'Tech & Gaming',
        items: [
          {
            name: 'Gaming Headset',
            price: '$50–$150',
            why: 'SteelSeries, HyperX, or Astro. If he games, he needs a good headset.',
            searchUrl: 'https://www.amazon.com/s?k=gaming+headset',
          },
          {
            name: 'Mechanical Keyboard',
            price: '$80–$200',
            why: 'The desk upgrade that gamers and coders obsess over.',
            searchUrl: 'https://www.amazon.com/s?k=mechanical+keyboard',
          },
          {
            name: 'Portable Charger (Power Bank)',
            price: '$30–$60',
            why: 'Anker makes the best. Practical, portable, and always appreciated.',
            searchUrl: 'https://www.amazon.com/s?k=anker+portable+charger',
          },
        ],
      },
      {
        heading: 'Style & Accessories',
        items: [
          {
            name: 'Minimalist Watch',
            price: '$80–$250',
            why: 'A clean watch elevates every outfit. MVMT and Seiko are great entry points.',
            searchUrl: 'https://www.amazon.com/s?k=minimalist+watch+men',
          },
          {
            name: 'Personalized Bracelet',
            price: '$30–$80',
            why: 'His initials, coordinates of somewhere meaningful, or a short message. Simple and thoughtful.',
            searchUrl: 'https://www.etsy.com/search?q=personalized+bracelet+men',
          },
          {
            name: 'Quality Sunglasses',
            price: '$50–$200',
            why: 'Ray-Ban or Oakley. If he always wears cheap ones, this is a real upgrade.',
            searchUrl: 'https://www.amazon.com/s?k=mens+sunglasses+quality',
          },
        ],
      },
      {
        heading: 'Experiences',
        items: [
          {
            name: 'Whiskey or Beer Tasting Experience',
            price: '$50–$150',
            why: "Book a local distillery tour or tasting event. Great date idea too.",
            searchUrl: 'https://www.airbnb.com/experiences',
          },
          {
            name: 'Cooking Class for Two',
            price: '$60–$150',
            why: 'Learn to make something together. Italian, sushi, or ramen — pick his favorite cuisine.',
            searchUrl: 'https://www.airbnb.com/experiences',
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is a good birthday gift for a boyfriend?",
        a: "The best birthday gifts match his interests specifically. A gamer needs gaming gear. A foodie needs a restaurant experience or kitchen gadget. A fitness person needs workout equipment or activewear. The worst gifts are generic — think about what makes him different, not what a generic 'boyfriend' might want.",
      },
      {
        q: "What is a romantic gift for a boyfriend?",
        a: "Romantic gifts have a personal story behind them. Coordinates of where you first met, engraved with a date, or a photo book of your relationship. Experiences beat objects every time — a surprise dinner, a weekend trip, or recreating your first date.",
      },
      {
        q: "What is a good cheap gift for a boyfriend?",
        a: "Under $30: a personalized keychain, his favorite book, a funny custom mug, a nice card game for two, or a streaming service subscription for the month. The thought matters more than the price — anything with a personal note beats an expensive generic gift.",
      },
    ],
  },
  girlfriend: {
    title: 'Best Gifts for Your Girlfriend in 2026',
    description: 'Romantic and thoughtful gift ideas for your girlfriend — from budget-friendly picks to splurge-worthy presents.',
    intro: "The trick to gifting your girlfriend: think about what she loves, not what the internet says girlfriends want. These picks cover a wide range — pick the section that matches her personality.",
    categories: [
      {
        heading: 'Beauty & Skincare',
        items: [
          {
            name: 'Skincare Gift Set',
            price: '$40–$100',
            why: 'Tatcha, Drunk Elephant, or CeraVe sets. She likely has a skincare routine — support it.',
            searchUrl: 'https://www.amazon.com/s?k=skincare+gift+set+women',
          },
          {
            name: 'Perfume',
            price: '$60–$150',
            why: "A new scent is intimate and memorable. Maison Margiela's Replica line and Jo Malone are reliable choices.",
            searchUrl: 'https://www.amazon.com/s?k=womens+perfume+gift',
          },
          {
            name: 'Gua Sha + Face Oil Set',
            price: '$25–$60',
            why: 'Trendy, spa-like self-care. Feels luxurious, practical for daily use.',
            searchUrl: 'https://www.amazon.com/s?k=gua+sha+face+oil+set',
          },
        ],
      },
      {
        heading: 'Jewelry',
        items: [
          {
            name: 'Gold Huggie Earrings',
            price: '$30–$80',
            why: 'Understated and versatile. She can wear them every day.',
            searchUrl: 'https://www.amazon.com/s?k=gold+huggie+earrings+women',
          },
          {
            name: 'Dainty Layering Necklace',
            price: '$40–$120',
            why: 'A delicate chain with a small charm or initial. Timeless.',
            searchUrl: 'https://www.etsy.com/search?q=dainty+layering+necklace',
          },
          {
            name: 'Birthstone Ring',
            price: '$50–$200',
            why: 'Personal, meaningful, and always the right gift. Etsy has hundreds of beautiful options.',
            searchUrl: 'https://www.etsy.com/search?q=birthstone+ring+women',
          },
        ],
      },
      {
        heading: 'Experiences & Comfort',
        items: [
          {
            name: 'Spa Day for Two',
            price: '$100–$300',
            why: "Book it, don't just suggest it. A spa day you planned together is better than a voucher.",
            searchUrl: 'https://www.spafinder.com',
          },
          {
            name: 'Silk Pajama Set',
            price: '$50–$150',
            why: 'Luxurious and practical. Something she would never buy herself.',
            searchUrl: 'https://www.amazon.com/s?k=silk+pajama+set+women',
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is a romantic gift for a girlfriend?",
        a: "Romantic doesn't mean expensive. A photo book of your relationship, a letter with a meaningful memory, surprise tickets to something she mentioned once — these land better than expensive but impersonal items. Effort and attention are the real currency of romantic gifts.",
      },
      {
        q: "What is a good birthday gift for a girlfriend?",
        a: "Birthday gifts for girlfriends should match her personality, not a template. Fashionista? A nice bag or jewelry. Bookworm? A first edition of her favorite novel plus a gift card to her local bookstore. Foodie? A reservation at a restaurant she's been wanting to try. Personalized > generic every time.",
      },
      {
        q: "What do girlfriends actually want as gifts?",
        a: "Most girlfriends want to feel seen and thought about. A gift that references an inside joke, a memory, or something she mentioned months ago in passing will always outperform a generic gift card. Pay attention throughout the year — the best gifts are born from listening.",
      },
    ],
  },
  teens: {
    title: 'Best Gifts for Teenagers in 2026',
    description: 'Actually-cool gift ideas for teens — tech, style, and experiences they\'ll genuinely want.',
    intro: "Buying for a teenager is a minefield. Get it right and you're the cool one. Get it wrong and it ends up in a drawer. These picks are curated to actually land.",
    categories: [
      {
        heading: 'Tech',
        items: [
          {
            name: 'AirPods or Wireless Earbuds',
            price: '$100–$250',
            why: 'The single most-requested teen gift. AirPods if they have an iPhone, Galaxy Buds for Android.',
            searchUrl: 'https://www.amazon.com/s?k=wireless+earbuds+teens',
          },
          {
            name: 'Portable Bluetooth Speaker',
            price: '$40–$100',
            why: 'JBL Flip or Charge series. Perfect for their room, sleepovers, outdoor hangouts.',
            searchUrl: 'https://www.amazon.com/s?k=jbl+bluetooth+speaker',
          },
          {
            name: 'Ring Light',
            price: '$25–$60',
            why: 'Every teen who makes content (or just takes selfies) wants one.',
            searchUrl: 'https://www.amazon.com/s?k=ring+light+for+phone',
          },
        ],
      },
      {
        heading: 'Style & Lifestyle',
        items: [
          {
            name: 'Custom Hoodie or Crewneck',
            price: '$40–$80',
            why: 'Personalized with their initials, a quote, or custom graphic. Printful or Etsy can make it happen.',
            searchUrl: 'https://www.etsy.com/search?q=custom+hoodie+teens',
          },
          {
            name: 'Journaling Set',
            price: '$20–$50',
            why: 'A Leuchtturm1917 notebook and Muji pens. More teens journal than you think.',
            searchUrl: 'https://www.amazon.com/s?k=journal+notebook+set+teens',
          },
          {
            name: 'Polaroid or Instax Camera',
            price: '$60–$120',
            why: 'They print memories instantly. Every teen phase eventually includes film photography.',
            searchUrl: 'https://www.amazon.com/s?k=instax+mini+camera',
          },
        ],
      },
      {
        heading: 'Gaming & Entertainment',
        items: [
          {
            name: 'Nintendo Switch Game',
            price: '$40–$60',
            why: 'Ask what games they want — a specific game they\'ve been wanting beats a gift card.',
            searchUrl: 'https://www.amazon.com/s?k=nintendo+switch+games',
          },
          {
            name: 'Gift Card to Their Favorite Store',
            price: '$25–$100',
            why: "When in doubt, don't guess. A gift card to SHEIN, Steam, PSN, or their favorite brand beats a missed guess every time.",
            searchUrl: 'https://www.amazon.com/s?k=gift+card+teens',
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What do teenagers actually want as gifts?",
        a: "Tech accessories (wireless earbuds, phone cases, ring lights), gift cards to their favorite stores (Steam, Nike, SHEIN, Roblox), and experiences with friends (escape room, movie night package, cooking class). Ask a parent what apps and games they use — that's your cheat code.",
      },
      {
        q: "What is a good gift for a teenager on a budget?",
        a: "Under $30: a nice journal, a Spotify gift card, custom stickers or phone case, a book they'd actually enjoy, or a JBL Go speaker. The best budget gifts for teens are things they consume — music, games, content creation supplies.",
      },
      {
        q: "What are unique gift ideas for teens?",
        a: "Experiences beat objects: escape rooms, pottery classes, cooking experiences, concert tickets, or a print-your-own photo gift box. For creative teens: a digital drawing tablet, a film camera, or a beginner's kit for their current obsession (crocheting, embroidery, resin art).",
      },
    ],
  },
  coworker: {
    title: 'Best Gifts for a Coworker in 2026',
    description: 'Thoughtful, professional gift ideas for a coworker, colleague, or work friend — without crossing any lines.',
    intro: "Gifting a coworker is a careful balance: thoughtful but not over-the-top, personal but not too personal. These picks work whether it's a Secret Santa, a farewell, or just a thank-you.",
    categories: [
      {
        heading: 'Desk & Office',
        items: [
          {
            name: 'Desk Plant (Succulent or Pothos)',
            price: '$15–$40',
            why: "Low maintenance, brightens any desk, universally liked. Impossible to go wrong.",
            searchUrl: 'https://www.amazon.com/s?k=desk+plant+office+succulent',
          },
          {
            name: 'Wireless Charging Pad',
            price: '$20–$40',
            why: 'Practical, professional, universally useful. Clean desk energy.',
            searchUrl: 'https://www.amazon.com/s?k=wireless+charging+pad+desk',
          },
          {
            name: 'Premium Notebook + Pen Set',
            price: '$20–$40',
            why: 'Moleskine or Leuchtturm1917 with a Pilot G2. Feels elevated without being extravagant.',
            searchUrl: 'https://www.amazon.com/s?k=moleskine+notebook+pen+set',
          },
        ],
      },
      {
        heading: 'Food & Drink',
        items: [
          {
            name: 'Specialty Coffee or Tea Sampler',
            price: '$20–$50',
            why: "A curated box of single-origin coffees or artisan teas. Always welcome, never wasteful.",
            searchUrl: 'https://www.amazon.com/s?k=specialty+coffee+sampler+gift',
          },
          {
            name: 'Gourmet Snack Box',
            price: '$25–$60',
            why: 'Thoughtful and shareable. Great for Secret Santa or team gifts.',
            searchUrl: 'https://www.amazon.com/s?k=gourmet+snack+gift+box',
          },
          {
            name: 'Nice Travel Mug',
            price: '$25–$50',
            why: "Yeti or Fellow Carter. If they commute with coffee, they'll use it every day.",
            searchUrl: 'https://www.amazon.com/s?k=travel+mug+gift',
          },
        ],
      },
      {
        heading: 'Wellness & Relaxation',
        items: [
          {
            name: 'Candle',
            price: '$20–$50',
            why: "Safe, pleasant, and always appropriate. Voluspa and Yankee Candle have great options at every price.",
            searchUrl: 'https://www.amazon.com/s?k=luxury+candle+gift+coworker',
          },
          {
            name: 'Gift Card to a Restaurant Near the Office',
            price: '$25–$50',
            why: "When in doubt, gift a lunch. Everyone has to eat.",
            searchUrl: 'https://www.amazon.com/s?k=restaurant+gift+card',
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is an appropriate gift for a coworker?",
        a: "Safe coworker gifts are universal: food, a nice candle, desk accessories, or a gift card. Avoid anything too personal (perfume, clothing) or anything that could be misread. The goal is warm and thoughtful, not intimate. $20–$50 is the right range for most workplace contexts.",
      },
      {
        q: "What is a good Secret Santa gift for a coworker?",
        a: "Under the typical $20–$30 Secret Santa budget: a nice candle, a specialty coffee sampler, a small desk plant, a good notebook and pen, or a gift card to a nearby café or restaurant. Go for quality over quantity — one nice thing beats a basket of cheap fillers.",
      },
      {
        q: "What do you give a coworker who is leaving?",
        a: "For a farewell gift: a group card with handwritten notes (priceless), a personalized keepsake (engraved pen or custom mug), or a gift card they can use for a celebratory meal. If you know them well, a book meaningful to their next chapter is memorable.",
      },
    ],
  },
  grandma: {
    title: 'Best Gifts for Grandma in 2026',
    description: 'Find the perfect gift for grandma — from cozy comforts to tech that keeps her connected. Thoughtful gifts for every budget.',
    intro: "Grandma has everything she needs — the trick is finding something she didn't know she wanted. These gifts are cozy, practical, and genuinely thoughtful.",
    categories: [
      {
        heading: 'Comfort & Warmth',
        items: [
          { name: 'Electric Heated Blanket', price: '$40–$80', why: 'Keeps her warm on the couch without raising the thermostat.', searchUrl: 'https://www.amazon.com/s?k=electric+heated+blanket' },
          { name: 'Memory Foam Slippers', price: '$25–$50', why: 'Because her feet deserve the good stuff.', searchUrl: 'https://www.amazon.com/s?k=memory+foam+slippers+women' },
          { name: 'Cashmere-Blend Cardigan', price: '$50–$120', why: 'Soft, elegant, and she can wear it anywhere.', searchUrl: 'https://www.amazon.com/s?k=cashmere+cardigan+women' },
          { name: 'Compression Socks Set', price: '$15–$30', why: 'Comfortable, colorful, and she\'ll actually wear them daily.', searchUrl: 'https://www.amazon.com/s?k=compression+socks+women' },
        ],
      },
      {
        heading: 'Tech That\'s Actually Simple',
        items: [
          { name: 'Digital Photo Frame (WiFi)', price: '$60–$120', why: 'Load it with family photos before gifting — she\'ll tear up in the best way.', searchUrl: 'https://www.amazon.com/s?k=wifi+digital+photo+frame' },
          { name: 'Amazon Echo (Alexa)', price: '$50–$100', why: 'Voice-controlled music, calls, and timers. No buttons to press.', searchUrl: 'https://www.amazon.com/s?k=amazon+echo+alexa' },
          { name: 'Large-Button Phone', price: '$30–$80', why: 'Easy to use, hard to lose. Great for seniors who hate smartphones.', searchUrl: 'https://www.amazon.com/s?k=large+button+phone+seniors' },
        ],
      },
      {
        heading: 'Sentimental & Personalized',
        items: [
          { name: 'Custom Family Photo Book', price: '$25–$60', why: 'A year of memories printed beautifully. She will display it forever.', searchUrl: 'https://www.shutterfly.com' },
          { name: 'Personalized Grandma Jewelry', price: '$40–$120', why: 'A necklace or bracelet engraved with grandchildren\'s names or birthstones.', searchUrl: 'https://www.etsy.com/search?q=personalized+grandma+jewelry' },
          { name: 'Custom Family Tree Print', price: '$30–$70', why: 'Framed artwork with every family member\'s name. Gorgeous on any wall.', searchUrl: 'https://www.etsy.com/search?q=custom+family+tree+print' },
        ],
      },
    ],
    faqs: [
      { q: 'What are unique gifts for grandma?', a: 'Personalized photo books, a WiFi digital photo frame pre-loaded with family photos, custom jewelry with grandchildren\'s names or birthstones, or a family tree print. Gifts that celebrate family always mean the most.' },
      { q: 'What is a good gift for grandma on a budget?', a: 'Under $30: a nice candle, a personalized mug with family photos, a cozy pair of socks, a memory foam foot cushion, or a card game the whole family can enjoy together.' },
      { q: 'What do grandmas actually want as gifts?', a: 'Most grandmas value connection above all else. Anything that brings the family together — a photo book, a framed picture, a family calendar — will mean more than any gadget. Practical comfort items (soft slippers, warm blanket) are a close second.' },
    ],
  },
  grandpa: {
    title: 'Best Gifts for Grandpa in 2026',
    description: 'Thoughtful gift ideas for grandpa — from practical gadgets to hobbies he loves. Perfect for birthdays, holidays, and Father\'s Day.',
    intro: "Grandpa is the original 'doesn't need anything' guy. But he'd never turn down something that makes his hobby better or his daily routine easier. Here's what actually works.",
    categories: [
      {
        heading: 'Hobbies & Outdoors',
        items: [
          { name: 'Fishing Rod & Reel Combo', price: '$40–$120', why: 'If he fishes, a quality combo is always appreciated. Shakespeare and Ugly Stik are reliable.', searchUrl: 'https://www.amazon.com/s?k=fishing+rod+reel+combo+gift' },
          { name: 'Folding Camp Chair (Heavy Duty)', price: '$40–$80', why: 'Sturdy, comfortable, and easy to carry. Perfect for fishing, sports games, or the backyard.', searchUrl: 'https://www.amazon.com/s?k=folding+camp+chair+heavy+duty' },
          { name: 'Binoculars', price: '$40–$120', why: 'Great for bird watching, sports, or any outdoor adventure. Nikon makes excellent mid-range options.', searchUrl: 'https://www.amazon.com/s?k=binoculars+bird+watching+gift' },
        ],
      },
      {
        heading: 'Tech & Practical',
        items: [
          { name: 'Large-Display Tablet', price: '$150–$300', why: 'Bigger screen means easier reading, video calls with the family, and no squinting.', searchUrl: 'https://www.amazon.com/s?k=large+display+tablet+seniors' },
          { name: 'Hearing Amplifier', price: '$30–$80', why: 'Not a hearing aid — a personal sound amplifier. He might actually use it if it\'s not called a hearing aid.', searchUrl: 'https://www.amazon.com/s?k=personal+sound+amplifier' },
          { name: 'Instant-Read Thermometer', price: '$25–$50', why: 'If he grills or cooks, this is the upgrade he\'s been skipping for years.', searchUrl: 'https://www.amazon.com/s?k=instant+read+meat+thermometer' },
        ],
      },
      {
        heading: 'Sentimental',
        items: [
          { name: 'Custom Engraved Watch', price: '$60–$200', why: 'A classic watch with a personal message on the back. He\'ll wear it every day.', searchUrl: 'https://www.amazon.com/s?k=engraved+watch+men+personalized' },
          { name: 'Personalized Wallet', price: '$30–$80', why: 'Monogrammed leather wallet. Practical and personal.', searchUrl: 'https://www.etsy.com/search?q=personalized+leather+wallet+grandpa' },
          { name: 'Family Photo Canvas Print', price: '$30–$80', why: 'A large canvas with a favorite family photo. Goes straight to the living room wall.', searchUrl: 'https://www.amazon.com/s?k=family+photo+canvas+print' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for grandpa on Father\'s Day?', a: 'Focus on his hobbies: fishing gear, golf accessories, a quality pocket knife, or grilling tools. If he\'s hard to shop for, a personalized item (engraved watch, custom photo canvas) or a family experience (dinner out, game tickets) always land well.' },
      { q: 'What do grandfathers actually want?', a: 'Most grandfathers want to feel useful, appreciated, and connected to family. Practical gifts tied to hobbies plus something sentimental is the winning combination.' },
      { q: 'What is a thoughtful gift for grandpa under $50?', a: 'Under $50: an instant-read thermometer, a good pocket knife, a personalized mug, quality fishing lures, or a folding card table for game nights.' },
    ],
  },
  sister: {
    title: 'Best Gifts for Sister in 2026',
    description: 'Fun, thoughtful gift ideas for your sister — for birthdays, Christmas, and just because. From beauty to experiences.',
    intro: "Your sister will know immediately if you phoned it in. Luckily, with a little attention to her personality, you can get it very right. These picks work across age ranges and interests.",
    categories: [
      {
        heading: 'Beauty & Self-Care',
        items: [
          { name: 'Skincare Gift Set', price: '$40–$100', why: 'Tatcha, Drunk Elephant, or CeraVe sets. Match the set to her skin type.', searchUrl: 'https://www.amazon.com/s?k=skincare+gift+set+women' },
          { name: 'Hair Styling Tool', price: '$60–$200', why: 'Dyson Airwrap or a quality curling wand. The gift she\'d never buy herself.', searchUrl: 'https://www.amazon.com/s?k=hair+styling+tool+women+gift' },
          { name: 'Perfume Gift Set', price: '$50–$150', why: 'A fragrance she doesn\'t already own. Jo Malone and Maison Margiela Replica are safe bets.', searchUrl: 'https://www.amazon.com/s?k=womens+perfume+gift+set' },
          { name: 'Gua Sha + Facial Oil Set', price: '$25–$60', why: 'Trendy, spa-like, and actually useful in a daily skincare routine.', searchUrl: 'https://www.amazon.com/s?k=gua+sha+facial+oil+set' },
        ],
      },
      {
        heading: 'Fashion & Accessories',
        items: [
          { name: 'Silk Scarf', price: '$30–$80', why: 'Versatile, elegant, and something she might not splurge on herself.', searchUrl: 'https://www.amazon.com/s?k=silk+scarf+women+gift' },
          { name: 'Dainty Gold Jewelry', price: '$40–$120', why: 'A simple chain necklace or huggie earrings she can wear every day.', searchUrl: 'https://www.amazon.com/s?k=dainty+gold+jewelry+women' },
          { name: 'Tote Bag (Canvas or Leather)', price: '$40–$120', why: 'Practical for every day. Cuyana and Madewell make great quality totes.', searchUrl: 'https://www.amazon.com/s?k=canvas+tote+bag+women+quality' },
        ],
      },
      {
        heading: 'Experiences & Fun',
        items: [
          { name: 'Cooking or Pottery Class for Two', price: '$60–$150', why: 'Do it together. The experience beats any object.', searchUrl: 'https://www.airbnb.com/experiences' },
          { name: 'Subscription Box (Curated)', price: '$30–$80/mo', why: 'FabFitFun, Ipsy, or a book subscription. The gift that arrives monthly.', searchUrl: 'https://www.amazon.com/s?k=subscription+box+women+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good birthday gift for a sister?', a: 'The best sister gifts show you know her actual interests — not a generic "sister" gift. A beauty product she\'s been eyeing, a book in her favorite genre, or a shared experience will always beat a generic spa kit.' },
      { q: 'What are funny gifts for a sister?', a: 'Custom mugs with an inside joke, a "World\'s Most Annoying Sister" trophy, a novelty book that matches her personality, or a gift basket themed around her current obsession (true crime, reality TV, etc.).' },
      { q: 'What is a thoughtful gift for an older sister?', a: 'Think about her current life stage — if she\'s a new mom, practical self-care items are gold. If she\'s career-focused, a quality work bag or productivity tool. Shared experience gifts (lunch date, spa day, wine night) always work for older sisters.' },
    ],
  },
  brother: {
    title: 'Best Gifts for Brother in 2026',
    description: 'Cool and practical gift ideas for your brother — for birthdays, Christmas, and any occasion. From tech to outdoor gear.',
    intro: "Brothers are notoriously hard to shop for — they either have it or they'd buy it themselves. The key: go practical, go specific to his hobbies, or go for an experience he'd never plan himself.",
    categories: [
      {
        heading: 'Tech & Gaming',
        items: [
          { name: 'Gaming Controller (Extra)', price: '$50–$80', why: 'Every gamer needs a backup. Check his console (PS5, Xbox, Switch) before buying.', searchUrl: 'https://www.amazon.com/s?k=gaming+controller+gift' },
          { name: 'Mechanical Keyboard', price: '$80–$200', why: 'The upgrade gamers and programmers obsess over. Satisfying to type on.', searchUrl: 'https://www.amazon.com/s?k=mechanical+keyboard+gaming' },
          { name: 'Portable Bluetooth Speaker', price: '$50–$150', why: 'JBL or Bose. For his room, the gym, camping — he\'ll use it everywhere.', searchUrl: 'https://www.amazon.com/s?k=portable+bluetooth+speaker+jbl' },
          { name: 'Smart Watch', price: '$150–$350', why: 'Apple Watch or Galaxy Watch. Fitness + notifications in one device he\'ll actually wear.', searchUrl: 'https://www.amazon.com/s?k=smartwatch+men' },
        ],
      },
      {
        heading: 'Sports & Outdoors',
        items: [
          { name: 'Hydro Flask Water Bottle', price: '$30–$50', why: 'Keeps drinks cold for 24 hours. Virtually indestructible. He\'ll use it forever.', searchUrl: 'https://www.amazon.com/s?k=hydro+flask+water+bottle' },
          { name: 'Resistance Band Set', price: '$20–$50', why: 'Home gym essential. Compact and covers a full workout range.', searchUrl: 'https://www.amazon.com/s?k=resistance+band+set+men' },
          { name: 'Multi-Tool (Leatherman)', price: '$40–$100', why: 'He\'ll use it constantly and wonder how he managed without one.', searchUrl: 'https://www.amazon.com/s?k=leatherman+multi+tool' },
        ],
      },
      {
        heading: 'Food & Drink',
        items: [
          { name: 'Hot Sauce Gift Set', price: '$25–$50', why: 'A curated box of artisan hot sauces. Perfect for the heat lover.', searchUrl: 'https://www.amazon.com/s?k=hot+sauce+gift+set' },
          { name: 'Craft Beer Sampler', price: '$30–$60', why: 'A mix of styles from a quality local or national brewery. Beats a single six-pack every time.', searchUrl: 'https://www.amazon.com/s?k=craft+beer+sampler+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good birthday gift for a brother?', a: 'Match the gift to his hobby: a gamer needs gear, a gym rat needs equipment, a foodie needs an experience. Generic brother gifts underperform — specificity wins every time.' },
      { q: 'What is a good cheap gift for a brother?', a: 'Under $30: a pocket multi-tool, a Spotify gift card, a hot sauce set, a good phone case, or a book on a topic he\'s into. Add a handwritten note and it\'ll land better than an expensive impersonal gift.' },
      { q: 'What do brothers actually want as gifts?', a: 'Brothers want things tied to what they actually do. Figure out his current obsession — a game, a sport, a hobby — and buy something that makes that better. Practical beats sentimental for most brothers.' },
    ],
  },
  'best-friend': {
    title: 'Best Gifts for Your Best Friend in 2026',
    description: 'Thoughtful, funny, and personal gift ideas for your best friend — for birthdays, holidays, and just because.',
    intro: "Your best friend deserves more than an Amazon gift card and a shrug. You know them better than anyone — use that intel. These picks give you a head start.",
    categories: [
      {
        heading: 'Personalized & Sentimental',
        items: [
          { name: 'Custom Photo Book', price: '$25–$60', why: 'Your friendship in photos, beautifully printed. They will cry. So will you.', searchUrl: 'https://www.shutterfly.com' },
          { name: 'Personalized Map Print', price: '$30–$80', why: 'The city where you met, where you both live, or a place you traveled together.', searchUrl: 'https://www.etsy.com/search?q=personalized+city+map+print' },
          { name: 'Custom Friendship Bracelet Set', price: '$20–$60', why: 'Matching or complementary. A classic for a reason.', searchUrl: 'https://www.etsy.com/search?q=custom+friendship+bracelet+set' },
        ],
      },
      {
        heading: 'Shared Experiences',
        items: [
          { name: 'Concert or Show Tickets', price: '$50–$200', why: 'Book tickets to something you both love. The gift that becomes a memory.', searchUrl: 'https://www.ticketmaster.com' },
          { name: 'Cooking Class for Two', price: '$60–$150', why: 'Make something together. Italian, sushi, cocktails — pick your shared obsession.', searchUrl: 'https://www.airbnb.com/experiences' },
          { name: 'Escape Room Experience', price: '$25–$50', why: 'A challenge you tackle together. Great for competitive friend groups.', searchUrl: 'https://www.amazon.com/s?k=escape+room+gift+card' },
        ],
      },
      {
        heading: 'Fun & Personality Gifts',
        items: [
          { name: 'Custom Illustrated Portrait', price: '$30–$100', why: 'A cartoon or watercolor portrait of the two of you. Etsy artists do these beautifully.', searchUrl: 'https://www.etsy.com/search?q=custom+friend+portrait+illustration' },
          { name: 'Book They\'ve Been Meaning to Read', price: '$15–$30', why: 'That book they keep mentioning but never buy. Pair with a bookmark and a note.', searchUrl: 'https://www.amazon.com/s?k=bestselling+books+2026' },
          { name: 'Matching Pajama Set', price: '$30–$70', why: 'For sleepovers, movie marathons, or just because. Surprisingly hilarious and heartwarming.', searchUrl: 'https://www.amazon.com/s?k=matching+pajama+set+friends' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good birthday gift for a best friend?', a: 'The best birthday gifts for a best friend reference your shared history — an inside joke, a place you both love, or something they\'ve been wanting but wouldn\'t buy themselves. An experience you do together always beats any object.' },
      { q: 'What are funny gifts for a best friend?', a: 'Custom caricatures, novelty mugs with inside jokes, a "This Is Us" photo book, or a gag gift wrapped around something genuinely nice. The funnier and more personal, the better.' },
      { q: 'What are good cheap gifts for a best friend?', a: 'Under $25: their favorite snack box assembled by hand, a heartfelt handwritten letter, a book you love with annotations, or a small personalized item from Etsy. Thoughtfulness scales with budget — don\'t overthink it.' },
    ],
  },
  teacher: {
    title: 'Best Gifts for Teacher in 2026',
    description: 'Thoughtful gifts for teachers that go beyond the apple — from classroom supplies to self-care treats they\'ll actually use.',
    intro: "Teachers get a lot of mugs, candles, and 'World's Best Teacher' plaques. These picks are a little different — actually useful, genuinely appreciated, and not yet another mug.",
    categories: [
      {
        heading: 'Classroom & Office',
        items: [
          { name: 'Amazon Gift Card', price: '$25–$100', why: 'Teachers spend their own money on classroom supplies constantly. An Amazon gift card goes directly to that.', searchUrl: 'https://www.amazon.com/s?k=amazon+gift+card' },
          { name: 'Wireless Presenter Clicker', price: '$25–$50', why: 'For teachers who do slide-based lessons. A surprisingly useful upgrade they\'d never buy themselves.', searchUrl: 'https://www.amazon.com/s?k=wireless+presenter+clicker+teacher' },
          { name: 'Quality Mechanical Pencils Set', price: '$15–$30', why: 'Pentel or Staedtler. Teachers go through pencils fast — a nice set feels like a real treat.', searchUrl: 'https://www.amazon.com/s?k=mechanical+pencil+set+quality' },
          { name: 'Personalized Tote Bag', price: '$25–$60', why: 'Teachers carry everything. A quality tote with their name or a fun design gets used daily.', searchUrl: 'https://www.etsy.com/search?q=personalized+teacher+tote+bag' },
        ],
      },
      {
        heading: 'Self-Care & Relaxation',
        items: [
          { name: 'Spa Gift Set', price: '$30–$80', why: 'Teaching is exhausting. A quality bath and body set says "you deserve a break."', searchUrl: 'https://www.amazon.com/s?k=spa+gift+set+relaxation' },
          { name: 'Specialty Tea or Coffee Box', price: '$20–$50', why: 'A curated box of teas or coffees. Consumed, enjoyed, and never takes up shelf space.', searchUrl: 'https://www.amazon.com/s?k=specialty+tea+gift+set' },
          { name: 'Restaurant Gift Card', price: '$25–$50', why: 'After a long week, there\'s no better gift than not having to cook.', searchUrl: 'https://www.amazon.com/s?k=restaurant+gift+card' },
        ],
      },
      {
        heading: 'Personal & Fun',
        items: [
          { name: 'Book by Their Favorite Author', price: '$15–$30', why: 'If you know their taste, this is the most personal gift possible. Add a handwritten note.', searchUrl: 'https://www.amazon.com/s?k=bestselling+books+2026' },
          { name: 'Personalized Stationery Set', price: '$20–$50', why: 'Custom notepad or card set with their name. Feels elevated, used constantly.', searchUrl: 'https://www.etsy.com/search?q=personalized+stationery+teacher+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What are good end-of-year gifts for a teacher?', a: 'End-of-year teacher gifts that really land: an Amazon gift card (they\'ll spend it on classroom supplies), a handwritten note from the student, a spa gift set, or a donation to their classroom wishlist on DonorsChoose.org. The note matters most.' },
      { q: 'What should you NOT give a teacher as a gift?', a: 'Avoid another coffee mug, a generic "World\'s Best Teacher" item, cheap chocolates, or anything breakable and decorative. Teachers have limited space and get many of these already. Consumables and gift cards are always better.' },
      { q: 'What is a thoughtful teacher gift under $20?', a: 'Under $20: a quality notebook and pen set, a Starbucks or local coffee gift card, a small succulent plant, a personalized bookmark, or a handwritten card with a specific memory from the year. The specific memory in the note is priceless.' },
    ],
  },
  boss: {
    title: 'Best Gifts for Your Boss in 2026',
    description: 'Professional and thoughtful gift ideas for your boss — for the holidays, appreciation, or a farewell. Appropriate, useful, and memorable.',
    intro: "Gifting a boss is a delicate art. Too cheap and it seems careless; too expensive and it's awkward. These picks hit the right note — professional, thoughtful, and genuinely useful.",
    categories: [
      {
        heading: 'Desk & Office',
        items: [
          { name: 'Premium Notebook + Pen Set', price: '$30–$60', why: 'A Leuchtturm1917 or Moleskine with a quality pen. Elevated but never presumptuous.', searchUrl: 'https://www.amazon.com/s?k=premium+notebook+pen+set+executive' },
          { name: 'Wireless Charging Pad (Luxury)', price: '$40–$80', why: 'Native Union or Courant make beautiful leather charging pads that look great on any executive desk.', searchUrl: 'https://www.amazon.com/s?k=luxury+wireless+charging+pad+leather' },
          { name: 'Cable Management Kit', price: '$20–$40', why: 'Clean desk energy. Premium leather or metal cable organizers are practical and look sharp.', searchUrl: 'https://www.amazon.com/s?k=cable+management+kit+leather+desk' },
        ],
      },
      {
        heading: 'Food & Drink',
        items: [
          { name: 'Premium Coffee Sampler', price: '$40–$80', why: 'A curated box of specialty coffees or a premium single-origin bag. Great for the coffee-loving boss.', searchUrl: 'https://www.amazon.com/s?k=premium+coffee+gift+set+executive' },
          { name: 'Wine or Whiskey Gift Set', price: '$50–$150', why: 'A bottle of quality wine or a whiskey sampler set. Classic, appropriate, always appreciated.', searchUrl: 'https://www.amazon.com/s?k=whiskey+gift+set+premium' },
          { name: 'Gourmet Snack or Charcuterie Box', price: '$40–$80', why: 'Shareable and thoughtful. Great for the boss who appreciates quality food.', searchUrl: 'https://www.amazon.com/s?k=gourmet+charcuterie+gift+box' },
        ],
      },
      {
        heading: 'Experiences & Practical',
        items: [
          { name: 'Spa Gift Certificate', price: '$80–$200', why: 'Leadership is stressful. A spa voucher says "take care of yourself" without overstepping.', searchUrl: 'https://www.spafinder.com' },
          { name: 'Audible Subscription Gift', price: '$15–$45', why: 'Perfect for the busy boss who commutes or travels. 1–3 months of unlimited audiobooks.', searchUrl: 'https://www.amazon.com/s?k=audible+gift+subscription' },
        ],
      },
    ],
    faqs: [
      { q: 'Is it appropriate to give your boss a gift?', a: 'Yes, within reason. The general rule: keep it professional, keep it under $75, and never give anything too personal (clothing, perfume, intimate items). Food gifts, desk accessories, and experience vouchers are always appropriate. Group gifts from the team are even better.' },
      { q: 'What is a good group gift for a boss?', a: 'Pool the team\'s budget for something more meaningful: a premium restaurant gift card, a spa package, a nice bottle of wine or spirits, a quality leather portfolio, or a donation to a cause your boss supports. The group card with personal notes matters as much as the gift.' },
      { q: 'What to get a boss who is leaving?', a: 'A farewell gift should be personal and memorable: a framed team photo, a book meaningful to their career journey, or a quality keepsake they\'ll use (engraved pen, leather portfolio). Pair with a signed card from the entire team.' },
    ],
  },
  newborn: {
    title: 'Best Gifts for a Newborn Baby in 2026',
    description: 'Practical and adorable newborn gift ideas for new parents — from essentials they\'ll use immediately to keepsakes they\'ll treasure forever.',
    intro: "New parents have a lot going on. The best newborn gifts are either immediately practical (so they don't have to shop) or beautifully sentimental (so they save them forever). Skip the third onesie.",
    categories: [
      {
        heading: 'Practical Essentials',
        items: [
          { name: 'White Noise Machine', price: '$30–$60', why: 'The single most recommended baby sleep tool by parents everywhere. Hatch Baby Rest is the gold standard.', searchUrl: 'https://www.amazon.com/s?k=white+noise+machine+baby' },
          { name: 'Baby Swaddle Blanket Set', price: '$25–$50', why: 'Aden + Anais muslin swaddles. Breathable, stretchy, used from day one.', searchUrl: 'https://www.amazon.com/s?k=aden+anais+swaddle+blanket+set' },
          { name: 'Baby Nail File & Safety Set', price: '$15–$30', why: 'New parents are terrified of trimming tiny nails. A quality baby grooming kit removes the anxiety.', searchUrl: 'https://www.amazon.com/s?k=baby+nail+file+safety+grooming+kit' },
          { name: 'Diaper Bag Backpack', price: '$50–$120', why: 'A stylish, functional diaper bag that looks like a regular backpack. Parents will use it for years.', searchUrl: 'https://www.amazon.com/s?k=diaper+bag+backpack+modern' },
        ],
      },
      {
        heading: 'Sleep & Comfort',
        items: [
          { name: 'Organic Cotton Baby Bodysuit Set', price: '$25–$50', why: 'Burt\'s Bees or Honest Company. Soft, chemical-free, and they go through these constantly.', searchUrl: 'https://www.amazon.com/s?k=organic+cotton+baby+bodysuit+set' },
          { name: 'Baby Monitor (Video)', price: '$80–$200', why: 'If the parents don\'t have one yet, this is the most used baby gadget of all time.', searchUrl: 'https://www.amazon.com/s?k=video+baby+monitor' },
          { name: 'Portable Baby Soother', price: '$30–$60', why: 'A clip-on soother that plays lullabies and shows nightlights. Invaluable for car rides and travel.', searchUrl: 'https://www.amazon.com/s?k=portable+baby+soother+clip+on' },
        ],
      },
      {
        heading: 'Keepsakes & Memories',
        items: [
          { name: 'Baby Handprint & Footprint Kit', price: '$20–$40', why: 'A ceramic or ink kit that captures tiny prints forever. One of the most-treasured baby gifts.', searchUrl: 'https://www.amazon.com/s?k=baby+handprint+footprint+kit' },
          { name: 'Personalized Baby Blanket', price: '$30–$70', why: 'Custom embroidered with baby\'s name and birth date. A keepsake they\'ll save.', searchUrl: 'https://www.etsy.com/search?q=personalized+baby+blanket+name' },
          { name: 'Baby Memory Book', price: '$20–$45', why: 'A beautifully designed book for capturing first-year milestones. Parents love filling these in.', searchUrl: 'https://www.amazon.com/s?k=baby+memory+book+first+year' },
        ],
      },
    ],
    faqs: [
      { q: 'What is the most useful newborn gift?', a: 'The most practically useful newborn gifts are a white noise machine, swaddle blankets, and a video baby monitor. These get used every single day from week one. If you want to give something immediately useful at a baby shower, these are it.' },
      { q: 'What should you NOT give a newborn as a gift?', a: 'Avoid: clothing that\'s too small (newborns outgrow it in weeks), cheap stuffed animals that shed, bath toys (they won\'t be used for months), or anything with small parts. Also skip scented lotions and soaps — newborn skin is sensitive.' },
      { q: 'What is a good budget-friendly newborn gift?', a: 'Under $30: a set of organic cotton onesies, a handprint kit, a simple white noise machine, or a personalized baby blanket from Etsy. A meal delivery gift card to Doordash or Instacart might be the most appreciated of all — new parents can\'t cook.' },
    ],
  },
  toddler: {
    title: 'Best Gifts for Toddlers (Ages 1–3) in 2026',
    description: 'The best toddler gifts that actually get played with — from sensory toys to imaginative play sets. Tested and parent-approved.',
    intro: "Toddlers are hard to shop for only if you forget the rules: durable, safe, open-ended, and slightly messy. These picks survive both the toddler and the parents' sanity check.",
    categories: [
      {
        heading: 'Sensory & Active Play',
        items: [
          { name: 'Kinetic Sand Set', price: '$20–$40', why: 'Wildly satisfying, surprisingly mess-contained. Hours of focused sensory play.', searchUrl: 'https://www.amazon.com/s?k=kinetic+sand+toddler' },
          { name: 'Water Table', price: '$40–$80', why: 'Outdoor summer essential. Keeps toddlers happily occupied for stretches that feel like magic.', searchUrl: 'https://www.amazon.com/s?k=water+table+toddler' },
          { name: 'Balance Bike', price: '$50–$100', why: 'The training-wheel-free way to learn balance. Most toddlers are riding pedal bikes within weeks of mastering these.', searchUrl: 'https://www.amazon.com/s?k=balance+bike+toddler' },
          { name: 'Play Tunnel', price: '$25–$50', why: 'Crawl through, hide in, drag it around the house. Simple, beloved, collapses flat for storage.', searchUrl: 'https://www.amazon.com/s?k=play+tunnel+toddler' },
        ],
      },
      {
        heading: 'Learning & Creative Play',
        items: [
          { name: 'LEGO DUPLO Classic Set', price: '$25–$60', why: 'The OG building toy, toddler-sized. Develops fine motor skills while keeping them quietly focused.', searchUrl: 'https://www.amazon.com/s?k=lego+duplo+classic+set' },
          { name: 'Melissa & Doug Wooden Puzzles', price: '$15–$30', why: 'Chunky, colorful, durable. Perfect starter puzzles for ages 1–3.', searchUrl: 'https://www.amazon.com/s?k=melissa+doug+wooden+puzzle+toddler' },
          { name: 'Crayola Washable Finger Paints', price: '$10–$20', why: 'Washable is the key word. Mess-friendly creative play that\'s actually forgiving.', searchUrl: 'https://www.amazon.com/s?k=crayola+washable+finger+paints' },
        ],
      },
      {
        heading: 'Imaginative Play',
        items: [
          { name: 'Play Kitchen Set', price: '$60–$150', why: 'One of the highest-play-value toddler gifts of all time. Gets used for years.', searchUrl: 'https://www.amazon.com/s?k=play+kitchen+set+toddler' },
          { name: 'Dress-Up Costume Box', price: '$30–$60', why: 'A collection of capes, crowns, and costumes. Imagination at its most joyful.', searchUrl: 'https://www.amazon.com/s?k=toddler+dress+up+costume+set' },
        ],
      },
    ],
    faqs: [
      { q: 'What are the best toys for a 1-year-old?', a: 'For 1-year-olds: soft stacking blocks, shape-sorters, push-along walkers, board books, and simple musical instruments. Focus on sensory exploration and cause-and-effect toys — anything that responds to their actions.' },
      { q: 'What are the best toys for a 2-year-old?', a: 'At 2: LEGO DUPLO, simple puzzles, play kitchen sets, finger paints, balance bikes, and play tunnels. The magic age for imaginative play begins here — anything that sparks pretend play will get used constantly.' },
      { q: 'What toddler gifts do parents actually appreciate?', a: 'Parents appreciate gifts that keep toddlers engaged and are easy to clean up. Kinetic sand, water tables, and DUPLO are parent-approved. Noisy battery-powered toys with no off switch are not. Check with the parent first if you\'re unsure.' },
    ],
  },
  '5-year-old': {
    title: 'Best Gifts for 5-Year-Olds in 2026',
    description: 'The best toys and gifts for 5-year-olds — creative, educational, and actually fun. Parent and kid approved.',
    intro: "Five-year-olds are in the golden age of play: imaginative, curious, and capable of more complex games. These picks match that energy.",
    categories: [
      {
        heading: 'Creative & Building',
        items: [
          { name: 'LEGO Classic Large Set', price: '$40–$80', why: 'Open-ended building with hundreds of bricks. The classic for a reason.', searchUrl: 'https://www.amazon.com/s?k=lego+classic+large+brick+set' },
          { name: 'Playdoh Mega Set', price: '$20–$40', why: 'Endless sculpting fun. More colors = more play time.', searchUrl: 'https://www.amazon.com/s?k=playdoh+mega+set' },
          { name: 'Art Supply Kit', price: '$20–$40', why: 'Crayons, watercolors, stickers, and construction paper in one box. Rainy day gold.', searchUrl: 'https://www.amazon.com/s?k=kids+art+supply+kit+5+year+old' },
          { name: 'Magnetic Tiles (Magna-Tiles)', price: '$50–$100', why: 'The toy that 5-year-olds (and their parents) can\'t put down. Builds spatial reasoning.', searchUrl: 'https://www.amazon.com/s?k=magna+tiles+magnetic+tiles' },
        ],
      },
      {
        heading: 'Active & Outdoor',
        items: [
          { name: 'Stomp Rocket', price: '$25–$40', why: 'Stamp, launch, chase, repeat. Gets them outside and burns energy the fun way.', searchUrl: 'https://www.amazon.com/s?k=stomp+rocket+kids' },
          { name: 'Scooter (Two-Wheel)', price: '$50–$100', why: 'Micro Kickboard or Razor. The outdoor toy that gets daily use.', searchUrl: 'https://www.amazon.com/s?k=kids+scooter+2+wheel+5+year+old' },
          { name: 'Jump Rope', price: '$10–$20', why: 'Simple, timeless, and a genuine playground skill. Gets more fun as they improve.', searchUrl: 'https://www.amazon.com/s?k=jump+rope+kids' },
        ],
      },
      {
        heading: 'Games & Learning',
        items: [
          { name: 'Sequence for Kids', price: '$15–$25', why: 'A card and board game that 5-year-olds can actually win. Great for family game nights.', searchUrl: 'https://www.amazon.com/s?k=sequence+for+kids+board+game' },
          { name: 'LeapFrog Learning Toy', price: '$20–$50', why: 'Phonics, numbers, spelling — dressed up as a toy. Parents love these for screen-free learning.', searchUrl: 'https://www.amazon.com/s?k=leapfrog+learning+toy' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for a 5-year-old boy?', a: 'Top picks for 5-year-old boys: LEGO sets, Stomp Rockets, magnetic tiles, Hot Wheels tracks, a scooter, or a beginner sports set (T-ball, soccer). Active toys and building toys dominate this age group.' },
      { q: 'What is a good gift for a 5-year-old girl?', a: 'Top picks for 5-year-old girls: craft kits, magnetic tiles, a doll house, Playdoh sets, art supplies, or a beginner baking set. Creative and imaginative play are dominant at this age — lean into whatever her current interests are.' },
      { q: 'What are educational gifts for a 5-year-old?', a: 'The best educational gifts don\'t feel educational: LEGO (spatial reasoning), magnetic tiles (geometry), Osmo Genius Starter Kit (reading and math through games), and science experiment kits designed for ages 4–6.' },
    ],
  },
  '10-year-old': {
    title: 'Best Gifts for 10-Year-Olds in 2026',
    description: 'The best gifts for 10-year-olds — from STEM kits to gaming gear. Fun, age-appropriate, and actually wanted.',
    intro: "Ten is the transitional age: too old for little-kid toys, not quite ready for teen stuff. These picks hit the sweet spot — interesting, challenging, and cool.",
    categories: [
      {
        heading: 'Tech & Gaming',
        items: [
          { name: 'Nintendo Switch Lite', price: '$180–$220', why: 'The portable console 10-year-olds obsess over. Huge game library.', searchUrl: 'https://www.amazon.com/s?k=nintendo+switch+lite' },
          { name: 'Kids Coding Kit (Kano)', price: '$50–$100', why: 'Build a computer or coding device from scratch. Genuinely engaging for curious 10-year-olds.', searchUrl: 'https://www.amazon.com/s?k=kano+coding+kit' },
          { name: 'Polaroid Snap Camera', price: '$60–$100', why: 'Instant photos at this age are magic. They\'ll decorate their room with prints.', searchUrl: 'https://www.amazon.com/s?k=polaroid+snap+camera+kids' },
        ],
      },
      {
        heading: 'Creative & STEM',
        items: [
          { name: 'Snap Circuits Kit', price: '$30–$80', why: 'Build real working circuits with snap-together pieces. Kids get hooked on making things work.', searchUrl: 'https://www.amazon.com/s?k=snap+circuits+kit' },
          { name: 'LEGO Technic Set', price: '$40–$120', why: 'Gears, axles, motors. For the 10-year-old ready to graduate from classic LEGO.', searchUrl: 'https://www.amazon.com/s?k=lego+technic+set+10+year+old' },
          { name: 'Science Experiment Kit', price: '$25–$50', why: 'Volcano kits, crystal growing, slime labs. Real experiments, real results, real mess.', searchUrl: 'https://www.amazon.com/s?k=science+experiment+kit+10+year+old' },
          { name: 'Art Set (Professional-Style)', price: '$25–$50', why: 'Colored pencils, sketch pads, watercolors — for the creative kid who\'s ready for real tools.', searchUrl: 'https://www.amazon.com/s?k=art+set+kids+professional' },
        ],
      },
      {
        heading: 'Sports & Active',
        items: [
          { name: 'Beginner Skateboard', price: '$40–$80', why: 'If any of their friends skate, they want one. Complete decks from Powell or Cal 7 are great starter options.', searchUrl: 'https://www.amazon.com/s?k=beginner+skateboard+kids' },
          { name: 'Basketball (Personalized)', price: '$20–$50', why: 'A quality ball with their name printed on it. Instantly their favorite possession.', searchUrl: 'https://www.amazon.com/s?k=personalized+basketball+kids' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good birthday gift for a 10-year-old boy?', a: 'Top picks for 10-year-old boys: Nintendo Switch games, LEGO Technic, Snap Circuits, a skateboard, a beginner drone, or sports equipment for their current sport. Tech and building toys are the sweet spot at this age.' },
      { q: 'What is a good birthday gift for a 10-year-old girl?', a: 'Top picks for 10-year-old girls: a DIY jewelry kit, a Polaroid camera, a professional art set, a friendship bracelet loom, or a book series they\'re into. Creative and social gifts dominate at this age.' },
      { q: 'What are good educational gifts for a 10-year-old?', a: 'Snap Circuits, Kano coding kits, LEGO Mindstorms, science experiment sets, or a subscription to Tynker (online coding for kids). The best educational gifts feel like toys first.' },
    ],
  },
  'teenager-girl': {
    title: 'Best Gifts for Teenage Girls in 2026',
    description: 'Actually-cool gift ideas for teenage girls — beauty, tech, fashion, and experiences she\'ll genuinely want.',
    intro: "Gifting a teenage girl is all about relevance. What she wants is constantly evolving, but a few categories are reliably safe. These picks are current, thoughtful, and won't end up in a drawer.",
    categories: [
      {
        heading: 'Beauty & Self-Care',
        items: [
          { name: 'Skincare Starter Set', price: '$30–$80', why: 'Teen skincare is huge right now. CeraVe, The Ordinary, or a curated clean beauty set.', searchUrl: 'https://www.amazon.com/s?k=teen+skincare+gift+set' },
          { name: 'Makeup Brush Set', price: '$20–$50', why: 'A quality set of brushes beats a pile of cheap ones. She\'ll notice the difference.', searchUrl: 'https://www.amazon.com/s?k=makeup+brush+set+teen+gift' },
          { name: 'Hair Accessories Set', price: '$20–$50', why: 'Claw clips, silk scrunchies, and headbands in a gift box. Currently very trendy.', searchUrl: 'https://www.amazon.com/s?k=hair+accessories+set+teen+girl' },
          { name: 'Nail Art Kit', price: '$20–$50', why: 'Gel polish, nail stickers, and art tools. A Saturday activity that doubles as a gift.', searchUrl: 'https://www.amazon.com/s?k=nail+art+kit+teen+girl' },
        ],
      },
      {
        heading: 'Tech & Content Creation',
        items: [
          { name: 'Ring Light + Phone Stand', price: '$25–$60', why: 'Every teen who takes photos, records videos, or does calls wants better lighting.', searchUrl: 'https://www.amazon.com/s?k=ring+light+phone+stand+teen' },
          { name: 'Wireless Earbuds', price: '$50–$200', why: 'AirPods or Galaxy Buds. The single most-requested teen tech gift.', searchUrl: 'https://www.amazon.com/s?k=wireless+earbuds+teen+girl' },
          { name: 'Polaroid or Instax Camera', price: '$60–$120', why: 'Prints memories instantly. Every teen eventually goes through a film photography phase.', searchUrl: 'https://www.amazon.com/s?k=fujifilm+instax+mini+camera' },
        ],
      },
      {
        heading: 'Style & Accessories',
        items: [
          { name: 'Dainty Gold Jewelry Set', price: '$30–$80', why: 'Minimalist layering necklaces and huggie earrings. Timeless and always on-trend.', searchUrl: 'https://www.amazon.com/s?k=dainty+gold+jewelry+set+teen' },
          { name: 'Custom Hoodie or Sweatshirt', price: '$40–$80', why: 'Personalized with her name, initials, or a design she loves. Etsy has endless options.', searchUrl: 'https://www.etsy.com/search?q=custom+hoodie+teen+girl' },
          { name: 'Gift Card to Her Favorite Store', price: '$25–$100', why: 'SHEIN, Aritzia, Urban Outfitters, or wherever she shops. Teens have very specific taste.', searchUrl: 'https://www.amazon.com/s?k=gift+card+teen+girl' },
        ],
      },
    ],
    faqs: [
      { q: 'What do teenage girls actually want as gifts?', a: 'In 2026, teen girls want: wireless earbuds, skincare products, ring lights for content creation, trendy clothing from their favorite brands, and experiences with friends (concert tickets, spa day, escape room). Ask what she\'s currently into — trends move fast.' },
      { q: 'What is a good birthday gift for a teenage girl?', a: 'A gift that matches her current obsession is always the winner. If she\'s into beauty: a full skincare set. If she\'s creative: a polaroid camera or art supplies. If she\'s social: concert tickets or a restaurant gift card with a friend.' },
      { q: 'What is a good cheap gift for a teenage girl?', a: 'Under $25: a silk scrunchie set, a nice journal and pens, a Spotify gift card, custom stickers for her phone or laptop, or a book in a genre she loves. Add a heartfelt note for maximum impact.' },
    ],
  },
  'teenager-boy': {
    title: 'Best Gifts for Teenage Boys in 2026',
    description: 'Cool and practical gift ideas for teenage boys — from gaming gear to style upgrades. Actually wanted, not just well-intentioned.',
    intro: "Teenage boys are specific about what they want. The good news: they'll tell you if you ask. The bad news: it's usually expensive. These picks cover the range from budget to splurge.",
    categories: [
      {
        heading: 'Gaming & Tech',
        items: [
          { name: 'Gaming Headset', price: '$50–$150', why: 'SteelSeries Arctis, HyperX Cloud, or Astro A40. If he games, this is the most-used gift you can give.', searchUrl: 'https://www.amazon.com/s?k=gaming+headset+teen+boy' },
          { name: 'Gaming Gift Card (PSN/Xbox/Steam)', price: '$25–$100', why: 'The safest gaming gift. He picks the game, you get the credit.', searchUrl: 'https://www.amazon.com/s?k=gaming+gift+card+psn+xbox+steam' },
          { name: 'Portable Bluetooth Speaker', price: '$50–$100', why: 'JBL Flip or Charge. For his room, outdoor hangouts, parties. Gets used everywhere.', searchUrl: 'https://www.amazon.com/s?k=jbl+bluetooth+speaker+teen' },
          { name: 'Wireless Earbuds', price: '$50–$200', why: 'AirPods or Samsung Galaxy Buds. The everyday tech item he\'s wanted forever.', searchUrl: 'https://www.amazon.com/s?k=wireless+earbuds+teen+boy' },
        ],
      },
      {
        heading: 'Sports & Active',
        items: [
          { name: 'Nike or Adidas Gift Card', price: '$30–$100', why: 'Shoes, gear, apparel — he knows exactly what he wants. Let him choose.', searchUrl: 'https://www.amazon.com/s?k=nike+gift+card' },
          { name: 'Resistance Band Set', price: '$20–$40', why: 'Home gym starter pack. Perfect for the teen who\'s discovered working out.', searchUrl: 'https://www.amazon.com/s?k=resistance+band+set+teen' },
          { name: 'Hydro Flask Water Bottle', price: '$30–$50', why: 'The water bottle of choice for this age group. He\'s probably already seen his friends with one.', searchUrl: 'https://www.amazon.com/s?k=hydro+flask+water+bottle' },
        ],
      },
      {
        heading: 'Style',
        items: [
          { name: 'Graphic Tee (Favorite Brand)', price: '$25–$50', why: 'Know his style? A tee from his favorite brand or artist is always a win.', searchUrl: 'https://www.amazon.com/s?k=graphic+tee+teen+boy' },
          { name: 'Minimal Sneakers', price: '$60–$130', why: 'Nike Air Force 1 or Adidas Stan Smith. The clean sneaker every teen cycles through eventually.', searchUrl: 'https://www.amazon.com/s?k=white+sneakers+teen+boy' },
        ],
      },
    ],
    faqs: [
      { q: 'What do teenage boys actually want as gifts?', a: 'In 2026: gaming gear (headsets, controllers, gift cards), wireless earbuds, athletic apparel, sneakers, and tech accessories. Ask him directly — teenage boys are usually honest about what they want and will genuinely appreciate being asked.' },
      { q: 'What is a good birthday gift for a teenage boy?', a: 'The winning formula: pick something tied to his specific hobby (gaming, sports, music) and go for quality over quantity. One good gaming headset beats a basket of small items.' },
      { q: 'What is a good cheap gift for a teenage boy?', a: 'Under $30: a gaming gift card, a Spotify subscription, his favorite snacks in a gift box, a phone stand for gaming, or a graphic tee from his favorite brand or game. The snack box with a note is more personal than it sounds.' },
    ],
  },
  'college-student': {
    title: 'Best Gifts for College Students in 2026',
    description: 'Practical and fun gift ideas for college students — dorm essentials, tech, and self-care picks they actually need.',
    intro: "College students need practical things, want fun things, and rarely buy either for themselves. This sweet spot makes them actually pretty easy to shop for — if you know where to look.",
    categories: [
      {
        heading: 'Dorm & Study Essentials',
        items: [
          { name: 'Desk Lamp with USB Charging', price: '$25–$60', why: 'Adjustable brightness + built-in USB port. The study essential every dorm room needs.', searchUrl: 'https://www.amazon.com/s?k=desk+lamp+usb+charging+dorm' },
          { name: 'Noise-Cancelling Headphones', price: '$80–$350', why: 'Sony or Bose. For studying in loud dorms, libraries, or coffee shops. Life-changing.', searchUrl: 'https://www.amazon.com/s?k=noise+cancelling+headphones+student' },
          { name: 'Laptop Stand + Cooling Pad', price: '$25–$50', why: 'Better ergonomics for long study sessions. Simple, inexpensive, and genuinely appreciated.', searchUrl: 'https://www.amazon.com/s?k=laptop+stand+cooling+pad' },
          { name: 'Mini Fridge', price: '$80–$150', why: 'If their dorm doesn\'t have one, this is the most practical gift of all time for a college student.', searchUrl: 'https://www.amazon.com/s?k=mini+fridge+dorm+room' },
        ],
      },
      {
        heading: 'Food & Convenience',
        items: [
          { name: 'Instant Ramen Gift Box', price: '$20–$40', why: 'A curated box of premium ramen varieties. Ironic and genuinely useful — they will eat it all.', searchUrl: 'https://www.amazon.com/s?k=instant+ramen+gift+box+variety' },
          { name: 'DoorDash / Uber Eats Gift Card', price: '$25–$100', why: 'The gift that keeps a hungry college student fed. Universally loved.', searchUrl: 'https://www.amazon.com/s?k=doordash+gift+card' },
          { name: 'Single-Serve Coffee Maker', price: '$30–$70', why: 'A Keurig Mini or AeroPress. Because campus coffee is expensive and the dining hall closes at 8pm.', searchUrl: 'https://www.amazon.com/s?k=single+serve+coffee+maker+dorm' },
        ],
      },
      {
        heading: 'Self-Care & Wellness',
        items: [
          { name: 'Portable Bluetooth Speaker', price: '$40–$80', why: 'For the dorm room, gym, or pre-game. JBL is the go-to for this age group.', searchUrl: 'https://www.amazon.com/s?k=portable+bluetooth+speaker+college' },
          { name: 'Skincare Starter Kit', price: '$30–$60', why: 'A basic cleanser, moisturizer, and SPF. College is when skincare habits form.', searchUrl: 'https://www.amazon.com/s?k=skincare+starter+kit+young+adults' },
          { name: 'Planner or Bullet Journal', price: '$20–$40', why: 'College is when time management either clicks or collapses. A good planner helps.', searchUrl: 'https://www.amazon.com/s?k=planner+college+student+2026' },
        ],
      },
    ],
    faqs: [
      { q: 'What are practical gifts for a college student?', a: 'Practical college gifts: noise-cancelling headphones, a quality desk lamp, a mini fridge, a laptop stand, a food delivery gift card, or a planner. Anything that makes studying or dorm life easier will be genuinely appreciated.' },
      { q: 'What are fun gifts for a college student?', a: 'Fun college gifts: a portable speaker, a custom dorm poster, a college-themed care package, a game night kit (cards, dice), concert tickets, or a subscription to something they\'d love (Spotify, Netflix, Audible).' },
      { q: 'What is a good care package for a college student?', a: 'Build a care package around their needs: snacks they love, instant ramen, energy bars, a gift card to a campus coffee shop or delivery service, a cozy pair of socks, a motivational note, and maybe a favorite treat from home. The from-home element matters.' },
    ],
  },
  gamer: {
    title: 'Best Gifts for Gamers in 2026',
    description: 'The best gaming gifts in 2026 — headsets, accessories, and upgrades for every type of gamer and every budget.',
    intro: "Buying for a gamer is only hard if you don't know what platform they use. Find that out first, then these picks will help you nail it.",
    categories: [
      {
        heading: 'Audio & Communication',
        items: [
          { name: 'Gaming Headset', price: '$50–$200', why: 'SteelSeries Arctis Nova, HyperX Cloud III, or Astro A50. Immersive audio and clear comms for multiplayer.', searchUrl: 'https://www.amazon.com/s?k=gaming+headset+2026' },
          { name: 'Desktop Microphone', price: '$50–$150', why: 'Blue Yeti or HyperX QuadCast. For streamers, content creators, or anyone tired of headset mic quality.', searchUrl: 'https://www.amazon.com/s?k=gaming+desktop+microphone+usb' },
        ],
      },
      {
        heading: 'Peripherals & Setup',
        items: [
          { name: 'Mechanical Keyboard', price: '$80–$200', why: 'The satisfying clicky upgrade every serious gamer eventually makes. Keychron and Corsair are top brands.', searchUrl: 'https://www.amazon.com/s?k=mechanical+keyboard+gaming+2026' },
          { name: 'Gaming Mouse', price: '$40–$120', why: 'Logitech G502 or Razer DeathAdder. Better precision, programmable buttons, and much more comfortable for long sessions.', searchUrl: 'https://www.amazon.com/s?k=gaming+mouse+logitech+razer' },
          { name: 'RGB Desk Mat', price: '$25–$60', why: 'Large mousepad that covers the whole desk. Practical and looks great in any gaming setup.', searchUrl: 'https://www.amazon.com/s?k=rgb+desk+mat+gaming+mousepad' },
          { name: 'Monitor Light Bar', price: '$30–$60', why: 'Sits on top of the monitor and lights the desk without screen glare. BenQ ScreenBar is the gold standard.', searchUrl: 'https://www.amazon.com/s?k=monitor+light+bar+gaming' },
        ],
      },
      {
        heading: 'Games & Comfort',
        items: [
          { name: 'PSN / Xbox / Steam Gift Card', price: '$25–$100', why: 'Safe, flexible, and always used. They know what they want to play next.', searchUrl: 'https://www.amazon.com/s?k=gaming+gift+card+psn+xbox+steam' },
          { name: 'Gaming Chair', price: '$150–$400', why: 'A quality gaming chair transforms marathon sessions. Secret Lab and Razer are the top-rated brands.', searchUrl: 'https://www.amazon.com/s?k=gaming+chair+2026' },
          { name: 'Snack Box for Gamers', price: '$25–$50', why: 'A curated gaming snack box. Because no serious session ends before the snacks run out.', searchUrl: 'https://www.amazon.com/s?k=gamer+snack+box+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What should I get a gamer who has everything?', a: 'Focus on quality upgrades: a better headset than they have, a mechanical keyboard if they\'re still using a membrane one, a monitor light bar, or a high-quality gaming chair. If gear is covered, gift cards and gaming snack boxes are always appreciated.' },
      { q: 'What is a good gift for a PC gamer?', a: 'Top PC gamer gifts: a Steam gift card, a mechanical keyboard, a gaming mouse, a quality headset, or a monitor upgrade. For serious PC gamers, peripherals are always a safe bet — there\'s always something to upgrade.' },
      { q: 'What is a good gift for a console gamer?', a: 'For console gamers: the specific game they\'ve been waiting for, a PSN or Xbox gift card, an extra controller, a gaming headset that\'s compatible with their console, or a comfortable gaming chair.' },
    ],
  },
  foodie: {
    title: 'Best Gifts for Foodies & Food Lovers in 2026',
    description: 'The best gifts for food lovers — from artisan ingredient kits to cooking experiences. For home cooks, restaurant enthusiasts, and adventurous eaters.',
    intro: "The foodie in your life has already found the best restaurant in town, made their own pasta at least twice, and has opinions about salt. These gifts match that energy.",
    categories: [
      {
        heading: 'Artisan Ingredients & Pantry',
        items: [
          { name: 'Truffle Salt & Specialty Salt Set', price: '$25–$50', why: 'Flavored salts and finishing salts change every dish. A small luxury with a huge impact.', searchUrl: 'https://www.amazon.com/s?k=truffle+salt+specialty+salt+set+gift' },
          { name: 'Olive Oil Tasting Set', price: '$30–$60', why: 'Premium single-origin olive oils. The gift that makes every salad and pasta noticeably better.', searchUrl: 'https://www.amazon.com/s?k=olive+oil+tasting+set+gift' },
          { name: 'Hot Sauce Collection', price: '$25–$60', why: 'A curated selection of craft hot sauces from around the world. For the heat-seeker.', searchUrl: 'https://www.amazon.com/s?k=craft+hot+sauce+collection+gift' },
          { name: 'Spice Gift Set', price: '$30–$60', why: 'Penzeys or Burlap & Barrel spice sets. Instantly elevates home cooking.', searchUrl: 'https://www.amazon.com/s?k=spice+gift+set+cooking' },
        ],
      },
      {
        heading: 'Tools & Equipment',
        items: [
          { name: 'Microplane Grater Set', price: '$20–$50', why: 'The kitchen tool pros use for zesting, grating cheese, and shaving chocolate. Life-changing simplicity.', searchUrl: 'https://www.amazon.com/s?k=microplane+grater+set+kitchen' },
          { name: 'Instant-Read Thermometer', price: '$25–$60', why: 'ThermoPro or Thermapen. The tool that makes meat, candy, and baking reliably perfect.', searchUrl: 'https://www.amazon.com/s?k=instant+read+thermometer+cooking' },
          { name: 'Japanese Mandoline Slicer', price: '$30–$80', why: 'Razor-thin, uniform slices for salads, gratins, and presentations. A pro technique made accessible.', searchUrl: 'https://www.amazon.com/s?k=japanese+mandoline+slicer+kitchen' },
        ],
      },
      {
        heading: 'Experiences & Subscriptions',
        items: [
          { name: 'Cooking Class (In-Person or Online)', price: '$60–$200', why: 'MasterClass subscription or a local hands-on class. The foodie\'s favorite type of learning.', searchUrl: 'https://www.masterclass.com' },
          { name: 'Restaurant Gift Card', price: '$50–$150', why: 'A gift card to a restaurant they\'ve been wanting to try. Experiences beat objects for foodies.', searchUrl: 'https://www.amazon.com/s?k=restaurant+gift+card' },
          { name: 'Wine or Cheese Club Subscription', price: '$50–$100/mo', why: 'Monthly deliveries of curated wines or artisan cheeses. The gift that keeps giving.', searchUrl: 'https://www.amazon.com/s?k=wine+club+subscription+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good food gift for someone who likes to cook?', a: 'Focus on quality ingredients and pro tools: finishing salts, premium olive oil, a Thermapen, a Microplane set, or a pasta-making kit. Foodies who cook love ingredients and tools that elevate their technique.' },
      { q: 'What is a good gift for a foodie who has everything?', a: 'Experiences: a reservation at a new restaurant, a cooking class in their favorite cuisine, a food tour of their city, or a subscription to a food culture magazine like Bon Appétit or Eater. Experiences beat objects for serious food lovers.' },
      { q: 'What are affordable food gifts under $30?', a: 'Under $30: a specialty salt set, a single-origin olive oil, artisan hot sauce trio, a pasta-making book with fresh pasta flour, or a quality cookbook from a chef they admire.' },
    ],
  },
  'fitness-lover': {
    title: 'Best Gifts for Fitness & Gym Lovers in 2026',
    description: 'The best fitness gifts in 2026 — gym gear, recovery tools, and activewear for every type of workout.',
    intro: "Fitness people have very specific opinions about their gear. These picks are crowd-tested and actually used by real gym-goers — no gimmicks, no novelty workout gadgets.",
    categories: [
      {
        heading: 'Gym & Workout Gear',
        items: [
          { name: 'Adjustable Dumbbells', price: '$100–$300', why: 'Bowflex or NordicTrack. Replace an entire dumbbell rack. Perfect for home gym setups.', searchUrl: 'https://www.amazon.com/s?k=adjustable+dumbbells+home+gym' },
          { name: 'Resistance Band Set (Heavy)', price: '$25–$60', why: 'Pull-up assistance, hip bands, full-body resistance training. Versatile and lightweight.', searchUrl: 'https://www.amazon.com/s?k=heavy+resistance+band+set+gym' },
          { name: 'Lifting Gloves or Straps', price: '$15–$40', why: 'For heavy lifters, quality gloves and wrist straps protect hands and improve grip.', searchUrl: 'https://www.amazon.com/s?k=weight+lifting+gloves+straps' },
          { name: 'Foam Roller (Deep Tissue)', price: '$25–$60', why: 'TriggerPoint or Rumble Roller. The recovery tool serious gym-goers actually use.', searchUrl: 'https://www.amazon.com/s?k=foam+roller+deep+tissue' },
        ],
      },
      {
        heading: 'Recovery & Nutrition',
        items: [
          { name: 'Massage Gun (Hypervolt / Theragun)', price: '$80–$300', why: 'Deep muscle recovery in minutes. Every serious athlete wants one they don\'t have to share.', searchUrl: 'https://www.amazon.com/s?k=massage+gun+hypervolt+theragun' },
          { name: 'Protein Powder Sampler', price: '$30–$60', why: 'A variety pack of protein flavors and brands. Great for anyone building or maintaining muscle.', searchUrl: 'https://www.amazon.com/s?k=protein+powder+sampler+variety' },
          { name: 'Insulated Shaker Bottle', price: '$25–$50', why: 'HydroJug or Hydra Cup. Keeps protein shakes cold and doubles as a water bottle.', searchUrl: 'https://www.amazon.com/s?k=insulated+shaker+bottle+gym' },
        ],
      },
      {
        heading: 'Activewear & Tech',
        items: [
          { name: 'Fitness Tracker (Garmin or Fitbit)', price: '$100–$250', why: 'For the dedicated trainer who wants detailed metrics without a full smartwatch.', searchUrl: 'https://www.amazon.com/s?k=fitness+tracker+garmin+fitbit' },
          { name: 'Quality Gym Bag', price: '$40–$100', why: 'Nike, Under Armour, or Adidas. A proper gym bag with shoe compartment and wet pocket.', searchUrl: 'https://www.amazon.com/s?k=gym+bag+with+shoe+compartment' },
          { name: 'Wireless Earbuds (Sport)', price: '$50–$180', why: 'Powerbeats Pro or Jabra Elite Active. Sweat-resistant, secure fit, great sound for workouts.', searchUrl: 'https://www.amazon.com/s?k=wireless+sport+earbuds+gym' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for someone who loves going to the gym?', a: 'Focus on practical gear they use daily: wireless earbuds for workouts, a quality gym bag, a foam roller for recovery, or a massage gun. Avoid novelty fitness gadgets — gym people are particular about their tools.' },
      { q: 'What fitness gifts do people actually use?', a: 'The most-used fitness gifts are: a massage gun, foam roller, insulated water bottle or shaker, a fitness tracker, and quality earbuds. These get used every workout. Skip the yoga mat with a funny slogan.' },
      { q: 'What is a good gift for a runner?', a: 'For runners: a GPS running watch (Garmin Forerunner), a foam roller or massage gun for recovery, compression socks, Body Glide anti-chafe balm, a hydration vest for long runs, or a race entry as a gift. Runners have specific needs — ask what distance they\'re training for.' },
    ],
  },
  traveler: {
    title: 'Best Gifts for Travelers in 2026',
    description: 'The best travel gifts in 2026 — packing gear, travel tech, and accessories for frequent flyers and adventure seekers.',
    intro: "Travelers are particular about their gear — they've learned what works through hard-won experience. These picks are the things they actually bring, use, and recommend.",
    categories: [
      {
        heading: 'Packing & Luggage',
        items: [
          { name: 'Packing Cubes Set', price: '$20–$50', why: 'Eagle Creek or Osprey. Transforms suitcase chaos into organized perfection. Every traveler eventually converts.', searchUrl: 'https://www.amazon.com/s?k=packing+cubes+set+travel' },
          { name: 'Compression Travel Pillow', price: '$25–$60', why: 'Cabeau or Trtl. The neck pillow upgrade that actually supports the neck properly.', searchUrl: 'https://www.amazon.com/s?k=compression+travel+neck+pillow' },
          { name: 'TSA-Approved Toiletry Bag', price: '$20–$50', why: 'A hanging toiletry organizer with clear pockets. Makes airport security and hotel bathrooms effortless.', searchUrl: 'https://www.amazon.com/s?k=tsa+approved+travel+toiletry+bag' },
          { name: 'Luggage Tags (Personalized)', price: '$15–$40', why: 'A quality leather luggage tag with their initials. Small upgrade, looks great.', searchUrl: 'https://www.etsy.com/search?q=personalized+leather+luggage+tag' },
        ],
      },
      {
        heading: 'Travel Tech',
        items: [
          { name: 'Universal Travel Adapter', price: '$20–$40', why: 'All-in-one plug adapter for 150+ countries. The most universally useful travel accessory.', searchUrl: 'https://www.amazon.com/s?k=universal+travel+adapter+all+countries' },
          { name: 'Portable Battery Pack', price: '$30–$60', why: 'Anker PowerCore 10000. Slim, powerful, and fits in any bag. Never be stranded with a dead phone.', searchUrl: 'https://www.amazon.com/s?k=anker+power+bank+travel' },
          { name: 'Noise-Cancelling Earbuds', price: '$100–$280', why: 'Sony WF-1000XM5 or AirPods Pro. The long-haul flight essential. Transforms 10 hours into something manageable.', searchUrl: 'https://www.amazon.com/s?k=noise+cancelling+earbuds+travel' },
        ],
      },
      {
        heading: 'Experiences & Documents',
        items: [
          { name: 'Travel Journal', price: '$20–$40', why: 'A beautifully bound travel journal. The analog counterpart to 1,000 Instagram photos.', searchUrl: 'https://www.amazon.com/s?k=travel+journal+leather' },
          { name: 'RFID-Blocking Passport Wallet', price: '$20–$50', why: 'Keeps passport, cards, and currency organized and protected from electronic skimming.', searchUrl: 'https://www.amazon.com/s?k=rfid+blocking+passport+wallet' },
          { name: 'Airbnb or Booking.com Gift Card', price: '$50–$200', why: 'The gift of accommodation. Travelers always have a trip on the planning board.', searchUrl: 'https://www.amazon.com/s?k=airbnb+gift+card' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for someone who travels a lot?', a: 'Focus on practical travel accessories: packing cubes, a universal adapter, noise-cancelling earbuds, a quality travel pillow, or a portable battery pack. Experienced travelers have the big ticket items — small practical upgrades are always welcome.' },
      { q: 'What is a unique travel gift?', a: 'Unique travel gifts: a scratch-off world map, a custom city map print of their favorite destination, a subscription to Atlas Obscura (interesting places to visit), a language-learning app subscription (Duolingo Plus), or a personalized travel journal.' },
      { q: 'What are budget-friendly travel gifts?', a: 'Under $30: a set of packing cubes, a universal adapter, an RFID passport wallet, a travel-size toiletry set, or a quality luggage tag. The most used travel accessories are often the least expensive ones.' },
    ],
  },
  'pet-lover': {
    title: 'Best Gifts for Pet Lovers in 2026',
    description: 'Thoughtful gifts for dog owners, cat lovers, and all pet parents — from pet accessories to personalized keepsakes.',
    intro: "Pet lovers don't want gifts for themselves — they want gifts for their pets, or gifts that celebrate their pets. These picks cover both, from practical to deeply sentimental.",
    categories: [
      {
        heading: 'For the Pet',
        items: [
          { name: 'Premium Pet Treats Gift Box', price: '$25–$50', why: 'A curated box of gourmet dog or cat treats. Because pets deserve the good stuff too.', searchUrl: 'https://www.amazon.com/s?k=gourmet+dog+treats+gift+box' },
          { name: 'Interactive Puzzle Toy', price: '$20–$50', why: 'Mental stimulation for dogs or cats. Reduces boredom and keeps them engaged while owners are away.', searchUrl: 'https://www.amazon.com/s?k=interactive+puzzle+toy+dog+cat' },
          { name: 'Cozy Pet Bed', price: '$40–$100', why: 'A plush, washable bed their pet will claim immediately and never leave.', searchUrl: 'https://www.amazon.com/s?k=cozy+pet+bed+dog+cat' },
          { name: 'Cat Subscription Box (KitNipBox)', price: '$25–$50/mo', why: 'Monthly box of cat toys, treats, and accessories. Every cat parent\'s dream subscription.', searchUrl: 'https://www.amazon.com/s?k=cat+subscription+box+gift' },
        ],
      },
      {
        heading: 'For the Pet Parent',
        items: [
          { name: 'Custom Pet Portrait', price: '$30–$150', why: 'A painted or illustrated portrait of their pet. Etsy has hundreds of talented artists. Genuinely treasured.', searchUrl: 'https://www.etsy.com/search?q=custom+pet+portrait+painting' },
          { name: 'Personalized Pet Name Jewelry', price: '$30–$100', why: 'A necklace or bracelet engraved with their pet\'s name. A wearable love letter to their fur baby.', searchUrl: 'https://www.etsy.com/search?q=personalized+pet+name+necklace' },
          { name: 'Pet Photo Book', price: '$25–$60', why: 'A photo book dedicated entirely to their pet. They have the photos — this gives them the vehicle.', searchUrl: 'https://www.shutterfly.com' },
        ],
      },
      {
        heading: 'Practical & Functional',
        items: [
          { name: 'Automatic Pet Feeder', price: '$40–$120', why: 'Schedule feedings remotely via app. Essential for pet parents who travel or work long hours.', searchUrl: 'https://www.amazon.com/s?k=automatic+pet+feeder+app' },
          { name: 'GPS Pet Tracker', price: '$50–$100', why: 'Tile or Whistle. Clips to the collar and shows location in real time. Peace of mind in a small device.', searchUrl: 'https://www.amazon.com/s?k=gps+pet+tracker+collar' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for a dog owner?', a: 'Dog owner favorites: a custom pet portrait, a personalized dog collar or tag, a subscription box of dog treats and toys (BarkBox), a quality retractable leash, or a GPS pet tracker. Anything that celebrates or helps their dog is a winner.' },
      { q: 'What is a good gift for a cat owner?', a: 'Cat owner hits: a KitNipBox subscription, a custom cat portrait, a self-cleaning litter box, a cozy cat bed, or a personalized "Cat Mom/Dad" mug or jewelry. Cat people love gifts that acknowledge their cat by name.' },
      { q: 'What is a unique gift for a pet lover?', a: 'Custom pet portraits (Etsy has amazing artists), a phone case with their pet\'s face, a "Pet Parent" personalized jewelry piece with their pet\'s name and paw print, or a custom illustrated pet book where their pet is the main character.' },
    ],
  },
  bookworm: {
    title: 'Best Gifts for Book Lovers in 2026',
    description: 'Thoughtful gifts for book lovers and avid readers — from Kindles to cozy reading accessories. For every type of reader.',
    intro: "Book lovers are simultaneously the easiest and hardest to shop for. Get them the right book and you're a hero. Miss the mark and it collects dust. These picks minimize the risk.",
    categories: [
      {
        heading: 'Tech & Reading Upgrades',
        items: [
          { name: 'Kindle Paperwhite', price: '$90–$140', why: 'The e-reader readers actually use. Glare-free screen, weeks of battery, thousands of books in one device.', searchUrl: 'https://www.amazon.com/s?k=kindle+paperwhite+2026' },
          { name: 'Kindle Unlimited Subscription', price: '$10–$120/yr', why: 'Unlimited access to over a million books and audiobooks. The gift that never runs out.', searchUrl: 'https://www.amazon.com/s?k=kindle+unlimited+gift' },
          { name: 'Book Light (Rechargeable)', price: '$15–$30', why: 'A warm clip-on light for late-night reading without disturbing anyone.', searchUrl: 'https://www.amazon.com/s?k=rechargeable+book+light+reading' },
        ],
      },
      {
        heading: 'Cozy Reading Accessories',
        items: [
          { name: 'Leather Bookmark Set', price: '$15–$35', why: 'A personalized or quality leather bookmark. The small gift that gets used in every book.', searchUrl: 'https://www.amazon.com/s?k=leather+bookmark+set+personalized' },
          { name: 'Book Sleeve / Tote', price: '$20–$50', why: 'A padded fabric sleeve that protects books in bags. Bookworms with transit commutes love these.', searchUrl: 'https://www.etsy.com/search?q=book+sleeve+tote+reader' },
          { name: 'Reading Chair Blanket', price: '$30–$60', why: 'Soft, oversized, and designed for curling up. Every serious reader has a reading spot — make it cozier.', searchUrl: 'https://www.amazon.com/s?k=soft+reading+blanket+cozy' },
          { name: 'Literary Candle', price: '$20–$40', why: 'Scented candles inspired by books and libraries. Etsy shops like Happy Piranha make amazing ones.', searchUrl: 'https://www.etsy.com/search?q=literary+candle+book+scent' },
        ],
      },
      {
        heading: 'Books & Subscriptions',
        items: [
          { name: 'Book of the Month Subscription', price: '$15–$20/mo', why: 'A curated hardcover delivered monthly. Great for readers who love to be surprised.', searchUrl: 'https://www.amazon.com/s?k=book+of+the+month+subscription+gift' },
          { name: 'Local Bookstore Gift Card', price: '$25–$100', why: 'Support their local bookshop and let them pick. Far better than guessing the title.', searchUrl: 'https://www.amazon.com/s?k=bookstore+gift+card' },
          { name: 'Signed or First Edition Book', price: '$30–$200+', why: 'A signed copy of their favorite author\'s work. AbeBooks and ThriftBooks often have rare finds.', searchUrl: 'https://www.abebooks.com' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for a book lover?', a: 'The safest book lover gifts don\'t require knowing exactly what they want to read: a Kindle Paperwhite, a Book of the Month subscription, a local bookstore gift card, or cozy reading accessories (blanket, book light, leather bookmark). Let them choose the books.' },
      { q: 'What book should I buy for a book lover?', a: 'Only buy a specific book if you genuinely know their taste well. A signed copy of their all-time favorite author, a first edition of a beloved novel, or a new release from an author they follow are safer bets than guessing their next read.' },
      { q: 'What are unique gifts for bibliophiles?', a: 'Unique bookish gifts: a custom library card catalog, a literary map of their favorite fictional world, a subscription to Literati or Book of the Month, a personalized book spine art print, or a candle scented like "old books" from a literary Etsy shop.' },
    ],
  },
  gardener: {
    title: 'Best Gifts for Gardeners in 2026',
    description: 'Thoughtful gifts for gardeners and plant lovers — from quality tools to seed subscriptions. For every type of green thumb.',
    intro: "Gardeners are passionate people who spend real time and love on their plants. These picks match that dedication — quality tools, interesting seeds, and thoughtful accessories they'll actually use.",
    categories: [
      {
        heading: 'Tools & Equipment',
        items: [
          { name: 'Hori-Hori Garden Knife', price: '$25–$60', why: 'The Swiss army knife of garden tools. Digs, divides plants, weeds, and measures depth. Every serious gardener wants one.', searchUrl: 'https://www.amazon.com/s?k=hori+hori+garden+knife' },
          { name: 'Quality Pruning Shears', price: '$25–$60', why: 'Felco or Fiskars. Sharp, precise, long-lasting. An upgrade from whatever they\'re currently using.', searchUrl: 'https://www.amazon.com/s?k=quality+pruning+shears+felco' },
          { name: 'Kneeling Pad (Thick Foam)', price: '$20–$40', why: 'Hours on their knees are rough. A quality kneeling pad is one of those gifts that genuinely improves their experience.', searchUrl: 'https://www.amazon.com/s?k=garden+kneeling+pad+thick' },
          { name: 'Watering Can (Stylish)', price: '$25–$60', why: 'A beautiful copper or powder-coated watering can. Functional and looks great in any garden or home.', searchUrl: 'https://www.amazon.com/s?k=stylish+watering+can+garden' },
        ],
      },
      {
        heading: 'Seeds & Plants',
        items: [
          { name: 'Heirloom Seed Collection', price: '$20–$50', why: 'A curated mix of heirloom vegetable or flower seeds. The gift of a whole new growing season.', searchUrl: 'https://www.amazon.com/s?k=heirloom+seed+collection+gift' },
          { name: 'Rare Houseplant', price: '$20–$80', why: 'A variegated Monstera, Hoya, or hard-to-find fern. Plant lovers always want the one they don\'t have.', searchUrl: 'https://www.amazon.com/s?k=rare+houseplant+variegated+monstera' },
          { name: 'Seed Subscription Box', price: '$20–$40/mo', why: 'Monthly curated seed packets from small farms and seed companies. For the gardener who wants to try new varieties.', searchUrl: 'https://www.amazon.com/s?k=seed+subscription+box+gardener' },
        ],
      },
      {
        heading: 'Accessories & Learning',
        items: [
          { name: 'Garden Journal / Planner', price: '$20–$40', why: 'Track what was planted, when, what worked. Serious gardeners keep notes — give them a beautiful place to do it.', searchUrl: 'https://www.amazon.com/s?k=garden+journal+planner' },
          { name: 'Gardening Gloves (Quality)', price: '$15–$40', why: 'Bamboo or pigskin leather gloves that actually fit and protect. A small upgrade they\'ll notice every session.', searchUrl: 'https://www.amazon.com/s?k=quality+gardening+gloves+women+men' },
          { name: 'Plant Identification App Subscription', price: '$10–$30', why: 'PictureThis or PlantNet Premium. Instantly identifies any plant. Great for curious growers.', searchUrl: 'https://www.amazon.com/s?k=plant+identification+app+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for an avid gardener?', a: 'Focus on quality tools they\'d hesitate to spend on themselves: a Hori-Hori knife, Felco pruning shears, or a beautiful watering can. Alternatively, rare plants or curated seed collections give them something exciting to grow.' },
      { q: 'What are good gifts for a new gardener?', a: 'For beginners: a starter seed kit with grow lights, a basic tool set (trowel, cultivator, pruners), a beginner gardening book, a grow-your-own herb kit, or an indoor pot set with quality potting mix. Keep it simple and encouraging.' },
      { q: 'What are unique gifts for plant lovers?', a: 'Unique garden gifts: a subscription to Floret Flower Farm\'s seed shop, a custom garden marker set with plant names, a personalized garden stone, a rare cultivar of their favorite plant genus, or a gardening workshop in their area.' },
    ],
  },
  artist: {
    title: 'Best Gifts for Artists & Creatives in 2026',
    description: 'The best gifts for artists, illustrators, and creatives — from professional supplies to digital tools. For every medium and skill level.',
    intro: "Artists are particular about their supplies — and they'll notice the difference between quality and generic. These picks are what working artists actually use and want.",
    categories: [
      {
        heading: 'Drawing & Illustration',
        items: [
          { name: 'Procreate + Apple Pencil (iPad)', price: '$100–$350', why: 'The digital art setup that has converted thousands of traditional artists. Procreate is the industry standard for digital illustration.', searchUrl: 'https://www.amazon.com/s?k=apple+pencil+ipad+procreate' },
          { name: 'Copic Marker Set', price: '$40–$150', why: 'Professional-grade alcohol markers used by illustrators and designers worldwide. Refillable and long-lasting.', searchUrl: 'https://www.amazon.com/s?k=copic+marker+set' },
          { name: 'Sketchbook Set (Canson or Strathmore)', price: '$20–$50', why: 'Quality paper that holds pencil, ink, and watercolor without buckling. Artists notice paper quality immediately.', searchUrl: 'https://www.amazon.com/s?k=sketchbook+set+canson+strathmore' },
          { name: 'Drawing Tablet (Wacom)', price: '$80–$300', why: 'Wacom Intuus or Cintiq. The digital drawing upgrade for illustrators who want to work without an iPad.', searchUrl: 'https://www.amazon.com/s?k=wacom+drawing+tablet' },
        ],
      },
      {
        heading: 'Painting & Mixed Media',
        items: [
          { name: 'Professional Watercolor Set', price: '$30–$120', why: 'Winsor & Newton or Daniel Smith. Professional pigments make a visible difference in the finished work.', searchUrl: 'https://www.amazon.com/s?k=professional+watercolor+set+winsor+newton' },
          { name: 'Gouache Paint Set', price: '$25–$80', why: 'The trending opaque watercolor medium. Perfect for illustration and textile work.', searchUrl: 'https://www.amazon.com/s?k=gouache+paint+set+professional' },
          { name: 'Canvas Panel Set', price: '$20–$50', why: 'Quality pre-primed canvas panels for oil and acrylic work. Artists always need more surfaces.', searchUrl: 'https://www.amazon.com/s?k=canvas+panel+set+painting' },
        ],
      },
      {
        heading: 'Workspace & Inspiration',
        items: [
          { name: 'Artist Lamp (Adjustable, Daylight)', price: '$40–$100', why: 'A daylight bulb lamp that renders colors accurately. Essential for detailed work.', searchUrl: 'https://www.amazon.com/s?k=artist+daylight+lamp+adjustable' },
          { name: 'Art Book (Monograph of Their Favorite Artist)', price: '$30–$80', why: 'A beautifully printed survey of an artist they admire. Coffee table meets reference book.', searchUrl: 'https://www.amazon.com/s?k=artist+monograph+art+book' },
          { name: 'MasterClass Subscription', price: '$90–$180/yr', why: 'Learn from Annie Leibovitz, Jeff Koons, or other legendary creatives. Pure inspiration fuel.', searchUrl: 'https://www.masterclass.com' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for an artist?', a: 'The best artist gifts are high-quality supplies in their medium: professional paints for painters, quality sketchbooks and Copic markers for illustrators, or a Procreate + Apple Pencil setup for digital artists. Go for professional-grade quality — they\'ll immediately notice the difference.' },
      { q: 'What is a good gift for a beginner artist?', a: 'For beginners: a quality sketchbook, a basic drawing tutorial book, a watercolor starter set, or access to a platform like Skillshare or MasterClass. Don\'t buy expensive supplies until they\'ve committed to a medium — start with quality basics.' },
      { q: 'What are unique gifts for creative people?', a: 'Unique creative gifts: a custom art print of their own work (enlarged and framed), a spot in a local workshop or art class, a subscription to a creative software (Adobe Creative Cloud, Procreate), or a sketchbook trip to a city they\'ve never drawn in.' },
    ],
  },
  'tech-lover': {
    title: 'Best Gifts for Tech Enthusiasts in 2026',
    description: 'The best tech gifts in 2026 — from smart home gadgets to the latest accessories. For the person who has everything and still wants more.',
    intro: "Tech lovers are hard to surprise — they've already researched everything they want. The trick is finding something in their blind spot or an upgrade they haven't justified yet.",
    categories: [
      {
        heading: 'Smart Home & Automation',
        items: [
          { name: 'Smart Light Bulb Starter Kit (Philips Hue)', price: '$60–$150', why: 'The smart home gateway gift. Once they have Hue lights, they\'re in the ecosystem forever.', searchUrl: 'https://www.amazon.com/s?k=philips+hue+starter+kit' },
          { name: 'Smart Plug Set', price: '$25–$50', why: 'Kasa or TP-Link. Instantly makes any lamp or appliance app-controlled. Entry-level smart home upgrade.', searchUrl: 'https://www.amazon.com/s?k=smart+plug+set+kasa' },
          { name: 'Robot Vacuum (Entry-Level)', price: '$150–$400', why: 'Roomba or Eufy. The lazy tech lover\'s dream appliance. Gets used every single day.', searchUrl: 'https://www.amazon.com/s?k=robot+vacuum+roomba+eufy' },
        ],
      },
      {
        heading: 'Gadgets & Accessories',
        items: [
          { name: 'MagSafe Wallet + Charger Set', price: '$40–$80', why: 'A magnetic wallet that snaps to the iPhone and a MagSafe charging pad. Elegant and practical.', searchUrl: 'https://www.amazon.com/s?k=magsafe+wallet+charger+set' },
          { name: 'USB-C Hub / Docking Station', price: '$40–$100', why: 'The desk accessory that adds 7+ ports to any laptop. Belkin and Anker make excellent ones.', searchUrl: 'https://www.amazon.com/s?k=usb+c+hub+docking+station' },
          { name: 'NFC Business Card', price: '$20–$50', why: 'Tap to share contact info instantly. The tech-forward replacement for paper business cards.', searchUrl: 'https://www.amazon.com/s?k=nfc+business+card+smart' },
          { name: 'Cable Management Box', price: '$20–$50', why: 'A clean cable organizer for the desk or entertainment center. Tech people hate messy cables.', searchUrl: 'https://www.amazon.com/s?k=cable+management+box+desk' },
        ],
      },
      {
        heading: 'Audio & Displays',
        items: [
          { name: 'Smart Speaker (Amazon Echo or HomePod mini)', price: '$50–$100', why: 'Voice-controlled everything. If they don\'t have one yet, this is the one to start with.', searchUrl: 'https://www.amazon.com/s?k=smart+speaker+amazon+echo+homepod' },
          { name: 'Monitor Light Bar (BenQ)', price: '$40–$80', why: 'Sits on top of the monitor, illuminates the desk without screen glare. Every home office person wants one.', searchUrl: 'https://www.amazon.com/s?k=benq+monitor+light+bar' },
          { name: 'Portable Projector (Mini)', price: '$100–$300', why: 'Movie nights anywhere. Connects to a phone or laptop for a big screen wherever you want it.', searchUrl: 'https://www.amazon.com/s?k=portable+mini+projector+1080p' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for a tech enthusiast who has everything?', a: 'Focus on upgrades to what they already have: a better cable management solution, a higher-quality charging pad, a smarter version of a dumb appliance (robot vacuum, smart thermostat), or something in a category they haven\'t explored yet (smart home, audio, VR).' },
      { q: 'What are good cheap tech gifts under $50?', a: 'Under $50: a smart plug set, a MagSafe wallet, a cable management box, a USB-C hub, or a monitor light bar. Small practical tech accessories are always appreciated and don\'t require knowing their exact setup.' },
      { q: 'What is a good gift for someone who builds PCs?', a: 'For the PC builder: a high-quality cable management kit, a thermal paste (Thermal Grizzly Kryonaut), a magnetic screwdriver set, an anti-static wristband kit, or a premium LED controller for their build. Niche but deeply appreciated.' },
    ],
  },
  'home-chef': {
    title: 'Best Gifts for Home Cooks & Chefs in 2026',
    description: 'The best kitchen gifts for home cooks and chefs — from pro-grade knives to smart kitchen gadgets. Practical, beautiful, and actually used.',
    intro: "Home cooks don't need more kitchen gadgets that live in a drawer. They want the tools that genuinely improve their cooking — the ones professionals use. These picks make the cut.",
    categories: [
      {
        heading: 'Essential Kitchen Tools',
        items: [
          { name: "Chef's Knife (8-inch)", price: '$60–$200', why: "Wüsthof Classic or Global. A quality chef's knife transforms every cooking task. The single most impactful kitchen upgrade.", searchUrl: "https://www.amazon.com/s?k=wusthof+chef+knife+8+inch" },
          { name: 'Instant-Read Thermometer (Thermapen)', price: '$40–$100', why: 'Perfect meat, perfect candy, perfect bread. The professional kitchen standard.', searchUrl: 'https://www.amazon.com/s?k=thermapen+instant+read+thermometer' },
          { name: 'Cast Iron Skillet (Lodge)', price: '$30–$60', why: 'Indestructible, improves with age, works on every heat source. The forever gift for any cook.', searchUrl: 'https://www.amazon.com/s?k=lodge+cast+iron+skillet+12+inch' },
          { name: 'Microplane Grater Set', price: '$20–$50', why: 'Zests citrus, grates hard cheese, shaves chocolate, grates nutmeg. Used in every professional kitchen.', searchUrl: 'https://www.amazon.com/s?k=microplane+grater+set+kitchen+gift' },
        ],
      },
      {
        heading: 'Specialty Equipment',
        items: [
          { name: 'Pasta Maker Machine', price: '$60–$200', why: 'Marcato Atlas or KitchenAid attachment. Fresh pasta at home is a game changer. A gift they\'ll use for years.', searchUrl: 'https://www.amazon.com/s?k=pasta+maker+machine+home' },
          { name: 'Immersion Blender (High-Power)', price: '$40–$100', why: 'Soups, sauces, smoothies — without transferring to a blender. Breville and Braun are the pro picks.', searchUrl: 'https://www.amazon.com/s?k=immersion+blender+high+power+kitchen' },
          { name: 'Dutch Oven (Enameled)', price: '$80–$350', why: 'Le Creuset or Staub. Braising, bread baking, soups. The ultimate all-purpose pot that lasts a lifetime.', searchUrl: 'https://www.amazon.com/s?k=enameled+dutch+oven+le+creuset+staub' },
        ],
      },
      {
        heading: 'Pantry & Ingredients',
        items: [
          { name: 'Premium Olive Oil Set', price: '$30–$70', why: 'Single-origin finishing oils from Italy, Greece, or California. Drizzled on everything, used in nothing it shouldn\'t be.', searchUrl: 'https://www.amazon.com/s?k=premium+olive+oil+set+gift' },
          { name: 'Artisan Spice Collection', price: '$30–$60', why: 'Burlap & Barrel or Penzeys specialty spice sets. High-quality spices that make a real difference.', searchUrl: 'https://www.amazon.com/s?k=artisan+spice+collection+gift' },
          { name: 'Cookbook by a Renowned Chef', price: '$30–$60', why: 'Salt Fat Acid Heat, Jerusalem, Plenty, or The Food Lab — a great cookbook is the gift that keeps cooking.', searchUrl: 'https://www.amazon.com/s?k=bestselling+cookbook+2026' },
        ],
      },
    ],
    faqs: [
      { q: 'What kitchen gifts do home cooks actually want?', a: 'Home cooks want quality upgrades, not gadgets: a better chef\'s knife, a Thermapen, a Dutch oven, quality spices, or a pasta maker. Avoid single-use gadgets (avocado slicers, strawberry hullers) — they end up in the back of a drawer.' },
      { q: 'What is a good gift for someone who loves to bake?', a: 'For bakers: a kitchen scale (mandatory for precision), a stand mixer attachment, high-quality vanilla extract, a Danish dough whisk, silicone baking mats, or a premium cookbook focused on baking (Tartine Bread, The Perfect Cookie).' },
      { q: 'What are luxury kitchen gifts under $100?', a: 'Under $100: a Thermapen thermometer, a cast iron skillet, a Microplane set, an immersion blender, a premium olive oil collection, a pasta maker, or a beautifully bound cookbook. Focused quality beats a big basket of generic items.' },
    ],
  },
  outdoorsy: {
    title: 'Best Gifts for Outdoor & Nature Lovers in 2026',
    description: 'The best outdoor gifts for hikers, campers, and nature enthusiasts — from trail gear to camp kitchen essentials.',
    intro: "Outdoor people have strong opinions about their gear — weight, durability, and function matter more than price tags. These picks are what they actually want to find under the tree.",
    categories: [
      {
        heading: 'Hiking & Trail Gear',
        items: [
          { name: 'Trekking Poles (Collapsible)', price: '$40–$100', why: 'Black Diamond or Leki. Reduces knee strain on descents, adds stability on rough terrain. Converts skeptics immediately.', searchUrl: 'https://www.amazon.com/s?k=collapsible+trekking+poles+black+diamond' },
          { name: 'Hydration Bladder (CamelBak)', price: '$30–$60', why: 'Hands-free water access on the trail. CamelBak Crux is the gold standard. Once you use one, you never go back.', searchUrl: 'https://www.amazon.com/s?k=camelbak+hydration+bladder' },
          { name: 'Trail Running Shoes', price: '$100–$180', why: 'Salomon or Hoka. If they trail run or do technical hikes, quality footwear is the most impactful upgrade.', searchUrl: 'https://www.amazon.com/s?k=trail+running+shoes+salomon+hoka' },
          { name: 'Headlamp (High Lumen)', price: '$25–$60', why: 'Black Diamond Spot or Petzl Actik. Essential for any early morning or late evening adventure.', searchUrl: 'https://www.amazon.com/s?k=headlamp+high+lumen+black+diamond' },
        ],
      },
      {
        heading: 'Camping Essentials',
        items: [
          { name: 'Portable Camp Stove (MSR)', price: '$40–$100', why: 'Ultralight, reliable, screws onto fuel canisters. The classic camp cooking tool that outlasts everything.', searchUrl: 'https://www.amazon.com/s?k=msr+portable+camp+stove' },
          { name: 'Camp Coffee Maker (AeroPress or Percolator)', price: '$35–$60', why: 'Backcountry coffee that\'s actually good. AeroPress is beloved by serious campers for its compact size.', searchUrl: 'https://www.amazon.com/s?k=camp+coffee+maker+aeropress+percolator' },
          { name: 'Sleeping Bag Liner', price: '$30–$70', why: 'Adds 10–15°F of warmth to any sleeping bag without adding bulk. A versatile, practical upgrade.', searchUrl: 'https://www.amazon.com/s?k=sleeping+bag+liner+camping' },
        ],
      },
      {
        heading: 'Navigation & Safety',
        items: [
          { name: 'Garmin GPS Device', price: '$150–$400', why: 'For serious hikers and backcountry explorers. Offline maps, SOS, and tracking without cell service.', searchUrl: 'https://www.amazon.com/s?k=garmin+gps+hiking+device' },
          { name: 'National Parks Annual Pass', price: '$80', why: 'The America the Beautiful Pass — unlimited entry to all 400+ national parks for a year.', searchUrl: 'https://www.amazon.com/s?k=national+parks+annual+pass' },
          { name: 'AllTrails Pro Subscription', price: '$30/yr', why: 'Offline trail maps, reviews, and navigation. The app every serious hiker uses, upgraded to Pro.', searchUrl: 'https://www.amazon.com/s?k=alltrails+pro+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good gift for someone who loves hiking?', a: 'Top hiker gifts: trekking poles, a quality headlamp, a hydration bladder, AllTrails Pro subscription, a National Parks pass, or trail-specific footwear. Gear that solves a real problem on the trail always wins over aesthetic outdoor accessories.' },
      { q: 'What are good camping gifts?', a: 'Best camping gifts: a compact camp stove, an AeroPress for trail coffee, a sleeping bag liner, a high-quality headlamp, a portable water filter (Sawyer Squeeze), or a durable camp mug (GSI or Stanley). Focus on lightweight and multi-purpose.' },
      { q: 'What are unique gifts for outdoor lovers?', a: 'Unique outdoor gifts: a national parks journal with spaces for each park visited, an engraved summit log, a custom topo map print of their favorite hike, a wilderness first aid course, or a guided backcountry trip. Experiences always stand out for adventure lovers.' },
    ],
  },
  kids: {
    title: 'Best Gifts for Kids in 2026',
    description: 'Top toy and gift ideas for kids of all ages — from toddlers to tweens. Tested, loved, and actually played with.',
    intro: "The best kids' gifts get played with beyond the first day. Here are the toys and experiences that hold attention, build skills, and earn a permanent spot in the playroom.",
    categories: [
      {
        heading: 'Ages 2–5',
        items: [
          {
            name: 'LEGO DUPLO Set',
            price: '$20–$60',
            why: 'The OG building toy. Hours of quiet creative play.',
            searchUrl: 'https://www.amazon.com/s?k=lego+duplo+set',
          },
          {
            name: 'Melissa & Doug Puzzles',
            price: '$15–$30',
            why: 'Quality puzzles that don\'t fall apart after a week.',
            searchUrl: 'https://www.amazon.com/s?k=melissa+doug+puzzles',
          },
          {
            name: 'Kinetic Sand',
            price: '$20–$40',
            why: 'Wildly satisfying sensory play. Surprisingly mess-contained.',
            searchUrl: 'https://www.amazon.com/s?k=kinetic+sand',
          },
        ],
      },
      {
        heading: 'Ages 6–10',
        items: [
          {
            name: 'LEGO Creator Set',
            price: '$30–$100',
            why: 'Age-appropriate complexity. They\'ll build, rebuild, and build again.',
            searchUrl: 'https://www.amazon.com/s?k=lego+creator+set',
          },
          {
            name: 'Osmo Starter Kit',
            price: '$60–$100',
            why: 'Screen time that actually teaches coding, math, and drawing.',
            searchUrl: 'https://www.amazon.com/s?k=osmo+starter+kit',
          },
          {
            name: 'Stomp Rocket',
            price: '$25–$40',
            why: 'Gets them outside. Physics lesson disguised as pure fun.',
            searchUrl: 'https://www.amazon.com/s?k=stomp+rocket+kids',
          },
        ],
      },
      {
        heading: 'Ages 10+',
        items: [
          {
            name: 'Nintendo Switch Lite',
            price: '$180–$220',
            why: 'The console kids actually want. Game library is excellent.',
            searchUrl: 'https://www.amazon.com/s?k=nintendo+switch+lite',
          },
          {
            name: 'Beginner Coding Kit',
            price: '$50–$100',
            why: 'Kano or Micro:bit. Makes coding tactile and visual.',
            searchUrl: 'https://www.amazon.com/s?k=kids+coding+kit',
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the most popular toy for kids right now?",
        a: "In 2026, top picks include LEGO sets, Squishmallows, interactive robots (Sphero, Dash), and Nintendo Switch games. What's popular at school varies a lot — asking the child directly or their parent is the safest approach.",
      },
      {
        q: "What are good educational gifts for kids?",
        a: "The best educational gifts don't feel educational. Osmo, LEGO Technic, Snap Circuits, coding robots (like Dash by Wonder Workshop), and science experiment kits all teach skills through play.",
      },
      {
        q: "What is a good gift for a 5-year-old?",
        a: "At age 5: LEGO DUPLO or Junior sets, Melissa & Doug art supplies, Kinetic Sand, a balance bike, or a children's camera. Focus on open-ended toys that grow with them.",
      },
    ],
  },
  wedding: {
    title: 'Best Wedding Gifts in 2026',
    description: 'Find the perfect wedding gift — from registry must-haves to thoughtful cash alternatives. Curated wedding gift ideas for every budget.',
    intro: "Wedding gifts are a minefield. Too practical feels cold; too personal feels presumptuous. The best approach: check the registry first, then fill gaps with something from these categories. The couple will remember the thoughtful ones long after the wrapping paper is gone.",
    categories: [
      {
        heading: 'Kitchen & Home Essentials',
        items: [
          { name: 'Dutch Oven (Le Creuset or Staub)', price: '$100–$350', why: 'The kitchen heirloom every couple wants but won\'t buy themselves. Gets used for decades.', searchUrl: 'https://www.amazon.com/s?k=le+creuset+dutch+oven+wedding+gift' },
          { name: 'KitchenAid Stand Mixer', price: '$300–$500', why: 'The ultimate kitchen upgrade. Pairs well with a group contribution from multiple guests.', searchUrl: 'https://www.amazon.com/s?k=kitchenaid+stand+mixer+wedding' },
          { name: 'Luxury Bedding Set', price: '$100–$250', why: 'High thread-count sheets or a quality duvet set. Something they\'ll use every single night.', searchUrl: 'https://www.amazon.com/s?k=luxury+bedding+set+wedding+gift' },
          { name: 'Espresso / Coffee Machine', price: '$80–$300', why: 'Nespresso or Breville. Daily use, daily appreciation. A great registry pick to contribute toward.', searchUrl: 'https://www.amazon.com/s?k=espresso+machine+wedding+gift' },
        ],
      },
      {
        heading: 'Experience Gifts',
        items: [
          { name: 'Honeymoon Fund Contribution', price: '$50–$200', why: 'Many couples set up a honeymoon fund instead of a traditional registry. Contributing directly feels incredibly generous.', searchUrl: 'https://www.amazon.com/s?k=experience+gift+card+travel' },
          { name: 'Cooking Class for Two', price: '$80–$200', why: 'A date night built in. Cooking classes are a memorable shared experience that strengthens the new marriage.', searchUrl: 'https://www.amazon.com/s?k=cooking+class+gift+card+couple' },
          { name: 'Wine or Whiskey Tasting Experience', price: '$60–$150', why: 'A curated tasting experience at a local winery or distillery, or a delivered sampler box.', searchUrl: 'https://www.amazon.com/s?k=wine+tasting+gift+couple' },
        ],
      },
      {
        heading: 'Personalized & Sentimental',
        items: [
          { name: 'Custom Wedding Artwork', price: '$50–$200', why: 'A custom illustration of their venue, vows, or wedding date. Etsy has hundreds of talented artists for this.', searchUrl: 'https://www.etsy.com/search?q=custom+wedding+artwork+personalized' },
          { name: 'Engraved Cutting Board', price: '$40–$100', why: 'Personalized with their names and wedding date. A kitchen staple that doubles as a keepsake.', searchUrl: 'https://www.amazon.com/s?k=engraved+cutting+board+wedding+personalized' },
          { name: 'Custom Photo Album / Guest Book', price: '$40–$100', why: 'A beautifully designed guest book or photo album for their wedding memories. They\'ll pull it out every anniversary.', searchUrl: 'https://www.etsy.com/search?q=custom+wedding+photo+album+guest+book' },
        ],
      },
      {
        heading: 'Cash Alternatives',
        items: [
          { name: 'Newlywed Starter Fund (Gift Card Bundle)', price: '$50–$300', why: 'Gift cards to home stores (Pottery Barn, Williams Sonoma, IKEA) give flexibility without the awkwardness of cash.', searchUrl: 'https://www.amazon.com/s?k=pottery+barn+gift+card+wedding' },
          { name: 'Home Depot / Lowe\'s Gift Card', price: '$50–$200', why: 'For couples moving into their first home — practical and immediately useful. Often more appreciated than kitchenware.', searchUrl: 'https://www.amazon.com/s?k=home+depot+gift+card' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good wedding gift?', a: 'The best wedding gifts come from the registry — the couple chose those items intentionally. If you want to go off-registry, personalized keepsakes (custom artwork, engraved items), experience gifts, or contributions to a honeymoon fund are universally well-received.' },
      { q: 'How much should I spend on a wedding gift?', a: 'The general etiquette: $50–$75 for a coworker or casual acquaintance, $75–$150 for a friend, $150–$300+ for a close friend or family member. For a destination wedding where you\'re traveling, it\'s acceptable to spend less on the gift itself.' },
      { q: 'What are unique wedding gift ideas?', a: 'Beyond the registry: a custom illustrated map of where they met or got married, a star map of their wedding night sky, a contribution to a honeymoon experience, a "first year of marriage" date night box, or a donation to their favorite charity in their name.' },
      { q: 'Is it okay to give cash as a wedding gift?', a: 'Absolutely — especially for younger couples or those who have already established their home. A beautifully presented cash gift or contribution to a honeymoon fund is often the most practical and appreciated option. Just present it thoughtfully with a card.' },
    ],
  },
  'baby-shower': {
    title: 'Best Baby Shower Gifts in 2026',
    description: 'The best baby shower gifts for new parents — from nursery essentials to mom care. Practical, thoughtful, and actually used from day one.',
    intro: "Baby shower gifts should pass two tests: will the parents use it in the first month, or will they treasure it forever? Everything else is just clutter. These picks nail both — practical essentials that make new-parent life easier, plus keepsakes they\'ll hold onto.",
    categories: [
      {
        heading: 'Nursery Essentials',
        items: [
          { name: 'White Noise Machine (Hatch Baby Rest)', price: '$60–$100', why: 'The single most recommended baby sleep tool by parents. Doubles as a nightlight and app-controlled.', searchUrl: 'https://www.amazon.com/s?k=hatch+baby+rest+white+noise+machine' },
          { name: 'Baby Monitor (Video)', price: '$80–$200', why: 'A quality video monitor is used every nap and every night for 3+ years. One of the highest-value baby gifts.', searchUrl: 'https://www.amazon.com/s?k=video+baby+monitor' },
          { name: 'Organic Crib Sheet Set', price: '$30–$60', why: 'Burt\'s Bees or Aden + Anais. Soft, breathable, chemical-free. Parents go through these constantly.', searchUrl: 'https://www.amazon.com/s?k=organic+crib+sheet+set+baby' },
          { name: 'Diaper Pail (Dekor or Ubbi)', price: '$40–$70', why: 'The good diaper pails seal in odors completely. Parents who have one can\'t imagine living without it.', searchUrl: 'https://www.amazon.com/s?k=diaper+pail+ubbi+dekor' },
        ],
      },
      {
        heading: 'Feeding & Care',
        items: [
          { name: 'Dr. Brown\'s Bottle Starter Set', price: '$25–$50', why: 'Reduces colic and gas. The bottle brand pediatricians most commonly recommend.', searchUrl: 'https://www.amazon.com/s?k=dr+browns+bottle+starter+set' },
          { name: 'Baby Nail File & Grooming Kit', price: '$15–$30', why: 'New parents are terrified of trimming tiny nails. A quality grooming kit removes the anxiety.', searchUrl: 'https://www.amazon.com/s?k=baby+nail+file+grooming+kit' },
          { name: 'Nursing Pillow (Boppy)', price: '$40–$60', why: 'Essential for breastfeeding and bottle feeding. Also doubles as a tummy time support as they grow.', searchUrl: 'https://www.amazon.com/s?k=boppy+nursing+pillow+baby' },
        ],
      },
      {
        heading: 'Mom Care',
        items: [
          { name: 'Meal Delivery Gift Card (DoorDash or Instacart)', price: '$50–$100', why: 'New parents can\'t cook. A meal delivery gift card may be the single most appreciated baby shower gift of all.', searchUrl: 'https://www.amazon.com/s?k=doordash+gift+card' },
          { name: 'Postpartum Recovery Kit', price: '$40–$80', why: 'Earth Mama or Frida Mom postpartum sets. Something everyone needs but nobody buys themselves. Deeply appreciated.', searchUrl: 'https://www.amazon.com/s?k=postpartum+recovery+kit+new+mom' },
          { name: 'Comfortable Nursing Pajamas Set', price: '$40–$80', why: 'Soft, functional PJs designed for new moms. Used every single night in those early weeks.', searchUrl: 'https://www.amazon.com/s?k=nursing+pajamas+set+new+mom' },
        ],
      },
      {
        heading: 'Keepsakes & Memories',
        items: [
          { name: 'Baby Handprint & Footprint Kit', price: '$20–$40', why: 'A ceramic or ink kit that captures tiny prints forever. One of the most treasured baby gifts of all time.', searchUrl: 'https://www.amazon.com/s?k=baby+handprint+footprint+kit' },
          { name: 'Personalized Baby Blanket', price: '$30–$70', why: 'Custom embroidered with baby\'s name and birth date. A keepsake they\'ll pull out for years.', searchUrl: 'https://www.etsy.com/search?q=personalized+baby+blanket+embroidered+name' },
          { name: 'Baby Memory Book', price: '$20–$45', why: 'A beautifully designed book for first-year milestones. Parents love filling these in and keeping them forever.', searchUrl: 'https://www.amazon.com/s?k=baby+memory+book+first+year' },
        ],
      },
    ],
    faqs: [
      { q: 'What is the most useful baby shower gift?', a: 'The most practically useful baby shower gifts: a white noise machine, a video baby monitor, a diaper pail, and a meal delivery gift card. These get used every day from week one. If in doubt, check the baby registry — the parents chose those items intentionally.' },
      { q: 'How much should I spend on a baby shower gift?', a: 'Typical ranges: $20–$40 for a coworker or acquaintance, $40–$80 for a friend, $80–$150+ for a close friend or family member. Group gifts for big-ticket items (stroller, crib) are always appreciated and appropriate.' },
      { q: 'What are unique baby shower gift ideas?', a: 'Beyond the registry: a meal train gift card, a postpartum recovery kit, a custom family portrait commission, a baby\'s first library (curated board books), or a "year of experiences" (activities for each month of baby\'s first year).' },
      { q: 'What should you NOT give at a baby shower?', a: 'Avoid: clothing only in newborn size (they outgrow it in weeks — buy 3–6 month or 6–12 month), cheap stuffed animals that shed, bath toys (not used for months), and anything with small parts or strong fragrances. Check the registry first and ask if you\'re unsure.' },
    ],
  },
  birthday: {
    title: 'Best Birthday Gifts for Anyone in 2026',
    description: 'The best birthday gift ideas in 2026 — from tech and experiences to pampering and personalized. Something great for everyone on your list.',
    intro: "Birthday gifts have one job: make someone feel genuinely celebrated. The best ones are either something they want but wouldn\'t buy themselves, or an experience that creates a memory. These picks cover every personality type and every budget.",
    categories: [
      {
        heading: 'Tech & Gadgets',
        items: [
          { name: 'Wireless Earbuds (AirPods or Pixel Buds)', price: '$80–$200', why: 'The gift almost nobody already has a perfect pair of. An upgrade they\'ll use every day.', searchUrl: 'https://www.amazon.com/s?k=wireless+earbuds+birthday+gift+2026' },
          { name: 'Kindle Paperwhite', price: '$130–$160', why: 'For the reader who stares at screens all day — a warm-light e-reader is a genuine upgrade. Waterproof too.', searchUrl: 'https://www.amazon.com/s?k=kindle+paperwhite+birthday+gift' },
          { name: 'Portable Power Bank (Anker)', price: '$30–$60', why: 'The gift everyone needs and always forgets to buy. Anker 20,000mAh charges phones 4+ times.', searchUrl: 'https://www.amazon.com/s?k=anker+portable+power+bank' },
          { name: 'Smart Watch (Fitness Tracker)', price: '$100–$400', why: 'Fitbit, Garmin, or Apple Watch. For anyone who wants to be more active or just tell the time without their phone.', searchUrl: 'https://www.amazon.com/s?k=smart+watch+fitness+tracker+birthday+gift' },
        ],
      },
      {
        heading: 'Experiences',
        items: [
          { name: 'Concert or Event Tickets', price: '$50–$300', why: 'An experience beats a thing every time. Find out who they love and grab tickets — it shows real thought.', searchUrl: 'https://www.ticketmaster.com' },
          { name: 'Cooking Class or Tasting Experience', price: '$60–$150', why: 'A shared experience you can do together or give as a solo adventure. Memorable and unique.', searchUrl: 'https://www.amazon.com/s?k=cooking+class+experience+gift+card+birthday' },
          { name: 'Spa Day or Massage Gift Card', price: '$80–$200', why: 'Universal appeal. A spa voucher says "you deserve to be pampered" in the clearest possible way.', searchUrl: 'https://www.spafinder.com' },
        ],
      },
      {
        heading: 'Pampering & Self-Care',
        items: [
          { name: 'Luxury Skincare Set', price: '$40–$150', why: 'A curated set from Tatcha, Drunk Elephant, or Kiehl\'s. The gift that makes them feel genuinely indulgent.', searchUrl: 'https://www.amazon.com/s?k=luxury+skincare+set+birthday+gift' },
          { name: 'Weighted Blanket', price: '$40–$80', why: 'The gift that says "rest more" — and they\'ll actually use it every single evening.', searchUrl: 'https://www.amazon.com/s?k=weighted+blanket+birthday+gift' },
          { name: 'Diffuser + Essential Oil Set', price: '$30–$60', why: 'Aromatherapy that turns any room into a sanctuary. Endlessly giftable and universally loved.', searchUrl: 'https://www.amazon.com/s?k=diffuser+essential+oil+set+gift' },
        ],
      },
      {
        heading: 'Personalized',
        items: [
          { name: 'Custom Star Map Print', price: '$30–$80', why: 'A print of the night sky on their birthday. Deeply personal, beautifully framed. Etsy shops do stunning work.', searchUrl: 'https://www.etsy.com/search?q=custom+star+map+birthday+gift+print' },
          { name: 'Personalized Jewelry', price: '$40–$150', why: 'A necklace or bracelet with their initial, birthstone, or a meaningful date. Never goes out of style.', searchUrl: 'https://www.amazon.com/s?k=personalized+jewelry+birthday+gift' },
          { name: 'Custom Illustrated Portrait', price: '$30–$100', why: 'Commission a digital portrait of them, their pet, or their family. Etsy has talented artists at every price point.', searchUrl: 'https://www.etsy.com/search?q=custom+illustrated+portrait+birthday' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good birthday gift for someone who has everything?', a: 'Focus on experiences (concert tickets, cooking class, spa day) or meaningful consumables (a bottle of their favorite wine, a luxury candle, specialty food). Personalized items also cut through — something with their name or a meaningful date shows genuine thought.' },
      { q: 'What is a good birthday gift for a friend?', a: 'Great friend birthday gifts: something related to a shared memory or inside joke, a book by their favorite author, tickets to something they\'d love, a luxe version of something they use daily (skincare, coffee, candles), or a gift card to their favorite restaurant.' },
      { q: 'How much should I spend on a birthday gift?', a: 'Context matters: $20–$40 for a coworker, $40–$75 for a friend, $75–$150+ for a close friend or partner. The thought and presentation matter as much as the price. A $30 gift wrapped beautifully with a heartfelt note beats a $100 gift in a bag with no card.' },
      { q: 'What are unique birthday gift ideas?', a: 'Unique birthday gifts: a DNA ancestry kit, a custom illustrated family portrait, a subscription box in their hobby (coffee, books, plants), a "day trip" envelope with a planned experience, or a donation to a cause they care about paired with a heartfelt letter.' },
    ],
  },
  christmas: {
    title: 'Best Christmas Gifts in 2026',
    description: 'The best Christmas gift ideas in 2026 — cozy home gifts, tech, kids toys, foodie picks, and stocking stuffers under $20.',
    intro: "Christmas shopping is a sport, and the best players start with a list. Whether you\'re shopping for the tech lover, the homebody, the foodie, or the kid who already has everything — these categories have you covered with gifts people actually want to unwrap.",
    categories: [
      {
        heading: 'Cozy & Home',
        items: [
          { name: 'Sherpa or Fleece Throw Blanket', price: '$30–$70', why: 'The ultimate Christmas gift. Warm, soft, and used every single evening. You can\'t go wrong.', searchUrl: 'https://www.amazon.com/s?k=sherpa+throw+blanket+christmas+gift' },
          { name: 'Luxury Candle Set', price: '$30–$80', why: 'Voluspa, Diptyque, or Yankee Candle. A seasonal scent set feels festive and smells amazing.', searchUrl: 'https://www.amazon.com/s?k=luxury+candle+set+christmas+gift' },
          { name: 'Coffee or Tea Gift Set', price: '$25–$60', why: 'A curated box of specialty coffees or holiday teas. Consumable, delightful, zero shelf-clutter.', searchUrl: 'https://www.amazon.com/s?k=coffee+tea+gift+set+christmas' },
          { name: 'Slippers (Memory Foam)', price: '$25–$60', why: 'Cozy slippers are the dark horse Christmas gift. UGG, Dearfoams, or Minnetonka — all excellent.', searchUrl: 'https://www.amazon.com/s?k=memory+foam+slippers+christmas+gift' },
        ],
      },
      {
        heading: 'Tech Gifts',
        items: [
          { name: 'Amazon Echo (Smart Speaker)', price: '$50–$100', why: 'Alexa-powered everything. Amazon always discounts Echo devices at Christmas — great value.', searchUrl: 'https://www.amazon.com/s?k=amazon+echo+christmas+gift+2026' },
          { name: 'Wireless Charging Pad', price: '$20–$50', why: 'Clean desk, charged phone. Everyone needs one and not everyone has one. Universal utility.', searchUrl: 'https://www.amazon.com/s?k=wireless+charging+pad+christmas+gift' },
          { name: 'Streaming Stick (Fire TV or Roku)', price: '$30–$50', why: 'Instant upgrade for any TV. Perfect for the family member still watching cable.', searchUrl: 'https://www.amazon.com/s?k=fire+tv+stick+roku+christmas+gift' },
        ],
      },
      {
        heading: 'Kids & Toys',
        items: [
          { name: 'LEGO Set (Age-Appropriate)', price: '$30–$120', why: 'The classic Christmas gift that never fails. LEGO has sets for every age, interest, and budget.', searchUrl: 'https://www.amazon.com/s?k=lego+set+christmas+gift+kids' },
          { name: 'Nintendo Switch Game', price: '$30–$60', why: 'If they have a Switch, a new game is the perfect Christmas addition. Check their wishlist or ask a parent.', searchUrl: 'https://www.amazon.com/s?k=nintendo+switch+game+christmas' },
          { name: 'Arts & Crafts Activity Kit', price: '$20–$50', why: 'A Christmas break must-have. Kids\' kits for painting, slime, science experiments, or jewelry making.', searchUrl: 'https://www.amazon.com/s?k=kids+arts+crafts+kit+christmas+gift' },
        ],
      },
      {
        heading: 'Stocking Stuffers (Under $20)',
        items: [
          { name: 'Chapstick or Lip Balm Set', price: '$5–$15', why: 'Winter lips need moisture. A quality set from EOS or Burt\'s Bees is small, useful, and loved.', searchUrl: 'https://www.amazon.com/s?k=lip+balm+set+stocking+stuffer' },
          { name: 'Mini Hand Cream Set', price: '$10–$20', why: 'L\'Occitane or The Body Shop minis. Travel-size luxury that\'s perfect stocking filler.', searchUrl: 'https://www.amazon.com/s?k=mini+hand+cream+set+stocking+stuffer' },
          { name: 'Playing Cards (Premium)', price: '$10–$20', why: 'A deck of quality playing cards with interesting design. Bicycle, Theory11, or Cartamundi.', searchUrl: 'https://www.amazon.com/s?k=premium+playing+cards+stocking+stuffer' },
          { name: 'Scratch-Off Lottery Tickets Bundle', price: '$10–$20', why: 'The stocking stuffer that always gets a reaction. Wrap a small bundle for instant Christmas excitement.', searchUrl: 'https://www.amazon.com/s?k=scratch+off+lottery+ticket+holder+stocking' },
        ],
      },
    ],
    faqs: [
      { q: 'What are the most popular Christmas gifts in 2026?', a: 'Top Christmas gifts in 2026: LEGO sets, wireless earbuds, smart home devices (Echo, smart plugs), cozy throw blankets, skincare gift sets, Kindles, and Nintendo Switch games. The safest bets are consumables (candles, food) and practical tech upgrades.' },
      { q: 'What is a good Christmas gift for someone who has everything?', a: 'For the person who has everything: experiences (spa day, cooking class, event tickets), high-quality consumables (luxury candle, specialty coffee, artisan chocolate), or personalized items they wouldn\'t buy themselves. Avoid generic decorative items — they have enough.' },
      { q: 'How early should you start Christmas shopping?', a: 'The earlier the better, but realistically: start by October to avoid December shipping delays and sold-out stock. Black Friday and Cyber Monday (late November) offer genuine discounts on tech, appliances, and popular gifts. Many items ship free in December but cut-off dates vary.' },
      { q: 'What are good last-minute Christmas gifts?', a: 'Last-minute Christmas gifts: a gift card to their favorite restaurant or store (digital delivery in minutes), an Audible or Amazon subscription, a streaming service gift, a PayPal or Venmo payment with a note about what it\'s for, or downloadable experiences like online classes.' },
    ],
  },
  'valentines-day': {
    title: "Best Valentine's Day Gifts in 2026",
    description: "The best Valentine's Day gift ideas in 2026 — romantic, personalized, and thoughtful. For partners, new relationships, and everyone in between.",
    intro: "Valentine\'s Day gifts don\'t have to be extravagant — they have to feel intentional. The best ones show you were paying attention: to what they love, what they\'ve mentioned, what would make them smile. These picks range from deeply romantic to lighthearted, covering every type of relationship.",
    categories: [
      {
        heading: 'Romantic',
        items: [
          { name: 'Weekend Getaway or Hotel Stay', price: '$150–$500', why: 'An overnight trip together beats any physical gift. Pick a place they\'ve mentioned wanting to visit.', searchUrl: 'https://www.airbnb.com' },
          { name: 'Spa Day for Two', price: '$100–$300', why: 'A couples\' massage or spa package. Relaxing, indulgent, and something you do together.', searchUrl: 'https://www.spafinder.com' },
          { name: 'Personalized Love Letter Book', price: '$30–$80', why: 'A custom book where every page has a reason you love them. Etsy sellers make stunning keepsake versions.', searchUrl: 'https://www.etsy.com/search?q=personalized+love+letter+book+valentines' },
          { name: 'Fine Dining Experience', price: '$80–$200', why: 'A reservation at a restaurant they\'ve been wanting to try. Wrap the confirmation in a card — the anticipation is half the gift.', searchUrl: 'https://www.opentable.com' },
        ],
      },
      {
        heading: 'Jewelry & Accessories',
        items: [
          { name: 'Personalized Initial Necklace', price: '$40–$150', why: 'Their initial or a meaningful date on a delicate chain. Classic, wearable, and genuinely appreciated.', searchUrl: 'https://www.etsy.com/search?q=personalized+initial+necklace+valentines+gift' },
          { name: 'Birthstone Ring or Bracelet', price: '$50–$200', why: 'A piece of jewelry with their birthstone. Personal, wearable, and something they\'d treasure.', searchUrl: 'https://www.amazon.com/s?k=birthstone+ring+bracelet+valentines+gift' },
          { name: 'Custom Coordinates Bracelet', price: '$30–$80', why: 'A bracelet engraved with the coordinates of where you met, got engaged, or a place that means something to you both.', searchUrl: 'https://www.etsy.com/search?q=custom+coordinates+bracelet+valentines' },
        ],
      },
      {
        heading: 'Pampering',
        items: [
          { name: 'Luxury Bath & Body Set', price: '$40–$100', why: 'Jo Malone, Aesop, or L\'Occitane. An indulgent set they\'d never justify buying themselves.', searchUrl: 'https://www.amazon.com/s?k=luxury+bath+body+gift+set+valentines' },
          { name: 'Silk Robe or Pajamas', price: '$50–$150', why: 'Soft, sensual, and practical. A gift they\'ll wear and think of you every time.', searchUrl: 'https://www.amazon.com/s?k=silk+robe+pajamas+valentines+gift' },
          { name: 'Perfume or Cologne (Their Signature Scent)', price: '$60–$150', why: 'If you know their signature scent, a full-size bottle is a deeply personal and romantic gift.', searchUrl: 'https://www.amazon.com/s?k=perfume+cologne+valentines+day+gift' },
        ],
      },
      {
        heading: 'Funny & Lighthearted',
        items: [
          { name: 'Custom Caricature Portrait', price: '$30–$80', why: 'A fun illustrated portrait of you both. Etsy artists do amazing work — great for couples with a sense of humor.', searchUrl: 'https://www.etsy.com/search?q=custom+caricature+portrait+couple+funny' },
          { name: 'Couples Game Night Box', price: '$25–$50', why: 'A curated set of games for two: Fog of Love, Codenames Duet, or a card game designed for couples.', searchUrl: 'https://www.amazon.com/s?k=couples+game+night+set+valentines' },
          { name: '"Why I Love You" Scratch Card', price: '$15–$30', why: 'Scratch off panels to reveal reasons. Sweet, interactive, and weirdly fun to give and receive.', searchUrl: 'https://www.amazon.com/s?k=why+i+love+you+scratch+card+valentines' },
        ],
      },
    ],
    faqs: [
      { q: "What is a good Valentine's Day gift for a girlfriend?", a: "For a girlfriend: personalized jewelry (initial necklace, birthstone ring), a luxury bath and body set, concert tickets to a show she wants to see, a spa day voucher, a romantic dinner reservation, or a custom illustrated portrait of you both. The most romantic gifts show you were paying attention to her interests." },
      { q: "What is a good Valentine's Day gift for a boyfriend?", a: "For a boyfriend: a new experience together (cooking class, escape room, sport or activity he loves), a quality leather wallet or accessory, tickets to a game or concert, a personalized item (engraved watch, coordinates bracelet), or a night-in package (his favorite snacks, a game, a comfort movie)." },
      { q: "How much should I spend on a Valentine's Day gift?", a: "There\'s no fixed rule. For new relationships: $20–$50 is appropriate. For established relationships: $50–$150 is common. For long-term partners or spouses: $100–$300+. Experiences (dinner, overnight trip) often feel more generous than a physical gift at the same price." },
      { q: "What are good Valentine's Day gifts for him?", a: "Great Valentine\'s Day gifts for men: a quality leather wallet, a personalized whiskey glass set, tickets to a sporting event or concert, a grooming kit upgrade, a cooking class for two, a custom map print of a place meaningful to your relationship, or a weekend trip to a destination he\'s mentioned." },
    ],
  },
  'mothers-day': {
    title: "Best Mother's Day Gifts in 2026",
    description: "Find the perfect Mother's Day gift — from relaxation and jewelry to experiences and kitchen upgrades. Thoughtful gift ideas for every mom.",
    intro: "Mother\'s Day has one rule: make her feel seen, not just appreciated in a generic way. The gifts that land are the ones that reflect her actual interests — not a mug that says \'World\'s Best Mom.\' These picks are organized by what she actually loves.",
    categories: [
      {
        heading: 'Relaxation & Wellness',
        items: [
          { name: 'Spa Day Gift Card (SpaFinder)', price: '$80–$200', why: 'A day entirely for her. SpaFinder works at thousands of spas nationwide — she picks when and where.', searchUrl: 'https://www.spafinder.com' },
          { name: 'Weighted Blanket', price: '$40–$80', why: 'The gift that says "rest more." Used every evening on the couch or in bed. Genuinely life-improving.', searchUrl: 'https://www.amazon.com/s?k=weighted+blanket+mothers+day+gift' },
          { name: 'Luxury Skincare Set (Tatcha or Kiehl\'s)', price: '$50–$150', why: 'A curated set she\'d never splurge on herself. Elegant packaging, real results.', searchUrl: 'https://www.amazon.com/s?k=luxury+skincare+gift+set+mothers+day' },
          { name: 'Aromatherapy Diffuser + Essential Oils', price: '$30–$70', why: 'Creates a spa-like atmosphere at home. The gift that keeps giving every time she uses it.', searchUrl: 'https://www.amazon.com/s?k=aromatherapy+diffuser+essential+oils+mothers+day' },
        ],
      },
      {
        heading: 'Jewelry',
        items: [
          { name: "Children's Birthstone Necklace", price: '$50–$200', why: "A necklace featuring her children's birthstones. One of the most consistently loved Mother's Day gifts of all time.", searchUrl: 'https://www.etsy.com/search?q=childrens+birthstone+necklace+mothers+day' },
          { name: 'Personalized Name Bracelet', price: '$40–$120', why: "A delicate bracelet with her children's names or initials. She'll wear it every day.", searchUrl: 'https://www.etsy.com/search?q=personalized+name+bracelet+mothers+day' },
          { name: 'Locket Necklace (Photo Inside)', price: '$40–$150', why: 'A locket with photos of her kids or family inside. Sentimental, classic, and genuinely treasured.', searchUrl: 'https://www.amazon.com/s?k=locket+necklace+photo+mothers+day+gift' },
        ],
      },
      {
        heading: 'Experiences',
        items: [
          { name: 'Cooking or Baking Class', price: '$60–$150', why: 'Something to do, not just to have. Great for the mom who loves food and wants a fun outing.', searchUrl: 'https://www.amazon.com/s?k=cooking+class+gift+card+mothers+day' },
          { name: 'Afternoon Tea Experience', price: '$40–$100', why: 'A classic, elegant Mother\'s Day treat. Book a local hotel or tea room for a refined outing.', searchUrl: 'https://www.amazon.com/s?k=afternoon+tea+experience+gift+card' },
          { name: 'Concert or Theatre Tickets', price: '$50–$200', why: 'Find out who she loves and get tickets. A shared experience is the most memorable Mother\'s Day gift.', searchUrl: 'https://www.ticketmaster.com' },
        ],
      },
      {
        heading: 'Kitchen & Home',
        items: [
          { name: 'Nespresso or Keurig Machine', price: '$80–$180', why: 'Morning coffee elevated. If she doesn\'t have one, this is the gift that improves her every single morning.', searchUrl: 'https://www.amazon.com/s?k=nespresso+keurig+machine+mothers+day' },
          { name: 'Silk Pillowcase Set', price: '$30–$60', why: 'Better sleep and better hair — a rare double win. She\'ll notice the difference immediately.', searchUrl: 'https://www.amazon.com/s?k=silk+pillowcase+set+mothers+day' },
          { name: 'Custom Family Portrait', price: '$50–$200', why: 'Commission a digital or painted portrait of the family. Etsy artists do stunning work at every price point.', searchUrl: 'https://www.etsy.com/search?q=custom+family+portrait+mothers+day' },
        ],
      },
    ],
    faqs: [
      { q: "What is the best Mother's Day gift?", a: "The best Mother's Day gifts are personal and reflect her actual interests. A spa day, jewelry with her children's birthstones, a cooking class, or a beautiful personalized keepsake all outperform generic options. Ask her siblings or your own siblings for ideas if you're stuck — insider knowledge beats guessing." },
      { q: "What to get mom for Mother's Day when she says she doesn't want anything?", a: "When she says she doesn't want anything, she means she doesn't want you to stress about it — but she'd still love to feel celebrated. A homemade voucher for a day of her choosing (you plan it), a favorite meal cooked for her, or a heartfelt letter alongside a small meaningful gift usually hits perfectly." },
      { q: "What are good Mother's Day gifts from kids?", a: "From younger kids: a handmade card with a drawing, a coupon book for chores, a photo mug or photo book with their pictures, or a painted flower pot with a planted flower. From older kids/adults: experiences (dinner out, spa), jewelry, a framed family photo, or a subscription to something she loves." },
      { q: "How much should I spend on a Mother's Day gift?", a: "There's no set rule. Many people spend $30–$75 on a thoughtful gift. Experiences (spa day, dinner out) in the $50–$150 range often feel more generous than a physical item at the same price. What matters most is that it feels personal — a $20 gift chosen with genuine thought beats a $100 generic set." },
    ],
  },
  'fathers-day': {
    title: "Best Father's Day Gifts in 2026",
    description: "The best Father's Day gift ideas in 2026 — from tech and grilling gear to sports, grooming, and personalized gifts for every dad.",
    intro: "Dad says he doesn\'t need anything. The trick is finding the thing he\'d buy himself if he ever actually did that. These picks are organized by what kind of dad he is — because a grilling enthusiast and a tech dad need very different gifts.",
    categories: [
      {
        heading: 'Tech & Gadgets',
        items: [
          { name: 'Smart Watch (Garmin or Apple Watch)', price: '$150–$400', why: 'A fitness and health tracker that also tells the time. Dads who exercise love Garmin; iPhone users love Apple Watch.', searchUrl: 'https://www.amazon.com/s?k=garmin+apple+watch+fathers+day+gift' },
          { name: 'Portable Bluetooth Speaker', price: '$50–$150', why: 'For the garage, backyard, or camping. JBL Flip or Bose SoundLink — both excellent options.', searchUrl: 'https://www.amazon.com/s?k=portable+bluetooth+speaker+fathers+day' },
          { name: 'Action Camera (GoPro)', price: '$150–$400', why: 'For the active dad who bikes, skis, kayaks, or just wants to capture family adventures in a new way.', searchUrl: 'https://www.amazon.com/s?k=gopro+action+camera+fathers+day' },
          { name: 'E-Reader (Kindle)', price: '$130–$160', why: 'For the dad who reads. A Paperwhite is portable, backlit, and holds a thousand books.', searchUrl: 'https://www.amazon.com/s?k=kindle+paperwhite+fathers+day+gift' },
        ],
      },
      {
        heading: 'Grilling & Outdoors',
        items: [
          { name: 'Premium Grilling Tool Set', price: '$40–$100', why: 'A quality stainless steel set with everything he needs. Great for the dad who grills year-round.', searchUrl: 'https://www.amazon.com/s?k=premium+grilling+tool+set+fathers+day' },
          { name: 'Instant-Read Meat Thermometer (Thermapen)', price: '$40–$100', why: 'Perfect steaks, perfect chicken, every time. Every serious griller needs one and will immediately use it.', searchUrl: 'https://www.amazon.com/s?k=thermapen+meat+thermometer+fathers+day' },
          { name: 'Traeger or Weber Grill Accessories', price: '$30–$80', why: 'If he already has a grill, premium accessories (smoking chips, cedar planks, grill mats) are always appreciated.', searchUrl: 'https://www.amazon.com/s?k=traeger+weber+grill+accessories+fathers+day' },
        ],
      },
      {
        heading: 'Grooming & Self-Care',
        items: [
          { name: 'Premium Grooming Kit (Braun or Philips)', price: '$50–$150', why: 'An electric trimmer or grooming set upgrade. The kind he wouldn\'t buy himself but uses every day.', searchUrl: 'https://www.amazon.com/s?k=premium+grooming+kit+men+fathers+day' },
          { name: 'Luxury Shave Set (Art of Shaving)', price: '$40–$100', why: 'A quality shave cream, brush, and aftershave set. Transforms a chore into a ritual.', searchUrl: 'https://www.amazon.com/s?k=luxury+shave+set+art+of+shaving+fathers+day' },
          { name: 'Skincare Starter Kit for Men', price: '$30–$80', why: 'Kiehl\'s or Lumin for Men. Most dads use the same bar of soap for everything. This is the nudge they need.', searchUrl: 'https://www.amazon.com/s?k=mens+skincare+starter+kit+fathers+day' },
        ],
      },
      {
        heading: 'Personalized',
        items: [
          { name: 'Custom Engraved Whiskey Glass Set', price: '$30–$80', why: 'His name or a meaningful date engraved on quality rocks glasses. One of the most consistently loved dad gifts.', searchUrl: 'https://www.amazon.com/s?k=custom+engraved+whiskey+glass+set+fathers+day' },
          { name: 'Personalized Leather Wallet', price: '$30–$80', why: 'A slim wallet with his initials embossed. Something he uses every day with a personal touch.', searchUrl: 'https://www.amazon.com/s?k=personalized+leather+wallet+fathers+day' },
          { name: 'Custom Family Portrait or Photo Book', price: '$30–$80', why: 'A photo book of the family\'s year or a custom illustrated family portrait. Dads love these more than they let on.', searchUrl: 'https://www.shutterfly.com' },
        ],
      },
    ],
    faqs: [
      { q: "What is the best Father's Day gift?", a: "The best Father's Day gifts match his actual hobbies: a Thermapen for the griller, tech accessories for the gadget dad, grooming upgrades for the man who uses the same shampoo for 10 years, or experiences (golf round, baseball game, fishing trip) for the dad who prefers doing over having." },
      { q: "What to get your dad for Father's Day when he has everything?", a: "When he has everything: focus on experiences (a round of golf at a course he's been eyeing, tickets to a game, a day trip), personalized items (engraved whiskey glasses, custom photo book), or a premium version of something he uses daily (upgraded grooming kit, quality leather wallet)." },
      { q: "What are good Father's Day gifts from kids?", a: "From young kids: a handmade coupon book, a custom painted portrait (help them draw dad), a photo mug with their pictures, or a planted herb they grew together. From older kids/adults: experiences (game tickets, dinner out), personalized gifts, or contributing toward a bigger purchase he's been wanting." },
      { q: "How much should I spend on a Father's Day gift?", a: "Typical spending: $30–$75 for a practical or personalized gift, $75–$150 for a quality tech or grooming upgrade, $150+ for an experience or premium item. The most appreciated Father's Day gifts combine thoughtfulness with practicality — something he'll use, not just display." },
    ],
  },
  graduation: {
    title: 'Best Graduation Gifts in 2026',
    description: 'The best graduation gift ideas in 2026 — practical career launches, experiences, and meaningful gifts for high school and college grads.',
    intro: "Graduation gifts should meet the graduate where they\'re going — not where they\'ve been. A high school grad heading to college needs different things than a college grad entering the workforce. These picks are organized around what actually helps them launch the next chapter.",
    categories: [
      {
        heading: 'Career Launch Essentials',
        items: [
          { name: 'Quality Laptop Bag or Backpack', price: '$50–$150', why: 'For the office, commute, or campus. A durable, professional bag that handles a laptop and essentials.', searchUrl: 'https://www.amazon.com/s?k=quality+laptop+bag+graduation+gift' },
          { name: 'Business Card Holder + Portfolio', price: '$30–$80', why: 'For the grad entering the professional world. A sleek portfolio for interviews and first days.', searchUrl: 'https://www.amazon.com/s?k=business+card+holder+portfolio+graduation+gift' },
          { name: 'Noise-Cancelling Headphones', price: '$100–$350', why: 'Sony WH-1000XM5 or AirPods Pro. For deep work, commutes, and open offices. One of the most impactful gifts for any grad.', searchUrl: 'https://www.amazon.com/s?k=noise+cancelling+headphones+graduation+gift' },
          { name: 'Digital Planner + Productivity Bundle', price: '$30–$80', why: 'A quality paper planner plus productivity apps subscription. For the grad who needs to get organized.', searchUrl: 'https://www.amazon.com/s?k=digital+planner+productivity+gift+graduation' },
        ],
      },
      {
        heading: 'Experiences',
        items: [
          { name: 'Travel Gift Card (Airbnb or Booking.com)', price: '$100–$300', why: 'For the grad who wants to explore before the real world kicks in. A travel fund gift card is the ultimate adventure starter.', searchUrl: 'https://www.amazon.com/s?k=airbnb+gift+card+graduation+travel' },
          { name: 'Cooking Class or Skills Workshop', price: '$60–$150', why: 'A practical life skill packaged as a fun experience. Perfect for grads moving out for the first time.', searchUrl: 'https://www.amazon.com/s?k=cooking+class+gift+card+graduation' },
          { name: 'Concert, Festival, or Event Tickets', price: '$50–$200', why: 'A celebration experience for right now. Pick something they\'ve been wanting to see.', searchUrl: 'https://www.ticketmaster.com' },
        ],
      },
      {
        heading: 'Financial Head Start',
        items: [
          { name: 'Personal Finance Book (The Psychology of Money)', price: '$15–$25', why: 'Morgan Housel\'s book is the most accessible and impactful money book for young adults. Pair it with a Roth IRA contribution.', searchUrl: 'https://www.amazon.com/s?k=psychology+of+money+graduation+gift' },
          { name: 'Quality Leather Wallet (Slim)', price: '$30–$80', why: 'A slim, professional wallet that handles cards and cash cleanly. The right wallet signals you\'re entering the adult world.', searchUrl: 'https://www.amazon.com/s?k=slim+leather+wallet+graduation+gift' },
          { name: 'Cash or Gift Card to Build an Emergency Fund', price: '$50–$500', why: 'The most practical graduation gift of all. Cash toward an emergency fund or a head start on their first paycheck goes further than any object.', searchUrl: 'https://www.amazon.com/s?k=amazon+gift+card+graduation' },
        ],
      },
      {
        heading: 'Celebration & Personalized',
        items: [
          { name: 'Custom Graduation Jewelry (Name or Year)', price: '$40–$120', why: 'A necklace or bracelet engraved with their graduation year or name. A wearable memento they\'ll keep.', searchUrl: 'https://www.etsy.com/search?q=custom+graduation+jewelry+personalized' },
          { name: 'Personalized Graduation Photo Book', price: '$30–$70', why: 'A photo book of their school years — from the first day to the last. Parents and grads both love this gift.', searchUrl: 'https://www.shutterfly.com' },
          { name: 'Engraved Pen Set', price: '$20–$60', why: 'An engraved quality pen with their name or a message. Sounds cliché — actually used constantly and appreciated.', searchUrl: 'https://www.amazon.com/s?k=engraved+pen+set+graduation+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good high school graduation gift?', a: 'For high school grads: cash (always wins), noise-cancelling headphones, a quality backpack or laptop bag, a dorm essentials package, a travel gift card, or a personalized keepsake from their school years. Most high school grads are heading to college — practical life-launch gifts are the most appreciated.' },
      { q: 'What is a good college graduation gift?', a: 'For college grads entering the workforce: noise-cancelling headphones, a quality laptop bag or portfolio, a slim leather wallet, a personal finance book, a skills course subscription (LinkedIn Learning, MasterClass), or cash toward their first apartment or emergency fund.' },
      { q: 'How much should I spend on a graduation gift?', a: 'From a family friend or relative: $25–$75 is appropriate. From immediate family: $75–$200 is common. From parents: often $200–$500+, or contributing toward a meaningful life-launch purchase. Cash is always deeply appreciated and never wrong for a grad.' },
      { q: 'What are unique graduation gift ideas?', a: 'Unique graduation gifts: a custom illustrated map of their college campus, a subscription to a skill-building platform (MasterClass, Coursera), a letter from a mentor or parent they can open "when you need it," a contribution toward their Roth IRA, or tickets to an experience they\'ve always wanted to try.' },
    ],
  },
  housewarming: {
    title: 'Best Housewarming Gifts in 2026',
    description: 'The best housewarming gift ideas in 2026 — from kitchen essentials and home decor to smart home upgrades and outdoor entertaining.',
    intro: "Housewarming gifts should feel like a contribution to a home, not more stuff to find room for. The best ones are either beautiful (they\'ll display it), useful (they\'ll use it daily), or both. These picks help a new homeowner or renter feel settled from day one.",
    categories: [
      {
        heading: 'Kitchen Essentials',
        items: [
          { name: 'Cast Iron Skillet (Lodge)', price: '$30–$60', why: 'Indestructible, improves with age, works on every heat source. The forever kitchen gift that new homeowners love.', searchUrl: 'https://www.amazon.com/s?k=lodge+cast+iron+skillet+housewarming+gift' },
          { name: 'Quality Cutting Board (End-Grain)', price: '$40–$100', why: 'A beautiful end-grain wood cutting board is both a kitchen workhorse and a countertop centerpiece.', searchUrl: 'https://www.amazon.com/s?k=end+grain+cutting+board+housewarming+gift' },
          { name: 'French Press or Pour-Over Coffee Set', price: '$25–$60', why: 'A simple coffee ritual for the new home. Chemex or a quality French press makes the first morning special.', searchUrl: 'https://www.amazon.com/s?k=french+press+pour+over+coffee+housewarming' },
          { name: 'Herb Garden Starter Kit', price: '$25–$50', why: 'Fresh basil, thyme, and rosemary in their new kitchen window. A living, growing gift that keeps giving.', searchUrl: 'https://www.amazon.com/s?k=herb+garden+starter+kit+housewarming+gift' },
        ],
      },
      {
        heading: 'Home Decor',
        items: [
          { name: 'Luxury Candle (Diptyque or Voluspa)', price: '$30–$80', why: 'A beautifully scented candle that makes a new space feel instantly like home. Classic and always right.', searchUrl: 'https://www.amazon.com/s?k=luxury+candle+housewarming+gift+diptyque' },
          { name: 'Quality Throw Blanket', price: '$40–$80', why: 'A soft, beautiful throw for the couch. Adds warmth and texture to any living space immediately.', searchUrl: 'https://www.amazon.com/s?k=quality+throw+blanket+housewarming+gift' },
          { name: 'Framed Art Print', price: '$30–$100', why: 'A beautiful print for their wall. Society6 and Minted have excellent options at every price point and style.', searchUrl: 'https://www.amazon.com/s?k=framed+art+print+housewarming+gift' },
        ],
      },
      {
        heading: 'Organization & Smart Home',
        items: [
          { name: 'Smart Plug Set (Kasa or TP-Link)', price: '$25–$50', why: 'Instantly makes any lamp or appliance app-controlled. The gateway drug to smart home living.', searchUrl: 'https://www.amazon.com/s?k=smart+plug+set+housewarming+gift' },
          { name: 'Over-the-Door Organizer Kit', price: '$20–$50', why: 'Pantry, closet, or bathroom organization that uses vertical space. Practical and immediately useful.', searchUrl: 'https://www.amazon.com/s?k=over+door+organizer+housewarming+gift' },
          { name: 'Label Maker (DYMO)', price: '$25–$50', why: 'Every organized home starts with a label maker. DYMO LabelManager is the go-to for pantry and office organization.', searchUrl: 'https://www.amazon.com/s?k=dymo+label+maker+housewarming+gift' },
        ],
      },
      {
        heading: 'Outdoor & Entertaining',
        items: [
          { name: 'Charcuterie Board Set', price: '$40–$100', why: 'A beautiful marble or wood board with serving accessories. Perfect for new homeowners who love to entertain.', searchUrl: 'https://www.amazon.com/s?k=charcuterie+board+set+housewarming+gift' },
          { name: 'String Lights (Outdoor Patio)', price: '$20–$50', why: 'Instant ambiance for any patio, balcony, or backyard. One of the most universally loved outdoor home additions.', searchUrl: 'https://www.amazon.com/s?k=outdoor+string+lights+patio+housewarming+gift' },
          { name: 'Cocktail or Mocktail Kit', price: '$30–$70', why: 'A curated set of cocktail tools, mixers, and a recipe card. Makes the first housewarming party feel like a real occasion.', searchUrl: 'https://www.amazon.com/s?k=cocktail+mocktail+kit+housewarming+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good housewarming gift?', a: 'The best housewarming gifts are things people need but don\'t prioritize buying for themselves: a quality cast iron skillet, a luxury candle, a throw blanket, a beautiful cutting board, or a set of smart plugs. Avoid overly personal decor items — stick to universally useful or neutral-aesthetic pieces.' },
      { q: 'How much should I spend on a housewarming gift?', a: 'Typical spending: $20–$50 for a coworker or acquaintance, $50–$100 for a friend, $100–$200+ for a close friend or family member. Group gifts are common for big-ticket items (a KitchenAid, a Roomba, a nice outdoor set). There\'s no strict etiquette — give what feels right for the relationship.' },
      { q: 'What should you NOT give as a housewarming gift?', a: 'Avoid: live plants that need specific care (unless you know their green-thumb level), overly personal decor that may not match their style, breakable items that are hard to display, and anything requiring major assembly. Also skip wine if you\'re unsure whether they drink.' },
      { q: 'What is a good housewarming gift for a first apartment?', a: 'For a first apartment: a quality cast iron skillet, an herb garden starter kit, a French press, a cozy throw blanket, a label maker, or a practical tool kit. First-apartment dwellers need basics more than luxuries — practical gifts that fill gaps in their kitchen and home are the most appreciated.' },
    ],
  },
  anniversary: {
    title: 'Best Anniversary Gifts in 2026',
    description: 'The best anniversary gift ideas in 2026 — from personalized keepsakes and experiences to traditional year-specific gifts and romantic getaways.',
    intro: "Anniversary gifts should feel as significant as the milestone they\'re marking. The most memorable ones are either deeply personal (something that reflects your shared history) or an experience that creates a new memory together. These picks cover every anniversary stage — from the first year to the fiftieth.",
    categories: [
      {
        heading: 'Personalized & Sentimental',
        items: [
          { name: 'Custom Wedding Vows Art Print', price: '$40–$120', why: 'Your actual vows beautifully typeset and framed. Etsy sellers do stunning calligraphy versions. A gift they\'ll hang forever.', searchUrl: 'https://www.etsy.com/search?q=custom+wedding+vows+art+print+anniversary' },
          { name: 'Custom Map of Where You Met', price: '$30–$80', why: 'A framed map of the city, neighborhood, or exact location where your relationship began. Deeply personal.', searchUrl: 'https://www.etsy.com/search?q=custom+map+print+where+we+met+anniversary' },
          { name: 'Photo Book of Your Years Together', price: '$30–$80', why: 'A beautifully curated photo book of your relationship. Shutterfly or Artifact Uprising do excellent work.', searchUrl: 'https://www.shutterfly.com' },
          { name: 'Star Map of Your Wedding Night', price: '$30–$80', why: 'The exact night sky from your wedding location and date. A romantic, unique keepsake.', searchUrl: 'https://www.etsy.com/search?q=star+map+wedding+night+anniversary+print' },
        ],
      },
      {
        heading: 'Experiences',
        items: [
          { name: 'Weekend Getaway (Return to First Date Location)', price: '$200–$600', why: 'Return to where you had your first date, got engaged, or spent your honeymoon. The experience + the memory is unbeatable.', searchUrl: 'https://www.airbnb.com' },
          { name: 'Couples\' Cooking Class', price: '$80–$200', why: 'A fun shared experience that results in a delicious meal. Book through a local culinary school or Sur La Table.', searchUrl: 'https://www.amazon.com/s?k=couples+cooking+class+experience+gift' },
          { name: 'Spa Day for Two', price: '$100–$300', why: 'A couples\' massage or spa package. Relaxing, indulgent, and a genuine treat for both of you.', searchUrl: 'https://www.spafinder.com' },
        ],
      },
      {
        heading: 'Jewelry & Accessories',
        items: [
          { name: 'Eternity Band or Anniversary Ring', price: '$100–$500', why: 'A diamond or gemstone eternity band. The traditional jewelry milestone gift for 5th, 10th, or 25th anniversaries.', searchUrl: 'https://www.amazon.com/s?k=eternity+band+anniversary+ring+gift' },
          { name: 'Personalized Couple\'s Watch Set', price: '$100–$400', why: 'Matching or complementary watches engraved with your anniversary date. Wearable daily reminders of each other.', searchUrl: 'https://www.amazon.com/s?k=personalized+couples+watch+anniversary+gift' },
          { name: 'Coordinates Bracelet (Where You Got Married)', price: '$30–$80', why: 'The exact GPS coordinates of your ceremony location engraved on a bracelet. Small, meaningful, and wearable.', searchUrl: 'https://www.etsy.com/search?q=coordinates+bracelet+wedding+anniversary' },
        ],
      },
      {
        heading: 'Year-Specific Gifts (Traditional)',
        items: [
          { name: '1st Anniversary — Paper Gift (Custom Book or Art Print)', price: '$30–$100', why: 'The traditional 1st anniversary gift is paper. A custom art print, a personalized book, or handwritten letters in a beautiful journal.', searchUrl: 'https://www.etsy.com/search?q=paper+gift+1st+anniversary' },
          { name: '5th Anniversary — Wood Gift (Engraved Keepsake Box)', price: '$40–$120', why: 'The 5th is wood. An engraved wooden keepsake box, a personalized cutting board, or a custom wooden wall art piece.', searchUrl: 'https://www.etsy.com/search?q=wood+gift+5th+anniversary+engraved' },
          { name: '10th Anniversary — Tin or Aluminum Gift (Personalized)', price: '$30–$80', why: 'The 10th is tin/aluminum. A personalized aluminum print of your wedding photo or a custom stamped piece of jewelry.', searchUrl: 'https://www.etsy.com/search?q=tin+aluminum+10th+anniversary+personalized' },
          { name: '25th Anniversary — Silver Gift', price: '$80–$300', why: 'The silver anniversary. Sterling silver jewelry, engraved silver frames, or a beautiful silver keepsake box.', searchUrl: 'https://www.amazon.com/s?k=silver+25th+anniversary+gift+personalized' },
        ],
      },
    ],
    faqs: [
      { q: 'What is a good anniversary gift for her?', a: 'For her: personalized jewelry (eternity band, coordinates bracelet, initial necklace), a custom map or star map print of a significant moment, a weekend getaway, a spa day, or a photo book of your years together. The most treasured anniversary gifts are personal and reflect your shared history.' },
      { q: 'What is a good anniversary gift for him?', a: 'For him: a personalized leather wallet or watch engraved with your anniversary date, a weekend trip to somewhere he\'s mentioned, tickets to a sporting event or concert, a custom photo book, engraved whiskey glasses, or a couples\' experience you do together.' },
      { q: 'What are traditional anniversary gifts by year?', a: '1st = Paper, 2nd = Cotton, 3rd = Leather, 4th = Fruit/Flowers, 5th = Wood, 6th = Candy/Iron, 7th = Wool/Copper, 8th = Bronze/Pottery, 9th = Pottery/Willow, 10th = Tin/Aluminum, 15th = Crystal, 20th = China, 25th = Silver, 30th = Pearl, 40th = Ruby, 50th = Gold.' },
      { q: 'What is a good 1st anniversary gift?', a: 'The traditional 1st anniversary gift is paper. Great options: a custom art print of your wedding vows, a photo book of your first year together, a personalized watercolor of your home or wedding venue, a handwritten letter collection in a beautiful book, or a journal documenting your first year of marriage.' },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(GUIDES).map((person) => ({ person }))
}

export async function generateMetadata({ params }: { params: Promise<{ person: string }> }): Promise<Metadata> {
  const { person } = await params
  const guide = GUIDES[person]
  if (!guide) return { title: 'Not Found' }

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `https://wishlistcart.com/gift-ideas/for/${person}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://wishlistcart.com/gift-ideas/for/${person}`,
      type: 'article',
    },
  }
}

export default async function GiftGuidePage({ params }: { params: Promise<{ person: string }> }) {
  const { person } = await params
  const guide = GUIDES[person]
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
          <span className="text-foreground capitalize">For {person}</span>
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
            Save any of these items to a WishlistCart wishlist and share it with the people who want to buy you a gift.
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
          <h2 className="font-semibold text-foreground mb-4">More gift guides</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(GUIDES)
              .filter((p) => p !== person)
              .map((p) => (
                <Link
                  key={p}
                  href={`/gift-ideas/for/${p}`}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors capitalize"
                >
                  Gifts for {p}
                </Link>
              ))}
          </div>
        </section>

        {/* Related WishlistCart features */}
        <div className="mt-12 rounded-xl border border-[--color-border] bg-[--color-bg-subtle] p-6">
          <h3 className="text-sm font-semibold text-[--color-text] mb-3">Save these gift ideas</h3>
          <p className="text-sm text-[--color-text-secondary] mb-4">
            Add any of these to a wishlist or registry — share with friends and family so they know exactly what to get.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F0F0F] px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Create a free wishlist
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[--color-border] px-4 py-2 text-sm font-medium text-[--color-text] hover:bg-[--color-bg-muted] transition-colors"
            >
              Explore gift ideas
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
