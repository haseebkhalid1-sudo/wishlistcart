'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VAPID_PUBLIC_KEY } from '@/lib/push/vapid'
import { toast } from 'sonner'

// Converts a base64 URL-encoded VAPID public key to a Uint8Array for the
// pushManager.subscribe() applicationServerKey parameter.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

export function PushOptIn() {
  const [permState, setPermState] = useState<PermissionState>('default')
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPermState('unsupported')
      return
    }
    setPermState(Notification.permission as PermissionState)
  }, [])

  // Already granted — show a subtle "enabled" indicator instead of a button
  if (permState === 'granted' && !isDone) return null
  // Denied or unsupported — nothing to show
  if (permState === 'denied' || permState === 'unsupported') return null

  if (isDone) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Check className="h-4 w-4 text-foreground" />
        Notifications enabled
      </div>
    )
  }

  async function handleEnable() {
    setIsLoading(true)
    try {
      // 1. Request browser permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setPermState(permission as PermissionState)
        toast.error('Notification permission was denied.')
        return
      }
      setPermState('granted')

      // 2. Get service worker registration
      const registration = await navigator.serviceWorker.ready

      // 3. Subscribe with VAPID public key
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      })

      // 4. Send subscription to server
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      })

      if (!res.ok) {
        throw new Error('Failed to save subscription')
      }

      setIsDone(true)
      toast.success('Push notifications enabled!')
    } catch (err: unknown) {
      console.error('[PushOptIn]', err)
      toast.error('Could not enable notifications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDisable() {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
      }
      await fetch('/api/push/subscribe', { method: 'DELETE' })
      setPermState('default')
      toast.success('Push notifications disabled.')
    } catch (err: unknown) {
      console.error('[PushOptIn unsubscribe]', err)
      toast.error('Could not disable notifications.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleEnable}
        disabled={isLoading}
      >
        <Bell className="mr-2 h-4 w-4" />
        {isLoading ? 'Enabling…' : 'Enable notifications'}
      </Button>
      <button
        type="button"
        className="hidden text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        onClick={handleDisable}
        disabled={isLoading}
        aria-label="Disable push notifications"
      >
        <BellOff className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// Variant that renders a "Disable" link — use on the notifications settings page
// alongside PushOptIn when permission === 'granted'.
export function PushOptOut() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  if (typeof window !== 'undefined' && Notification.permission !== 'granted') return null
  if (isDone) {
    return (
      <span className="text-sm text-muted-foreground">Notifications disabled.</span>
    )
  }

  async function handleDisable() {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) await subscription.unsubscribe()
      await fetch('/api/push/subscribe', { method: 'DELETE' })
      setIsDone(true)
      toast.success('Push notifications disabled.')
    } catch (err: unknown) {
      console.error('[PushOptOut]', err)
      toast.error('Could not disable notifications.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDisable} disabled={isLoading}>
      <BellOff className="mr-2 h-4 w-4" />
      {isLoading ? 'Disabling…' : 'Disable notifications'}
    </Button>
  )
}
