import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MarketingMobileNav } from '@/components/layout/marketing-mobile-nav'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="font-serif text-xl text-foreground">
            WishlistCart
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/gift-finder" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Gift Finder
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
          {/* Desktop auth buttons */}
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
          {/* Mobile hamburger */}
          <MarketingMobileNav />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-serif text-lg text-foreground">WishlistCart</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Save anything. Share with everyone.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Link href="/gift-finder" className="hover:text-foreground transition-colors">Gift Finder</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/signup" className="hover:text-foreground transition-colors">Get Started</Link>
            </div>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            © {new Date().getFullYear()} WishlistCart. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
