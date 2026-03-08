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
