import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWishlistById } from '@/lib/actions/wishlists'
import { WishlistSettingsClient } from './wishlist-settings-client'

interface Props {
  params: Promise<{ id: string }>
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  if (!UUID_REGEX.test(id)) return { title: 'Not found' }
  const wishlist = await getWishlistById(id)
  if (!wishlist) return { title: 'Not found' }
  return { title: `${wishlist.name} — Settings` }
}

export default async function WishlistSettingsPage({ params }: Props) {
  const { id } = await params
  if (!UUID_REGEX.test(id)) notFound()
  const wishlist = await getWishlistById(id)
  if (!wishlist) notFound()

  return <WishlistSettingsClient wishlist={wishlist} />
}
