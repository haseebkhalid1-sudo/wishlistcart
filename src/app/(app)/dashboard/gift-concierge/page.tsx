import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { getConciergeUsage, getConciergeHistory } from '@/lib/actions/concierge'
import { ConciergeChatUI } from '@/components/gift-concierge/chat'

export const metadata: Metadata = {
  title: 'Gift Concierge — WishlistCart',
  description:
    "AI-powered personal gift advisor. Tell me about who you're shopping for and I'll find perfect gift ideas.",
}

export default async function GiftConciergePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [usageResult, historyResult, wishlists] = await Promise.all([
    getConciergeUsage(),
    getConciergeHistory(),
    prisma.wishlist.findMany({
      where: { userId: user.id, isArchived: false },
      select: { id: true, name: true },
      orderBy: { position: 'asc' },
    }),
  ])

  const usage = usageResult.success
    ? usageResult.data
    : { used: 0, limit: 3, plan: 'FREE' }

  const sessions = historyResult.success ? historyResult.data.sessions : []

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <ConciergeChatUI
        initialUsage={usage as { used: number; limit: number; plan: string }}
        recentSessions={sessions}
        wishlists={wishlists}
      />
    </div>
  )
}
