'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { stripe } from '@/lib/stripe/client'
import type { ActionResult } from '@/types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

// ---- Public type ----

export type CashFundPublic = NonNullable<Awaited<ReturnType<typeof getCashFund>>>

// ---- getCashFund (public) ----

export async function getCashFund(fundId: string) {
  return prisma.cashFund.findUnique({
    where: { id: fundId },
    include: {
      wishlist: {
        select: {
          name: true,
          shareToken: true,
          user: { select: { name: true, username: true } },
        },
      },
    },
  })
}

// ---- getCashFundByRegistryId (owner dashboard) ----

export async function getCashFundByRegistryId(registryId: string) {
  return prisma.cashFund.findUnique({ where: { wishlistId: registryId } })
}

// ---- createCashFund ----

export async function createCashFund(
  registryId: string,
  formData: FormData
): Promise<ActionResult<{ fundId: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Verify registry belongs to user and is of type REGISTRY
  const registry = await prisma.wishlist.findUnique({
    where: { id: registryId },
    select: { userId: true, type: true },
  })

  if (!registry || registry.userId !== user.id) {
    return { success: false, error: 'Registry not found' }
  }

  if (registry.type !== 'REGISTRY') {
    return { success: false, error: 'Cash funds can only be added to registries, not wishlists' }
  }

  // Parse form fields
  const titleRaw = (formData.get('title') as string | null)?.trim() ?? ''
  const descriptionRaw = (formData.get('description') as string | null)?.trim() || null
  const goalAmountRaw = formData.get('goalAmount')

  if (!titleRaw) {
    return { success: false, error: 'Validation failed', fieldErrors: { title: ['Title is required'] } }
  }
  if (titleRaw.length > 100) {
    return { success: false, error: 'Validation failed', fieldErrors: { title: ['Title must be 100 characters or fewer'] } }
  }
  if (descriptionRaw && descriptionRaw.length > 500) {
    return { success: false, error: 'Validation failed', fieldErrors: { description: ['Description must be 500 characters or fewer'] } }
  }

  let goalAmount: number | null = null
  if (goalAmountRaw !== null && goalAmountRaw !== '') {
    const parsed = Number(goalAmountRaw)
    if (isNaN(parsed) || parsed <= 0) {
      return { success: false, error: 'Validation failed', fieldErrors: { goalAmount: ['Goal amount must be a positive number'] } }
    }
    if (parsed > 999999) {
      return { success: false, error: 'Validation failed', fieldErrors: { goalAmount: ['Goal amount must be 999,999 or less'] } }
    }
    goalAmount = parsed
  }

  try {
    const fund = await prisma.cashFund.create({
      data: {
        wishlistId: registryId,
        title: titleRaw,
        description: descriptionRaw,
        goalAmount: goalAmount ?? null,
      },
      select: { id: true },
    })

    revalidatePath(`/dashboard/registries/${registryId}`)
    return { success: true, data: { fundId: fund.id } }
  } catch (err) {
    // Unique constraint violation — a fund already exists for this registry
    if (
      err instanceof Error &&
      (err.message.includes('Unique constraint') || err.message.includes('unique'))
    ) {
      return { success: false, error: 'This registry already has a cash fund' }
    }
    return { success: false, error: 'Failed to create cash fund. Please try again.' }
  }
}

// ---- createCashFundContributionCheckout ----

export async function createCashFundContributionCheckout(
  fundId: string,
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  // No auth required — public action

  const fund = await prisma.cashFund.findUnique({
    where: { id: fundId },
    include: {
      wishlist: { select: { name: true } },
    },
  })

  if (!fund) return { success: false, error: 'Cash fund not found' }
  if (!fund.isActive) return { success: false, error: 'This fund is no longer accepting contributions' }

  // Parse fields
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const amountRaw = formData.get('amount')
  const message = (formData.get('message') as string | null)?.trim() || null
  const isAnonymous = formData.get('isAnonymous') === 'on' || formData.get('isAnonymous') === 'true'

  if (!name) {
    return { success: false, error: 'Validation failed', fieldErrors: { name: ['Name is required'] } }
  }
  if (!email) {
    return { success: false, error: 'Validation failed', fieldErrors: { email: ['Email is required'] } }
  }

  const amount = Number(amountRaw)
  if (isNaN(amount) || amount < 1) {
    return { success: false, error: 'Validation failed', fieldErrors: { amount: ['Minimum contribution is $1'] } }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${fund.title} — ${fund.wishlist.name}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${APP_URL}/cash-fund/${fundId}?contributed=1`,
      cancel_url: `${APP_URL}/cash-fund/${fundId}`,
      metadata: {
        type: 'cash_fund_contribution',
        fundId,
        contributorName: name,
        contributorEmail: email,
        message: message ?? '',
        isAnonymous: String(isAnonymous),
      },
    })

    return { success: true, data: { url: session.url! } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return { success: false, error: message }
  }
}

// ---- updateCashFund ----

export async function updateCashFund(
  fundId: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Verify ownership through wishlist
  const fund = await prisma.cashFund.findUnique({
    where: { id: fundId },
    include: { wishlist: { select: { userId: true, id: true } } },
  })

  if (!fund || fund.wishlist.userId !== user.id) {
    return { success: false, error: 'Fund not found' }
  }

  // Parse fields
  const titleRaw = (formData.get('title') as string | null)?.trim() ?? ''
  const descriptionRaw = (formData.get('description') as string | null)?.trim() || null
  const goalAmountRaw = formData.get('goalAmount')
  const isActiveRaw = formData.get('isActive')

  if (!titleRaw) {
    return { success: false, error: 'Validation failed', fieldErrors: { title: ['Title is required'] } }
  }
  if (titleRaw.length > 100) {
    return { success: false, error: 'Validation failed', fieldErrors: { title: ['Title must be 100 characters or fewer'] } }
  }
  if (descriptionRaw && descriptionRaw.length > 500) {
    return { success: false, error: 'Validation failed', fieldErrors: { description: ['Description must be 500 characters or fewer'] } }
  }

  let goalAmount: number | null = null
  if (goalAmountRaw !== null && goalAmountRaw !== '') {
    const parsed = Number(goalAmountRaw)
    if (isNaN(parsed) || parsed <= 0) {
      return { success: false, error: 'Validation failed', fieldErrors: { goalAmount: ['Goal amount must be a positive number'] } }
    }
    if (parsed > 999999) {
      return { success: false, error: 'Validation failed', fieldErrors: { goalAmount: ['Goal amount must be 999,999 or less'] } }
    }
    goalAmount = parsed
  }

  const isActive = isActiveRaw === 'true' || isActiveRaw === 'on'

  try {
    await prisma.cashFund.update({
      where: { id: fundId },
      data: {
        title: titleRaw,
        description: descriptionRaw,
        goalAmount: goalAmount ?? null,
        isActive,
      },
    })

    revalidatePath(`/dashboard/registries/${fund.wishlist.id}`)
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Failed to update cash fund. Please try again.' }
  }
}
