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
    select: { stripeConnectId: true, isCreator: true },
  })

  if (!dbUser?.isCreator) {
    return NextResponse.json({ error: 'Creator account required' }, { status: 403 })
  }

  if (!dbUser.stripeConnectId) {
    return NextResponse.json({
      connected: false,
      chargesEnabled: false,
      payoutsEnabled: false,
    })
  }

  const account = await stripe.accounts.retrieve(dbUser.stripeConnectId)

  return NextResponse.json({
    connected: true,
    chargesEnabled: account.charges_enabled ?? false,
    payoutsEnabled: account.payouts_enabled ?? false,
  })
}
