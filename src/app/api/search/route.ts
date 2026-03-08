import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

export type SearchWishlist = Prisma.WishlistGetPayload<{
  include: { user: { select: { username: true; name: true; avatarUrl: true } } }
}>

export type SearchUser = {
  id: string
  username: string | null
  name: string | null
  avatarUrl: string | null
  _count: { wishlists: number }
}

export type SearchResponse = {
  wishlists: SearchWishlist[]
  users: SearchUser[]
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ wishlists: [], users: [] } satisfies SearchResponse)
  }

  try {
    const [wishlists, users] = await Promise.all([
      prisma.wishlist.findMany({
        where: {
          privacy: 'PUBLIC',
          isArchived: false,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: {
          user: { select: { username: true, name: true, avatarUrl: true } },
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          _count: { select: { wishlists: true } },
        },
        take: 5,
      }),
    ])

    return NextResponse.json({
      wishlists: wishlists as unknown as SearchWishlist[],
      users: users as unknown as SearchUser[],
    } satisfies SearchResponse)
  } catch (err) {
    console.error('[search] error:', err)
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 },
    )
  }
}
