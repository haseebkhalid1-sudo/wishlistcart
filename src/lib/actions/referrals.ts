'use server'

import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { referralCodeSchema } from '@/lib/validators/referrals'
import type { ActionResult } from '@/types'
import type { ReferralCode } from '@prisma/client'

// ---- Helpers ----

function generateCode(base: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  // Take first 8 chars of base (uppercase alphanumeric only), append suffix
  const cleaned = base.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
  return `${cleaned}${suffix}`
}

// ---- getOrCreateReferralCode ----

export async function getOrCreateReferralCode(): Promise<ActionResult<ReferralCode>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Try to find existing code
  const existing = await prisma.referralCode.findUnique({
    where: { userId: user.id },
  })
  if (existing) {
    return { success: true, data: existing as unknown as ReferralCode }
  }

  // Derive base from name or email prefix
  const userRecord = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true },
  })
  const base =
    (userRecord?.name ?? userRecord?.email?.split('@')[0] ?? 'USER').trim()

  // Try up to 5 times to generate a unique code
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode(base)
    try {
      const created = await prisma.referralCode.create({
        data: { userId: user.id, code },
      })
      return { success: true, data: created as unknown as ReferralCode }
    } catch {
      // Unique constraint violation — try again with different suffix
      continue
    }
  }

  return { success: false, error: 'Failed to generate a unique referral code. Please try again.' }
}

// ---- getReferralStats ----

export type ReferralStats = {
  code: string
  clicks: number
  signups: number
  rewardsSent: number
}

export async function getReferralStats(): Promise<ActionResult<ReferralStats>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const referralCode = await prisma.referralCode.findUnique({
    where: { userId: user.id },
    select: { code: true, clicks: true, signups: true, rewardsSent: true },
  })

  if (!referralCode) {
    return {
      success: true,
      data: { code: '', clicks: 0, signups: 0, rewardsSent: 0 },
    }
  }

  return { success: true, data: referralCode as ReferralStats }
}

// ---- applyReferralCode ----

export async function applyReferralCode(
  code: string,
  newUserId: string
): Promise<ActionResult<void>> {
  const parsed = referralCodeSchema.safeParse({ code })
  if (!parsed.success) return { success: false, error: 'Invalid referral code' }

  try {
    const referral = await prisma.referralCode.findUnique({
      where: { code: parsed.data.code },
      select: { id: true, userId: true },
    })

    if (!referral) return { success: false, error: 'Referral code not found' }

    // Don't allow self-referral
    if (referral.userId === newUserId) {
      return { success: false, error: 'Cannot use your own referral code' }
    }

    // Increment signups count and connect this user as referred
    await prisma.referralCode.update({
      where: { id: referral.id },
      data: {
        signups: { increment: 1 },
        referred: {
          connect: { id: newUserId },
        },
      },
    })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to apply referral code' }
  }
}

// ---- trackReferralClick ----

export async function trackReferralClick(code: string): Promise<ActionResult<void>> {
  const parsed = referralCodeSchema.safeParse({ code })
  if (!parsed.success) return { success: false, error: 'Invalid code' }

  try {
    await prisma.referralCode.updateMany({
      where: { code: parsed.data.code },
      data: { clicks: { increment: 1 } },
    })
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to track click' }
  }
}
