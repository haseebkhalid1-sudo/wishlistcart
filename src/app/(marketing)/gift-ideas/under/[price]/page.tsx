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
  '10': {
    amount: 10,
    title: 'Best Gifts Under $10 in 2026',
    description: 'Thoughtful gifts under $10 that don\'t look cheap — for Secret Santa, stocking stuffers, coworkers, and last-minute occasions.',
    intro: "Under $10 is a real constraint — but it\'s not a death sentence. The key is picking one thing that\'s genuinely nice rather than a basket of filler. These picks punch above their weight.",
    categories: [
      {
        heading: 'For Everyone',
        items: [
          { name: 'Magnetic Bookmark Set', price: '$5–$9', why: 'Clever, practical, and feels like a premium find. Book lovers will use these on every read.', searchUrl: 'https://www.amazon.com/s?k=magnetic+bookmark+set' },
          { name: 'Mini Succulent Plant', price: '$5–$9', why: 'A tiny living gift. Hard to kill, easy to love, and brightens any desk immediately.', searchUrl: 'https://www.amazon.com/s?k=mini+succulent+plant+gift' },
          { name: 'Pocket Notebook (3-Pack)', price: '$6–$10', why: 'Small notebooks people carry everywhere. Great for lists, notes, and impromptu sketches.', searchUrl: 'https://www.amazon.com/s?k=pocket+notebook+3+pack' },
        ],
      },
      {
        heading: 'Food & Drink',
        items: [
          { name: 'Specialty Hot Cocoa Packet Set', price: '$5–$10', why: 'Artisan hot chocolate packets in fun flavors. Cozy, consumable, and universally loved.', searchUrl: 'https://www.amazon.com/s?k=specialty+hot+cocoa+gift+set' },
          { name: 'Tea Sampler (Individual Bags)', price: '$6–$10', why: 'A handful of interesting flavors from Harney & Sons or Twinings. Simple and always appreciated.', searchUrl: 'https://www.amazon.com/s?k=tea+sampler+gift+set+variety' },
        ],
      },
      {
        heading: 'Fun & Stocking Stuffers',
        items: [
          { name: 'Deck of Playing Cards (Nice Design)', price: '$5–$10', why: 'Bicycle or a novelty design they\'ll keep on the coffee table. Universally fun.', searchUrl: 'https://www.amazon.com/s?k=playing+cards+nice+design+gift' },
          { name: 'Silicone Cable Ties Set', price: '$4–$8', why: 'The gift that solves the cable drawer problem. Shockingly satisfying to use.', searchUrl: 'https://www.amazon.com/s?k=silicone+cable+ties+set' },
          { name: 'Lip Balm Set (SPF)', price: '$5–$9', why: 'EOS or Burt\'s Bees multi-pack. Used daily, always runs out, always welcome.', searchUrl: 'https://www.amazon.com/s?k=lip+balm+set+spf+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What can I get as a gift for under $10?', a: 'Under $10, focus on consumables or small practicalities: a specialty tea or cocoa sampler, a nice set of playing cards, a mini succulent, magnetic bookmarks, or silicone cable ties. One thoughtful item beats a pile of cheap filler.' },
      { q: 'What are good stocking stuffers under $10?', a: 'The best stocking stuffers under $10: lip balm sets, magnetic bookmarks, pocket notebooks, playing cards, fun socks, specialty snacks, silicone cable ties, and mini hand lotions. Mix practical with fun for the best stocking.' },
      { q: 'Can under $10 gifts feel thoughtful?', a: 'Absolutely. A $7 magnetic bookmark with a handwritten note about a book you both love is more thoughtful than a $50 generic gift basket. The note and the context are what make a small gift feel significant.' },
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
  '150': {
    amount: 150,
    title: 'Best Gifts Under $150 — Quality Picks for Any Occasion',
    description: "Skip the generic — gifts under $150 hit the sweet spot between thoughtful and impressive.",
    intro: "Under $150, you can give something that genuinely surprises — quality tech, memorable experiences, and home upgrades they'd want but wouldn't splurge on themselves.",
    categories: [
      {
        heading: 'Tech & Gadgets',
        items: [
          { name: 'Anker Soundcore Motion+ Bluetooth Speaker', price: '$100–$130', why: 'Hi-res audio, 12-hour battery, and waterproof. Audiophile sound without the audiophile price tag.', searchUrl: 'https://www.amazon.com/s?k=anker+soundcore+motion+plus+speaker' },
          { name: 'Tile Pro Tracker (4-Pack)', price: '$100–$140', why: 'The gift for the person who loses everything. Attaches to keys, bags, and wallets. Actually life-changing.', searchUrl: 'https://www.amazon.com/s?k=tile+pro+4+pack+tracker' },
          { name: 'Smart Ring (Oura or RingConn)', price: '$100–$149', why: 'Sleep, HRV, and activity tracking in a ring. For the health-conscious person on your list.', searchUrl: 'https://www.amazon.com/s?k=smart+ring+health+tracker' },
          { name: 'Kindle Oasis', price: '$120–$149', why: 'The premium Kindle with a warm light and ergonomic grip. The e-reader for serious readers.', searchUrl: 'https://www.amazon.com/s?k=kindle+oasis+e-reader' },
          { name: 'MagSafe Charger + Stand Combo', price: '$80–$140', why: 'An elegant bedside or desk charging station for iPhone users. Practical and genuinely beautiful.', searchUrl: 'https://www.amazon.com/s?k=magsafe+charger+stand+combo' },
        ],
      },
      {
        heading: 'Experience Gifts',
        items: [
          { name: 'Local Cooking Class (for One)', price: '$80–$150', why: 'A hands-on cooking class is an experience they\'d never book for themselves but will love. Check Sur La Table or local culinary schools.', searchUrl: 'https://www.amazon.com/s?k=cooking+class+gift+card+experience' },
          { name: 'Wine or Cocktail Tasting Experience', price: '$75–$140', why: 'A guided tasting at a local bar, winery, or spirits distillery. Memorable and fun.', searchUrl: 'https://www.amazon.com/s?k=wine+tasting+experience+gift+card' },
          { name: 'Pottery or Art Class (Intro Session)', price: '$70–$140', why: 'A creative experience for the person who\'s always said they want to try something artsy.', searchUrl: 'https://www.amazon.com/s?k=pottery+class+gift+voucher+experience' },
          { name: 'Museum Membership (Annual Pass)', price: '$75–$150', why: 'A year of unlimited visits. Great for art, science, or history lovers — a gift that gives all year.', searchUrl: 'https://www.amazon.com/s?k=museum+membership+annual+gift' },
        ],
      },
      {
        heading: 'Home & Kitchen',
        items: [
          { name: 'Breville Milk Frother (Cafe Roma)', price: '$100–$130', why: 'Barista-quality milk foam at home. Perfect for latte and cappuccino lovers who haven\'t bought one yet.', searchUrl: 'https://www.amazon.com/s?k=breville+milk+frother+cafe+roma' },
          { name: 'KitchenAid Hand Mixer (5-Speed)', price: '$60–$100', why: 'The kitchen upgrade that opens up baking. Reliable, colorful, and something home bakers treasure.', searchUrl: 'https://www.amazon.com/s?k=kitchenaid+hand+mixer+5+speed' },
          { name: 'Luxury Scented Candle Set (Diptyque or Jo Malone)', price: '$80–$150', why: 'Two or three candles from a luxury brand. The gift for someone who appreciates fine fragrance at home.', searchUrl: 'https://www.amazon.com/s?k=diptyque+candle+gift+set' },
          { name: 'Linen Throw Blanket (Stonewashed)', price: '$80–$130', why: 'A beautiful, breathable linen throw that goes with any sofa. The aesthetic home gift.', searchUrl: 'https://www.amazon.com/s?k=stonewashed+linen+throw+blanket' },
          { name: 'French Press (Bodum Chambord, Large)', price: '$40–$80', why: 'The coffee purist\'s brewer. Elegant, simple, and makes a noticeably better cup. Great paired with specialty coffee.', searchUrl: 'https://www.amazon.com/s?k=bodum+chambord+french+press+large' },
        ],
      },
      {
        heading: 'Fashion & Accessories',
        items: [
          { name: 'Leather Belt (Genuine Full-Grain)', price: '$60–$130', why: 'A quality leather belt from Fossil, Lejon, or Trafalgar. One of the most underrated practical gifts for men.', searchUrl: 'https://www.amazon.com/s?k=genuine+full+grain+leather+belt+men' },
          { name: 'Silk Sleep Mask (Luxury)', price: '$40–$100', why: 'A weighted silk sleep mask from Slip or Alaska Bear. Genuinely improves sleep quality.', searchUrl: 'https://www.amazon.com/s?k=silk+sleep+mask+luxury+weighted' },
          { name: 'Cashmere Beanie or Scarf', price: '$60–$140', why: 'Real cashmere, not cashmere blend. Once they feel the difference, nothing else compares.', searchUrl: 'https://www.amazon.com/s?k=100+percent+cashmere+beanie+scarf+gift' },
          { name: 'Personalized Leather Wallet (Engraved)', price: '$60–$130', why: 'A slim full-grain leather wallet engraved with initials or a short message. A keepsake gift.', searchUrl: 'https://www.etsy.com/search?q=personalized+leather+wallet+engraved+men' },
        ],
      },
    ],
    faqs: [
      { q: 'What are good gifts in the $100–$150 range?', a: 'The $100–$150 range is perfect for milestone birthdays, close friends, and partners. Great picks: a Kindle Oasis, a smart ring, a cooking class experience, a luxury candle set, a KitchenAid hand mixer, or a cashmere accessory. Focus on quality and longevity — gifts at this price should last.' },
      { q: 'What is a thoughtful gift under $150 for a woman?', a: 'For her under $150: a Kindle Oasis, a Diptyque candle set, a luxury silk sleep mask, a stonewashed linen throw, a pottery class voucher, or a museum membership. The most appreciated gifts at this range are ones she would enjoy but wouldn\'t buy for herself.' },
      { q: 'What is a good gift under $150 for a man?', a: 'For him under $150: a smart ring or fitness tracker, a Tile Pro 4-pack, an Anker Bluetooth speaker, a personalized leather wallet, a full-grain leather belt, or a cooking class. At this range, tech and quality accessories resonate best with most men.' },
    ],
  },
  '200': {
    amount: 200,
    title: 'Best Gifts Under $200 in 2026',
    description: 'Premium gifts under $200 — the range where you can give something truly special. Quality picks for every type of person.',
    intro: "Under $200 is where gifting gets genuinely exciting. You can afford something that lasts, something that impresses, or something they\'ve been wanting but haven\'t justified for themselves.",
    categories: [
      {
        heading: 'Tech',
        items: [
          { name: 'AirPods (3rd Gen) or Galaxy Buds', price: '$130–$180', why: 'Wireless earbuds they\'ll use every single day. AirPods for iPhone users, Galaxy Buds for Android.', searchUrl: 'https://www.amazon.com/s?k=airpods+3rd+generation+wireless+earbuds' },
          { name: 'Kindle Paperwhite (Signature Edition)', price: '$140–$190', why: 'The upgraded Kindle with wireless charging and auto-adjusting front light. A genuine delight for any reader.', searchUrl: 'https://www.amazon.com/s?k=kindle+paperwhite+signature+edition' },
          { name: 'Portable Projector (Mini)', price: '$100–$180', why: 'Movie nights anywhere. Connects to a phone or laptop in seconds. A crowd-pleasing tech gift.', searchUrl: 'https://www.amazon.com/s?k=portable+mini+projector+1080p' },
        ],
      },
      {
        heading: 'Experiences & Luxury',
        items: [
          { name: 'Spa Day Gift Certificate', price: '$100–$200', why: 'Book it at a local spa. A full massage or facial is the luxury gift most people won\'t buy for themselves.', searchUrl: 'https://www.spafinder.com' },
          { name: 'Fine Dining Gift Card', price: '$100–$200', why: 'A gift card to a restaurant they\'ve been wanting to try. The gift of a special night out.', searchUrl: 'https://www.amazon.com/s?k=restaurant+gift+card+fine+dining' },
          { name: 'Wine Club Subscription (3 months)', price: '$120–$180', why: 'Curated bottles delivered monthly. Naked Wines or Firstleaf are great starting points.', searchUrl: 'https://www.amazon.com/s?k=wine+club+subscription+gift+3+months' },
        ],
      },
      {
        heading: 'Home & Lifestyle',
        items: [
          { name: 'Le Creuset Signature Skillet', price: '$120–$180', why: 'The enameled cast iron upgrade that lasts a lifetime. A kitchen heirloom in the right color.', searchUrl: 'https://www.amazon.com/s?k=le+creuset+signature+skillet' },
          { name: 'Dyson Supersonic Hair Dryer', price: '$150–$200', why: 'The professional hair dryer that converts skeptics in one use. A real luxury splurge.', searchUrl: 'https://www.amazon.com/s?k=dyson+supersonic+hair+dryer' },
          { name: 'Cashmere Throw Blanket', price: '$80–$180', why: 'A genuine cashmere or cashmere-blend throw. Softer and warmer than anything else — and it shows.', searchUrl: 'https://www.amazon.com/s?k=cashmere+throw+blanket+gift' },
        ],
      },
    ],
    faqs: [
      { q: 'What are good gifts in the $100–$200 range?', a: 'The $100–$200 range covers truly special gifts: wireless earbuds, a Kindle Paperwhite, a spa day, a fine dining gift card, a Le Creuset skillet, or a cashmere throw. This is the range for milestone birthdays, anniversaries, and people you want to impress.' },
      { q: 'What is a luxurious gift under $200?', a: 'Luxury gifts under $200: Dyson hair tools, AirPods, a wine club subscription, a spa gift certificate, a cashmere blanket, or a piece of quality jewelry. The key at this price point is brand and quality — one premium item beats a bundle of average ones.' },
      { q: 'What are romantic gifts under $200?', a: 'Romantic gifts in this range: a spa day for two ($150–$200), a fine dining reservation with a small meaningful gift, a weekend getaway deposit, a custom piece of jewelry ($80–$150), or a wine and cheese tasting experience.' },
    ],
  },
  '300': {
    amount: 300,
    title: 'Best Gifts Under $300 — Wow-Factor Picks for Special Occasions',
    description: "For milestones that deserve more than a gift card. These under-$300 picks deliver real wow-factor.",
    intro: "Under $300, you can give something that genuinely wows — premium tech, serious kitchen gear, or a travel experience they'll talk about. These picks are for the special occasions that deserve more than a token gift.",
    categories: [
      {
        heading: 'Tech & Entertainment',
        items: [
          { name: 'Sony WF-1000XM5 Wireless Earbuds', price: '$200–$280', why: 'The best noise-cancelling earbuds available. Audiophile sound + ANC in a tiny package. Daily use guaranteed.', searchUrl: 'https://www.amazon.com/s?k=sony+wf-1000xm5+wireless+earbuds' },
          { name: 'GoPro Hero 13 Black', price: '$250–$280', why: 'For the adventurer, traveler, or anyone who wants to capture life in action. Waterproof, durable, incredible footage.', searchUrl: 'https://www.amazon.com/s?k=gopro+hero+13+black' },
          { name: 'iPad Mini (Latest Gen)', price: '$250–$300', why: 'The most portable and versatile iPad. Perfect for reading, drawing, travel, and video calls.', searchUrl: 'https://www.amazon.com/s?k=ipad+mini+latest+generation' },
          { name: 'Garmin Forerunner 265 (Running Watch)', price: '$250–$280', why: 'Advanced GPS running watch with AMOLED display and training readiness metrics. A serious runner\'s dream.', searchUrl: 'https://www.amazon.com/s?k=garmin+forerunner+265+running+watch' },
          { name: 'Bose QuietComfort 45 Headphones', price: '$200–$280', why: 'Best-in-class comfort and noise cancellation. The headphones for long flights, commutes, and deep work sessions.', searchUrl: 'https://www.amazon.com/s?k=bose+quietcomfort+45+headphones' },
        ],
      },
      {
        heading: 'Kitchen & Home',
        items: [
          { name: 'Breville Barista Express Espresso Machine', price: '$250–$300', why: 'Built-in grinder + espresso maker in one. For the coffee lover who\'s ready to graduate from pods.', searchUrl: 'https://www.amazon.com/s?k=breville+barista+express+espresso+machine' },
          { name: 'KitchenAid Stand Mixer (Artisan, 5 Qt)', price: '$250–$300', why: 'The kitchen gift that changes everything. Heavy, beautiful, and built to last a lifetime.', searchUrl: 'https://www.amazon.com/s?k=kitchenaid+artisan+stand+mixer+5+quart' },
          { name: 'Vitamix E310 Blender', price: '$250–$300', why: 'The blender that blends anything — ice, nuts, frozen fruit — silky smooth in seconds. A lifetime appliance.', searchUrl: 'https://www.amazon.com/s?k=vitamix+e310+blender' },
          { name: 'Philips Hue Starter Kit (Smart Lighting)', price: '$100–$200', why: 'Smart color-changing lights that transform the feel of any room. Controlled by voice or phone.', searchUrl: 'https://www.amazon.com/s?k=philips+hue+starter+kit+smart+lighting' },
          { name: 'Saatva Throw Pillow Set (Premium)', price: '$150–$280', why: 'Hotel-quality throw pillows that elevate a living room or bedroom instantly.', searchUrl: 'https://www.amazon.com/s?k=premium+decorative+throw+pillow+set+luxury' },
        ],
      },
      {
        heading: 'Travel & Outdoors',
        items: [
          { name: 'Osprey Farpoint 40 Travel Backpack', price: '$180–$250', why: 'The gold-standard carry-on travel backpack. Fits overhead bins, comes with a lifetime guarantee.', searchUrl: 'https://www.amazon.com/s?k=osprey+farpoint+40+travel+backpack' },
          { name: 'Away Carry-On Suitcase', price: '$225–$275', why: 'The travel brand with a cult following. Elegant, durable, and the gold standard of modern luggage.', searchUrl: 'https://www.amazon.com/s?k=away+carry+on+suitcase' },
          { name: 'Stanley Quencher Tumbler (40 oz)', price: '$35–$55', why: 'The tumbler that keeps drinks cold for 2 days. A perennial best-seller for active people and outdoor lovers.', searchUrl: 'https://www.amazon.com/s?k=stanley+quencher+40oz+tumbler' },
          { name: 'YETI Tundra 35 Hard Cooler', price: '$250–$300', why: 'The serious cooler for camping, road trips, and tailgating. Keeps ice for days. Built like a tank.', searchUrl: 'https://www.amazon.com/s?k=yeti+tundra+35+hard+cooler' },
          { name: 'National Parks Annual Pass (America the Beautiful)', price: '$80', why: 'Unlimited entry to 2,000+ federal recreation sites for a year. The outdoor lover\'s gift card.', searchUrl: 'https://store.usgs.gov/america-the-beautiful' },
        ],
      },
      {
        heading: 'Wellness',
        items: [
          { name: 'Theragun Prime (Percussion Massager)', price: '$200–$250', why: 'The recovery tool athletes and desk workers both love. Deep muscle relief in minutes.', searchUrl: 'https://www.amazon.com/s?k=theragun+prime+massage+gun' },
          { name: 'Loftie Smart Alarm Clock', price: '$120–$160', why: 'A premium bedside alarm with white noise, wake-up light, and a phone-free bedroom philosophy.', searchUrl: 'https://www.amazon.com/s?k=loftie+smart+alarm+clock' },
          { name: 'Casper Sleep Foam Pillow (2-Pack)', price: '$150–$230', why: 'The most-gifted sleep upgrade. Supportive, breathable, and endorsed by serious sleepers everywhere.', searchUrl: 'https://www.amazon.com/s?k=casper+foam+pillow+2+pack' },
          { name: 'Hydrow Wave Rower (Monthly Plan)', price: '$200–$300', why: 'An at-home rowing machine with live and on-demand classes. For the fitness person who wants something different.', searchUrl: 'https://www.amazon.com/s?k=hydrow+wave+connected+rower' },
          { name: 'Weighted Blanket (Gravity, 20 lb)', price: '$120–$200', why: 'The gold-standard weighted blanket. Reduces anxiety, deepens sleep, and feels like a permanent hug.', searchUrl: 'https://www.amazon.com/s?k=gravity+weighted+blanket+20+pound' },
        ],
      },
    ],
    faqs: [
      { q: 'What are impressive gifts under $300?', a: 'Under $300 you can give genuinely memorable gifts: Sony XM5 earbuds, a KitchenAid stand mixer, a Vitamix blender, Away luggage, a Theragun, or an iPad Mini. These are aspirational items people want but rarely buy for themselves — which makes them perfect gifts.' },
      { q: 'What are good birthday gifts under $300?', a: 'For a milestone birthday under $300: noise-cancelling headphones, a KitchenAid, a Breville espresso machine, Away carry-on luggage, or a Theragun. The best approach: think about their biggest daily friction and gift them the tool that eliminates it.' },
      { q: 'What is a good Christmas gift under $300?', a: 'Top Christmas gifts under $300: Sony WF-1000XM5 earbuds, iPad Mini, Vitamix blender, Bose QC45 headphones, Away suitcase, or a YETI cooler. At this price point, choose one exceptional item rather than a bundle. One wow gift beats three okay gifts every time.' },
    ],
  },
  '500': {
    amount: 500,
    title: 'Best Gifts Under $500 in 2026',
    description: 'Impressive gifts under $500 — for milestone birthdays, anniversaries, weddings, and people you truly want to celebrate.',
    intro: "Under $500, you\'re in genuinely special territory. These are the gifts people remember, the ones that get used for years, and the ones that say 'I really thought about this.'",
    categories: [
      {
        heading: 'Premium Tech',
        items: [
          { name: 'Apple Watch Series 10', price: '$350–$450', why: 'The health, fitness, and productivity tracker on your wrist. The gift tech lovers actually want.', searchUrl: 'https://www.amazon.com/s?k=apple+watch+series+10' },
          { name: 'Sony WH-1000XM5 Headphones', price: '$300–$380', why: 'The best noise-cancelling headphones available. Used daily for years. A life-quality upgrade.', searchUrl: 'https://www.amazon.com/s?k=sony+wh1000xm5+headphones' },
          { name: 'iPad (10th Gen)', price: '$350–$450', why: 'For art, reading, video calls, and everything in between. The most versatile device in Apple\'s lineup.', searchUrl: 'https://www.amazon.com/s?k=ipad+10th+generation' },
          { name: 'Instant Camera (Fujifilm Instax Wide)', price: '$100–$200', why: 'Prints wide-format instant photos. Perfect for parties, travel, and anyone who loves tangible memories.', searchUrl: 'https://www.amazon.com/s?k=fujifilm+instax+wide+camera' },
        ],
      },
      {
        heading: 'Experiences',
        items: [
          { name: 'Weekend Getaway (Airbnb Gift Card)', price: '$200–$500', why: 'The experience gift at scale. An Airbnb or hotel booking deposit for a trip they\'ve been planning.', searchUrl: 'https://www.amazon.com/s?k=airbnb+gift+card' },
          { name: 'Cooking Vacation or Class Trip', price: '$200–$500', why: 'A cooking school experience, a food tour in another city, or an immersive culinary trip. For the foodie who has everything.', searchUrl: 'https://www.airbnb.com/experiences' },
          { name: 'Concert or Sports VIP Tickets', price: '$150–$500', why: 'Front-row or suite-level tickets to a game or concert they\'d love. The memory is the gift.', searchUrl: 'https://www.ticketmaster.com' },
        ],
      },
      {
        heading: 'Luxury Home & Fashion',
        items: [
          { name: 'Dyson Airwrap Styler', price: '$400–$480', why: 'The viral hair styling tool that does everything. On every beauty lover\'s wishlist every year.', searchUrl: 'https://www.amazon.com/s?k=dyson+airwrap+styler' },
          { name: 'Le Creuset Dutch Oven (5.5 Qt)', price: '$350–$440', why: 'The kitchen heirloom. In the right color, it\'s the most beautiful and functional pot in any kitchen.', searchUrl: 'https://www.amazon.com/s?k=le+creuset+dutch+oven+5+quart' },
          { name: 'Quality Leather Handbag', price: '$200–$500', why: 'Tory Burch, Coach, or a mid-luxury brand. A leather bag used daily for years is genuinely cost-per-use efficient.', searchUrl: 'https://www.amazon.com/s?k=quality+leather+handbag+women' },
        ],
      },
    ],
    faqs: [
      { q: 'What are impressive gifts under $500?', a: 'Under $500, you can give gifts that feel genuinely luxurious: an Apple Watch, Sony XM5 headphones, a Dyson Airwrap, a Le Creuset Dutch oven, a weekend trip deposit, or VIP concert tickets. These are the gifts people talk about.' },
      { q: 'What is a good anniversary gift under $500?', a: 'Anniversary gifts in this range: a weekend trip together ($300–$500 on Airbnb), a piece of jewelry ($150–$400), a Dyson Airwrap or Apple Watch, or a private cooking or wine tasting experience. Lean toward experiences for milestone anniversaries.' },
      { q: 'What is a good graduation gift under $500?', a: 'For graduates: an Apple Watch or iPad for their new chapter, a quality leather work bag, a weekend trip, a generous restaurant gift card, or a contribution toward their next adventure. Think about what will serve them in their next life phase.' },
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
      type: 'website',
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wishlistcart.com' },
      { '@type': 'ListItem', position: 2, name: 'Gift Ideas', item: 'https://wishlistcart.com/gift-ideas/under/50' },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `https://wishlistcart.com/gift-ideas/under/${price}` },
    ],
  }

  const otherBudgets = Object.entries(BUDGET_GUIDES).filter(([p]) => p !== price)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
