import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

function hashKey(raw: string) {
  return createHash('sha256').update(raw).digest('hex')
}

function getCorsHeaders(origin: string | null, allowedDomains: string[]): Record<string, string> | null {
  if (!origin) return null
  try {
    const originHost = new URL(origin).hostname
    // Allow if domain matches or is a subdomain of an allowed domain
    const allowed = allowedDomains.some(d => originHost === d || originHost.endsWith('.' + d))
    if (!allowed) return null
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  } catch {
    return null
  }
}

export async function OPTIONS(req: NextRequest, { params }: { params: Promise<{ apiKey: string }> }) {
  const { apiKey } = await params
  const widget = await prisma.wishlistWidget.findUnique({
    where: { apiKeyHash: hashKey(apiKey) },
    select: { allowedDomains: true, isActive: true },
  })
  if (!widget || !widget.isActive) return new NextResponse(null, { status: 204 })
  const origin = req.headers.get('origin')
  const cors = getCorsHeaders(origin, widget.allowedDomains)
  return new NextResponse(null, { status: 204, headers: cors ?? {} })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ apiKey: string }> }) {
  const { apiKey } = await params
  const origin = req.headers.get('origin')

  const widget = await prisma.wishlistWidget.findUnique({
    where: { apiKeyHash: hashKey(apiKey) },
    select: { userId: true, allowedDomains: true, isActive: true, id: true },
  })

  if (!widget || !widget.isActive) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const cors = getCorsHeaders(origin, widget.allowedDomains)
  if (origin && !cors) {
    return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 })
  }

  // Increment request count fire-and-forget
  prisma.wishlistWidget.update({
    where: { id: widget.id },
    data: { requestCount: { increment: 1 } },
  }).catch(() => null)

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: widget.userId, privacy: 'PUBLIC', isArchived: false },
    select: {
      id: true, name: true, slug: true,
      _count: { select: { items: true } },
      items: { take: 4, select: { imageUrl: true }, orderBy: { position: 'asc' } },
    },
    orderBy: { position: 'asc' },
  })

  return NextResponse.json({ wishlists }, { headers: cors ?? {} })
}
