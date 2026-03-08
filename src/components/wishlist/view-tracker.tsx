'use client'

import { useEffect } from 'react'
import { trackWishlistView } from '@/lib/actions/views'

interface ViewTrackerProps {
  wishlistId: string
}

export function ViewTracker({ wishlistId }: ViewTrackerProps) {
  useEffect(() => {
    trackWishlistView(wishlistId) // fire and forget
  }, [wishlistId])
  return null
}
