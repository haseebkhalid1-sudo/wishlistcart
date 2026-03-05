import type { ScrapedProduct } from '@/types'

/**
 * DOM heuristic extractor — last resort fallback.
 * Looks for common price and image patterns in raw HTML.
 */
export function extractDomHeuristic(html: string): Partial<ScrapedProduct> & { confidence: number } {
  const price = extractPrice(html)
  const imageUrl = extractImage(html)

  if (!price && !imageUrl) return { confidence: 0 }

  return {
    title: null,
    description: null,
    price,
    currency: 'USD',
    imageUrl,
    imageUrls: imageUrl ? [imageUrl] : [],
    confidence: price != null ? 0.35 : 0.15,
  }
}

function extractPrice(html: string): number | null {
  // Common price patterns
  const patterns = [
    // data attributes: data-price="29.99"
    /data-price=["'](\d+\.?\d*)["']/i,
    // itemprop="price"
    /itemprop=["']price["'][^>]+content=["'](\d+\.?\d*)["']/i,
    /content=["'](\d+\.?\d*)["'][^>]+itemprop=["']price["']/i,
    // price classes
    /class=["'][^"']*price[^"']*["'][^>]*>\s*\$(\d+\.?\d*)/i,
    /class=["'][^"']*price[^"']*["'][^>]*>[\s\S]{0,20}(\d+\.\d{2})/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      const price = parseFloat(match[1])
      if (!isNaN(price) && price > 0 && price < 100000) {
        return price
      }
    }
  }

  return null
}

function extractImage(html: string): string | null {
  // Look for the largest/most prominent image
  const patterns = [
    // Product image with data attribute
    /data-zoom-image=["'](https?:\/\/[^"']+)["']/i,
    // img with product-related class
    /class=["'][^"']*product[^"']*["'][^>]+src=["'](https?:\/\/[^"']+\.(jpg|jpeg|png|webp))["']/i,
    // Large image (common product display)
    /src=["'](https?:\/\/[^"']+\.(jpg|jpeg|png|webp))["'][^>]+width=["']([4-9]\d{2}|\d{4})["']/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    const url = match?.[1]
    if (url && !url.includes('logo') && !url.includes('icon') && !url.includes('sprite')) {
      return url
    }
  }

  return null
}
