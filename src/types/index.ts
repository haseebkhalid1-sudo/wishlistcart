// ============================================================
// Core type definitions for WishlistCart.com
// ============================================================

// --- Branded ID types (prevent mixing up IDs) ---
type Brand<T, B> = T & { readonly _brand: B }
export type UserId = Brand<string, 'UserId'>
export type WishlistId = Brand<string, 'WishlistId'>
export type ItemId = Brand<string, 'ItemId'>

// --- Server Action result (discriminated union) ---
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// --- Scraper response ---
export interface ScrapedProduct {
  title: string | null
  description: string | null
  price: number | null
  currency: string
  imageUrl: string | null
  imageUrls: string[]
  storeName: string | null
  storeDomain: string
  url: string
  confidence: number // 0-1
}

// --- Price alert ---
export type AlertTriggerType = 'ANY_DROP' | 'TARGET_PRICE' | 'PERCENTAGE_DROP'

export interface PriceAlertConfig {
  type: AlertTriggerType
  targetPrice?: number // for TARGET_PRICE
  percentageDrop?: number // for PERCENTAGE_DROP (0-100)
}

// --- Pagination ---
export interface PaginatedResponse<T> {
  items: T[]
  nextCursor: string | null
  total: number
}

export interface PaginationInput {
  cursor?: string
  limit?: number // default 20, max 100
}

// --- Affiliate networks ---
export type AffiliateNetwork =
  | 'amazon-associates'
  | 'shareasale'
  | 'impact'
  | 'cj-affiliate'
  | 'awin'
  | 'direct' // no affiliate, direct link

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
