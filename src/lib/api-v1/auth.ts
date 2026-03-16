import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma/client'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type ApiUser = {
  id: string
  email: string | null
  name: string | null
  username: string | null
  plan: string
}

export async function validateApiKey(authHeader: string | null): Promise<ApiUser | null> {
  if (!authHeader?.startsWith('Bearer wlc_')) return null
  const rawKey = authHeader.slice(7) // remove "Bearer "

  const keyHash = createHash('sha256').update(rawKey).digest('hex')

  type ApiKeyWithUser = {
    id: string
    userId: string
    isActive: boolean
    user: ApiUser
  }

  const apiKey = (await (
    prisma.apiKey as unknown as {
      findUnique: (args: unknown) => Promise<ApiKeyWithUser | null>
    }
  ).findUnique({
    where: { keyHash },
    select: {
      id: true,
      userId: true,
      isActive: true,
      user: {
        select: { id: true, email: true, name: true, username: true, plan: true },
      },
    },
  })) as ApiKeyWithUser | null

  if (!apiKey || !apiKey.isActive) return null

  // Fire-and-forget lastUsedAt update
  ;(
    prisma.apiKey as unknown as { update: (args: unknown) => Promise<unknown> }
  )
    .update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
    .catch(() => null)

  return apiKey.user
}

// Rate limiting with Upstash (graceful fallback)
let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '1 m'),
  })
}

export async function checkRateLimit(userId: string, plan: string): Promise<boolean> {
  if (!ratelimit) return true // pass if not configured
  // Use per-plan key prefix so PRO/CORPORATE users get a higher threshold
  const keyPrefix = plan === 'PRO' || plan === 'CORPORATE' ? 'api:pro' : 'api:free'
  const { success } = await ratelimit.limit(`${keyPrefix}:${userId}`)
  return success
}
