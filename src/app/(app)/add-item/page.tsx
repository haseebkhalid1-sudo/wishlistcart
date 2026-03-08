// PWA Share Target handler
// manifest.json declares action="/add-item" method="GET"
// When the user shares a URL from their browser/app to WishlistCart, Android/iOS
// will open: /add-item?url=<shared-url>&title=<page-title>&text=<selected-text>
//
// We immediately redirect to the wishlists dashboard with the URL pre-filled
// so the existing AddItemDialog can open automatically.

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Adding item…' }

interface Props {
  searchParams: Promise<{ url?: string; title?: string; text?: string }>
}

export default async function AddItemPage({ searchParams }: Props) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams
  const sharedUrl = params.url ?? params.title ?? params.text ?? ''

  if (!user) {
    // Send them to login and bring them back after auth
    const next = sharedUrl
      ? `/add-item?url=${encodeURIComponent(sharedUrl)}`
      : '/add-item'
    redirect(`/login?next=${encodeURIComponent(next)}`)
  }

  if (sharedUrl) {
    // The wishlists page picks up ?addUrl= to pre-open the add-item dialog
    redirect(`/dashboard/wishlists?addUrl=${encodeURIComponent(sharedUrl)}`)
  }

  redirect('/dashboard/wishlists')
}
