'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { createReminderSchema, updateReminderSchema } from '@/lib/validators/reminder'
import type { ActionResult } from '@/types'

// ---- Queries ----

export async function getUserReminders() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const reminders = await prisma.occasionReminder.findMany({
    where: { userId: user.id },
    orderBy: { date: 'asc' },
  })

  return reminders
}

export type ReminderRow = Awaited<ReturnType<typeof getUserReminders>>[number]

// ---- Create ----

export async function createReminder(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const isRecurringRaw = formData.get('isRecurring')
  const linkedWishlistIdRaw = formData.get('linkedWishlistId')
  const customLabelRaw = formData.get('customLabel')

  const raw = {
    personName: formData.get('personName'),
    occasionType: formData.get('occasionType'),
    date: formData.get('date'),
    isRecurring: isRecurringRaw === 'true' || isRecurringRaw === 'on',
    reminderDaysBefore: formData.get('reminderDaysBefore') ?? 14,
    linkedWishlistId:
      linkedWishlistIdRaw && linkedWishlistIdRaw !== ''
        ? linkedWishlistIdRaw
        : null,
    customLabel:
      customLabelRaw && customLabelRaw !== '' ? customLabelRaw : undefined,
  }

  const parsed = createReminderSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const {
    personName,
    occasionType,
    date,
    isRecurring,
    reminderDaysBefore,
    linkedWishlistId,
    customLabel,
  } = parsed.data

  // For custom occasion type, store the custom label in the occasionType field
  const resolvedOccasionType =
    occasionType === 'custom' && customLabel ? customLabel : occasionType

  try {
    const reminder = await prisma.occasionReminder.create({
      data: {
        userId: user.id,
        personName,
        occasionType: resolvedOccasionType,
        date,
        isRecurring,
        reminderDaysBefore,
        linkedWishlistId: linkedWishlistId ?? null,
      },
      select: { id: true },
    })

    revalidatePath('/dashboard/reminders')
    return { success: true, data: { id: reminder.id } }
  } catch {
    return { success: false, error: 'Failed to create reminder. Please try again.' }
  }
}

// ---- Update ----

export async function updateReminder(
  id: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const existing = await prisma.occasionReminder.findUnique({
    where: { id },
    select: { userId: true },
  })
  if (!existing || existing.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  const isRecurringRaw = formData.get('isRecurring')
  const linkedWishlistIdRaw = formData.get('linkedWishlistId')
  const customLabelRaw = formData.get('customLabel')

  const raw: Record<string, unknown> = {}
  if (formData.has('personName')) raw.personName = formData.get('personName')
  if (formData.has('occasionType')) raw.occasionType = formData.get('occasionType')
  if (formData.has('date')) raw.date = formData.get('date')
  if (formData.has('isRecurring'))
    raw.isRecurring = isRecurringRaw === 'true' || isRecurringRaw === 'on'
  if (formData.has('reminderDaysBefore'))
    raw.reminderDaysBefore = formData.get('reminderDaysBefore')
  if (formData.has('linkedWishlistId'))
    raw.linkedWishlistId =
      linkedWishlistIdRaw && linkedWishlistIdRaw !== '' ? linkedWishlistIdRaw : null
  if (customLabelRaw && customLabelRaw !== '') raw.customLabel = customLabelRaw

  const parsed = updateReminderSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { customLabel, occasionType, ...rest } = parsed.data

  const resolvedOccasionType =
    occasionType === 'custom' && customLabel ? customLabel : occasionType

  try {
    await prisma.occasionReminder.update({
      where: { id },
      data: {
        ...rest,
        ...(resolvedOccasionType !== undefined
          ? { occasionType: resolvedOccasionType }
          : {}),
      },
    })

    revalidatePath('/dashboard/reminders')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to update reminder. Please try again.' }
  }
}

// ---- Delete ----

export async function deleteReminder(id: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const existing = await prisma.occasionReminder.findUnique({
    where: { id },
    select: { userId: true },
  })
  if (!existing || existing.userId !== user.id) {
    return { success: false, error: 'Not found' }
  }

  try {
    await prisma.occasionReminder.delete({ where: { id } })
    revalidatePath('/dashboard/reminders')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to delete reminder. Please try again.' }
  }
}
