import type { ScrapedProduct } from '@/types'

export function extractMetaTags(html: string): Partial<ScrapedProduct> & { confidence: number } {
  const getMeta = (name: string): string | null => {
    const match =
      html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
      html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'))
    return match?.[1]?.trim() ?? null
  }

  const getTitle = (): string | null => {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    return titleMatch?.[1]?.trim() ?? null
  }

  const title = getMeta('title') ?? getTitle()
  const description = getMeta('description')

  if (!title) return { confidence: 0 }

  return {
    title,
    description,
    price: null,
    currency: 'USD',
    imageUrl: null,
    imageUrls: [],
    confidence: 0.25,
  }
}
