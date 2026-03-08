import { NextRequest, NextResponse } from 'next/server'
import { sendPushToUser } from '@/lib/push/send'

// POST /api/push/send — internal server-to-server endpoint.
// Protect with a shared secret so it cannot be called by arbitrary clients.
// Set PUSH_INTERNAL_SECRET in Vercel env vars (any random string).
//
// Body: { userId: string; title: string; body: string; url?: string }
export async function POST(req: NextRequest) {
  const secret = process.env.PUSH_INTERNAL_SECRET
  if (secret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { userId, title, body: notifBody, url } = body as {
    userId?: string
    title?: string
    body?: string
    url?: string
  }

  if (!userId || !title || !notifBody) {
    return NextResponse.json(
      { error: 'userId, title, and body are required' },
      { status: 400 }
    )
  }

  try {
    await sendPushToUser(userId, { title, body: notifBody, url })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('[api/push/send]', err)
    return NextResponse.json({ error: 'Failed to send push notification' }, { status: 500 })
  }
}
