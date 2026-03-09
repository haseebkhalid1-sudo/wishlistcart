'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, LayoutGrid, Heart, Bell, Settings, Gift, Calendar, History, Rss, Compass, Star, Shield, Users2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: '/dashboard/feed', label: 'Feed', icon: Rss },
  { href: '/dashboard/wishlists', label: 'My Wishlists', icon: Heart },
  { href: '/dashboard/registries', label: 'Registries', icon: Gift },
  { href: '/dashboard/reminders', label: 'Reminders', icon: Calendar },
  { href: '/dashboard/price-alerts', label: 'Price Alerts', icon: Bell },
  { href: '/dashboard/gift-history', label: 'Gift History', icon: History },
  { href: '/dashboard/referrals', label: 'Referrals', icon: Users2 },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/dashboard/creator', label: 'Creator', icon: Star },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const adminNavItems = [
  { href: '/dashboard/admin', label: 'Overview', icon: Shield, exact: true },
  { href: '/dashboard/admin/creators', label: 'Creator Apps', icon: Star },
  { href: '/dashboard/admin/affiliate', label: 'Affiliate', icon: Compass },
  { href: '/dashboard/admin/system', label: 'System', icon: Settings },
]

interface MobileNavProps {
  isAdmin?: boolean
}

export function MobileNav({ isAdmin = false }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-14 items-center border-b border-border px-5">
          <span className="font-serif text-xl text-foreground">WishlistCart</span>
        </div>

        <nav className="space-y-0.5 overflow-y-auto p-3 pb-20">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-background font-medium text-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}

          {/* Admin section */}
          {isAdmin && (
            <div className="mt-4">
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Admin
              </p>
              {adminNavItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-background font-medium text-foreground shadow-xs'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
          <Link
            href="/dashboard/wishlists/new"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            + New Wishlist
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
