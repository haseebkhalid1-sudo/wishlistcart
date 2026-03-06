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
      </div>
    </>
  )
}
