'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, LayoutGrid, Heart, Bell, Settings, Gift, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: '/dashboard/wishlists', label: 'My Wishlists', icon: Heart },
  { href: '/dashboard/registries', label: 'Registries', icon: Gift },
  { href: '/dashboard/reminders', label: 'Reminders', icon: Calendar },
  { href: '/dashboard/price-alerts', label: 'Price Alerts', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function MobileNav() {
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

        <nav className="space-y-0.5 p-3">
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
