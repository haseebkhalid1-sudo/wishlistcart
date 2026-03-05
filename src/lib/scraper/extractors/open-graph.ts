import type { ScrapedProduct } from '@/types'

export function extractOpenGraph(html: string): Partial<ScrapedProduct> & { confidence: number } {
  const getMeta = (property: string): string | null => {
    const match =
      html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
      html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'))
    return match?.[1]?.trim() ?? null
  }

  const title = getMeta('og:title') ?? getMeta('twitter:title')
  const description = getMeta('og:description') ?? getMeta('twitter:description')
  const imageUrl = getMeta('og:image') ?? getMeta('twitter:image')

  // OG doesn't typically have price — low confidence
  if (!title) return { confidence: 0 }

  return {
    title,
    description,
    price: null,
    currency: 'USD',
    imageUrl,
    imageUrls: imageUrl ? [imageUrl] : [],
    confidence: 0.45, // OG data rarely has price
  }
}
