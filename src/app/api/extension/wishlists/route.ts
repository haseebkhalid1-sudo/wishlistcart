import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { withExtensionCors } from '@/app/api/extension/cors'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export type ExtensionWishlist = Prisma.WishlistGetPayload<{
  select: {
    id: true
    name: true
    _count: { select: { items: true } }
  }
}>

export async function OPTIONS(req: NextRequest) {
  return withExtensionCors(new NextResponse(null, { status: 204 }), req)
}

// GET /api/extension/wishlists
// Returns: { wishlists: Array<{ id, name, _count: { items: number } }> }
export async function GET(req: NextRequest) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const response = NextResponse.json({ wishlists: [] }, { status: 401 })
    return withExtensionCors(response, req)
  }

  const wishlists = await prisma.wishlist.findMany({
    where: {
      userId: user.id,
      isArchived: false,
    },
    select: {
      id: true,
      name: true,
      _count: { select: { items: true } },
    },
    orderBy: { position: 'asc' },
  })

  const response = NextResponse.json({
    wishlists: wishlists as unknown as ExtensionWishlist[],
  })

  return withExtensionCors(response, req)
}
