import type { Metadata } from 'next'
import { getBillingStatus } from '@/lib/actions/billing'
import { getProfile } from '@/lib/actions/profile'
import { SettingsClient } from './settings-client'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const [billingStatus, profile] = await Promise.all([
    getBillingStatus(),
    getProfile(),
  ])
  return <SettingsClient billingStatus={billingStatus} profile={profile} />
}
