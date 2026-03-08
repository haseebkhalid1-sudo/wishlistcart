// npm install web-push @types/web-push
import webpush from 'web-push'
import { prisma } from '@/lib/prisma/client'
import { assertVapidEnv } from './vapid'

// Lazily configure VAPID so the module can be imported without crashing at
// build time when env vars haven't been verified yet.
let vapidConfigured = false

function ensureVapidConfigured() {
  if (vapidConfigured) return
  assertVapidEnv()
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )
  vapidConfigured = true
}

export interface PushPayload {
  title: string
  body: string
  url?: string
}

export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<void> {
  ensureVapidConfigured()

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  })

  const settings = (dbUser?.settings as Record<string, unknown> | null) ?? null
  const sub = settings?.pushSubscription as webpush.PushSubscription | undefined

  if (!sub) return // user hasn't subscribed — silently skip

  const message = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? '/',
    icon: '/icons/icon-192.png',
  })

  try {
    await webpush.sendNotification(sub, message)
  } catch (err: unknown) {
    // 410 Gone = subscription expired — clean it up so we don't keep retrying
    if ((err as { statusCode?: number }).statusCode === 410) {
      const current = (dbUser?.settings as Record<string, unknown>) ?? {}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pushSubscription: _removed, ...rest } = current
      await prisma.user.update({
        where: { id: userId },
        data: { settings: rest },
      })
    }
    // For other errors (e.g. 400, 429) we log but don't crash the caller
    console.error('[push/send] sendNotification error:', err)
  }
}
