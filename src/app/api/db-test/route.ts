import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const results: Record<string, unknown> = {
    databaseUrl: process.env.DATABASE_URL?.slice(0, 60) + '...',
  }

  // 1. Check auth
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    results.auth = user ? { id: user.id, email: user.email } : null
  } catch (e) {
    results.auth = { error: (e as Error).message }
  }

  // 2. Read test
  try {
    const userCount = await prisma.user.count()
    const wishlistCount = await prisma.wishlist.count()
    results.reads = { ok: true, users: userCount, wishlists: wishlistCount }
  } catch (e) {
    results.reads = { ok: false, error: (e as Error).message }
  }

  // 3. Write test
  const testId = '00000000-0000-0000-0000-000000000099'
  try {
    await prisma.user.upsert({
      where: { id: testId },
      create: { id: testId, email: 'dbtest@test.com', name: 'DB Test' },
      update: {},
    })
    const wishlist = await prisma.wishlist.create({
      data: { userId: testId, name: 'Test', slug: 'test-' + Date.now(), privacy: 'PRIVATE' },
      select: { id: true },
    })
    await prisma.wishlist.delete({ where: { id: wishlist.id } })
    await prisma.user.delete({ where: { id: testId } })
    results.writes = { ok: true }
  } catch (e) {
    results.writes = { ok: false, error: (e as Error).message, code: (e as { code?: string }).code }
  }

  return NextResponse.json(results)
}
