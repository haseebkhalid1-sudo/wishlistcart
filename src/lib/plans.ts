export const FREE_WISHLIST_LIMIT = 3

export type Plan = 'FREE' | 'PRO' | 'CORPORATE'

export function isPro(plan: Plan): boolean {
  return plan === 'PRO'
}

export function isCorporate(plan: Plan): boolean {
  return plan === 'CORPORATE'
}

export function isPaidPlan(plan: Plan): boolean {
  return plan === 'PRO' || plan === 'CORPORATE'
}

export function canCreateWishlist(plan: Plan, currentCount: number): boolean {
  if (plan === 'PRO' || plan === 'CORPORATE') return true
  return currentCount < FREE_WISHLIST_LIMIT
}

export function canSetPriceAlert(plan: Plan): boolean {
  return plan === 'PRO' || plan === 'CORPORATE'
}

// ---- Stripe plan config ----

export const PLAN_CONFIG = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: '',
    features: [
      'Up to 3 wishlists',
      'Unlimited items per wishlist',
      'URL auto-import from any store',
      'Share wishlists with friends',
      'Gift claiming & surprise mode',
      'Affiliate buy links',
    ],
    limits: {
      wishlists: FREE_WISHLIST_LIMIT,
      itemsPerWishlist: Infinity,
      teamMembers: 1,
      priceAlerts: 0,
    },
  },
  PRO: {
    name: 'Pro',
    price: 400, // $4/mo in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? '',
    features: [
      'Everything in Free',
      'Unlimited wishlists',
      'Price tracking on every item',
      'Price drop alerts (email + in-app)',
      'Price history charts',
      'Browser extension (Chrome)',
      'Priority support',
    ],
    limits: {
      wishlists: Infinity,
      itemsPerWishlist: Infinity,
      teamMembers: 1,
      priceAlerts: Infinity,
    },
  },
  CORPORATE: {
    name: 'Team',
    price: 2900, // $29/mo in cents
    priceId: process.env.STRIPE_CORPORATE_PRICE_ID ?? '',
    features: [
      'Up to 25 team members',
      'Bulk wishlist management',
      'Budget controls per person',
      'Priority support',
      'Custom gift templates',
    ],
    limits: {
      wishlists: 100,
      itemsPerWishlist: 200,
      teamMembers: 25,
      priceAlerts: 100,
    },
  },
} as const satisfies Record<Plan, {
  name: string
  price: number
  priceId: string
  features: readonly string[]
  limits: { wishlists: number; itemsPerWishlist: number; teamMembers: number; priceAlerts: number }
}>
