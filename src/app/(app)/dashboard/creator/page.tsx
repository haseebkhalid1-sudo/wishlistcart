import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, Clock, CheckCircle2, XCircle, BarChart3, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getCreatorStatus } from '@/lib/actions/creator'
import { CreatorBadge } from '@/components/creator/creator-badge'
import { WithdrawButton } from '@/components/creator/withdraw-button'

export const metadata: Metadata = { title: 'Creator Hub' }

export default async function CreatorPage() {
  const { isCreator, stripeConnectId, application } = await getCreatorStatus()

  // ── State C: Approved creator ─────────────────────────────────────────────
  if (isCreator) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="flex items-start gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl text-foreground">Creator Hub</h1>
              <CreatorBadge variant="card" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome to the creator program. Manage your presence and earnings below.
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Quick action cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </CardTitle>
              <CardDescription>View your affiliate click data and earnings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/creator/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          {!stripeConnectId && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" />
                  Payouts
                </CardTitle>
                <CardDescription>
                  Connect Stripe to receive your 70% affiliate revenue share.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" className="bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90">
                  <Link href="/dashboard/creator/connect-stripe">Connect Stripe</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {stripeConnectId && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" />
                  Payouts
                </CardTitle>
                <CardDescription>Stripe connected. Earnings paid monthly.</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Benefits reminder */}
        <Card className="mt-6 border-border bg-subtle">
          <CardContent className="pt-5">
            <p className="text-sm font-medium text-foreground">Your creator benefits</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-foreground" />
                Verified creator badge on your public profile
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-foreground" />
                70% affiliate revenue share on qualifying purchases
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-foreground" />
                Detailed click & conversion analytics
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── State B: Application pending ─────────────────────────────────────────
  if (application && application.status === 'PENDING') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="font-serif text-2xl text-foreground">Creator Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your application status.</p>

        <Card className="mt-6 border-border">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Application Under Review
              </CardTitle>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <CardDescription>
              Submitted on{' '}
              {new Date(application.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeline */}
            <ol className="relative ml-2 space-y-4 border-l border-border pl-5">
              <li className="relative">
                <span className="absolute -left-[1.4rem] flex h-5 w-5 items-center justify-center rounded-full bg-[#0F0F0F] ring-2 ring-background">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </span>
                <p className="text-sm font-medium text-foreground">Applied</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(application.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </li>
              <li className="relative">
                <span className="absolute -left-[1.4rem] flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background ring-2 ring-background">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                </span>
                <p className="text-sm font-medium text-foreground">Under Review</p>
                <p className="text-xs text-muted-foreground">Typically 2–3 business days</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[1.4rem] flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background ring-2 ring-background">
                  <Star className="h-3 w-3 text-muted-foreground" />
                </span>
                <p className="text-sm text-muted-foreground">Decision</p>
              </li>
            </ol>

            <div className="pt-2">
              <WithdrawButton />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── State D: Rejected ─────────────────────────────────────────────────────
  if (application && application.status === 'REJECTED') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="font-serif text-2xl text-foreground">Creator Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your application status.</p>

        <Card className="mt-6 border-border">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                Application Not Approved
              </CardTitle>
              <Badge variant="secondary">Not Approved</Badge>
            </div>
            {application.reviewedAt && (
              <CardDescription>
                Reviewed on{' '}
                {new Date(application.reviewedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            )}
          </CardHeader>
          {application.reviewNote && (
            <CardContent>
              <div className="rounded-lg border border-border bg-subtle p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Reviewer note
                </p>
                <p className="text-sm text-foreground">{application.reviewNote}</p>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="mt-6">
          <p className="mb-3 text-sm text-muted-foreground">
            You're welcome to apply again — we'd love to see you grow your audience and reapply.
          </p>
          <Button asChild className="bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90">
            <Link href="/dashboard/creator/apply">Apply Again</Link>
          </Button>
        </div>
      </div>
    )
  }

  // ── State A: Not applied yet ───────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col items-center py-10 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-subtle">
          <Star className="h-7 w-7 text-foreground" />
        </div>
        <h1 className="font-serif text-3xl text-foreground">Become a Creator</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Join the WishlistCart creator program and earn revenue sharing on every purchase made
          through your wishlists.
        </p>

        <Button
          asChild
          className="mt-6 bg-[#0F0F0F] text-white hover:bg-[#0F0F0F]/90"
          size="lg"
        >
          <Link href="/dashboard/creator/apply">Apply Now</Link>
        </Button>
      </div>

      <Separator />

      {/* Benefits */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Creator benefits
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Creator badge',
              description:
                'A verified creator badge displayed on your public profile to build trust with your audience.',
            },
            {
              title: '70% revenue share',
              description:
                'Earn 70% of affiliate commissions generated by purchases through your wishlist links.',
            },
            {
              title: 'Analytics',
              description:
                'Detailed insights into clicks, conversions, and earnings across all your wishlists.',
            },
          ].map((benefit) => (
            <Card key={benefit.title} className="border-border bg-subtle">
              <CardContent className="pt-5">
                <p className="text-sm font-medium text-foreground">{benefit.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
