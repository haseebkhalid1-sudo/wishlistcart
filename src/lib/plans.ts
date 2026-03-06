export const FREE_WISHLIST_LIMIT = 3

export type Plan = 'FREE' | 'PRO'

export function isPro(plan: Plan): boolean {
  return plan === 'PRO'
}

export function canCreateWishlist(plan: Plan, currentCount: number): boolean {
  if (plan === 'PRO') return true
  return currentCount < FREE_WISHLIST_LIMIT
}

export function canSetPriceAlert(plan: Plan): boolean {
  return plan === 'PRO'
}
