import Link from 'next/link'
import type { Metadata } from 'next'
import { RetryButton } from './retry-button'

export const metadata: Metadata = {
  title: 'Offline — WishlistCart',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📶</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">You&apos;re offline</h1>
        <p className="text-gray-500 mb-8">
          Check your internet connection and try again. Your wishlists will be waiting when
          you&apos;re back online.
        </p>
        <RetryButton />
        <div className="mt-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
