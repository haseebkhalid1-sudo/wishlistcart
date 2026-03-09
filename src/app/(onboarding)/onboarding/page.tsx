import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { ensureUser } from '@/lib/auth/ensure-user'
import { OnboardingWizard } from './onboarding-wizard'

export const metadata = {
  title: 'Welcome to WishlistCart',
  robots: { index: false, follow: false },
}

export default async function OnboardingPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ensure user row exists before querying
  await ensureUser(user)

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { onboardingDone: true, name: true },
  })

  if (dbUser?.onboardingDone) {
    redirect('/dashboard/wishlists')
  }

  return <OnboardingWizard userName={dbUser?.name ?? null} />
}
