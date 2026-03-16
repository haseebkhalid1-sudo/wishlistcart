'use server'

import { revalidatePath } from 'next/cache'
import { createHash, randomBytes } from 'crypto'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { ActionResult } from '@/types/index'

export type ApiKeyRow = {
  id: string
  name: string
  keyPrefix: string
  lastUsedAt: Date | null
  isActive: boolean
  createdAt: Date
}

const createKeySchema = z.object({
  name: z.string().min(1, 'Name required').max(100).trim(),
})

function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}

function generateRawKey(): string {
  return 'wlc_' + randomBytes(24).toString('hex') // wlc_ + 48 hex chars = 52 total
}

export async function listApiKeys(): Promise<ActionResult<ApiKeyRow[]>> {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const keys = (await (
      prisma.apiKey as unknown as {
        findMany: (args: unknown) => Promise<ApiKeyRow[]>
      }
    ).findMany({
      where: { userId: user.id, isActive: true },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        lastUsedAt: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })) as ApiKeyRow[]

    return { success: true, data: keys }
  } catch {
    return { success: false, error: 'Failed to load API keys' }
  }
}

export async function createApiKey(
  input: unknown
): Promise<ActionResult<{ key: ApiKeyRow & { rawKey: string } }>> {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const parsed = createKeySchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    // Max 10 keys per user
    const count = await (
      prisma.apiKey as unknown as { count: (args: unknown) => Promise<number> }
    ).count({
      where: { userId: user.id, isActive: true },
    })
    if (count >= 10) return { success: false, error: 'Maximum 10 API keys allowed' }

    const rawKey = generateRawKey()
    const keyHash = hashKey(rawKey)
    const keyPrefix = rawKey.slice(0, 12) // "wlc_" + 8 chars

    const created = (await (
      prisma.apiKey as unknown as {
        create: (args: unknown) => Promise<ApiKeyRow>
      }
    ).create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        keyHash,
        keyPrefix,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        lastUsedAt: true,
        isActive: true,
        createdAt: true,
      },
    })) as ApiKeyRow

    revalidatePath('/dashboard/api-keys')
    return { success: true, data: { key: { ...created, rawKey } } }
  } catch {
    return { success: false, error: 'Failed to create API key' }
  }
}

export async function revokeApiKey(keyId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const existing = await (
      prisma.apiKey as unknown as {
        findUnique: (args: unknown) => Promise<{ userId: string } | null>
      }
    ).findUnique({
      where: { id: keyId },
      select: { userId: true },
    })
    if (!existing || existing.userId !== user.id)
      return { success: false, error: 'Not found' }

    await (
      prisma.apiKey as unknown as {
        update: (args: unknown) => Promise<unknown>
      }
    ).update({
      where: { id: keyId },
      data: { isActive: false },
    })

    revalidatePath('/dashboard/api-keys')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to revoke API key' }
  }
}
