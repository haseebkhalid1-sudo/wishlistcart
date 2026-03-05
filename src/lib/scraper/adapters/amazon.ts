import type { ScrapedProduct } from '@/types'

/**
 * Amazon-specific extraction.
 * Amazon blocks most scrapers, so we rely heavily on structured data.
 * The generic extractors handle Schema.org and OG — this adapter
 * handles Amazon-specific HTML patterns as a supplement.
 */
export function extractAmazon(html: string, url: string): Partial<ScrapedProduct> {
  // Extract ASIN from URL
  const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/)
  const asin = asinMatch?.[1]

  // Product title — Amazon uses #productTitle
  const titleMatch = html.match(/id=["']productTitle["'][^>]*>\s*([^<]{5,200})\s*</)
  const title = titleMatch?.[1]?.trim() ?? null

  // Price — Amazon uses multiple price elements
  const priceMatch =
    html.match(/id=["']priceblock_ourprice["'][^>]*>[\s\S]{0,20}\$(\d+\.?\d*)/i) ??
    html.match(/class=["'][^"']*a-price-whole["'][^>]*>(\d+)</)

  let price: number | null = null
  if (priceMatch?.[1]) {
    const parsed = parseFloat(priceMatch[1])
    if (!isNaN(parsed)) price = parsed
  }

  // Main image
  const imageMatch = html.match(/id=["']landingImage["'][^>]+(?:src|data-old-hires)=["'](https?:\/\/[^"']+)["']/)
  const imageUrl = imageMatch?.[1] ?? null

  return { title, price, imageUrl, imageUrls: imageUrl ? [imageUrl] : [] }
}

export function isAmazonUrl(domain: string): boolean {
  return domain.includes('amazon.')
}
