import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateApiKey, checkRateLimit } from '@/lib/api-v1/auth'
import { prisma } from '@/lib/prisma/client'

const createSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(500).trim().optional(),
  privacy: z.enum(['PRIVATE', 'SHARED', 'PUBLIC']).default('PRIVATE'),
})

export async function GET(req: NextRequest) {
  const user = await validateApiKey(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkRateLimit(user.id, user.plan)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))

  type WishlistRow = {
    id: string
    name: string
    description: string | null
    privacy: string
    slug: string
    createdAt: Date
    _count: { items: number }
  }
  const wishlists = (await (
    prisma.wishlist as unknown as { findMany: (args: unknown) => Promise<WishlistRow[]> }
  ).findMany({
    where: { userId: user.id, isArchived: false },
    select: {
      id: true,
      name: true,
      description: true,
      privacy: true,
      slug: true,
      createdAt: true,
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })) as WishlistRow[]

  return NextResponse.json({ data: wishlists, page, limit })
}

export async function POST(req: NextRequest) {
  const user = await validateApiKey(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const allowed = await checkRateLimit(user.id, user.plan)
  if (!allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.issues },
      { status: 422 }
    )

  const slug =
    parsed.data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) +
    '-' +
    Date.now().toString(36)

  type Created = {
    id: string
    name: string
    description: string | null
    privacy: string
    slug: string
    createdAt: Date
  }
  const wishlist = (await (
    prisma.wishlist as unknown as { create: (args: unknown) => Promise<Created> }
  ).create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      privacy: parsed.data.privacy,
      slug,
    },
    select: {
      id: true,
      name: true,
      description: true,
      privacy: true,
      slug: true,
      createdAt: true,
    },
  })) as Created

  return NextResponse.json({ data: wishlist }, { status: 201 })
}
