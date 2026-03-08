import type { Metadata } from 'next'
import { getNotificationPreferences } from '@/lib/actions/notifications'
import { NotificationsSettingsClient } from './notifications-settings-client'

export const metadata: Metadata = { title: 'Notification preferences' }

export default async function NotificationsSettingsPage() {
  const prefs = await getNotificationPreferences()
  return <NotificationsSettingsClient initialPrefs={prefs} />
}
