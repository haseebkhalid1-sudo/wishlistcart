import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal header — just the logo */}
      <header className="flex h-14 items-center px-6">
        <Link href="/" className="font-serif text-xl text-foreground">
          WishlistCart
        </Link>
      </header>

      {/* Centered auth form */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}
