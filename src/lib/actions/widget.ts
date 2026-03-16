'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { revalidatePath } from 'next/cache'
import { createHash, randomBytes } from 'crypto'
import { z } from 'zod'
import type { ActionResult } from '@/types'

function generateApiKey(): string {
  return 'wlc_' + randomBytes(16).toString('hex') // wlc_ + 32 hex chars
}

function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex')
}

const createWidgetSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  allowedDomains: z.array(z.string().max(200).trim()).max(10).default([]),
})

const updateWidgetSchema = z.object({
  widgetId: z.string().uuid(),
  name: z.string().min(1).max(100).trim().optional(),
  allowedDomains: z.array(z.string().max(200).trim()).max(10).optional(),
  isActive: z.boolean().optional(),
})

// Returns the raw API key ONCE — caller must show it to the user immediately
export async function createWidget(
  input: z.infer<typeof createWidgetSchema>
): Promise<ActionResult<{ widget: { id: string; name: string; apiKeyPrefix: string }; rawApiKey: string }>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const validated = createWidgetSchema.safeParse(input)
    if (!validated.success) return { success: false, error: 'Invalid input' }

    // Check limit: max 5 widgets per user
    const count = await prisma.wishlistWidget.count({ where: { userId: user.id } })
    if (count >= 5) return { success: false, error: 'Maximum 5 widgets per account' }

    const rawKey = generateApiKey()
    const hash = hashApiKey(rawKey)
    const prefix = rawKey.slice(0, 12) // "wlc_a1b2c3d4"

    const widget = await prisma.wishlistWidget.create({
      data: {
        userId: user.id,
        name: validated.data.name,
        apiKeyHash: hash,
        apiKeyPrefix: prefix,
        allowedDomains: validated.data.allowedDomains,
      },
      select: { id: true, name: true, apiKeyPrefix: true },
    })

    revalidatePath('/dashboard/widget')
    return { success: true, data: { widget, rawApiKey: rawKey } }
  } catch {
    return { success: false, error: 'Failed to create widget' }
  }
}

export async function updateWidget(
  input: z.infer<typeof updateWidgetSchema>
): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const validated = updateWidgetSchema.safeParse(input)
    if (!validated.success) return { success: false, error: 'Invalid input' }

    const { widgetId, ...updates } = validated.data

    const existing = await prisma.wishlistWidget.findFirst({
      where: { id: widgetId, userId: user.id },
      select: { id: true },
    })
    if (!existing) return { success: false, error: 'Widget not found' }

    const widget = await prisma.wishlistWidget.update({
      where: { id: widgetId },
      data: {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.allowedDomains !== undefined && { allowedDomains: updates.allowedDomains }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
      },
      select: { id: true, name: true },
    })

    revalidatePath('/dashboard/widget')
    return { success: true, data: widget }
  } catch {
    return { success: false, error: 'Failed to update widget' }
  }
}

export async function deleteWidget(widgetId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const existing = await prisma.wishlistWidget.findFirst({
      where: { id: widgetId, userId: user.id },
      select: { id: true },
    })
    if (!existing) return { success: false, error: 'Widget not found' }

    await prisma.wishlistWidget.delete({ where: { id: widgetId } })
    revalidatePath('/dashboard/widget')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to delete widget' }
  }
}

// Rotates the API key — returns the new raw key ONCE
export async function rotateApiKey(
  widgetId: string
): Promise<ActionResult<{ rawApiKey: string; apiKeyPrefix: string }>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const existing = await prisma.wishlistWidget.findFirst({
      where: { id: widgetId, userId: user.id },
      select: { id: true },
    })
    if (!existing) return { success: false, error: 'Widget not found' }

    const rawKey = generateApiKey()
    const hash = hashApiKey(rawKey)
    const prefix = rawKey.slice(0, 12)

    await prisma.wishlistWidget.update({
      where: { id: widgetId },
      data: { apiKeyHash: hash, apiKeyPrefix: prefix },
    })

    revalidatePath('/dashboard/widget')
    return { success: true, data: { rawApiKey: rawKey, apiKeyPrefix: prefix } }
  } catch {
    return { success: false, error: 'Failed to rotate API key' }
  }
}

export async function getWidgets(): Promise<ActionResult<Array<{
  id: string
  name: string
  apiKeyPrefix: string
  allowedDomains: string[]
  isActive: boolean
  requestCount: number
  createdAt: Date
}>>> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const widgets = await prisma.wishlistWidget.findMany({
      where: { userId: user.id },
      select: {
        id: true, name: true, apiKeyPrefix: true,
        allowedDomains: true, isActive: true,
        requestCount: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: widgets }
  } catch {
    return { success: false, error: 'Failed to load widgets' }
  }
}
