import type { Metadata } from 'next'
import { Inter, DM_Serif_Display } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'WishlistCart — Save Products from Any Store, Share with Everyone',
    template: '%s | WishlistCart',
  },
  description:
    'Create wishlists from any online store, track prices, and coordinate gifts. The universal wishlist and gift registry for every occasion.',
  keywords: ['wishlist', 'gift registry', 'universal wishlist', 'price tracker', 'wedding registry'],
  openGraph: {
    title: 'WishlistCart — Save. Share. Celebrate.',
    description:
      'Universal wishlist and gift registry. Add items from any store, track prices, coordinate gifts.',
    url: 'https://wishlistcart.com',
    siteName: 'WishlistCart',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'WishlistCart' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WishlistCart — Universal Wishlist & Gift Registry',
    description: 'Save products from any store. Share wishlists. Coordinate gifts.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://wishlistcart.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
