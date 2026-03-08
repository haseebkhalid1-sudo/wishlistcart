import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'

// POST /api/push/subscribe
// Saves the browser PushSubscription to the authenticated user's settings.
export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let subscription: unknown
  try {
    const body = await req.json()
    subscription = body?.subscription
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!subscription || typeof subscription !== 'object') {
    return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { settings: true },
  })

  const currentSettings = (dbUser?.settings as Record<string, unknown>) ?? {}

  await prisma.user.update({
    where: { id: user.id },
    data: {
      settings: { ...currentSettings, pushSubscription: subscription },
    },
  })

  return NextResponse.json({ ok: true })
}

// DELETE /api/push/subscribe
// Removes the push subscription from the user's settings.
export async function DELETE(_req: NextRequest) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { settings: true },
  })

  const currentSettings = (dbUser?.settings as Record<string, unknown>) ?? {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pushSubscription: _removed, ...rest } = currentSettings

  await prisma.user.update({
    where: { id: user.id },
    data: { settings: rest },
  })

  return NextResponse.json({ ok: true })
}
