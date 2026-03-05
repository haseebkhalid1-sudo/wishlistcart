import type { ScrapedProduct } from '@/types'
import { extractSchemaOrg } from './extractors/schema-org'
import { extractOpenGraph } from './extractors/open-graph'
import { extractMetaTags } from './extractors/meta-tags'
import { extractDomHeuristic } from './extractors/dom-heuristic'
import { extractAmazon, isAmazonUrl } from './adapters/amazon'
import { extractGeneric } from './adapters/generic'

const ALLOWED_PROTOCOLS = ['https:', 'http:']
const BLOCKED_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.']

/**
 * SSRF protection — validate the URL before fetching
 */
export function validateScraperUrl(urlString: string): { valid: boolean; error?: string } {
  let url: URL
  try {
    url = new URL(urlString)
  } catch {
    return { valid: false, error: 'Invalid URL' }
  }

  if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
    return { valid: false, error: 'Only http/https URLs are allowed' }
  }

  const hostname = url.hostname.toLowerCase()
  for (const blocked of BLOCKED_DOMAINS) {
    if (hostname.includes(blocked)) {
      return { valid: false, error: 'URL not allowed' }
    }
  }

  // Block private IP ranges
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4) {
    const [, a, b] = ipv4
    if (a === '10' || a === '172' || (a === '192' && b === '168') || a === '127') {
      return { valid: false, error: 'URL not allowed' }
    }
  }

  return { valid: true }
}

/**
 * Main scraper — fetches a URL and extracts product data
 */
export async function scrapeProduct(urlString: string): Promise<ScrapedProduct> {
  const validation = validateScraperUrl(urlString)
  if (!validation.valid) {
    throw new Error(validation.error ?? 'Invalid URL')
  }

  // Fetch the page
  const response = await fetch(urlString, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; WishlistCartBot/1.0; +https://wishlistcart.com/bot)',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(10000), // 10s timeout
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html')) {
    throw new Error('URL does not return HTML content')
  }

  const html = await response.text()

  // Get store info
  const { storeName, storeDomain } = extractGeneric(urlString)

  // Run extractors in priority order
  const schemaResult = extractSchemaOrg(html)
  const ogResult = extractOpenGraph(html)
  const metaResult = extractMetaTags(html)
  const domResult = extractDomHeuristic(html)

  // Apply store-specific adapter
  let adapterResult: Partial<ScrapedProduct> = {}
  if (isAmazonUrl(storeDomain)) {
    adapterResult = extractAmazon(html, urlString)
  }

  // Merge: highest-confidence data wins for each field
  const merged = mergeResults(
    [schemaResult, adapterResult, ogResult, metaResult, domResult],
    [schemaResult.confidence, 0.8, ogResult.confidence, metaResult.confidence, domResult.confidence]
  )

  return {
    url: urlString,
    storeName: storeName ?? null,
    storeDomain,
    title: merged.title ?? null,
    description: merged.description ?? null,
    price: merged.price ?? null,
    currency: merged.currency ?? 'USD',
    imageUrl: merged.imageUrl ?? null,
    imageUrls: merged.imageUrls ?? [],
    confidence: schemaResult.confidence > 0 ? schemaResult.confidence : ogResult.confidence,
  }
}

function mergeResults(
  results: Array<Partial<ScrapedProduct>>,
  weights: number[]
): Partial<ScrapedProduct> {
  const merged: Partial<ScrapedProduct> = {}
  const fields: Array<keyof ScrapedProduct> = [
    'title', 'description', 'price', 'currency', 'imageUrl', 'imageUrls',
  ]

  for (const field of fields) {
    // Pick from highest-weighted extractor that has this field
    const pairs = results
      .map((r, i) => ({ value: r[field], weight: weights[i] ?? 0 }))
      .filter((p) => p.value != null)
      .sort((a, b) => b.weight - a.weight)

    if (pairs.length > 0) {
      ;(merged as Record<string, unknown>)[field] = pairs[0]!.value
    }
  }

  return merged
}
