'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/gift-finder', label: 'Gift Finder' },
  { href: '/gift-ideas/for/mom', label: 'Gift Ideas' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/corporate', label: 'For Business' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export function MarketingMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-14 z-40 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown panel */}
          <div className="absolute left-0 right-0 top-14 z-50 border-b border-border bg-background shadow-md">
            <nav className="mx-auto max-w-6xl px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-subtle hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3 pb-1">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-subtle transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
                >
                  Get started free
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
