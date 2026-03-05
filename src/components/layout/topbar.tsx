import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { UserMenu } from './user-menu'
import { MobileNav } from './mobile-nav'

export async function Topbar() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const name = user?.user_metadata?.['name'] as string | undefined
  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.['avatar_url'] as string | undefined

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background px-4 md:px-6">
      {/* Mobile logo + hamburger */}
      <div className="flex items-center gap-3 lg:hidden">
        <MobileNav />
        <Link href="/dashboard" className="font-serif text-lg text-foreground">
          WishlistCart
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side: user menu */}
      <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
    </header>
  )
}
