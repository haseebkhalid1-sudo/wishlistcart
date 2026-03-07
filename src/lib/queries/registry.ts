import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'

// ============================================================
// REGISTRY QUERIES — surprise-mode rules:
//
// Public / gift-giver view:
//   - CAN see isPurchased (item is "claimed")
//   - NEVER sees purchasedBy, giftMessage, notes
//
// Owner view (registries differ from wishlists here):
//   - Owner CAN see isPurchased + purchasedAt (thank-you tracking)
//   - Owner still NEVER sees purchasedBy or giftMessage
// ============================================================

// ---- Public types ----

export type PublicRegistryItem = Prisma.WishlistItemGetPayload<{
  select: {
    id: true
    title: true
    url: true
    affiliateUrl: true
    storeName: true
    storeDomain: true
    imageUrl: true
    price: true
    currency: true
    originalPrice: true
    priority: true
    position: true
    category: true
    tags: true
    isPurchased: true
    isAnonymous: true
  }
}>

export type PublicRegistry = Prisma.WishlistGetPayload<{
  include: {
    items: {
      select: {
        id: true
        title: true
        url: true
        affiliateUrl: true
        storeName: true
        storeDomain: true
        imageUrl: true
        price: true
        currency: true
        originalPrice: true
        priority: true
        position: true
        category: true
        tags: true
        isPurchased: true
        isAnonymous: true
      }
    }
    _count: { select: { items: true } }
    user: { select: { name: true; username: true; avatarUrl: true } }
    cashFund: true
  }
}>

// ---- Owner types ----

export type OwnerRegistryItem = Prisma.WishlistItemGetPayload<{
  select: {
    id: true
    title: true
    url: true
    affiliateUrl: true
    storeName: true
    storeDomain: true
    imageUrl: true
    price: true
    currency: true
    originalPrice: true
    priority: true
    position: true
    notes: true
    category: true
    tags: true
    isPurchased: true
    purchasedAt: true
    wishlistId: true
    userId: true
    createdAt: true
    updatedAt: true
    // NEVER include: purchasedBy, giftMessage, isAnonymous
  }
}>

export type OwnerRegistry = Prisma.WishlistGetPayload<{
  include: {
    items: {
      select: {
        id: true
        title: true
        url: true
        affiliateUrl: true
        storeName: true
        storeDomain: true
        imageUrl: true
        price: true
        currency: true
        originalPrice: true
        priority: true
        position: true
        notes: true
        category: true
        tags: true
        isPurchased: true
        purchasedAt: true
        wishlistId: true
        userId: true
        createdAt: true
        updatedAt: true
      }
    }
    _count: { select: { items: true } }
    user: { select: { name: true; username: true; avatarUrl: true } }
    cashFund: true
  }
}>

// ---- Functions ----

/**
 * Public / gift-giver view of a registry.
 * Looked up by shareToken so guests don't need the owner's username/slug.
 * Includes isPurchased so guests can see which items are already claimed,
 * but NEVER reveals purchasedBy or giftMessage.
 */
export async function getPublicRegistry(shareToken: string): Promise<PublicRegistry | null> {
  const registry = await prisma.wishlist.findFirst({
    where: {
      shareToken,
      type: 'REGISTRY',
      privacy: { in: ['PUBLIC', 'SHARED'] },
      isArchived: false,
    },
    include: {
      items: {
        orderBy: [{ category: 'asc' }, { position: 'asc' }],
        select: {
          id: true,
          title: true,
          url: true,
          affiliateUrl: true,
          storeName: true,
          storeDomain: true,
          imageUrl: true,
          price: true,
          currency: true,
          originalPrice: true,
          priority: true,
          position: true,
          category: true,
          tags: true,
          isPurchased: true,   // gift-givers CAN see claimed status
          isAnonymous: true,
          // NEVER include: purchasedBy, giftMessage, notes
        },
      },
      _count: { select: { items: true } },
      user: { select: { name: true, username: true, avatarUrl: true } },
      cashFund: true,
    },
  })

  return registry as unknown as PublicRegistry | null
}

/**
 * Owner view of a registry.
 * Registries differ from wishlists: the owner CAN see isPurchased + purchasedAt
 * for thank-you tracking purposes (e.g. "John bought this").
 * purchasedBy and giftMessage are still NEVER returned.
 */
export async function getRegistryForOwner(
  registryId: string,
  ownerId: string
): Promise<OwnerRegistry | null> {
  const registry = await prisma.wishlist.findUnique({
    where: { id: registryId, userId: ownerId },
    include: {
      items: {
        orderBy: [{ category: 'asc' }, { position: 'asc' }],
        select: {
          id: true,
          title: true,
          url: true,
          affiliateUrl: true,
          storeName: true,
          storeDomain: true,
          imageUrl: true,
          price: true,
          currency: true,
          originalPrice: true,
          priority: true,
          position: true,
          notes: true,
          category: true,
          tags: true,
          isPurchased: true,   // registry owner CAN see purchase status
          purchasedAt: true,   // registry owner CAN see when it was purchased
          wishlistId: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          // NEVER include: purchasedBy, giftMessage, isAnonymous
        },
      },
      _count: { select: { items: true } },
      user: { select: { name: true, username: true, avatarUrl: true } },
      cashFund: true,
    },
  })

  return registry as unknown as OwnerRegistry | null
}
