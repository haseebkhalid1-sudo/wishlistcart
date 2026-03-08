import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { stripe } from '@/lib/stripe/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripeConnectId: true, isCreator: true, email: true, name: true },
  })

  if (!dbUser?.isCreator) {
    return NextResponse.json({ error: 'Creator account required' }, { status: 403 })
  }

  let accountId = dbUser.stripeConnectId

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: dbUser.email ?? undefined,
      capabilities: { transfers: { requested: true } },
    })
    accountId = account.id
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeConnectId: accountId },
    })
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/creator?connect=refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/creator?connect=success`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}
