import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET() {
  try {
    const tables = await prisma.$queryRawUnsafe(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    ) as Array<{ table_name: string }>

    const userCount = await prisma.user.count()
    const wishlistCount = await prisma.wishlist.count()

    return NextResponse.json({
      ok: true,
      tables: tables.map(t => t.table_name),
      counts: { users: userCount, wishlists: wishlistCount },
      databaseUrl: process.env.DATABASE_URL?.slice(0, 60) + '...',
    })
  } catch (err) {
    const error = err as Error
    return NextResponse.json({
      ok: false,
      error: error.message,
      code: (err as { code?: string }).code,
    }, { status: 500 })
  }
}
