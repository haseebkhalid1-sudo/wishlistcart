'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { stripe } from '@/lib/stripe/client'
import { ensureUser } from '@/lib/auth/ensure-user'
import type { ActionResult } from '@/types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

// Create or retrieve Stripe customer for the user
async function getOrCreateCustomer(userId: string, email: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (user?.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}

// Start a Stripe Checkout session for Pro subscription
export async function createCheckoutSession(): Promise<ActionResult<{ url: string }>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  await ensureUser(user)

  const priceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID
  if (!priceId) return { success: false, error: 'Billing not configured' }

  try {
    const customerId = await getOrCreateCustomer(user.id, user.email ?? '')

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/dashboard/settings?billing=success`,
      cancel_url: `${APP_URL}/dashboard/settings`,
      allow_promotion_codes: true,
      metadata: { userId: user.id },
    })

    if (!session.url) return { success: false, error: 'Failed to create checkout session' }
    return { success: true, data: { url: session.url } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return { success: false, error: message }
  }
}

// Start a Stripe Checkout session for Corporate subscription
export async function createCorporateCheckoutSession(): Promise<ActionResult<{ url: string }>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  await ensureUser(user)

  const priceId = process.env.STRIPE_CORPORATE_PRICE_ID
  if (!priceId) return { success: false, error: 'Corporate billing not configured' }

  try {
    const customerId = await getOrCreateCustomer(user.id, user.email ?? '')

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/dashboard/settings?billing=success`,
      cancel_url: `${APP_URL}/corporate`,
      allow_promotion_codes: true,
      metadata: { userId: user.id },
    })

    if (!session.url) return { success: false, error: 'Failed to create checkout session' }
    return { success: true, data: { url: session.url } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return { success: false, error: message }
  }
}

// Open Stripe Customer Portal for managing subscription
export async function createPortalSession(): Promise<ActionResult<{ url: string }>> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripeCustomerId: true },
  })

  if (!dbUser?.stripeCustomerId) {
    return { success: false, error: 'No billing account found' }
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${APP_URL}/dashboard/settings`,
    })
    return { success: true, data: { url: session.url } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return { success: false, error: message }
  }
}

// Get current subscription status for display
export async function getBillingStatus() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { plan: true, stripeCustomerId: true, email: true, name: true, avatarUrl: true },
  })

  return dbUser
}
