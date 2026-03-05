import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const name = (user?.user_metadata?.['name'] as string | undefined) ?? 'there'

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-display-md text-foreground">
          Good morning, {name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your wishlists.
        </p>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-subtle py-20 text-center">
        <div className="mb-4 text-4xl">🎁</div>
        <h2 className="text-lg font-semibold text-foreground">Create your first wishlist</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Save products from any store, share with friends and family, and coordinate gifts.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/dashboard/wishlists/new">Create a wishlist</Link>
        </Button>
      </div>
    </div>
  )
}
