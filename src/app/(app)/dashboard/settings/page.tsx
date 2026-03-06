import type { Metadata } from 'next'
import { getBillingStatus } from '@/lib/actions/billing'
import { SettingsClient } from './settings-client'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const billingStatus = await getBillingStatus()
  return <SettingsClient billingStatus={billingStatus} />
}
