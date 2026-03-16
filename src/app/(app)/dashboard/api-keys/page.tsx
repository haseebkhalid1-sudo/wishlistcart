import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { listApiKeys } from '@/lib/actions/api-keys'
import { ApiKeysClient } from './api-keys-client'

export const metadata: Metadata = {
  title: 'API Keys — WishlistCart',
  description: 'Manage your WishlistCart REST API keys.',
}

export default async function ApiKeysPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const result = await listApiKeys()
  const keys = result.success ? result.data : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">API Keys</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use API keys to access your wishlists programmatically. Keys are shown only once —
          store them safely.
        </p>
      </div>
      <ApiKeysClient initialKeys={keys} />
    </div>
  )
}
