import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateApiKey, checkRateLimit } from '@/lib/api-v1/auth'
import { prisma } from '@/lib/prisma/client'

const addItemSchema = z.object({
  title: z.string().min(1).max(500).trim(),
  url: z.string().url().optional().nullable(),
  price: z.number().positive().max(999999).optional().nullable(),
  currency: z.string().length(3).default('USD'),
  notes: z.string().max(1000).trim().optional().nullable(),
  priority: z.number().int().min(1).max(5).default(3),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const user = await validateApiKey(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkRateLimit(user.id, user.plan)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const { id: wishlistId } = await params

  const wishlist = await (
    prisma.wishlist as unknown as {
      findUnique: (args: unknown) => Promise<{ userId: string } | null>
    }
  ).findUnique({
    where: { id: wishlistId },
    select: { userId: true },
  })
  if (!wishlist || wishlist.userId !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  type ItemRow = {
    id: string
    title: string
    url: string | null
    price: unknown
    currency: string
    priority: number
    createdAt: Date
  }
  const items = (await (
    prisma.wishlistItem as unknown as { findMany: (args: unknown) => Promise<ItemRow[]> }
  ).findMany({
    where: { wishlistId },
    select: {
      id: true,
      title: true,
      url: true,
      price: true,
      currency: true,
      priority: true,
      createdAt: true,
    },
    orderBy: { position: 'asc' },
  })) as ItemRow[]

  return NextResponse.json({
    data: items.map((i) => ({ ...i, price: i.price != null ? Number(i.price) : null })),
  })
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const user = await validateApiKey(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkRateLimit(user.id, user.plan)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const { id: wishlistId } = await params

  const wishlist = await (
    prisma.wishlist as unknown as {
      findUnique: (args: unknown) => Promise<{ userId: string } | null>
    }
  ).findUnique({
    where: { id: wishlistId },
    select: { userId: true },
  })
  if (!wishlist || wishlist.userId !== user.id)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = addItemSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.issues },
      { status: 422 }
    )

  type CreatedItem = {
    id: string
    title: string
    url: string | null
    price: unknown
    currency: string
    priority: number
    createdAt: Date
  }
  const item = (await (
    prisma.wishlistItem as unknown as { create: (args: unknown) => Promise<CreatedItem> }
  ).create({
    data: {
      wishlistId,
      userId: user.id,
      title: parsed.data.title,
      url: parsed.data.url ?? null,
      price: parsed.data.price ?? null,
      currency: parsed.data.currency,
      notes: parsed.data.notes ?? null,
      priority: parsed.data.priority,
    },
    select: {
      id: true,
      title: true,
      url: true,
      price: true,
      currency: true,
      priority: true,
      createdAt: true,
    },
  })) as CreatedItem

  return NextResponse.json(
    { data: { ...item, price: item.price != null ? Number(item.price) : null } },
    { status: 201 }
  )
}
