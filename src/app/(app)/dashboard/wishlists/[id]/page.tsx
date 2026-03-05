import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWishlistById } from '@/lib/actions/wishlists'
import { WishlistDetailClient } from './wishlist-detail-client'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const wishlist = await getWishlistById(id)
  if (!wishlist) return { title: 'Not found' }
  return { title: wishlist.name }
}

export default async function WishlistDetailPage({ params }: Props) {
  const { id } = await params
  const wishlist = await getWishlistById(id)

  if (!wishlist) notFound()

  return <WishlistDetailClient wishlist={wishlist} />
}
