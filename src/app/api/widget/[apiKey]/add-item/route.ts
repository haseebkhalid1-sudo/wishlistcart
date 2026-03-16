import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { createHash } from 'crypto'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

function hashKey(raw: string) {
  return createHash('sha256').update(raw).digest('hex')
}

function getCorsHeaders(origin: string | null, allowedDomains: string[]): Record<string, string> | null {
  if (!origin) return null
  try {
    const originHost = new URL(origin).hostname
    const allowed = allowedDomains.some(d => originHost === d || originHost.endsWith('.' + d))
    if (!allowed) return null
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  } catch {
    return null
  }
}

const bodySchema = z.object({
  wishlistId: z.string().uuid(),
  title: z.string().min(1).max(500).trim(),
  url: z.string().url().optional().nullable(),
  price: z.number().positive().max(999999).optional().nullable(),
  currency: z.string().length(3).default('USD'),
  imageUrl: z.string().url().optional().nullable(),
  quantity: z.number().int().min(1).max(99).default(1),
})

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ apiKey: string }> }) {
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

  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Verify wishlist belongs to the widget owner and is public
  const wishlist = await prisma.wishlist.findFirst({
    where: { id: body.wishlistId, userId: widget.userId, privacy: 'PUBLIC', isArchived: false },
    select: { id: true },
  })
  if (!wishlist) {
    return NextResponse.json({ error: 'Wishlist not found or not public' }, { status: 404 })
  }

  // Fire-and-forget request count
  prisma.wishlistWidget.update({
    where: { id: widget.id },
    data: { requestCount: { increment: 1 } },
  }).catch(() => null)

  const item = await prisma.wishlistItem.create({
    data: {
      wishlistId: body.wishlistId,
      userId: widget.userId,
      title: body.title,
      url: body.url ?? null,
      price: body.price ?? null,
      currency: body.currency,
      imageUrl: body.imageUrl ?? null,
      quantity: body.quantity,
      priority: 3,
    },
    select: { id: true, title: true },
  })

  return NextResponse.json({ success: true, item }, { headers: cors ?? {} })
}
