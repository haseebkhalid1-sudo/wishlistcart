import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { buildAffiliateUrl, getNetworkName } from '@/lib/affiliate'

export async function GET(request: NextRequest) {
  const itemId = request.nextUrl.searchParams.get('id')

  if (!itemId) {
    return NextResponse.json({ error: 'Missing item id' }, { status: 400 })
  }

  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    select: { url: true, affiliateUrl: true, storeDomain: true, storeName: true, wishlist: { select: { privacy: true } } },
  })

  if (!item || !item.url || item.wishlist.privacy === 'PRIVATE') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const destination = item.affiliateUrl ?? buildAffiliateUrl(item.url)
  const retailer = item.storeName ?? item.storeDomain ?? new URL(destination).hostname
  const affiliateNetwork = getNetworkName(item.url)

  // Fire-and-forget click tracking
  prisma.affiliateClick.create({
    data: {
      itemId,
      affiliateNetwork,
      retailer,
    },
  }).catch(() => null)

  return NextResponse.redirect(destination, { status: 302 })
}
