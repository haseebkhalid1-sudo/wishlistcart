import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import { ServiceWorkerRegistration } from '@/components/pwa/sw-registration'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://wishlistcart.com'),
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
    images: [{ url: '/api/og-image?title=WishlistCart&subtitle=Save products from any store.%20Share wishlists.%20Coordinate gifts.', width: 1200, height: 630, alt: 'WishlistCart' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WishlistCart — Universal Wishlist & Gift Registry',
    description: 'Save products from any store. Share wishlists. Coordinate gifts.',
    images: ['/api/og-image?title=WishlistCart&subtitle=Save products from any store.%20Share wishlists.%20Coordinate gifts.'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://wishlistcart.com' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'WishlistCart',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#0F0F0F" />
      </head>
      <body className="font-sans antialiased">
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <Toaster richColors position="bottom-right" />
        <ServiceWorkerRegistration />
        <InstallPrompt />
      </body>
    </html>
  )
}
