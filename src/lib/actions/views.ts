'use server'

import { prisma } from '@/lib/prisma/client'
import { headers } from 'next/headers'
import { createHash } from 'crypto'

/**
 * Called from public wishlist page when it loads.
 * Hashes IP for privacy — no PII stored.
 * Fire-and-forget — never throws on failure.
 */
export async function trackWishlistView(wishlistId: string) {
  try {
    const h = await headers()
    const ip =
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      h.get('x-real-ip') ??
      'unknown'
    const visitorId = createHash('sha256')
      .update(ip + new Date().toDateString())
      .digest('hex')
      .slice(0, 16)
    const referrer = h.get('referer') ?? null

    await prisma.wishlistView.create({
      data: { wishlistId, visitorId, referrer },
    })
  } catch {
    // Fire-and-forget — never throw on view tracking failure
  }
}
