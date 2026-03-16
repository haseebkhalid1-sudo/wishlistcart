'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutGrid,
  Heart,
  Bell,
  Settings,
  Gift,
  Calendar,
  History,
  Rss,
  Compass,
  Star,
  Shield,
  Users2,
  Chrome,
  Sparkles,
  Code2,
  ShoppingBag,
  BarChart2,
  Key,
} from 'lucide-react'
import { SearchBar } from '@/components/search/search-bar'

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
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/dashboard/gift-concierge', label: 'Gift Concierge', icon: Sparkles },
  { href: '/dashboard/widget', label: 'Embed Widget', icon: Code2 },
  { href: '/browser-extension', label: 'Get Extension', icon: Chrome },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
  { href: '/dashboard/creator', label: 'Creator', icon: Star },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const adminNavItems = [
  { href: '/dashboard/admin', label: 'Overview', icon: Shield, exact: true },
  { href: '/dashboard/admin/creators', label: 'Creator Apps', icon: Star },
  { href: '/dashboard/admin/affiliate', label: 'Affiliate', icon: Compass },
  { href: '/dashboard/admin/marketplace', label: 'Marketplace', icon: LayoutGrid },
  { href: '/dashboard/admin/system', label: 'System', icon: Settings },
]

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-subtle lg:flex">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/dashboard" className="font-serif text-xl text-foreground">
          WishlistCart
        </Link>
      </div>

      {/* Search */}
      <div className="border-b border-border px-3 py-2.5">
        <SearchBar compact />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Bottom: quick add */}
      <div className="border-t border-border p-3">
        <Link
          href="/dashboard/wishlists/new"
          className="flex items-center justify-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          + New Wishlist
        </Link>
      </div>
    </aside>
  )
}
