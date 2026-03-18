import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LayoutDashboard } from 'lucide-react'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="font-serif text-xl text-foreground">
            WishlistCart
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <Button size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
