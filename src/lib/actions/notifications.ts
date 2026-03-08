'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { ActionResult } from '@/types'

// ============================================================
// Notification preference types
// ============================================================

export interface NotificationPreferences {
  emailPriceDrops: boolean
  emailGiftClaimed: boolean
  emailNewFollower: boolean
  emailWeeklyDigest: boolean
  pushPriceDrops: boolean
  pushGiftClaimed: boolean
  pushNewFollower: boolean
}

const PREFS_DEFAULTS: NotificationPreferences = {
  emailPriceDrops: true,
  emailGiftClaimed: true,
  emailNewFollower: true,
  emailWeeklyDigest: true,
  pushPriceDrops: true,
  pushGiftClaimed: true,
  pushNewFollower: true,
}

// ============================================================
// Read preferences
// ============================================================

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return PREFS_DEFAULTS

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { settings: true },
  })

  const settings = (dbUser?.settings as Record<string, unknown>) ?? {}
  const stored = (settings.notifications as Partial<NotificationPreferences>) ?? {}

  return { ...PREFS_DEFAULTS, ...stored }
}

// ============================================================
// Update preferences
// ============================================================

export async function updateNotificationPreferences(
  prefs: NotificationPreferences
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { settings: true },
  })

  const currentSettings = (dbUser?.settings as Record<string, unknown>) ?? {}

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        settings: {
          ...currentSettings,
          notifications: {
            emailPriceDrops: prefs.emailPriceDrops,
            emailGiftClaimed: prefs.emailGiftClaimed,
            emailNewFollower: prefs.emailNewFollower,
            emailWeeklyDigest: prefs.emailWeeklyDigest,
            pushPriceDrops: prefs.pushPriceDrops,
            pushGiftClaimed: prefs.pushGiftClaimed,
            pushNewFollower: prefs.pushNewFollower,
          },
        },
      },
    })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to update preferences. Please try again.' }
  }
}

// ============================================================
// Helper used by Inngest functions / server code to check
// whether push notifications are enabled for a given event type
// before calling sendPushToUser.
// ============================================================

type PushPrefKey = keyof Pick<
  NotificationPreferences,
  'pushPriceDrops' | 'pushGiftClaimed' | 'pushNewFollower'
>

export async function isPushEnabled(userId: string, key: PushPrefKey): Promise<boolean> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  })

  const settings = (dbUser?.settings as Record<string, unknown>) ?? {}
  const notifications = (settings.notifications as Record<string, boolean> | undefined) ?? {}

  // Default to true if no preference has been saved yet
  return notifications[key] !== false
}
