import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  }

  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    select: { storeUrl: true },
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Fire-and-forget click count increment
  prisma.marketplaceProduct
    .update({
      where: { id: productId },
      data: { clickCount: { increment: 1 } },
    })
    .catch(() => null)

  return NextResponse.redirect(product.storeUrl, { status: 302 })
}
