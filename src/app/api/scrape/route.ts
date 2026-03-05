import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { scrapeProduct, validateScraperUrl } from '@/lib/scraper'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Rate limiter — only instantiated if Redis is configured
function getRatelimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 scrapes/min per user
  })
}

export async function POST(req: Request) {
  // Auth check
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse body
  let url: string
  try {
    const body = (await req.json()) as { url?: unknown }
    if (typeof body.url !== 'string' || !body.url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 })
    }
    url = body.url
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Validate URL (SSRF protection)
  const validation = validateScraperUrl(url)
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  // Rate limit check
  const limiter = getRatelimiter()
  if (limiter) {
    const { success } = await limiter.limit(user.id)
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }
  }

  // Scrape
  try {
    const product = await scrapeProduct(url)
    return NextResponse.json(product)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to scrape URL'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
