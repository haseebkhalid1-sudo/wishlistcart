import type { Metadata } from 'next'
import { Users, MousePointerClick, UserCheck, Award } from 'lucide-react'
import { getOrCreateReferralCode, getReferralStats } from '@/lib/actions/referrals'
import { ReferralLinkBox } from './referral-link-box'

export const metadata: Metadata = { title: 'Referrals' }

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'

export default async function ReferralsPage() {
  // Ensure user has a referral code, then fetch stats
  await getOrCreateReferralCode()
  const statsResult = await getReferralStats()

  const stats =
    statsResult.success && statsResult.data.code
      ? statsResult.data
      : { code: '', clicks: 0, signups: 0, rewardsSent: 0 }

  const referralUrl = stats.code
    ? `${APP_URL}/signup?ref=${stats.code}`
    : null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">Referrals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite friends and earn rewards together.
        </p>
      </div>

      {/* Hero */}
      <div className="mb-8 rounded-xl border border-border bg-subtle px-6 py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="font-serif text-xl text-foreground">
          Invite friends, earn rewards
        </h2>
        <p className="mt-2 max-w-sm mx-auto text-sm text-muted-foreground">
          Every friend who signs up with your link earns both of you{' '}
          <span className="font-medium text-foreground">1 free month of Pro</span>.
          No limits — the more you share, the more you earn.
        </p>
      </div>

      {/* Referral link */}
      {referralUrl ? (
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-foreground">Your referral link</p>
          <ReferralLinkBox url={referralUrl} code={stats.code} />
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground">
          Unable to load your referral link. Please refresh the page.
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-subtle px-4 py-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{stats.clicks}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Clicks</p>
        </div>
        <div className="rounded-lg border border-border bg-subtle px-4 py-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{stats.signups}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Signups</p>
        </div>
        <div className="rounded-lg border border-border bg-subtle px-4 py-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{stats.rewardsSent}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Rewards earned</p>
        </div>
      </div>

      {/* Empty state for no signups yet */}
      {stats.signups === 0 && (
        <div className="mb-8 rounded-lg border border-dashed border-border px-6 py-8 text-center">
          <p className="text-sm font-medium text-foreground">No signups yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your link with friends and family — your first referral is just one message away.
          </p>
        </div>
      )}

      {/* How it works */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          How it works
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-subtle text-xs font-semibold text-foreground">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Share your link</p>
              <p className="text-sm text-muted-foreground">
                Copy your personal referral link and send it to friends via message, email, or social media.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-subtle text-xs font-semibold text-foreground">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Friend signs up</p>
              <p className="text-sm text-muted-foreground">
                When your friend creates a free WishlistCart account using your link, the referral is tracked automatically.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-subtle text-xs font-semibold text-foreground">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Both get 1 month Pro free</p>
              <p className="text-sm text-muted-foreground">
                You and your friend each receive 1 free month of WishlistCart Pro — no credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
