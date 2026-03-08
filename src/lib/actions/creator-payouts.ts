'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { stripe } from '@/lib/stripe/client'
import type { ActionResult } from '@/types'

const MINIMUM_PAYOUT_USD = 10

// ---- Query: get pending earnings total for the authed creator ----

export async function getPendingEarnings(): Promise<ActionResult<{ totalUsd: number }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isCreator: true },
  })
  if (!dbUser?.isCreator) return { success: false, error: 'Creator account required' }

  const earnings = await prisma.creatorEarning.findMany({
    where: { userId: user.id, status: 'PENDING' },
    select: { amount: true },
  })

  const totalUsd = earnings.reduce((sum, e) => sum + Number(e.amount), 0)
  return { success: true, data: { totalUsd } }
}

// ---- Mutation: request a payout ----

export async function requestPayout(): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isCreator: true, stripeConnectId: true },
  })

  if (!dbUser?.isCreator) return { success: false, error: 'Creator account required' }

  if (!dbUser.stripeConnectId) {
    return {
      success: false,
      error: 'Please connect your Stripe account before requesting a payout.',
    }
  }

  // Gather all PENDING earnings
  const pendingEarnings = await prisma.creatorEarning.findMany({
    where: { userId: user.id, status: 'PENDING' },
    select: { id: true, amount: true },
  })

  const totalUsd = pendingEarnings.reduce((sum, e) => sum + Number(e.amount), 0)

  if (totalUsd < MINIMUM_PAYOUT_USD) {
    return {
      success: false,
      error: `Minimum payout is $${MINIMUM_PAYOUT_USD.toFixed(2)}. Your current balance is $${totalUsd.toFixed(2)}.`,
    }
  }

  const totalCents = Math.floor(totalUsd * 100)

  // Create a Stripe Transfer to the creator's Connect account
  let transfer: Awaited<ReturnType<typeof stripe.transfers.create>>
  try {
    transfer = await stripe.transfers.create({
      amount: totalCents,
      currency: 'usd',
      destination: dbUser.stripeConnectId,
      description: `WishlistCart creator payout — ${pendingEarnings.length} earnings`,
    })
  } catch (err) {
    console.error('Stripe transfer failed:', err)
    return { success: false, error: 'Payout failed. Please try again or contact support.' }
  }

  // Mark earnings as PROCESSING and record the transfer ID
  const earningIds = pendingEarnings.map((e) => e.id)
  await prisma.creatorEarning.updateMany({
    where: { id: { in: earningIds } },
    data: { status: 'PROCESSING', stripePayoutId: transfer.id },
  })

  revalidatePath('/dashboard/creator')
  return { success: true, data: undefined }
}
