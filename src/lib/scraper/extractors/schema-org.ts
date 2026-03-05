import type { ScrapedProduct } from '@/types'

interface JsonLdOffer {
  price?: string | number
  priceCurrency?: string
  lowPrice?: string | number
}

interface JsonLdProduct {
  '@type'?: string | string[]
  name?: string
  description?: string
  image?: string | string[] | { url?: string }
  offers?: JsonLdOffer | JsonLdOffer[]
}

export function extractSchemaOrg(html: string): Partial<ScrapedProduct> & { confidence: number } {
  const scripts = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? []

  for (const script of scripts) {
    const content = script.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim()

    try {
      const data: unknown = JSON.parse(content)
      const products = findProducts(data)

      for (const product of products) {
        const result = extractFromProduct(product)
        if (result.title) return result
      }
    } catch {
      // Invalid JSON — skip
    }
  }

  return { confidence: 0 }
}

function findProducts(data: unknown): JsonLdProduct[] {
  if (!data || typeof data !== 'object') return []

  if (Array.isArray(data)) {
    return data.flatMap(findProducts)
  }

  const obj = data as Record<string, unknown>
  const type = obj['@type']

  if (type === 'Product' || (Array.isArray(type) && type.includes('Product'))) {
    return [obj as JsonLdProduct]
  }

  // Check @graph
  if (obj['@graph'] && Array.isArray(obj['@graph'])) {
    return (obj['@graph'] as unknown[]).flatMap(findProducts)
  }

  return []
}

function extractFromProduct(product: JsonLdProduct): Partial<ScrapedProduct> & { confidence: number } {
  const title = product.name?.trim() ?? null
  const description = product.description?.trim() ?? null

  // Extract image
  let imageUrl: string | null = null
  if (typeof product.image === 'string') {
    imageUrl = product.image
  } else if (Array.isArray(product.image)) {
    const imgItem = product.image[0]
    imageUrl = typeof imgItem === 'string' ? imgItem : ((imgItem as unknown as { url?: string })?.url ?? null)
  } else if (product.image && typeof product.image === 'object') {
    imageUrl = (product.image as { url?: string }).url ?? null
  }

  // Extract price
  let price: number | null = null
  let currency = 'USD'

  const offers = product.offers
  if (offers) {
    const offer = Array.isArray(offers) ? offers[0] : offers
    if (offer) {
      const rawPrice = offer.price ?? (offer as JsonLdOffer).lowPrice
      if (rawPrice != null) {
        const parsed = parseFloat(String(rawPrice))
        if (!isNaN(parsed)) price = parsed
      }
      if (offer.priceCurrency) currency = offer.priceCurrency
    }
  }

  const hasEnoughData = !!title
  const confidence = hasEnoughData
    ? price != null
      ? 0.92
      : 0.75
    : 0

  return { title, description, price, currency, imageUrl, imageUrls: imageUrl ? [imageUrl] : [], confidence }
}
