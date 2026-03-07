import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { prisma } from '@/lib/prisma/client'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        if (userId && session.mode === 'subscription') {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: 'PRO' },
          })
        } else if (session.mode === 'payment') {
          const type = session.metadata?.type
          const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent as { id: string } | null)?.id ?? null

          if (type === 'group_gift_contribution') {
            const poolId = session.metadata?.poolId
            const name = session.metadata?.contributorName ?? 'Anonymous'
            const email = session.metadata?.contributorEmail ?? ''
            const message = session.metadata?.message || null
            const isAnonymous = session.metadata?.isAnonymous === 'true'
            const amount = session.amount_total ? session.amount_total / 100 : 0

            if (poolId && amount > 0) {
              await prisma.$transaction([
                prisma.groupGiftContribution.create({
                  data: {
                    poolId,
                    contributorName: name,
                    contributorEmail: email,
                    amount,
                    message,
                    isAnonymous,
                    stripeChargeId: paymentIntentId,
                  },
                }),
                prisma.groupGiftPool.update({
                  where: { id: poolId },
                  data: { currentAmount: { increment: amount } },
                }),
              ])

              // Check if goal reached and mark COMPLETED
              const pool = await prisma.groupGiftPool.findUnique({
                where: { id: poolId },
                select: { goalAmount: true, currentAmount: true },
              })
              if (pool && Number(pool.currentAmount) >= Number(pool.goalAmount)) {
                await prisma.groupGiftPool.update({
                  where: { id: poolId },
                  data: { status: 'COMPLETED' },
                })
              }
            }
          } else if (type === 'cash_fund_contribution') {
            const fundId = session.metadata?.fundId
            const amount = session.amount_total ? session.amount_total / 100 : 0

            if (fundId && amount > 0) {
              await prisma.cashFund.update({
                where: { id: fundId },
                data: { currentAmount: { increment: amount } },
              })
            }
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        })
        if (user) {
          const isActive = sub.status === 'active' || sub.status === 'trialing'
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: isActive ? 'PRO' : 'FREE' },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        })
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: 'FREE' },
          })
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
