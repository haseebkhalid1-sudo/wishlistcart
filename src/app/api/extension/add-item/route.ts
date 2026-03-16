import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { withExtensionCors } from '@/app/api/extension/cors'

export const dynamic = 'force-dynamic'

const addItemSchema = z.object({
  wishlistId: z.string().min(1),
  title: z.string().min(1).max(500).trim(),
  url: z.string().url().optional().nullable(),
  price: z.number().positive().optional().nullable(),
  currency: z.string().length(3).default('USD'),
  imageUrl: z.string().url().optional().nullable(),
  storeName: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  quantity: z.number().int().min(1).max(99).default(1),
  priority: z.number().int().min(1).max(5).default(3),
})

export async function OPTIONS(req: NextRequest) {
  return withExtensionCors(new NextResponse(null, { status: 204 }), req)
}

// POST /api/extension/add-item
// Body: { wishlistId, title, url, price?, currency?, imageUrl?, storeName?, notes?, quantity?, priority? }
// Returns: { success: true, item: { id, title } } | { error: string }
export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return withExtensionCors(response, req)
  }

  // Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    const response = NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    return withExtensionCors(response, req)
  }

  // Validate
  const parsed = addItemSchema.safeParse(body)
  if (!parsed.success) {
    const response = NextResponse.json(
      { error: 'Validation failed', fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
    return withExtensionCors(response, req)
  }

  const data = parsed.data

  // Ownership check — verify the wishlist belongs to the authenticated user
  const wishlist = await prisma.wishlist.findUnique({
    where: { id: data.wishlistId },
    select: { userId: true },
  })

  if (!wishlist || wishlist.userId !== user.id) {
    const response = NextResponse.json({ error: 'Wishlist not found' }, { status: 404 })
    return withExtensionCors(response, req)
  }

  // Create the item
  try {
    const item = await prisma.wishlistItem.create({
      data: {
        wishlistId: data.wishlistId,
        userId: user.id,
        title: data.title,
        url: data.url ?? null,
        price: data.price != null ? data.price : null,
        currency: data.currency,
        imageUrl: data.imageUrl ?? null,
        storeName: data.storeName ?? null,
        notes: data.notes ?? null,
        quantity: data.quantity,
        priority: data.priority,
      },
      select: { id: true, title: true },
    })

    const response = NextResponse.json({ success: true, item })
    return withExtensionCors(response, req)
  } catch {
    const response = NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
    return withExtensionCors(response, req)
  }
}
