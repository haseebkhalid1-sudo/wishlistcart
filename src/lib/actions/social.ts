'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { ActionResult } from '@/types'
import type { Prisma } from '@prisma/client'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PublicProfile = Prisma.UserGetPayload<{
  select: {
    id: true
    name: true
    username: true
    avatarUrl: true
    bio: true
    isCreator: true
    createdAt: true
    _count: { select: { followers: true; following: true; wishlists: true } }
  }
}>

export type PublicWishlistCard = Prisma.WishlistGetPayload<{
  include: {
    _count: { select: { items: true } }
    items: { select: { imageUrl: true } }
  }
}>

// ---------------------------------------------------------------------------
// followUser
// ---------------------------------------------------------------------------

export async function followUser(targetUserId: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  if (user.id === targetUserId) {
    return { success: false, error: 'Cannot follow yourself' }
  }

  // Idempotent: return success if already following
  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: targetUserId,
      },
    },
  })
  if (existing) return { success: true, data: undefined }

  await prisma.follow.create({
    data: { followerId: user.id, followingId: targetUserId },
  })

  revalidatePath('/dashboard')
  return { success: true, data: undefined }
}

// ---------------------------------------------------------------------------
// unfollowUser
// ---------------------------------------------------------------------------

export async function unfollowUser(targetUserId: string): Promise<ActionResult<void>> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // deleteMany avoids a 404/exception if the row doesn't exist
  await prisma.follow.deleteMany({
    where: { followerId: user.id, followingId: targetUserId },
  })

  revalidatePath('/dashboard')
  return { success: true, data: undefined }
}

// ---------------------------------------------------------------------------
// getFollowStatus — public counts, optional isFollowing for logged-in viewers
// ---------------------------------------------------------------------------

export async function getFollowStatus(targetUserId: string): Promise<{
  isFollowing: boolean
  followerCount: number
  followingCount: number
}> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [followerCount, followingCount, followRecord] = await Promise.all([
    prisma.follow.count({ where: { followingId: targetUserId } }),
    prisma.follow.count({ where: { followerId: targetUserId } }),
    user
      ? prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: user.id,
              followingId: targetUserId,
            },
          },
        })
      : Promise.resolve(null),
  ])

  return {
    isFollowing: followRecord !== null,
    followerCount,
    followingCount,
  }
}

// ---------------------------------------------------------------------------
// getPublicProfile
// ---------------------------------------------------------------------------

export async function getPublicProfile(username: string): Promise<PublicProfile | null> {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
      isCreator: true,
      createdAt: true,
      _count: { select: { followers: true, following: true, wishlists: true } },
    },
  }) as unknown as Promise<PublicProfile | null>
}

// ---------------------------------------------------------------------------
// getPublicWishlists
// ---------------------------------------------------------------------------

export async function getPublicWishlists(userId: string): Promise<PublicWishlistCard[]> {
  const wishlists = await prisma.wishlist.findMany({
    where: { userId, privacy: 'PUBLIC', isArchived: false },
    include: {
      _count: { select: { items: true } },
      items: {
        take: 4,
        orderBy: { position: 'asc' },
        select: { imageUrl: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 20,
  })
  return wishlists as unknown as PublicWishlistCard[]
}
