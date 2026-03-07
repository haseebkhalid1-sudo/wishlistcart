'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { stripe } from '@/lib/stripe/client'
import { createPoolSchema, contributeSchema } from '@/lib/validators/group-gift'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

// ---- Create pool ----

export async function createGroupGiftPool(
  itemId: string,
  formData: FormData
): Promise<ActionResult<{ poolId: string }>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    // Verify item belongs to a wishlist owned by this user
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      select: { wishlist: { select: { userId: true } } },
    })
    if (!item || item.wishlist.userId !== user.id) {
      return { success: false, error: 'Item not found' }
    }

    // Check no pool already exists for this item
    const existing = await prisma.groupGiftPool.findUnique({
      where: { itemId },
      select: { id: true },
    })
    if (existing) {
      return { success: false, error: 'A gift pool already exists for this item' }
    }

    const raw = {
      goalAmount: formData.get('goalAmount'),
      deadline: formData.get('deadline') || undefined,
    }

    const parsed = createPoolSchema.safeParse(raw)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    const pool = await prisma.groupGiftPool.create({
      data: {
        itemId,
        organizerId: user.id,
        goalAmount: parsed.data.goalAmount,
        deadline: parsed.data.deadline ?? null,
      },
      select: { id: true },
    })

    revalidatePath('/dashboard/registries')
    return { success: true, data: { poolId: pool.id } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create gift pool'
    return { success: false, error: message }
  }
}

// ---- Public pool query ----

export type GroupGiftPoolPublic = Prisma.GroupGiftPoolGetPayload<{
  include: {
    item: {
      select: {
        title: true
        imageUrl: true
        price: true
        currency: true
        wishlist: {
          select: {
            name: true
            shareToken: true
            user: { select: { name: true; username: true } }
          }
        }
      }
    }
    contributions: {
      where: { stripeChargeId: { not: null } }
      orderBy: { createdAt: 'desc' }
      select: {
        id: true
        contributorName: true
        amount: true
        message: true
        isAnonymous: true
        createdAt: true
      }
    }
  }
}>

export async function getGroupGiftPool(poolId: string): Promise<GroupGiftPoolPublic | null> {
  const pool = await prisma.groupGiftPool.findUnique({
    where: { id: poolId },
    include: {
      item: {
        select: {
          title: true,
          imageUrl: true,
          price: true,
          currency: true,
          wishlist: {
            select: {
              name: true,
              shareToken: true,
              user: { select: { name: true, username: true } },
            },
          },
        },
      },
      contributions: {
        where: { stripeChargeId: { not: null } },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          contributorName: true,
          amount: true,
          message: true,
          isAnonymous: true,
          createdAt: true,
        },
      },
    },
  })

  return (pool ?? null) as unknown as GroupGiftPoolPublic | null
}

// ---- Contribution checkout ----

export async function createPoolContributionCheckout(
  poolId: string,
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  try {
    // Fetch pool and verify it's active
    const pool = await prisma.groupGiftPool.findUnique({
      where: { id: poolId },
      include: {
        item: { select: { title: true } },
      },
    })

    if (!pool) return { success: false, error: 'Gift pool not found' }
    if (pool.status !== 'ACTIVE') {
      return { success: false, error: 'This gift pool is no longer accepting contributions' }
    }

    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      amount: formData.get('amount'),
      message: formData.get('message') || undefined,
      isAnonymous: formData.get('isAnonymous') === 'true',
    }

    const parsed = contributeSchema.safeParse(raw)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Gift contribution: ${pool.item.title}` },
            unit_amount: Math.round(parsed.data.amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: parsed.data.email,
      success_url: `${APP_URL}/gift-pool/${poolId}?contributed=1`,
      cancel_url: `${APP_URL}/gift-pool/${poolId}`,
      metadata: {
        type: 'group_gift_contribution',
        poolId,
        contributorName: parsed.data.name,
        contributorEmail: parsed.data.email,
        message: parsed.data.message ?? '',
        isAnonymous: String(parsed.data.isAnonymous),
      },
    })

    if (!session.url) return { success: false, error: 'Failed to create checkout session' }
    return { success: true, data: { url: session.url } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to start checkout'
    return { success: false, error: message }
  }
}

// ---- Pool by item (owner dashboard) ----

export async function getPoolByItemId(itemId: string) {
  const pool = await prisma.groupGiftPool.findUnique({
    where: { itemId },
    select: {
      id: true,
      goalAmount: true,
      currentAmount: true,
      status: true,
      deadline: true,
      _count: { select: { contributions: true } },
    },
  })

  return pool ?? null
}
