import type { ScrapedProduct } from '@/types'

/**
 * Generic adapter — extracts store name and domain from any URL.
 */
export function extractGeneric(url: string): Pick<ScrapedProduct, 'storeName' | 'storeDomain'> {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '')

    // Convert hostname to readable store name
    const parts = hostname.split('.')
    const domain = parts[parts.length - 2] ?? hostname
    const storeName = domain.charAt(0).toUpperCase() + domain.slice(1)

    return {
      storeName,
      storeDomain: hostname,
    }
  } catch {
    return { storeName: null, storeDomain: '' }
  }
}
