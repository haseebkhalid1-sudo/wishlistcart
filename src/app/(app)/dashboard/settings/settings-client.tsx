'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Crown, User, CreditCard, Check, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createCheckoutSession, createPortalSession } from '@/lib/actions/billing'
import { toast } from 'sonner'

interface BillingStatus {
  plan: 'FREE' | 'PRO'
  stripeCustomerId: string | null
  email: string
  name: string | null
  avatarUrl: string | null
}

interface Props {
  billingStatus: BillingStatus | null
}

export function SettingsClient({ billingStatus }: Props) {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'notifications'>('profile')
  const [isPending, startTransition] = useTransition()

  function handleUpgrade() {
    startTransition(async () => {
      const result = await createCheckoutSession()
      if (result.success) {
        window.location.href = result.data.url
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleManageBilling() {
    startTransition(async () => {
      const result = await createPortalSession()
      if (result.success) {
        window.location.href = result.data.url
      } else {
        toast.error(result.error)
      }
    })
  }

  const isPro = billingStatus?.plan === 'PRO'

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-display-md text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and subscription.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-border">
        {(['profile', 'billing', 'notifications'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-subtle p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg-overlay text-lg font-semibold text-foreground">
                {billingStatus?.name?.charAt(0).toUpperCase() ?? billingStatus?.email?.charAt(0).toUpperCase() ?? <User className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-medium text-foreground">{billingStatus?.name ?? 'Your account'}</p>
                <p className="text-sm text-muted-foreground">{billingStatus?.email}</p>
              </div>
              <div className="ml-auto">
                <Badge variant={isPro ? 'default' : 'outline'} className={isPro ? 'bg-foreground text-background' : ''}>
                  {isPro ? <><Crown className="mr-1 h-3 w-3" />Pro</> : 'Free'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border p-6">
            <h2 className="font-medium text-foreground mb-1">Profile editing</h2>
            <p className="text-sm text-muted-foreground">
              Profile name and avatar editing coming soon.
            </p>
          </div>
        </div>
      )}

      {/* Billing tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Current plan */}
          <div className="rounded-xl border border-border bg-subtle p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium text-foreground">
                  {isPro ? 'WishlistCart Pro' : 'Free plan'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isPro
                    ? 'Unlimited wishlists, price tracking, and priority support.'
                    : 'Up to 3 wishlists. Upgrade for unlimited access and price tracking.'}
                </p>
              </div>
              <Badge variant="outline" className={isPro ? 'border-foreground text-foreground' : ''}>
                {isPro ? <><Crown className="mr-1 h-3 w-3" />Pro</> : 'Free'}
              </Badge>
            </div>

            {isPro ? (
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleManageBilling}
                disabled={isPending}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isPending ? 'Loading…' : 'Manage billing'}
              </Button>
            ) : (
              <Button className="mt-4" onClick={handleUpgrade} disabled={isPending}>
                <Crown className="mr-2 h-4 w-4" />
                {isPending ? 'Loading…' : 'Upgrade to Pro — $9/mo'}
              </Button>
            )}
          </div>

          {/* Feature comparison */}
          {!isPro && (
            <div className="rounded-xl border border-border p-6">
              <h2 className="font-medium text-foreground mb-4">What you get with Pro</h2>
              <ul className="space-y-3">
                {[
                  'Unlimited wishlists (free: 3)',
                  'Price tracking & alerts',
                  'Weekly price digest emails',
                  'Priority support',
                  'Early access to new features',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground">
                      <Check className="h-3 w-3 text-background" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" onClick={handleUpgrade} disabled={isPending}>
                {isPending ? 'Loading…' : 'Get Pro — $9/month'}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Cancel anytime. No questions asked.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Notifications tab — links through to the dedicated page */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="h-4 w-4 text-foreground" />
              <h2 className="font-medium text-foreground">Notification preferences</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Control email and push notification settings for price drops, gift activity, followers, and more.
            </p>
            <Link href="/dashboard/settings/notifications">
              <Button variant="outline" size="sm">
                Manage notifications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
