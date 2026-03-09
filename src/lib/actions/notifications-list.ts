'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'

export type NotificationItem = Prisma.NotificationGetPayload<{
  select: {
    id: true
    type: true
    title: true
    body: true
    data: true
    readAt: true
    createdAt: true
  }
}>

export async function getNotifications(): Promise<NotificationItem[]> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  return prisma.notification.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      data: true,
      readAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  }) as unknown as NotificationItem[]
}

export async function markNotificationRead(
  notificationId: string
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId: user.id, readAt: null },
      data: { readAt: new Date() },
    })
    revalidatePath('/dashboard/notifications')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to mark as read' }
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    await prisma.notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    })
    revalidatePath('/dashboard/notifications')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to mark all as read' }
  }
}
